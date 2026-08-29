import Anthropic from "@anthropic-ai/sdk";
import { classifyAiError, formatAiFailureLog } from "../errors.js";
import type { AiProvider, CompletionInput, CompletionResult } from "../types.js";

let client: Anthropic | undefined;

function getAnthropicClient() {
  if (!process.env.ANTHROPIC_API_KEY) {
    return undefined;
  }

  client ??= new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  return client;
}

export function logAnthropicError(phase: string, error: unknown, context?: Record<string, unknown>) {
  const classified = classifyAiError(error);
  console.error(`[anthropic] ${phase}: ${formatAiFailureLog(classified)}`, {
    ...context,
    message: classified.message,
  });
}

export const anthropicProvider: AiProvider = {
  name: "anthropic",

  isConfigured() {
    return Boolean(process.env.ANTHROPIC_API_KEY);
  },

  async createMessage(input: CompletionInput, signal?: AbortSignal): Promise<CompletionResult | null> {
    const anthropic = getAnthropicClient();
    if (!anthropic) {
      return null;
    }

    const modelId = input.model ?? process.env.AI_MODEL ?? "claude-haiku-4-5";

    if (input.messages.length === 0) {
      console.error("[anthropic] createMessage skipped: no messages provided");
      return null;
    }

    const lastMessage = input.messages[input.messages.length - 1];
    if (!lastMessage || lastMessage.role !== "user") {
      console.error("[anthropic] createMessage skipped: final message must be from user");
      return null;
    }

    try {
      const response = await anthropic.messages.create(
        {
          model: modelId,
          max_tokens: input.maxTokens ?? 600,
          system: input.system,
          messages: input.messages.map((message) => ({
            role: message.role,
            content: message.content,
          })),
        },
        { signal },
      );

      const text = response.content
        .filter((block): block is Anthropic.TextBlock => block.type === "text")
        .map((block) => block.text)
        .join("\n")
        .trim();

      if (!text) {
        console.error("[anthropic] createMessage returned empty text", {
          model: modelId,
          stopReason: response.stop_reason,
        });
        return null;
      }

      return { text, model: modelId };
    } catch (error) {
      logAnthropicError("createMessage failed", error, { model: modelId });
      throw error;
    }
  },
};
