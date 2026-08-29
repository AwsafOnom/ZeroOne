import { useHealingChain } from "../../api";
import { useAuth } from "../../context/AuthContext";
import { Skeleton } from "../primitives";
import { ChainHeroBanner } from "./components/ChainHeroBanner";
import { ConnectionStack } from "./components/ConnectionStack";
import { HealingChainJourneyTimeline } from "./components/HealingChainJourneyTimeline";
import { HealingChainSidebar } from "./components/HealingChainSidebar";
import { HealingImpactPanel, LanternArtifactPanel } from "./components/ImpactPanels";
import { LanternSparksPanel, LanternSparksPanelSkeleton } from "./components/LanternSparksPanel";
import { SectionError } from "./healingChainShared";

export function HealingChainPage() {
  const { token } = useAuth();
  const chain = useHealingChain({ token });

  if (chain.isLoading) {
    return <HealingChainPageSkeleton />;
  }

  if (chain.error || !chain.data) {
    return (
      <div className="mx-auto w-full max-w-[var(--space-1457)]">
        <SectionError message={chain.error?.message ?? "Unable to load Healing Chain."} />
      </div>
    );
  }

  const data = chain.data;

  return (
    <div className="mx-auto flex w-full max-w-[var(--space-1457)] flex-col gap-[var(--space-layout)]">
      <header>
        <h1 className="text-heading-md font-weight-heading text-text-heading">Healing Chain</h1>
        <p className="mt-[var(--space-component-xs)] text-body-sm text-text-secondary">
          You Receive Hope. You Give Hope. Together, We Heal.
        </p>
      </header>

      <div className="grid gap-[var(--space-layout)] xl:grid-cols-[minmax(0,1fr)_minmax(280px,395px)]">
        <div className="flex min-w-0 flex-col gap-[var(--space-layout)]">
          <ChainHeroBanner />

          <ConnectionStack
            connectionStatus={data.connectionStatus}
            mentee={data.mentee}
            mentor={data.mentor}
          />

          <div className="grid min-w-0 gap-[var(--space-layout)] lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
            <LanternSparksPanel
              mentee={data.mentee}
              mentor={data.mentor}
              onSent={() => void chain.refetch()}
              sparkActions={data.sparkActions}
              sparkProgress={data.sparkProgress}
            />
            <div className="flex min-w-0 flex-col gap-[var(--space-layout)]">
              <HealingImpactPanel impact={data.healingImpact} />
              <LanternArtifactPanel lantern={data.lantern} />
            </div>
          </div>

          <HealingChainJourneyTimeline stages={data.journeyStages} />
        </div>

        <HealingChainSidebar mentee={data.mentee} mentor={data.mentor} />
      </div>
    </div>
  );
}

function HealingChainPageSkeleton() {
  return (
    <div className="mx-auto flex w-full max-w-[var(--space-1457)] flex-col gap-[var(--space-layout)]">
      <Skeleton className="h-[var(--space-60)]" />
      <div className="grid gap-[var(--space-layout)] xl:grid-cols-[minmax(0,1fr)_minmax(280px,395px)]">
        <div className="flex flex-col gap-[var(--space-layout)]">
          <Skeleton className="h-[var(--space-185-013)]" />
          <Skeleton className="h-[var(--space-328-617)]" />
          <LanternSparksPanelSkeleton />
          <Skeleton className="h-[var(--space-373)]" />
        </div>
        <div className="flex flex-col gap-[var(--space-layout)]">
          <Skeleton className="h-[var(--space-373)]" />
          <Skeleton className="h-[var(--space-183)]" />
          <Skeleton className="h-[var(--space-128-856)]" />
        </div>
      </div>
    </div>
  );
}
