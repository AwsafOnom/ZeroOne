import type { HTMLAttributes, ReactNode } from "react";
import { Skeleton } from "./Skeleton";
import { cx, type PrimitiveState } from "./utils";

export type CardVariant = "default" | "outlined" | "muted" | "ai" | "primary" | "doctor" | "promo";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  state?: PrimitiveState;
  emptyContent?: ReactNode;
  errorContent?: ReactNode;
}

const variantClasses: Record<CardVariant, string> = {
  default: "bg-surface-raised shadow-card",
  outlined: "border border-border-subtle bg-surface-default",
  muted: "border border-border-subtle bg-surface-muted",
  ai: "bg-gradient-ai-panel text-text-ai",
  primary: "bg-gradient-primary text-surface-default shadow-card",
  doctor: "bg-doctor-cta text-surface-default shadow-card",
  promo: "bg-gradient-ai text-surface-default shadow-card",
};

export function Card({
  children,
  className,
  emptyContent,
  errorContent,
  state = "ready",
  variant = "default",
  ...props
}: CardProps) {
  const content =
    state === "loading" ? (
      <Skeleton className="h-[var(--space-80-151)] w-full" />
    ) : state === "empty" ? (
      emptyContent
    ) : state === "error" ? (
      errorContent
    ) : (
      children
    );

  return (
    <div
      aria-busy={state === "loading" || undefined}
      className={cx(
        "rounded-md p-[var(--space-card-padding)]",
        variantClasses[variant],
        state === "error" && "border border-orange text-orange",
        className,
      )}
      {...props}
    >
      {content}
    </div>
  );
}
