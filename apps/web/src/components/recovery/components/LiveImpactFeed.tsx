import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { ApiImpactEvent } from "@zeroone/shared";
import { Card, Skeleton } from "../../primitives";
import { formatImpactMetrics, formatRelativeTime, SectionError } from "../shared";

export interface LiveImpactFeedProps {
  events: ApiImpactEvent[];
  error?: Error | null;
  isLoading: boolean;
  limit?: number;
}

export function LiveImpactFeed({ events, error, isLoading, limit = 6 }: LiveImpactFeedProps) {
  const [, setTick] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => setTick((value) => value + 1), 30_000);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <Card variant="outlined">
      <h2 className="text-body-lg font-weight-button text-text-primary">Live Squad Impact</h2>
      {isLoading ? (
        <div className="mt-[var(--space-component-md)] flex flex-col gap-[var(--space-component-sm)]">
          <Skeleton className="h-[var(--space-45)]" />
          <Skeleton className="h-[var(--space-45)]" />
          <Skeleton className="h-[var(--space-45)]" />
        </div>
      ) : error ? (
        <div className="mt-[var(--space-component-md)]">
          <SectionError message={error.message} />
        </div>
      ) : events.length === 0 ? (
        <p className="mt-[var(--space-component-md)] text-body-sm text-text-secondary">
          Your squad’s first completed activity will appear here.
        </p>
      ) : (
        <div className="mt-[var(--space-component-md)] flex flex-col gap-[var(--space-component-sm)] overflow-hidden">
          <AnimatePresence initial={false}>
            {events.slice(0, limit).map((event) => (
              <motion.article
                animate={{ opacity: 1, y: 0, height: "auto" }}
                className="overflow-hidden rounded-sm bg-surface-blue-light p-[var(--space-component-sm)]"
                exit={{ opacity: 0, height: 0 }}
                initial={{ opacity: 0, y: -16 }}
                key={event.id}
                layout
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <p className="text-body-xs text-text-primary">{event.message}</p>
                <div className="mt-[var(--space-component-xs)] flex items-center justify-between gap-[var(--space-component-sm)]">
                  <p className="text-body-xs font-weight-button text-primary">
                    {formatImpactMetrics(event.metrics ?? [{ metric: event.metric, delta: event.delta }])}
                  </p>
                  <time className="shrink-0 text-body-xs text-text-secondary" dateTime={event.occurredAt}>
                    {formatRelativeTime(event.occurredAt)}
                  </time>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>
      )}
    </Card>
  );
}
