import { useEffect, type ReactNode } from "react";
import { Button } from "./Button";
import { Skeleton } from "./Skeleton";
import { cx, type PrimitiveState } from "./utils";

export interface ModalProps {
  open: boolean;
  title?: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  onClose?: () => void;
  closeLabel?: string;
  state?: PrimitiveState;
  emptyContent?: ReactNode;
  errorContent?: ReactNode;
  className?: string;
}

export function Modal({
  children,
  className,
  closeLabel = "Close",
  description,
  emptyContent,
  errorContent,
  footer,
  onClose,
  open,
  state = "ready",
  title,
}: ModalProps) {
  useEffect(() => {
    const close = onClose;
    if (!open || !close) {
      return undefined;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        close?.();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, open]);

  if (!open) {
    return null;
  }

  const content =
    state === "loading" ? (
      <Skeleton className="h-[var(--space-128-856)] w-full" />
    ) : state === "empty" ? (
      emptyContent
    ) : state === "error" ? (
      errorContent
    ) : (
      children
    );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--primitive-color-media-overlay)] p-[var(--space-page-inline)]"
      onClick={onClose}
      role="presentation"
    >
      <section
        aria-label={typeof title === "string" ? title : undefined}
        aria-modal="true"
        className={cx(
          "flex max-h-[min(90vh,var(--space-875-248))] w-full max-w-[var(--space-612)] flex-col rounded-lg bg-surface-raised shadow-card",
          className,
        )}
        onClick={(event) => event.stopPropagation()}
        role="dialog"
      >
        {(title || description || onClose) && (
          <header className="flex shrink-0 items-start justify-between gap-[var(--space-component-md)] border-b border-border-subtle p-[var(--space-card-padding)]">
            <div className="flex min-w-0 flex-col gap-[var(--space-component-xs)]">
              {title && <h2 className="font-body text-heading-md font-weight-heading text-text-heading">{title}</h2>}
              {description && <p className="font-body text-body text-text-secondary">{description}</p>}
            </div>
            {onClose ? (
              <Button aria-label={closeLabel} onClick={onClose} size="sm" type="button" variant="secondary">
                Close
              </Button>
            ) : null}
          </header>
        )}
        <div
          aria-busy={state === "loading" || undefined}
          className="min-h-0 flex-1 overflow-y-auto p-[var(--space-card-padding)]"
        >
          {content}
        </div>
        {footer ? (
          <footer className="shrink-0 border-t border-border-subtle p-[var(--space-card-padding)]">{footer}</footer>
        ) : null}
      </section>
    </div>
  );
}
