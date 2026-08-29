import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import { cx, type PrimitiveState } from "./utils";

export type ProgressRingSize = "sm" | "md" | "lg";

export interface ProgressRingProps extends HTMLAttributes<HTMLDivElement> {
  value?: number;
  size?: ProgressRingSize;
  label?: ReactNode;
  state?: PrimitiveState;
  emptyContent?: ReactNode;
  errorContent?: ReactNode;
}

const sizeClasses: Record<ProgressRingSize, string> = {
  sm: "size-[var(--space-64-428)]",
  md: "size-[var(--space-80-151)]",
  lg: "size-[var(--space-128-856)]",
};

export function ProgressRing({
  className,
  emptyContent,
  errorContent,
  label,
  size = "md",
  state = "ready",
  value = 0,
  ...props
}: ProgressRingProps) {
  if (state === "loading") {
    return (
      <div
        aria-busy="true"
        className={cx("animate-pulse rounded-round bg-surface-subtle", sizeClasses[size], className)}
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
  const ringStyle: CSSProperties = {
    background: `conic-gradient(var(--color-primary) ${normalizedValue}%, var(--color-surface-subtle) 0)`,
  };

  return (
    <div
      aria-label={typeof label === "string" ? `${label}: ${normalizedValue}%` : undefined}
      aria-valuemax={100}
      aria-valuemin={0}
      aria-valuenow={normalizedValue}
      className={cx("relative rounded-round p-[var(--space-component-xs)]", sizeClasses[size], className)}
      role="progressbar"
      style={ringStyle}
      {...props}
    >
      <div className="flex size-full flex-col items-center justify-center rounded-round bg-surface-default font-body text-body font-weight-button text-primary">
        <span>{normalizedValue}%</span>
        {label && <span className="text-body-xs font-weight-body text-text-secondary">{label}</span>}
      </div>
    </div>
  );
}
