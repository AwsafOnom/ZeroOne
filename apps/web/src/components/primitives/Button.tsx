import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cx } from "./utils";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "destructive";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-gradient-primary text-surface-default shadow-activity hover:brightness-95",
  secondary:
    "border border-primary bg-surface-default text-primary hover:bg-surface-success",
  ghost: "bg-transparent text-primary hover:bg-surface-success",
  destructive:
    "bg-orange text-surface-default shadow-activity hover:bg-orange-hover",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "min-h-[var(--space-45)] px-[var(--space-component-md)] py-[var(--space-component-xs)] text-body-sm",
  md: "min-h-[var(--space-53-69)] px-[var(--space-component-lg)] py-[var(--space-component-sm)] text-button",
  lg: "min-h-[var(--space-60)] px-[var(--space-component-xl)] py-[var(--space-component-md)] text-button-lg",
};

function LoadingIndicator() {
  return (
    <span
      aria-hidden="true"
      className="size-[var(--space-component-md)] animate-spin rounded-round border-[var(--border-width)] border-solid border-surface-default border-t-[var(--primitive-color-transparent)]"
    />
  );
}

export function Button({
  children,
  className,
  disabled,
  isLoading = false,
  leadingIcon,
  trailingIcon,
  size = "md",
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <button
      aria-busy={isLoading || undefined}
      className={cx(
        "inline-flex items-center justify-center gap-[var(--space-component-sm)] rounded-md font-body font-weight-button leading-button transition-opacity focus-visible:ring-[var(--border-width)] focus-visible:ring-primary focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? <LoadingIndicator /> : leadingIcon}
      {children}
      {!isLoading && trailingIcon}
    </button>
  );
}
