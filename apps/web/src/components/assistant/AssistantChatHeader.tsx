import { Button, cx } from "../primitives";

const assistantAvatarIcon = "/assets/assistant-sparkle.svg";

export function AssistantChatHeader({
  className,
  onClose,
}: {
  className?: string;
  onClose?: () => void;
}) {
  return (
    <div
      className={cx(
        "border-b border-chat bg-gradient-ai-panel px-[var(--space-layout)] py-[var(--space-component-lg)]",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-[var(--space-component-md)]">
        <div className="flex min-w-0 items-center gap-[var(--space-component-md)]">
          <div className="flex size-[var(--space-60)] shrink-0 items-center justify-center rounded-md bg-gradient-primary shadow-activity">
            <img alt="" className="size-[var(--space-32-214)]" src={assistantAvatarIcon} />
          </div>
          <div className="min-w-0">
            <h2 className="truncate text-body-lg font-weight-heading text-text-ai">AI Wellness Chat</h2>
            <p className="mt-[var(--space-component-xs)] flex items-center gap-[var(--space-component-sm)] text-body-sm text-success">
              <span aria-hidden className="size-[var(--space-component-sm)] rounded-round bg-success opacity-50" />
              Online &amp; ready to help
            </p>
          </div>
        </div>

        <div className="hidden shrink-0 text-right sm:block">
          <p className="text-body-sm text-text-ai-supporting">Response time</p>
          <p className="text-body font-weight-button text-ai-accent">Instant</p>
        </div>

        {onClose && (
          <Button aria-label="Close AI Assistant" onClick={onClose} size="sm" variant="secondary">
            Close
          </Button>
        )}
      </div>
    </div>
  );
}
