import type { ApiImpactEvent, ApiImpactMetricChange } from "./api.js";

type RawImpactEvent = {
  id: string;
  squadId: string;
  cycleId: string | null;
  activityClaimId?: string | null;
  activityCategory: string;
  metric: string;
  delta: number;
  message: string;
  occurredAt: string;
  actor: ApiImpactEvent["actor"];
  activity: ApiImpactEvent["activity"];
  metrics?: ApiImpactMetricChange[];
};

export function groupImpactEvents(events: RawImpactEvent[]): ApiImpactEvent[] {
  const grouped = new Map<string, ApiImpactEvent>();

  for (const event of events) {
    const groupKey = event.activityClaimId ?? event.id;
    const metricChange: ApiImpactMetricChange = { metric: event.metric, delta: event.delta };
    const existing = grouped.get(groupKey);

    if (!existing) {
      grouped.set(groupKey, {
        ...event,
        activityClaimId: event.activityClaimId ?? null,
        metrics: event.metrics ?? [metricChange],
      });
      continue;
    }

    const metrics = [...existing.metrics];
    for (const entry of event.metrics ?? [metricChange]) {
      if (!metrics.some((metric) => metric.metric === entry.metric)) {
        metrics.push(entry);
      }
    }

    grouped.set(groupKey, {
      ...existing,
      metrics,
      metric: metrics[0]?.metric ?? existing.metric,
      delta: metrics[0]?.delta ?? existing.delta,
    });
  }

  return [...grouped.values()].sort(
    (left, right) => new Date(right.occurredAt).getTime() - new Date(left.occurredAt).getTime(),
  );
}
