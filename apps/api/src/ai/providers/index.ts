import type { AiProvider } from "../types.js";
import { anthropicProvider } from "./anthropic.js";
import { geminiProvider } from "./gemini.js";

const providers: Record<string, AiProvider> = {
  anthropic: anthropicProvider,
  gemini: geminiProvider,
};

export function resolveAiProvider(): AiProvider {
  const providerName = (process.env.AI_PROVIDER ?? "gemini").toLowerCase();
  const provider = providers[providerName];

  if (!provider) {
    throw new Error(`Unsupported AI_PROVIDER "${providerName}". Supported values: ${Object.keys(providers).join(", ")}.`);
  }

  return provider;
}
