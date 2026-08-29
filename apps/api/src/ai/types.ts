export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface CompletionInput {
  model?: string;
  maxTokens?: number;
  system: string;
  messages: ChatMessage[];
}

export interface CompletionResult {
  text: string;
  model: string;
}

export interface AiProvider {
  readonly name: string;
  isConfigured(): boolean;
  createMessage(input: CompletionInput, signal?: AbortSignal): Promise<CompletionResult | null>;
}
