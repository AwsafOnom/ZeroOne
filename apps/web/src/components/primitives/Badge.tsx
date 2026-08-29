import type { HTMLAttributes, ReactNode } from "react";
import { cx } from "./utils";

export type BadgeVariant = "points" | "status" | "condition" | "success" | "neutral";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  children?: ReactNode;
  isLoading?: boolean;
}

const variantClasses: Record<BadgeVariant, string> = {
  points: "bg-surface-blue-light text-primary",
  status: "border border-border-subtle bg-surface-default text-text-primary",
  condition: "border border-border-default bg-surface-default text-text-secondary",
  success: "border border-success bg-surface-success text-success",
  neutral: "bg-surface-muted text-text-secondary",
};

export function Badge({
  children,
  className,
  isLoading = false,
  variant = "neutral",
  ...props
}: BadgeProps) {
  return (
    <span
      aria-busy={isLoading || undefined}
      className={cx(
        "inline-flex min-h-[var(--space-28)] items-center justify-center rounded-pill px-[var(--space-component-sm)] py-[var(--space-component-xs)] font-body text-body-sm font-weight-label leading-body",
        variantClasses[variant],
        isLoading &&
          "min-w-[var(--space-50)] animate-pulse bg-surface-subtle text-[color:var(--primitive-color-transparent)]",
        className,
      )}
      {...props}
    >
      {isLoading ? "\u00a0" : children}
    </span>
  );
}
