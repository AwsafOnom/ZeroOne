export { createChatCompletion, createAnthropicMessage, isAiConfigured } from "./client.js";
export { detectCrisisLanguage, crisisSupportContent } from "./crisis.js";
export { generateJournalFeedback } from "./journalFeedback.js";

/** @deprecated Use isAiConfigured() */
export function getClaudeClient() {
  return undefined;
}

/** @deprecated Use isAiConfigured() */
export function getAnthropicClient() {
  return undefined;
}
