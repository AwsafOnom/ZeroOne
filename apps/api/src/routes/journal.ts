import "dotenv/config";
import { aiLimiter } from "../middleware/aiLimiter.js";
import { Router } from "express";
import { z } from "zod";
import { ZEROONE_CONFIG } from "@zeroone/shared";
import { generateJournalFeedback } from "../ai/journalFeedback.js";
import { getPrisma } from "../db.js";
import { asyncHandler, badRequest, notFound, parse } from "../http.js";
import { requireAuth } from "../auth/middleware.js";
import { getJourneyTimeline, matchPeerStories } from "../services/journal.js";
import { pageQuery, userIdFrom } from "./helpers.js";

const reflectionSchema = z
  .object({
    bodyText: z.string().trim().min(1).max(20_000),
    moodTags: z
      .array(z.enum(["SAD", "ANXIOUS", "FRUSTRATED", "LONELY", "EXHAUSTED", "HOPEFUL", "OTHER"]))
      .max(7)
      .default([]),
    emotionalTags: z
      .array(
        z.enum([
          "MISSED_EVENT",
          "PAIN_FLARE",
          "SOCIAL_ISOLATION",
          "IDENTITY_LOSS",
          "FATIGUE",
          "RELATIONSHIP_STRUGGLE",
          "ABANDONED_HOBBIES",
          "OTHERS",
        ]),
      )
      .max(8)
      .default([]),
    isPrivate: z.boolean().default(true),
    shareAsStory: z.boolean().default(false),
  })
  .strict();

const reflectionParamsSchema = z.object({ id: z.string().min(1).max(120) }).strict();
const storySchema = z
  .object({
    reflectionId: z.string().min(1).max(120),
  })
  .strict();
const reflectionQuerySchema = z
  .object({
    limit: z.coerce.number().int().min(1).max(100).default(20),
    offset: z.coerce.number().int().min(0).default(0),
  })
  .strict();
const peerStoryMatchSchema = z
  .object({
    emotionalTags: z
      .array(
        z.enum([
          "MISSED_EVENT",
          "PAIN_FLARE",
          "SOCIAL_ISOLATION",
          "IDENTITY_LOSS",
          "FATIGUE",
          "RELATIONSHIP_STRUGGLE",
          "ABANDONED_HOBBIES",
          "OTHERS",
        ]),
      )
      .max(8)
      .default([]),
  })
  .strict();

function serializeReflection(reflection: {
  id: string;
  bodyText: string;
  moodTags: string[];
  emotionalTags: string[];
  isPrivate: boolean;
  createdAt: Date;
  updatedAt: Date;
  aiFeedback?: Array<{
    id: string;
    reflectionId: string;
    model: string;
    responseText: string;
    createdAt: Date;
  }>;
}) {
  return {
    id: reflection.id,
    bodyText: reflection.bodyText,
    moodTags: reflection.moodTags,
    emotionalTags: reflection.emotionalTags,
    isPrivate: reflection.isPrivate,
    createdAt: reflection.createdAt.toISOString(),
    updatedAt: reflection.updatedAt.toISOString(),
    aiFeedback: reflection.aiFeedback?.map((feedback) => ({
      id: feedback.id,
      reflectionId: feedback.reflectionId,
      model: feedback.model,
      responseText: feedback.responseText,
      createdAt: feedback.createdAt.toISOString(),
      kind:
        feedback.model === "crisis-support"
          ? "crisis"
          : feedback.model === "unavailable"
            ? "unavailable"
            : feedback.model.startsWith("fallback")
              ? "fallback"
              : "reflection",
    })),
  };
}

async function persistAiFeedback(reflectionId: string, result: Awaited<ReturnType<typeof generateJournalFeedback>>) {
  if (!result.responseText) {
    return null;
  }

  const prisma = getPrisma();
  return prisma.aiFeedback.create({
    data: {
      reflectionId,
      model: result.model ?? (result.status === "crisis" ? "crisis-support" : "unavailable"),
      responseText: result.responseText,
    },
  });
}

async function maybePublishSharedStory(
  userId: string,
  reflection: {
    id: string;
    bodyText: string;
    emotionalTags: Array<
      | "MISSED_EVENT"
      | "PAIN_FLARE"
      | "SOCIAL_ISOLATION"
      | "IDENTITY_LOSS"
      | "FATIGUE"
      | "RELATIONSHIP_STRUGGLE"
      | "ABANDONED_HOBBIES"
      | "OTHERS"
    >;
    isPrivate: boolean;
  },
  shareAsStory: boolean,
) {
  if (!shareAsStory || reflection.isPrivate) {
    return null;
  }

  const prisma = getPrisma();
  return prisma.sharedStory.upsert({
    where: { sourceReflectionId: reflection.id },
    update: {
      anonymizedBody: reflection.bodyText,
      emotionalTags: reflection.emotionalTags,
      authorUserId: userId,
      isPublished: true,
    },
    create: {
      sourceReflectionId: reflection.id,
      authorUserId: userId,
      anonymizedBody: reflection.bodyText,
      emotionalTags: reflection.emotionalTags,
      isPublished: true,
    },
    select: {
      id: true,
      anonymizedBody: true,
      emotionalTags: true,
    },
  });
}

export const journalRouter = Router();
journalRouter.use(requireAuth);

journalRouter.get(
  "/journal/journey",
  asyncHandler(async (request, response) => {
    const stages = await getJourneyTimeline(userIdFrom(request));
    response.json({ stages });
  }),
);

journalRouter.get(
  "/journal/about",
  asyncHandler(async (_request, response) => {
    response.json({
      banner: "You Are Not The Only One Carrying This Pain.",
      principles: [
        {
          title: "Private and Secure",
          description:
            "Reflections are private by default. Nothing you write is visible to your squad, mentor, or the wider platform unless you explicitly choose to share.",
        },
        {
          title: "Emotional Relief",
          description:
            "Putting words to what you carry can loosen its grip. The journal is a place to name weight without performing strength.",
        },
        {
          title: "Track Progress",
          description:
            "Your journey timeline holds the arc of your recovery — not as a score, but as a record of where you have been and what you have moved through.",
        },
        {
          title: "Build Self-Awareness",
          description:
            "Moods, emotional tags, and honest writing help you notice patterns over time. Recognition comes before change.",
        },
      ],
    });
  }),
);

journalRouter.post(
  "/journal/peer-stories/match",
  asyncHandler(async (request, response) => {
    const body = parse(peerStoryMatchSchema, request.body);
    const stories = await matchPeerStories(body.emotionalTags);
    response.json({ stories });
  }),
);

journalRouter.get(
  "/journal/reflections",
  asyncHandler(async (request, response) => {
    const query = parse(reflectionQuerySchema, request.query);
    const prisma = getPrisma();
    const reflections = await prisma.reflection.findMany({
      where: { userId: userIdFrom(request) },
      orderBy: { createdAt: "desc" },
      skip: query.offset,
      take: query.limit,
      include: { aiFeedback: { orderBy: { createdAt: "desc" }, take: ZEROONE_CONFIG.aiFeedbackResponsesPerReflection } },
    });

    response.json({
      reflections: reflections.map(serializeReflection),
      pagination: { limit: query.limit, offset: query.offset, returned: reflections.length },
    });
  }),
);

journalRouter.post(
  "/journal/reflections",
  aiLimiter,
  asyncHandler(async (request, response) => {
    const body = parse(reflectionSchema, request.body);
    const prisma = getPrisma();
    const userId = userIdFrom(request);

    const reflection = await prisma.reflection.create({
      data: {
        userId,
        bodyText: body.bodyText,
        moodTags: body.moodTags,
        emotionalTags: body.emotionalTags,
        isPrivate: body.isPrivate,
      },
    });

    const feedbackResult = await generateJournalFeedback({
      bodyText: reflection.bodyText,
      moodTags: reflection.moodTags,
      emotionalTags: reflection.emotionalTags,
    });
    const feedback = await persistAiFeedback(reflection.id, feedbackResult);
    await maybePublishSharedStory(userId, reflection, body.shareAsStory);

    const peerStories = await matchPeerStories(reflection.emotionalTags);

    response.status(201).json({
      reflection: serializeReflection({
        ...reflection,
        aiFeedback: feedback ? [feedback] : [],
      }),
      aiFeedback: feedback
        ? {
            id: feedback.id,
            reflectionId: feedback.reflectionId,
            model: feedback.model,
            responseText: feedback.responseText,
            createdAt: feedback.createdAt.toISOString(),
            kind: feedbackResult.status === "crisis" ? "crisis" : "reflection",
          }
        : null,
      aiFeedbackStatus: feedbackResult.status,
      peerStories,
    });
  }),
);

journalRouter.get(
  "/journal/reflections/:id",
  asyncHandler(async (request, response) => {
    const { id } = parse(reflectionParamsSchema, request.params);
    const prisma = getPrisma();
    const reflection = await prisma.reflection.findFirst({
      where: { id, userId: userIdFrom(request) },
      include: { aiFeedback: { orderBy: { createdAt: "desc" } } },
    });

    if (!reflection) {
      return notFound("Reflection not found.");
    }

    response.json({ reflection: serializeReflection(reflection) });
  }),
);

journalRouter.patch(
  "/journal/reflections/:id",
  asyncHandler(async (request, response) => {
    const { id } = parse(reflectionParamsSchema, request.params);
    const body = parse(reflectionSchema.partial(), request.body);
    const prisma = getPrisma();
    const owned = await prisma.reflection.findFirst({
      where: { id, userId: userIdFrom(request) },
    });

    if (!owned) {
      return notFound("Reflection not found.");
    }

    const reflection = await prisma.reflection.update({
      where: { id },
      data: body,
    });
    response.json({ reflection: serializeReflection(reflection) });
  }),
);

journalRouter.post(
  "/journal/reflections/:id/ai-feedback",
  aiLimiter,
  asyncHandler(async (request, response) => {
    const { id } = parse(reflectionParamsSchema, request.params);
    const prisma = getPrisma();
    const reflection = await prisma.reflection.findFirst({
      where: { id, userId: userIdFrom(request) },
    });

    if (!reflection) {
      return notFound("Reflection not found.");
    }

    const feedbackResult = await generateJournalFeedback({
      bodyText: reflection.bodyText,
      moodTags: reflection.moodTags,
      emotionalTags: reflection.emotionalTags,
    });

    if (!feedbackResult.responseText) {
      response.status(feedbackResult.status === "unavailable" ? 503 : 502).json({
        aiFeedback: null,
        aiFeedbackStatus: feedbackResult.status,
        message:
          feedbackResult.status === "unavailable"
            ? "AI feedback is not configured on this server."
            : "The AI service is busy right now. Please try again shortly — your reflection is still saved.",
      });
      return;
    }

    const feedback = await persistAiFeedback(reflection.id, feedbackResult);
    if (!feedback) {
      return badRequest("The AI provider returned no feedback.");
    }

    response.status(201).json({
      feedback: {
        id: feedback.id,
        reflectionId: feedback.reflectionId,
        model: feedback.model,
        responseText: feedback.responseText,
        createdAt: feedback.createdAt.toISOString(),
        kind: feedbackResult.status === "crisis" ? "crisis" : "reflection",
      },
      aiFeedbackStatus: feedbackResult.status,
    });
  }),
);

journalRouter.post(
  "/journal/stories",
  asyncHandler(async (request, response) => {
    const body = parse(storySchema, request.body);
    const prisma = getPrisma();
    const reflection = await prisma.reflection.findFirst({
      where: { id: body.reflectionId, userId: userIdFrom(request) },
    });

    if (!reflection) {
      return notFound("Reflection not found.");
    }

    const story = await prisma.sharedStory.upsert({
      where: { sourceReflectionId: reflection.id },
      update: {
        anonymizedBody: reflection.bodyText,
        emotionalTags: reflection.emotionalTags,
        authorUserId: userIdFrom(request),
        isPublished: true,
      },
      create: {
        sourceReflectionId: reflection.id,
        authorUserId: userIdFrom(request),
        anonymizedBody: reflection.bodyText,
        emotionalTags: reflection.emotionalTags,
        isPublished: true,
      },
      select: {
        id: true,
        anonymizedBody: true,
        emotionalTags: true,
      },
    });

    response.status(201).json({ story });
  }),
);

journalRouter.get(
  "/journal/stories",
  asyncHandler(async (request, response) => {
    const { limit, offset } = pageQuery(request.query);
    const emotionalTags = z
      .array(
        z.enum([
          "MISSED_EVENT",
          "PAIN_FLARE",
          "SOCIAL_ISOLATION",
          "IDENTITY_LOSS",
          "FATIGUE",
          "RELATIONSHIP_STRUGGLE",
          "ABANDONED_HOBBIES",
          "OTHERS",
        ]),
      )
      .optional()
      .parse(
        typeof request.query.emotionalTags === "string"
          ? request.query.emotionalTags.split(",").filter(Boolean)
          : undefined,
      );

    if (emotionalTags && emotionalTags.length > 0) {
      const stories = await matchPeerStories(emotionalTags);
      response.json({
        stories,
        pagination: { limit: stories.length, offset: 0, returned: stories.length },
      });
      return;
    }

    const prisma = getPrisma();
    const stories = await prisma.sharedStory.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: "desc" },
      skip: offset,
      take: limit,
      select: {
        id: true,
        anonymizedBody: true,
        emotionalTags: true,
      },
    });

    response.json({ stories, pagination: { limit, offset, returned: stories.length } });
  }),
);
