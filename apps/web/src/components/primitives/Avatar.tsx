import type { HTMLAttributes, ReactNode } from "react";
import { cx } from "./utils";

export type AvatarSize = "sm" | "md" | "lg";

export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  name?: string;
  fallback?: ReactNode;
  size?: AvatarSize;
}

const sizeClasses: Record<AvatarSize, string> = {
  sm: "size-[var(--space-36)] text-body-xs",
  md: "size-[var(--space-50)] text-body-sm",
  lg: "size-[var(--space-64-428)] text-body-lg",
};

function initialsFor(name?: string): string {
  if (!name) {
    return "?";
  }

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function Avatar({
  alt,
  className,
  fallback,
  name,
  size = "md",
  src,
  ...props
}: AvatarProps) {
  return (
    <div
      aria-label={alt ?? name}
      className={cx(
        "inline-flex shrink-0 items-center justify-center overflow-hidden rounded-round bg-surface-blue-light font-body font-weight-button text-primary",
        sizeClasses[size],
        className,
      )}
      role="img"
      {...props}
    >
      {src ? (
        <img alt={alt ?? name ?? ""} className="size-full object-cover" src={src} />
      ) : (
        fallback ?? initialsFor(name)
      )}
    </div>
  );
}

export interface AvatarGroupProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function AvatarGroup({
  children,
  className,
  ...props
}: AvatarGroupProps) {
  return (
    <div
      aria-label={props["aria-label"]}
      className={cx(
        "flex items-center [&>*+*]:-ml-[var(--space-component-sm)] [&>*]:border-[var(--border-width)] [&>*]:border-solid [&>*]:border-surface-default",
        className,
      )}
      role="group"
      {...props}
    >
      {children}
    </div>
  );
}
