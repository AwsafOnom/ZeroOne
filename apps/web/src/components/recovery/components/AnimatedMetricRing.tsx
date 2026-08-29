import { useEffect } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import type { LucideIcon } from "lucide-react";

export interface AnimatedMetricRingProps {
  value: number;
  label: string;
  icon: LucideIcon;
  accentColor: string;
}

export function AnimatedMetricRing({ value, label, icon: Icon, accentColor }: AnimatedMetricRingProps) {
  const spring = useSpring(value, { stiffness: 55, damping: 18, mass: 0.9 });
  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  const background = useTransform(spring, (current) => {
    const clamped = Math.min(100, Math.max(0, current));
    return `conic-gradient(${accentColor} ${clamped}%, var(--color-surface-subtle) 0)`;
  });
  const displayValue = useTransform(spring, (current) => `${Math.round(current)}%`);

  return (
    <div className="flex flex-col items-center gap-[var(--space-component-sm)] text-center">
      <motion.div
        aria-label={`${label}: ${Math.round(value)}%`}
        aria-valuemax={100}
        aria-valuemin={0}
        aria-valuenow={Math.round(value)}
        className="relative size-[var(--space-64-428)] rounded-round p-[var(--space-component-xs)]"
        role="progressbar"
        style={{ background }}
      >
        <div className="flex size-full flex-col items-center justify-center gap-[var(--space-component-xs)] rounded-round bg-surface-default">
          <Icon aria-hidden className="size-[var(--space-20)]" style={{ color: accentColor }} />
          <motion.span className="font-body text-body-xs font-weight-button text-text-primary">{displayValue}</motion.span>
        </div>
      </motion.div>
      <span className="max-w-[var(--space-80-151)] font-body text-body-xs text-text-secondary">{label}</span>
    </div>
  );
}
