import { GoogleGenAI } from "@google/genai";
import { classifyAiError, formatAiFailureLog } from "../errors.js";
import type { AiProvider, CompletionInput, CompletionResult } from "../types.js";

let client: GoogleGenAI | undefined;

function getGeminiClient() {
  if (!process.env.GEMINI_API_KEY) {
    return undefined;
  }

  client ??= new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  return client;
}

function toGeminiRole(role: "user" | "assistant") {
  return role === "assistant" ? "model" : "user";
}

export function logGeminiError(phase: string, error: unknown, context?: Record<string, unknown>) {
  const classified = classifyAiError(error);
  console.error(`[gemini] ${phase}: ${formatAiFailureLog(classified)}`, {
    ...context,
    message: classified.message,
  });
}

export const geminiProvider: AiProvider = {
  name: "gemini",

  isConfigured() {
    return Boolean(process.env.GEMINI_API_KEY);
  },

  async createMessage(input: CompletionInput, signal?: AbortSignal): Promise<CompletionResult | null> {
    const ai = getGeminiClient();
    if (!ai) {
      return null;
    }

    const modelId = input.model ?? process.env.AI_MODEL ?? "gemini-flash-latest";

    if (input.messages.length === 0) {
      console.error("[gemini] createMessage skipped: no messages provided");
      return null;
    }

    const lastMessage = input.messages[input.messages.length - 1];
    if (!lastMessage || lastMessage.role !== "user") {
      console.error("[gemini] createMessage skipped: final message must be from user");
      return null;
    }

    const history = input.messages.slice(0, -1).map((message) => ({
      role: toGeminiRole(message.role),
      parts: [{ text: message.content }],
    }));

    try {
      const chat = ai.chats.create({
        model: modelId,
        config: {
          systemInstruction: input.system,
          maxOutputTokens: input.maxTokens ?? 600,
          abortSignal: signal,
        },
        history,
      });

      const response = await chat.sendMessage({
        message: lastMessage.content,
        config: {
          abortSignal: signal,
        },
      });

      const text = response.text?.trim();
      if (!text) {
        console.error("[gemini] createMessage returned empty text", {
          model: modelId,
          candidates: response.candidates?.length ?? 0,
          promptFeedback: response.promptFeedback,
        });
        return null;
      }

      return { text, model: modelId };
    } catch (error) {
      logGeminiError("createMessage failed", error, { model: modelId });
      throw error;
    }
  },
};
