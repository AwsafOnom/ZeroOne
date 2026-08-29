import { Link } from "react-router-dom";
import type { ApiHealingChainConnection } from "@zeroone/shared";
import { Avatar, Card, Skeleton } from "../primitives";
import {
  connectionRoleLabel,
  formatJourneyTenure,
  formatSessionDateTime,
  formatSessionStatus,
  personConditionLabel,
  personDisplayName,
} from "./healingChainShared";

export function HealingChainProfilePage({
  connection,
  role,
}: {
  role: "mentor" | "mentee";
  connection: ApiHealingChainConnection | null | undefined;
}) {
  if (connection === undefined) {
    return (
      <div className="mx-auto flex w-full max-w-[var(--space-1457)] flex-col gap-[var(--space-layout)]">
        <Skeleton className="h-[var(--space-60)]" />
        <Skeleton className="h-[var(--space-328-617)]" />
      </div>
    );
  }

  const title = connectionRoleLabel(role);

  return (
    <div className="mx-auto flex w-full max-w-[var(--space-1457)] flex-col gap-[var(--space-layout)]">
      <header>
        <Link className="text-body-sm font-weight-button text-primary" to="/healing-chain">
          ← Back to Healing Chain
        </Link>
        <h1 className="mt-[var(--space-component-md)] text-heading-md font-weight-heading text-text-heading">{title}</h1>
      </header>

      {!connection ? (
        <Card variant="outlined">
          <p className="text-body-sm text-text-secondary">
            {role === "mentor"
              ? "Your mentor profile will appear here once a volunteer mentor is matched with you."
              : "Your mentee profile will appear here once someone earlier in their journey is matched with you."}
          </p>
        </Card>
      ) : (
        <Card className="rounded-[var(--radius-lg)] p-[var(--space-layout)]" variant="outlined">
          <div className="flex flex-col gap-[var(--space-layout)] md:flex-row md:items-start">
            <Avatar
              name={personDisplayName(connection.person)}
              size="lg"
              src={connection.person.avatarUrl ?? undefined}
            />
            <div className="min-w-0 flex-1">
              <h2 className="text-heading-sm font-weight-heading text-text-heading">
                {personDisplayName(connection.person)}
              </h2>
              {personConditionLabel(connection.person) && (
                <p className="mt-[var(--space-component-xs)] text-body-sm text-text-secondary">
                  {personConditionLabel(connection.person)}
                </p>
              )}
              {formatJourneyTenure(connection.person.journeyStartDate) && (
                <p className="mt-[var(--space-component-xs)] text-body-sm text-text-secondary">
                  {formatJourneyTenure(connection.person.journeyStartDate)}
                </p>
              )}
            </div>
          </div>

          <dl className="mt-[var(--space-layout)] grid gap-[var(--space-component-md)] sm:grid-cols-2">
            <div>
              <dt className="text-body-xs font-weight-button text-text-secondary">Specialization</dt>
              <dd className="mt-[var(--space-component-xs)] text-body-sm text-text-primary">
                {connection.person.profile?.specialization ?? "Not shared yet"}
              </dd>
            </div>
            <div>
              <dt className="text-body-xs font-weight-button text-text-secondary">Availability</dt>
              <dd className="mt-[var(--space-component-xs)] text-body-sm text-text-primary">
                {connection.person.profile?.isAvailable ? "Available to connect" : "Not available right now"}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-body-xs font-weight-button text-text-secondary">Preferred communication</dt>
              <dd className="mt-[var(--space-component-xs)] text-body-sm text-text-primary">
                {connection.person.profile?.preferredCommunicationStyle ?? "Not shared yet"}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-body-xs font-weight-button text-text-secondary">Bio</dt>
              <dd className="mt-[var(--space-component-xs)] text-body-sm text-text-primary">
                {connection.person.profile?.bio ?? "This member has not added a bio yet."}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-body-xs font-weight-button text-text-secondary">Upcoming confirmed session</dt>
              <dd className="mt-[var(--space-component-xs)] text-body-sm text-text-primary">
                {connection.upcomingSession
                  ? `${formatSessionDateTime(connection.upcomingSession.startsAt)} · ${formatSessionStatus(connection.upcomingSession.status)}`
                  : "No upcoming session scheduled"}
              </dd>
            </div>
          </dl>

          <Link className="mt-[var(--space-layout)] inline-flex text-body-sm font-weight-button text-primary" to="/healing-chain/chain-chat">
            Chain chat
          </Link>
        </Card>
      )}
    </div>
  );
}
