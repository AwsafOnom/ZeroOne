import { Router } from "express";
import { z } from "zod";
import { generateJournalFeedback } from "../ai/journalFeedback.js";
import { asyncHandler, parse } from "../http.js";

const aiTestSchema = z
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
  })
  .strict();

export const devRouter = Router();

devRouter.post(
  "/ai-test",
  asyncHandler(async (request, response) => {
    const body = parse(aiTestSchema, request.body);
    const result = await generateJournalFeedback(body);

    response.json({
      status: result.status,
      model: result.model,
      responseText: result.responseText,
      configured: result.status !== "unavailable",
    });
  }),
);
