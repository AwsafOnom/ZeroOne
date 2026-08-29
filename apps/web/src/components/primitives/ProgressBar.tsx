import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import { cx, type PrimitiveState } from "./utils";

export interface ProgressBarProps extends HTMLAttributes<HTMLDivElement> {
  value?: number;
  label?: ReactNode;
  showValue?: boolean;
  state?: PrimitiveState;
  emptyContent?: ReactNode;
  errorContent?: ReactNode;
}

export function ProgressBar({
  className,
  emptyContent,
  errorContent,
  label,
  showValue = true,
  state = "ready",
  value = 0,
  ...props
}: ProgressBarProps) {
  if (state === "loading") {
    return (
      <div
        aria-busy="true"
        className={cx(
          "h-[var(--space-component-sm)] w-full animate-pulse rounded-pill bg-surface-subtle",
          className,
        )}
        {...props}
      />
    );
  }

  if (state === "empty") {
    return <div className={cx("font-body text-body-sm text-text-secondary", className)}>{emptyContent}</div>;
  }

  if (state === "error") {
    return <div className={cx("font-body text-body-sm text-orange", className)}>{errorContent}</div>;
  }

  const normalizedValue = Math.min(100, Math.max(0, value));
  const fillStyle: CSSProperties = { width: `${normalizedValue}%` };

  return (
    <div className={cx("flex w-full flex-col gap-[var(--space-component-xs)]", className)} {...props}>
      {(label || showValue) && (
        <div className="flex items-center justify-between font-body text-body-sm text-text-secondary">
          {label && <span>{label}</span>}
          {showValue && <span>{normalizedValue}%</span>}
        </div>
      )}
      <div
        aria-label={typeof label === "string" ? `${label}: ${normalizedValue}%` : undefined}
        aria-valuemax={100}
        aria-valuemin={0}
        aria-valuenow={normalizedValue}
        className="h-[var(--space-component-sm)] w-full overflow-hidden rounded-pill bg-surface-subtle"
        role="progressbar"
      >
        <div className="h-full rounded-pill bg-gradient-primary transition-[width]" style={fillStyle} />
      </div>
    </div>
  );
}
