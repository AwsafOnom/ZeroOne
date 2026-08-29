import type { ApiHealingChainConnection, ApiHealingChainPerson } from "@zeroone/shared";

export function SectionError({ message }: { message: string }) {
  return (
    <p className="rounded-sm bg-surface-success p-[var(--space-component-md)] text-body-sm text-orange" role="alert">
      {message}
    </p>
  );
}

export function formatSessionStatus(status: string): string {
  if (status === "CONFIRMED") {
    return "Confirmed";
  }
  if (status === "CANCELLED") {
    return "Cancelled";
  }
  return status
    .split("_")
    .map((part) => part.charAt(0) + part.slice(1).toLowerCase())
    .join(" ");
}

export function formatJourneyTenure(journeyStartDate: string | null): string | null {
  if (!journeyStartDate) {
    return null;
  }
  const start = new Date(journeyStartDate);
  const now = new Date();
  const totalMonths =
    (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth());
  if (totalMonths < 1) {
    const days = Math.max(1, Math.floor((now.getTime() - start.getTime()) / 86_400_000));
    if (days < 30) {
      return `${days} day${days === 1 ? "" : "s"} in journey`;
    }
  }
  if (totalMonths < 12) {
    return `${totalMonths} month${totalMonths === 1 ? "" : "s"} in journey`;
  }
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  if (months === 0) {
    return `${years} year${years === 1 ? "" : "s"} in journey`;
  }
  return `${years} year${years === 1 ? "" : "s"}, ${months} month${months === 1 ? "" : "s"} in journey`;
}

export function personDisplayName(person: ApiHealingChainPerson | null | undefined): string {
  return person?.name?.trim() || "Your connection";
}

export function personConditionLabel(person: ApiHealingChainPerson | null | undefined): string | null {
  const condition = person?.primaryCondition?.name;
  return condition ? `Living with ${condition}` : null;
}

export function connectionRoleLabel(role: "mentor" | "mentee"): string {
  return role === "mentor" ? "Your mentor" : "Your mentee";
}

export function formatSessionDateTime(isoDate: string): string {
  return new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(isoDate));
}

export function sparkRecipientOptions(
  mentor: ApiHealingChainConnection | null,
  mentee: ApiHealingChainConnection | null,
): Array<{ role: "mentor" | "mentee"; connection: ApiHealingChainConnection }> {
  const options: Array<{ role: "mentor" | "mentee"; connection: ApiHealingChainConnection }> = [];
  if (mentor) {
    options.push({ role: "mentor", connection: mentor });
  }
  if (mentee) {
    options.push({ role: "mentee", connection: mentee });
  }
  return options;
}
