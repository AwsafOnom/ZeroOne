import { Router } from "express";
import { z } from "zod";
import { getPrisma } from "../db.js";
import { asyncHandler, conflict, notFound, parse } from "../http.js";
import { requireAuth } from "../auth/middleware.js";
import { getHealingChainOverview } from "../services/healingChain.js";
import { pageQuery, userIdFrom } from "./helpers.js";

const sparkSchema = z
  .object({
    recipientId: z.string().min(1).max(120),
    kind: z.enum(["ENCOURAGEMENT", "VOICE_SUPPORT", "GUIDANCE"]),
    mentorshipLinkId: z.string().min(1).max(120).optional(),
  })
  .strict();

const messageSchema = z
  .object({
    mentorshipLinkId: z.string().min(1).max(120),
    ciphertext: z.string().min(1).max(100_000),
  })
  .strict();

const messagesQuerySchema = z
  .object({
    mentorshipLinkId: z.string().min(1).max(120),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    offset: z.coerce.number().int().min(0).default(0),
  })
  .strict();

async function accessibleLink(linkId: string, userId: string) {
  const prisma = getPrisma();
  const link = await prisma.mentorshipLink.findFirst({
    where: {
      id: linkId,
      OR: [{ mentorId: userId }, { menteeId: userId }],
    },
    include: {
      condition: true,
      mentor: { include: { healingChainProfile: true } },
      mentee: { include: { healingChainProfile: true } },
      sessions: { orderBy: { startsAt: "asc" }, take: 1 },
    },
  });

  return link ?? notFound("Healing Chain connection not found.");
}

export const healingChainRouter = Router();
healingChainRouter.use(requireAuth);

healingChainRouter.get(
  "/healing-chain",
  asyncHandler(async (request, response) => {
    const overview = await getHealingChainOverview(userIdFrom(request));
    response.json(overview);
  }),
);

healingChainRouter.get(
  "/healing-chain/sparks",
  asyncHandler(async (request, response) => {
    const { limit, offset } = pageQuery(request.query);
    const prisma = getPrisma();
    const userId = userIdFrom(request);
    const sparkWhere = { OR: [{ senderId: userId }, { recipientId: userId }] };
    const [sparks, totals] = await Promise.all([
      prisma.spark.findMany({
      where: sparkWhere,
      orderBy: { createdAt: "desc" },
      skip: offset,
      take: limit,
      include: {
        action: true,
        sender: { select: { id: true, name: true, avatarUrl: true } },
        recipient: { select: { id: true, name: true, avatarUrl: true } },
      },
      }),
      prisma.spark.aggregate({ where: { recipientId: userId }, _sum: { points: true } }),
    ]);

    response.json({
      sparks,
      receivedPoints: totals._sum.points ?? 0,
      pagination: { limit, offset, returned: sparks.length },
    });
  }),
);

healingChainRouter.post(
  "/healing-chain/sparks",
  asyncHandler(async (request, response) => {
    const body = parse(sparkSchema, request.body);
    const senderId = userIdFrom(request);
    const prisma = getPrisma();
    const link = body.mentorshipLinkId
      ? await accessibleLink(body.mentorshipLinkId, senderId)
      : await prisma.mentorshipLink.findFirst({
          where: { OR: [{ mentorId: senderId }, { menteeId: senderId }], status: "ACTIVE" },
        });

    if (!link) {
      return notFound("An active Healing Chain connection is required.");
    }

    if (link.mentorId !== senderId && link.menteeId !== senderId) {
      return notFound("Healing Chain connection not found.");
    }

    const action = await prisma.sparkActionConfig.findUnique({ where: { kind: body.kind } });
    if (!action?.isActive) {
      return conflict("This spark action is not available.");
    }

    const recipientId = body.recipientId;
    if (recipientId === senderId || (recipientId !== link.mentorId && recipientId !== link.menteeId)) {
      return conflict("Sparks can only be sent to the connected member.");
    }

    const spark = await prisma.spark.create({
      data: {
        actionId: action.id,
        senderId,
        recipientId,
        mentorshipLinkId: link.id,
        points: action.points,
      },
      include: { action: true },
    });

    response.status(201).json({ spark });
  }),
);

healingChainRouter.get(
  "/healing-chain/messages",
  asyncHandler(async (request, response) => {
    const query = parse(messagesQuerySchema, request.query);
    const link = await accessibleLink(query.mentorshipLinkId, userIdFrom(request));
    const prisma = getPrisma();
    const messages = await prisma.chainMessage.findMany({
      where: { mentorshipLinkId: link.id },
      orderBy: { sentAt: "asc" },
      skip: query.offset,
      take: query.limit,
      include: { sender: { select: { id: true, name: true, avatarUrl: true } } },
    });

    response.json({
      messages,
      pagination: { limit: query.limit, offset: query.offset, returned: messages.length },
    });
  }),
);

healingChainRouter.post(
  "/healing-chain/messages",
  asyncHandler(async (request, response) => {
    const body = parse(messageSchema, request.body);
    const link = await accessibleLink(body.mentorshipLinkId, userIdFrom(request));
    const prisma = getPrisma();
    const message = await prisma.chainMessage.create({
      data: {
        mentorshipLinkId: link.id,
        senderId: userIdFrom(request),
        ciphertext: body.ciphertext,
      },
    });

    response.status(201).json({ message });
  }),
);
