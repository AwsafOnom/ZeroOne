import type { ReactNode } from "react";
import { Button } from "./Button";
import { cx, type PrimitiveState } from "./utils";

export type ToastVariant = "info" | "success" | "error";

export interface ToastProps {
  open: boolean;
  title?: ReactNode;
  message?: ReactNode;
  variant?: ToastVariant;
  action?: ReactNode;
  onDismiss?: () => void;
  dismissLabel?: string;
  state?: Extract<PrimitiveState, "ready" | "loading" | "error">;
  className?: string;
}

const variantClasses: Record<ToastVariant, string> = {
  info: "border-primary bg-surface-blue-light text-text-primary",
  success: "border-success bg-surface-success text-text-primary",
  error: "border-orange bg-surface-muted text-orange",
};

export function Toast({
  action,
  className,
  dismissLabel,
  message,
  onDismiss,
  open,
  state = "ready",
  title,
  variant = "info",
}: ToastProps) {
  if (!open) {
    return null;
  }

  return (
    <div
      aria-busy={state === "loading" || undefined}
      aria-live="polite"
      className={cx(
        "flex w-full items-start gap-[var(--space-component-md)] rounded-md border p-[var(--space-card-padding)] shadow-card",
        variantClasses[variant],
        state === "loading" && "animate-pulse",
        className,
      )}
      role={state === "error" ? "alert" : "status"}
    >
      <div className="flex min-w-0 flex-1 flex-col gap-[var(--space-component-xs)]">
        {title && <p className="font-body text-body font-weight-button">{title}</p>}
        {message && <p className="font-body text-body-sm">{message}</p>}
      </div>
      {action}
      {onDismiss && dismissLabel && (
        <Button aria-label={dismissLabel} onClick={onDismiss} size="sm" variant="ghost">
          ×
        </Button>
      )}
    </div>
  );
}
