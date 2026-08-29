import { useEffect, useRef, useState, type FormEvent } from "react";
import type { ApiAssistantChatMessage } from "@zeroone/shared";
import { useAssistantChat } from "../../api";
import { useAuth } from "../../context/AuthContext";
import {
  createAssistantUiMessage,
  useAssistant,
  type AssistantUiMessage,
} from "../../context/AssistantContext";
import { Button, Skeleton, cx } from "../primitives";
import { AssistantChatHeader } from "./AssistantChatHeader";
import { AssistantMessageBubble } from "./AssistantMessageBubble";
import { AssistantWelcomeHero } from "./AssistantWelcomeHero";

const sendIcon =
  "https://www.figma.com/api/mcp/asset/5768a4ff-d860-4c0c-accd-bc905149a251.svg";

function firstNameFrom(displayName?: string | null) {
  if (!displayName?.trim()) {
    return "there";
  }

  return displayName.trim().split(/\s+/)[0] ?? "there";
}

export function AssistantChat({
  className,
  onClose,
  showCloseButton = false,
  variant = "panel",
}: {
  className?: string;
  onClose?: () => void;
  showCloseButton?: boolean;
  variant?: "panel" | "page";
}) {
  const { token, user } = useAuth();
  const { appendMessage, clearMessages, messages } = useAssistant();
  const chatMutation = useAssistantChat();
  const [draft, setDraft] = useState("");
  const [errorMessage, setErrorMessage] = useState<string>();
  const scrollAnchorRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const firstName = firstNameFrom(user?.displayName);
  const isLoading = chatMutation.isPending;

  useEffect(() => {
    scrollAnchorRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = draft.trim();
    if (!trimmed || !token || isLoading) {
      return;
    }

    setErrorMessage(undefined);
    const userMessage = createAssistantUiMessage({ role: "user", content: trimmed });
    appendMessage(userMessage);
    setDraft("");

    const history: ApiAssistantChatMessage[] = [...messages, userMessage].map(({ role, content }) => ({
      role,
      content,
    }));

    try {
      const result = await chatMutation.mutateAsync({ token, messages: history });
      if (!result.message) {
        setErrorMessage(
          result.errorMessage ??
            (result.status === "unavailable"
              ? "AI Assistant is not configured on this server."
              : "The AI service is busy right now. Please try again shortly."),
        );
        return;
      }

      appendMessage(
        createAssistantUiMessage(
          result.message,
          result.status === "crisis" ? "crisis" : "normal",
        ),
      );
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    }
  }

  return (
    <section
      className={cx(
        "flex min-h-0 flex-col bg-surface-default",
        variant === "panel" ? "h-full" : "min-h-[70vh] rounded-[var(--radius-lg)] border border-surface shadow-card",
        className,
      )}
    >
      <AssistantChatHeader onClose={showCloseButton ? onClose : undefined} />

      <div className="flex min-h-0 flex-1 flex-col gap-[var(--space-layout)] overflow-y-auto px-[var(--space-layout)] py-[var(--space-layout)]">
        {messages.length === 0 ? <AssistantWelcomeHero firstName={firstName} /> : null}

        <div className="flex flex-col gap-[var(--space-component-lg)]">
          {messages.map((message: AssistantUiMessage) => (
            <AssistantMessageBubble
              key={message.id}
              content={message.content}
              createdAt={message.createdAt}
              isCrisis={message.kind === "crisis"}
              role={message.role}
            />
          ))}

          {isLoading ? (
            <div aria-live="polite" className="flex justify-start" role="status">
              <div className="w-full max-w-[min(100%,var(--space-612))] rounded-bl-chat-bubble rounded-br-chat-bubble rounded-tl-sm rounded-tr-chat-bubble border border-chat bg-surface-default px-[var(--space-component-lg)] py-[var(--space-component-md)] shadow-ai-message">
                <p className="text-body-sm font-weight-button text-primary">Thinking…</p>
                <div className="mt-[var(--space-component-sm)] flex flex-col gap-[var(--space-component-sm)]">
                  <Skeleton className="h-[var(--space-component-md)]" />
                  <Skeleton className="h-[var(--space-component-md)]" />
                  <Skeleton className="h-[var(--space-component-md)] w-4/5" />
                </div>
              </div>
            </div>
          ) : null}

          <div ref={scrollAnchorRef} />
        </div>
      </div>

      <div className="border-t border-chat bg-[linear-gradient(90deg,var(--primitive-color-primary-20),var(--primitive-color-primary-strong-20))] px-[var(--space-layout)] py-[var(--space-component-lg)]">
        {errorMessage ? (
          <p className="mb-[var(--space-component-md)] text-body-sm text-orange" role="alert">
            {errorMessage}
          </p>
        ) : null}

        <form className="flex items-end gap-[var(--space-component-md)]" onSubmit={handleSubmit}>
          <label className="sr-only" htmlFor="assistant-message-input">
            Message the AI Assistant
          </label>
          <textarea
            className="min-h-[var(--space-79-461)] flex-1 resize-none rounded-[var(--radius-lg)] border-[length:var(--border-width-chat)] border-[color:var(--primitive-color-ai-input-border)] bg-surface-default px-[var(--space-component-lg)] py-[var(--space-component-md)] font-chat text-body text-text-chat shadow-input outline-none placeholder:text-text-chat-placeholder focus:border-primary focus:ring-[var(--border-width)] focus:ring-primary disabled:opacity-60"
            disabled={isLoading || !token}
            id="assistant-message-input"
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                event.currentTarget.form?.requestSubmit();
              }
            }}
            placeholder="Type your message or ask me anything..."
            ref={inputRef}
            rows={1}
            value={draft}
          />

          <Button
            className="shrink-0 bg-gradient-primary px-[var(--space-component-lg)] hover:brightness-95"
            disabled={isLoading || !draft.trim() || !token}
            leadingIcon={<img alt="" className="size-[var(--space-20)]" src={sendIcon} />}
            type="submit"
            variant="primary"
          >
            Send
          </Button>
        </form>

        {messages.length > 0 ? (
          <div className="mt-[var(--space-component-sm)] flex justify-end">
            <button
              className="text-body-xs text-text-secondary underline-offset-2 hover:underline"
              onClick={clearMessages}
              type="button"
            >
              Clear conversation
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
