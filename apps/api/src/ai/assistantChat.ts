import type { ChatMessage } from "./types.js";
import { createChatCompletion, isAiConfigured } from "./client.js";
import { detectCrisisLanguage, formatCrisisSupportResponse } from "./crisis.js";
import { assistantFewShots, assistantSystemPrompt } from "./assistantPrompt.js";
import { detectDietExerciseAdviceRequest, formatDietExerciseRedirectResponse } from "./assistantSafety.js";

export type AssistantChatStatus = "ready" | "crisis" | "unavailable" | "failed";

export interface AssistantChatResult {
  status: AssistantChatStatus;
  message: ChatMessage | null;
  model: string | null;
}

const MAX_HISTORY_MESSAGES = 40;

function latestUserMessage(messages: ChatMessage[]): string | null {
  for (let index = messages.length - 1; index >= 0; index -= 1) {
    const message = messages[index];
    if (message?.role === "user") {
      return message.content;
    }
  }

  return null;
}

export async function generateAssistantReply(messages: ChatMessage[]): Promise<AssistantChatResult> {
  const trimmedHistory = messages.slice(-MAX_HISTORY_MESSAGES);
  const latestUserText = latestUserMessage(trimmedHistory);

  if (!latestUserText?.trim()) {
    return {
      status: "failed",
      message: null,
      model: null,
    };
  }

  if (detectCrisisLanguage(latestUserText)) {
    return {
      status: "crisis",
      message: {
        role: "assistant",
        content: formatCrisisSupportResponse(),
      },
      model: "crisis-support",
    };
  }

  if (detectDietExerciseAdviceRequest(latestUserText)) {
    return {
      status: "ready",
      message: {
        role: "assistant",
        content: formatDietExerciseRedirectResponse(),
      },
      model: "diet-exercise-redirect",
    };
  }

  const completion = await createChatCompletion({
    system: assistantSystemPrompt,
    messages: [...assistantFewShots, ...trimmedHistory],
    maxTokens: 800,
  });

  if (!completion) {
    return {
      status: isAiConfigured() ? "failed" : "unavailable",
      message: null,
      model: null,
    };
  }

  return {
    status: "ready",
    message: {
      role: "assistant",
      content: completion.text,
    },
    model: completion.model,
  };
}
