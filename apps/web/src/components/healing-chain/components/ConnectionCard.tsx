import { Link } from "react-router-dom";
import type { ApiHealingChainConnection } from "@zeroone/shared";
import { Avatar } from "../../primitives";
import {
  connectionRoleLabel,
  personDisplayName,
  personSubtitle,
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
      <div className="flex min-w-0 flex-1 flex-col gap-[var(--space-component-sm)]">
        <p className="text-body-lg font-weight-button text-text-heading">{label}</p>
        <div className="flex min-h-[var(--space-128-856)] flex-col justify-center rounded-md border border-dashed border-border-subtle bg-surface-default px-[var(--space-layout)] py-[var(--space-component-md)]">
          <p className="text-body-sm text-text-secondary">
            {role === "mentor"
              ? "A volunteer mentor will appear here when a match is ready."
              : "A mentee will appear here when someone earlier in their journey is ready for your support."}
          </p>
        </div>
      </div>
    );
  }

  const { person } = connection;
  const subtitle = personSubtitle(person);

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-[var(--space-component-sm)]">
      <Link className="text-body-lg font-weight-button text-text-heading hover:text-primary" to={profilePath}>
        {label}
      </Link>
      <div className="flex min-h-[var(--space-128-856)] flex-col justify-between rounded-md border border-border-subtle bg-surface-default px-[var(--space-layout)] py-[var(--space-component-md)]">
        <div className="flex items-center gap-[var(--space-component-md)]">
          <Avatar name={personDisplayName(person)} size="md" src={person.avatarUrl ?? undefined} />
          <div className="min-w-0">
            <Link className="block truncate text-body font-weight-button text-text-heading hover:text-primary" to={profilePath}>
              {personDisplayName(person)}
            </Link>
            {subtitle && <p className="text-body-xs text-text-secondary">{subtitle}</p>}
          </div>
        </div>
        <div className="flex justify-end">
          <Link
            className="inline-flex min-h-[var(--space-36)] items-center justify-center rounded-sm border border-border-subtle px-[var(--space-component-sm)] text-body-xs font-weight-button text-text-primary hover:border-primary hover:text-primary"
            to="/healing-chain/chain-chat"
          >
            Message
          </Link>
        </div>
      </div>
    </div>
  );
}
