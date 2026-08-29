import type { ReactNode } from "react";
import type {
  ApiCycleCrystallization,
  ApiImpactEvent,
  ApiOnggiState,
  ApiSquadHealth,
  ApiSquadInsights,
  ApiSquadMatchup,
  ApiSquadMemberContribution,
} from "@zeroone/shared";

export const metricLabels: Record<string, string> = {
  BREATHING_EXERCISE: "Breathing Exercise",
  BREATHING_VEINS: "Breathing Veins",
  CIRCULATION: "Circulation",
  HARMONY: "Harmony",
  WARMTH: "Warmth",
};

export const onggiNameLabels: Record<string, string> = {
  NEW_BEGINNING: "Hope",
  STRENGTH: "Strength",
  GROWTH: "Growth",
  WISDOM: "Wisdom",
};

export const memberStatusLabels: Record<string, string> = {
  ACTIVE: "Active",
  PAUSED: "Taking a break",
  INVITED: "Invited",
  LEFT: "Left squad",
  REMOVED: "Removed",
};

export const capsuleTypeLabels: Record<string, string> = {
  PHOTO: "Photo",
  VOICE_RECORDING: "Voice recording",
  SONG: "Song",
  MEMORY: "Memory",
};

export function displayEnumLabel(value: string): string {
  return value
    .split("_")
    .map((part) => part.charAt(0) + part.slice(1).toLowerCase())
    .join(" ");
}

export function formatMetricLabel(value: string): string {
  return metricLabels[value] ?? displayEnumLabel(value);
}

export function formatMemberStatus(value: string): string {
  return memberStatusLabels[value] ?? displayEnumLabel(value);
}

export function formatRelativeTime(timestamp: string): string {
  const elapsedSeconds = Math.max(0, Math.floor((Date.now() - new Date(timestamp).getTime()) / 1_000));
  if (elapsedSeconds < 60) {
    return "just now";
  }
  const elapsedMinutes = Math.floor(elapsedSeconds / 60);
  if (elapsedMinutes < 60) {
    return `${elapsedMinutes}m ago`;
  }
  const elapsedHours = Math.floor(elapsedMinutes / 60);
  if (elapsedHours < 24) {
    return `${elapsedHours}h ago`;
  }
  return `${Math.floor(elapsedHours / 24)}d ago`;
}

export const onggiDisplayTitles: Record<string, string> = {
  NEW_BEGINNING: "Onggi of Hope",
  STRENGTH: "Onggi for Strength",
  GROWTH: "Onggi for Growth",
  WISDOM: "Onggi of Wisdom",
};

export function formatOnggiTitle(name: string, theme?: string): string {
  if (onggiDisplayTitles[name]) {
    return onggiDisplayTitles[name];
  }
  const label = theme ?? onggiNameLabels[name] ?? displayEnumLabel(name);
  return `Onggi of ${label}`;
}

export function formatImpactMetrics(metrics: Array<{ metric: string; delta: number }>): string {
  if (metrics.length === 0) {
    return "";
  }
  if (metrics.length > 1 && metrics.every((entry) => entry.delta === metrics[0]?.delta)) {
    return `All metrics +${metrics[0]?.delta}%`;
  }
  return metrics.map((entry) => `${formatMetricLabel(entry.metric)} +${entry.delta}%`).join(" · ");
}

const onggiThemeColorByName: Record<string, string> = {
  NEW_BEGINNING: "var(--color-secondary)",
  GROWTH: "var(--color-success-indicator)",
  STRENGTH: "var(--color-orange)",
  WISDOM: "var(--color-primary-strong)",
};

const onggiThemeColorByLabel: Record<string, string> = {
  Hope: "var(--color-secondary)",
  Growth: "var(--color-success-indicator)",
  Strength: "var(--color-orange)",
  Wisdom: "var(--color-primary-strong)",
};

export function getOnggiThemeColor(name: string, theme?: string): string {
  return onggiThemeColorByLabel[theme ?? ""] ?? onggiThemeColorByName[name] ?? "var(--color-primary)";
}

export function formatResonanceScore(value: number): string {
  return value.toLocaleString();
}

export function formatDateRange(start: string, end: string): string {
  const formatter = new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric", year: "numeric" });
  return `${formatter.format(new Date(start))} – ${formatter.format(new Date(end))}`;
}

export function cycleDayCount(start: string, end: string): number {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const elapsedDays = Math.round((endDate.getTime() - startDate.getTime()) / 86_400_000);
  return Math.max(1, elapsedDays + 1);
}

export function SectionError({ message }: { message: string }) {
  return (
    <p className="rounded-sm bg-surface-success p-[var(--space-component-md)] text-body-sm text-orange" role="alert">
      {message}
    </p>
  );
}

export function StatTile({
  label,
  value,
  hint,
}: {
  label: string;
  value: ReactNode;
  hint?: string;
}) {
  return (
    <div className="rounded-sm border border-border-subtle bg-surface-default p-[var(--space-card-padding)]">
      <p className="text-body-xs text-text-secondary">{label}</p>
      <p className="mt-[var(--space-component-xs)] text-heading-sm font-weight-heading text-text-primary">{value}</p>
      {hint && <p className="mt-[var(--space-component-xs)] text-body-xs text-text-secondary">{hint}</p>}
    </div>
  );
}

export type {
  ApiCycleCrystallization,
  ApiImpactEvent,
  ApiOnggiState,
  ApiSquadHealth,
  ApiSquadInsights,
  ApiSquadMatchup,
  ApiSquadMemberContribution,
};
