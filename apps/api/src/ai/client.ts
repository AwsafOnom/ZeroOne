import "dotenv/config";
import { backoffWithJitterMs, classifyAiError, formatAiFailureLog } from "./errors.js";
import { resolveAiProvider } from "./providers/index.js";
import type { CompletionInput, CompletionResult } from "./types.js";

const DEFAULT_TIMEOUT_MS = Number(process.env.AI_REQUEST_TIMEOUT_MS ?? 30_000);
const MAX_RETRIES = Number(process.env.AI_MAX_RETRIES ?? 4);

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function isAiConfigured(): boolean {
  return resolveAiProvider().isConfigured();
}

export async function createChatCompletion(input: CompletionInput): Promise<CompletionResult | null> {
  const provider = resolveAiProvider();

  if (!provider.isConfigured()) {
    return null;
  }

  const maxAttempts = MAX_RETRIES + 1;

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);

    try {
      const completion = await provider.createMessage(input, controller.signal);
      clearTimeout(timeout);

      if (!completion?.text) {
        if (!completion) {
          console.error(`[${provider.name}] createMessage returned null without throwing`);
        } else {
          console.error(`[${provider.name}] createMessage returned empty text`);
        }
        return null;
      }

      return completion;
    } catch (error) {
      clearTimeout(timeout);

      const classified = classifyAiError(error);
      const attemptLabel = `attempt ${attempt + 1}/${maxAttempts}`;
      console.error(`[${provider.name}] request ${attemptLabel} failed: ${formatAiFailureLog(classified)}`, {
        message: classified.message,
      });

      const hasRetriesLeft = attempt < MAX_RETRIES;
      if (!hasRetriesLeft || !classified.retryable) {
        if (!classified.retryable && hasRetriesLeft) {
          console.error(`[${provider.name}] non-retryable error; stopping retries (${formatAiFailureLog(classified)})`);
        }

        const attemptsUsed = attempt + 1;
        console.error(
          `[${provider.name}] request failed after ${attemptsUsed} attempt${attemptsUsed === 1 ? "" : "s"}: ${formatAiFailureLog(classified)}`,
          { message: classified.message },
        );
        return null;
      }

      const delayMs = backoffWithJitterMs(attempt);
      console.error(`[${provider.name}] retrying in ${delayMs}ms (${formatAiFailureLog(classified)})`);
      await sleep(delayMs);
    }
  }

  return null;
}

/** @deprecated Use createChatCompletion() */
export const createAnthropicMessage = createChatCompletion;
