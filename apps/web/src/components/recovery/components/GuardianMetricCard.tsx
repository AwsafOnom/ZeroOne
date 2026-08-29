import type { LucideIcon } from "lucide-react";
import { motion, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";

export interface GuardianMetricCardProps {
  accentColor: string;
  icon: LucideIcon;
  label: string;
  value: number;
  fullWidth?: boolean;
}

export function GuardianMetricCard({
  accentColor,
  fullWidth = false,
  icon: Icon,
  label,
  value,
}: GuardianMetricCardProps) {
  const spring = useSpring(value, { stiffness: 55, damping: 18, mass: 0.9 });
  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  const width = useTransform(spring, (current) => `${Math.min(100, Math.max(0, current))}%`);
  const displayValue = useTransform(spring, (current) => `${Math.round(current)}%`);

  return (
    <article
      className={`flex flex-col gap-[var(--space-component-md)] rounded-sm border border-surface-default bg-surface-default p-[var(--space-card-padding)] shadow-card ${
        fullWidth ? "col-span-2" : ""
      }`}
    >
      <div className="flex items-center justify-between gap-[var(--space-component-md)]">
        <div className="flex min-w-0 items-center gap-[var(--space-component-md)]">
          <span
            className="flex size-[var(--space-50)] shrink-0 items-center justify-center rounded-sm text-surface-default"
            style={{ backgroundColor: accentColor }}
          >
            <Icon aria-hidden className="size-[var(--space-24)]" />
          </span>
          <p className="font-body text-body-sm font-weight-button text-text-primary">{label}</p>
        </div>
        <motion.p className="shrink-0 font-body text-body-lg font-weight-heading text-text-primary">{displayValue}</motion.p>
      </div>
      <div className="h-[var(--space-component-sm)] overflow-hidden rounded-pill bg-surface-subtle">
        <motion.div className="h-full rounded-pill" style={{ backgroundColor: accentColor, width }} />
      </div>
    </article>
  );
}
