import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { ApiAssistantChatMessage } from "@zeroone/shared";

export interface AssistantUiMessage extends ApiAssistantChatMessage {
  id: string;
  createdAt: string;
  kind?: "crisis" | "normal";
}

export interface AssistantContextValue {
  isOpen: boolean;
  messages: AssistantUiMessage[];
  openAssistant: () => void;
  closeAssistant: () => void;
  toggleAssistant: () => void;
  appendMessage: (message: AssistantUiMessage) => void;
  clearMessages: () => void;
}

const AssistantContext = createContext<AssistantContextValue | undefined>(undefined);

function createMessageId() {
  return crypto.randomUUID();
}

export function AssistantProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<AssistantUiMessage[]>([]);

  const openAssistant = useCallback(() => setIsOpen(true), []);
  const closeAssistant = useCallback(() => setIsOpen(false), []);
  const toggleAssistant = useCallback(() => setIsOpen((open) => !open), []);

  const appendMessage = useCallback((message: AssistantUiMessage) => {
    setMessages((current) => [...current, message]);
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  const value = useMemo(
    () => ({
      isOpen,
      messages,
      openAssistant,
      closeAssistant,
      toggleAssistant,
      appendMessage,
      clearMessages,
    }),
    [appendMessage, clearMessages, closeAssistant, isOpen, messages, openAssistant, toggleAssistant],
  );

  return <AssistantContext.Provider value={value}>{children}</AssistantContext.Provider>;
}

export function useAssistant() {
  const context = useContext(AssistantContext);
  if (!context) {
    throw new Error("useAssistant must be used within AssistantProvider.");
  }

  return context;
}

export function createAssistantUiMessage(
  message: ApiAssistantChatMessage,
  kind: AssistantUiMessage["kind"] = "normal",
): AssistantUiMessage {
  return {
    ...message,
    id: createMessageId(),
    createdAt: new Date().toISOString(),
    kind,
  };
}
