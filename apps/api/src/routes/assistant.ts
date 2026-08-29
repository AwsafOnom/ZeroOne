import { Router } from "express";
import { generateAssistantReply } from "../ai/assistantChat.js";
import { assistantChatSchema } from "../ai/assistantValidation.js";
import { requireAuth } from "../auth/middleware.js";
import { aiLimiter } from "../middleware/aiLimiter.js";
import { asyncHandler, parse } from "../http.js";

export const assistantRouter = Router();
assistantRouter.use(requireAuth);

assistantRouter.post(
  "/assistant/chat",
  aiLimiter,
  asyncHandler(async (request, response) => {
    const body = parse(assistantChatSchema, request.body);
    const result = await generateAssistantReply(body.messages);

    response.json({
      status: result.status,
      message: result.message,
      model: result.model,
      errorMessage:
        result.message || result.status === "ready" || result.status === "crisis"
          ? undefined
          : result.status === "unavailable"
            ? "AI Assistant is not configured on this server."
            : "The AI service is busy right now. Please try again shortly.",
    });
  }),
);
