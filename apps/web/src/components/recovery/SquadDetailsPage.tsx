import { useMemberContributions, useSquadMatchup } from "../../api";
import { useAuth } from "../../context/AuthContext";
import { Avatar, Card, ProgressRing, Skeleton } from "../primitives";
import { AnimatedCounter } from "./components/AnimatedCounter";
import { OnggiVesselVisual } from "./components/OnggiVesselVisual";
import {
  formatMemberStatus,
  SectionError,
  StatTile,
} from "./shared";

export function SquadDetailsPage() {
  const { token } = useAuth();

  const matchup = useSquadMatchup({ token });
  const contributions = useMemberContributions({ token });

  const yourSquad = matchup.data?.matchup.yourSquad;
  const opponentSquad = matchup.data?.matchup.opponentSquad;
  const insights = matchup.data?.matchup.insights;

  return (
    <div className="flex flex-col gap-[var(--space-layout)]">
      <Card variant="outlined">
        <h2 className="text-heading-sm font-weight-heading text-text-primary">Squad matchup</h2>
        {matchup.isLoading ? (
          <div className="mt-[var(--space-layout)] grid gap-[var(--space-layout)] lg:grid-cols-[1fr_auto_1fr]">
            <Skeleton className="h-[var(--space-183)]" />
            <Skeleton className="mx-auto h-[var(--space-60)] w-[var(--space-60)] rounded-round" />
            <Skeleton className="h-[var(--space-183)]" />
          </div>
        ) : matchup.error ? (
          <div className="mt-[var(--space-layout)]">
            <SectionError message={matchup.error.message} />
          </div>
        ) : yourSquad?.squad ? (
          <div className="mt-[var(--space-layout)] grid items-center gap-[var(--space-layout)] lg:grid-cols-[1fr_auto_1fr]">
            <MatchupSide
              cycle={yourSquad.cycle}
              label="Your squad"
              squadName={yourSquad.squad.name}
            />
            <p aria-hidden className="text-center text-heading-sm font-weight-heading text-text-secondary">
              VS
            </p>
            {opponentSquad?.squad ? (
              <MatchupSide
                cycle={opponentSquad.cycle}
                label="Opponent"
                squadName={opponentSquad.squad.name}
              />
            ) : (
              <p className="rounded-sm bg-surface-success p-[var(--space-card-padding)] text-body-sm text-text-secondary">
                No opponent squad is matched for this cycle yet.
              </p>
            )}
          </div>
        ) : null}
      </Card>

      <div className="grid gap-[var(--space-layout)] xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <Card variant="outlined">
          <h2 className="text-body-lg font-weight-button text-text-primary">Squad members</h2>
          {contributions.isLoading ? (
            <div className="mt-[var(--space-component-md)] flex flex-col gap-[var(--space-component-sm)]">
              <Skeleton className="h-[var(--space-60)]" />
              <Skeleton className="h-[var(--space-60)]" />
              <Skeleton className="h-[var(--space-60)]" />
            </div>
          ) : contributions.error ? (
            <div className="mt-[var(--space-component-md)]">
              <SectionError message={contributions.error.message} />
            </div>
          ) : contributions.data?.members.length === 0 ? (
            <p className="mt-[var(--space-component-md)] text-body-sm text-text-secondary">
              Squad members will appear here once your squad is fully formed.
            </p>
          ) : (
            <div className="mt-[var(--space-component-md)] overflow-x-auto">
              <table className="w-full min-w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-border-subtle text-body-xs text-text-secondary">
                    <th className="pb-[var(--space-component-sm)] font-weight-body">Member</th>
                    <th className="pb-[var(--space-component-sm)] font-weight-body">Condition</th>
                    <th className="pb-[var(--space-component-sm)] font-weight-body">Status</th>
                    <th className="pb-[var(--space-component-sm)] text-right font-weight-body">This week</th>
                    <th className="pb-[var(--space-component-sm)] text-right font-weight-body">Activities</th>
                  </tr>
                </thead>
                <tbody>
                  {contributions.data?.members.map((member) => (
                    <tr className="border-b border-border-subtle last:border-b-0" key={member.id}>
                      <td className="py-[var(--space-component-sm)]">
                        <div className="flex items-center gap-[var(--space-component-sm)]">
                          <Avatar name={member.name ?? undefined} size="sm" src={member.avatarUrl ?? undefined} />
                          <span className="text-body-sm text-text-primary">{member.name ?? "Squad member"}</span>
                        </div>
                      </td>
                      <td className="py-[var(--space-component-sm)] text-body-sm text-text-secondary">
                        {member.condition.name}
                      </td>
                      <td className="py-[var(--space-component-sm)] text-body-sm text-text-secondary">
                        {formatMemberStatus(member.status)}
                      </td>
                      <td className="py-[var(--space-component-sm)] text-right text-body-sm font-weight-button text-primary">
                        {member.weeklyProgress}%
                      </td>
                      <td className="py-[var(--space-component-sm)] text-right text-body-sm text-text-primary">
                        {member.completedActivities}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        <aside className="flex flex-col gap-[var(--space-layout)]">
          <Card className="bg-surface-blue-light" variant="muted">
            <h2 className="text-body-lg font-weight-button text-text-primary">Squad stability</h2>
            {matchup.isLoading ? (
              <Skeleton className="mx-auto mt-[var(--space-layout)] size-[var(--space-128-856)] rounded-round" />
            ) : insights ? (
              <div className="mt-[var(--space-layout)] flex flex-col items-center gap-[var(--space-component-md)]">
                <ProgressRing label="Stability" size="lg" value={insights.stabilityPercent} />
                <p className="text-center text-body-xs text-text-secondary">
                  Engagement over the last 7 days: {insights.engagementLast7Days}%
                </p>
              </div>
            ) : null}
          </Card>

          <Card variant="outlined">
            <h2 className="text-body-lg font-weight-button text-text-primary">Shared Onggi</h2>
            <div className="mt-[var(--space-component-md)]">
              <OnggiVesselVisual />
            </div>
            {yourSquad?.cycle?.onggiState && (
              <p className="mt-[var(--space-component-md)] text-center text-body-sm text-text-secondary">
                Current resonance:{" "}
                <span className="font-weight-button text-primary">
                  <AnimatedCounter value={yourSquad.cycle.onggiState.resonanceScore} />
                </span>
              </p>
            )}
          </Card>
        </aside>
      </div>
    </div>
  );
}

function MatchupSide({
  label,
  squadName,
  cycle,
}: {
  label: string;
  squadName: string;
  cycle: { onggiState: { resonanceScore: number } | null } | null;
}) {
  const resonance = cycle?.onggiState?.resonanceScore ?? 0;
  return (
    <div className="rounded-sm border border-border-subtle bg-surface-default p-[var(--space-card-padding)]">
      <p className="text-body-xs text-text-secondary">{label}</p>
      <h3 className="mt-[var(--space-component-xs)] text-body-lg font-weight-button text-text-primary">{squadName}</h3>
      <p className="mt-[var(--space-component-md)] text-heading-sm font-weight-heading text-primary">
        {cycle?.onggiState ? <AnimatedCounter value={resonance} /> : "—"}
      </p>
      <p className="mt-[var(--space-component-xs)] text-body-xs text-text-secondary">Resonance score</p>
      {!cycle?.onggiState && (
        <p className="mt-[var(--space-component-sm)] text-body-xs text-text-secondary">
          Awaiting first shared activity.
        </p>
      )}
    </div>
  );
}
