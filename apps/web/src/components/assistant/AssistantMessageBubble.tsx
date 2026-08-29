import type { ApiAssistantChatMessage } from "@zeroone/shared";
import { cx } from "../primitives";

function formatMessageTime(iso: string) {
  return new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(iso));
}

export function AssistantMessageBubble({
  content,
  createdAt,
  isCrisis = false,
  role,
}: {
  content: string;
  createdAt: string;
  isCrisis?: boolean;
  role: ApiAssistantChatMessage["role"];
}) {
  const isUser = role === "user";

  return (
    <div className={cx("flex w-full", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cx(
          "max-w-[min(100%,var(--space-612))] px-[var(--space-component-lg)] py-[var(--space-component-md)] shadow-ai-message",
          isUser
            ? "rounded-bl-chat-bubble rounded-br-chat-bubble rounded-tl-chat-bubble rounded-tr-sm bg-gradient-primary text-surface-default"
            : "rounded-bl-chat-bubble rounded-br-chat-bubble rounded-tl-sm rounded-tr-chat-bubble border border-chat bg-surface-default text-text-ai",
          isCrisis && !isUser && "border-orange bg-surface-muted",
        )}
      >
        {isCrisis && !isUser && (
          <p className="mb-[var(--space-component-sm)] text-body-sm font-weight-button text-orange">
            Crisis support resources
          </p>
        )}
        <p className="whitespace-pre-wrap font-chat text-body-sm leading-standard text-inherit">{content}</p>
        <p
          className={cx(
            "mt-[var(--space-component-sm)] font-chat text-body-xs text-text-chat-timestamp",
            isUser && "text-[color:var(--primitive-color-white-80)]",
          )}
        >
          {formatMessageTime(createdAt)}
        </p>
      </div>
    </div>
  );
}
