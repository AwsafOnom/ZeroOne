import { Link } from "react-router-dom";
import type { ApiHealingChainConnection } from "@zeroone/shared";
import { Avatar, Card } from "../../primitives";
import {
  connectionRoleLabel,
  formatJourneyTenure,
  formatSessionDateTime,
  formatSessionStatus,
  personConditionLabel,
  personDisplayName,
} from "../healingChainShared";

export function ConnectionCard({
  connection,
  profilePath,
  role,
}: {
  connection: ApiHealingChainConnection | null;
  role: "mentor" | "mentee";
  profilePath: string;
}) {
  const label = connectionRoleLabel(role);

  if (!connection) {
    return (
      <Card className="rounded-[var(--radius-lg)] border-dashed" variant="outlined">
        <p className="text-body-sm font-weight-button text-text-secondary">{label}</p>
        <p className="mt-[var(--space-component-md)] text-body-sm text-text-secondary">
          {role === "mentor"
            ? "A volunteer mentor will appear here when a match is ready. Mentors are never assigned by staff — matching opens when someone further along chooses to walk with you."
            : "A mentee will appear here when someone earlier in their journey is ready for your support."}
        </p>
      </Card>
    );
  }

  const { person, upcomingSession } = connection;
  const tenure = formatJourneyTenure(person.journeyStartDate);
  const conditionLabel = personConditionLabel(person);

  return (
    <Card className="rounded-[var(--radius-lg)]" variant="outlined">
      <p className="text-body-sm font-weight-button text-text-secondary">{label}</p>
      <div className="mt-[var(--space-component-md)] flex items-center gap-[var(--space-component-md)]">
        <Avatar name={personDisplayName(person)} size="lg" src={person.avatarUrl ?? undefined} />
        <div className="min-w-0">
          <p className="truncate text-body-lg font-weight-button text-text-heading">{personDisplayName(person)}</p>
          {conditionLabel && <p className="text-body-sm text-text-secondary">{conditionLabel}</p>}
          {tenure && <p className="text-body-xs text-text-secondary">{tenure}</p>}
        </div>
      </div>
      {upcomingSession && (
        <p className="mt-[var(--space-component-md)] text-body-sm text-text-primary">
          Next session: {formatSessionDateTime(upcomingSession.startsAt)} ·{" "}
          {formatSessionStatus(upcomingSession.status)}
        </p>
      )}
      <div className="mt-[var(--space-layout)] flex flex-wrap gap-[var(--space-component-md)]">
        <Link className="text-body-sm font-weight-button text-primary" to={profilePath}>
          View profile
        </Link>
        <Link className="text-body-sm font-weight-button text-text-secondary" to="/healing-chain/chain-chat">
          Chain chat
        </Link>
      </div>
    </Card>
  );
}
