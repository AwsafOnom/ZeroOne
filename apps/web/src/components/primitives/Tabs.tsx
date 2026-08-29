import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Skeleton } from "./Skeleton";
import { cx, type PrimitiveState } from "./utils";

export interface TabItem {
  value: string;
  label: ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  items: TabItem[];
  value?: string;
  onValueChange?: (value: string) => void;
  state?: PrimitiveState;
  emptyContent?: ReactNode;
  errorContent?: ReactNode;
  className?: string;
}

function TabButton({
  active,
  item,
  onSelect,
}: {
  active: boolean;
  item: TabItem;
  onSelect?: (value: string) => void;
}) {
  const buttonProps: ButtonHTMLAttributes<HTMLButtonElement> = {
    "aria-selected": active,
    disabled: item.disabled,
    onClick: () => onSelect?.(item.value),
    role: "tab",
    type: "button",
  };

  return (
    <button
      {...buttonProps}
      className={cx(
        "border-b-[var(--border-width)] px-[var(--space-component-sm)] py-[var(--space-component-xs)] font-body text-body-lg leading-body transition-colors disabled:cursor-not-allowed disabled:opacity-50",
        active
          ? "border-primary font-weight-button text-primary"
          : "border-transparent text-text-secondary hover:border-border-default hover:text-text-primary",
      )}
    >
      {item.label}
    </button>
  );
}

export function Tabs({
  className,
  emptyContent,
  errorContent,
  items,
  onValueChange,
  state = "ready",
  value,
}: TabsProps) {
  if (state === "loading") {
    return (
      <div aria-busy="true" className={cx("flex gap-[var(--space-component-sm)]", className)}>
        <Skeleton className="h-[var(--space-28)] w-[var(--space-80-151)]" />
        <Skeleton className="h-[var(--space-28)] w-[var(--space-80-151)]" />
      </div>
    );
  }

  if (state === "empty" || items.length === 0) {
    return <div className={cx("font-body text-body-sm text-text-secondary", className)}>{emptyContent}</div>;
  }

  if (state === "error") {
    return <div className={cx("font-body text-body-sm text-orange", className)}>{errorContent}</div>;
  }

  return (
    <div
      className={cx("flex items-center gap-[var(--space-component-xs)]", className)}
      role="tablist"
    >
      {items.map((item) => (
        <TabButton
          active={item.value === value}
          item={item}
          key={item.value}
          onSelect={onValueChange}
        />
      ))}
    </div>
  );
}
