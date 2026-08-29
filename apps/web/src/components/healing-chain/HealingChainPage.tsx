import { useHealingChain } from "../../api";
import { useAuth } from "../../context/AuthContext";
import { Skeleton } from "../primitives";
import { JourneyTimeline } from "../journal/components/JourneyTimeline";
import { ChainChatPanel } from "./components/ChainChatPanel";
import { ChainHeroBanner } from "./components/ChainHeroBanner";
import { ConnectionStack } from "./components/ConnectionStack";
import { HealingImpactPanel, LanternArtifactPanel } from "./components/ImpactPanels";
import { LanternSparksPanel, LanternSparksPanelSkeleton } from "./components/LanternSparksPanel";
import { SectionError } from "./healingChainShared";

export function HealingChainPage() {
  const { token } = useAuth();
  const chain = useHealingChain({ token });

  if (chain.isLoading) {
    return (
      <div className="mx-auto flex w-full max-w-[var(--space-1457)] flex-col gap-[var(--space-layout)]">
        <Skeleton className="h-[var(--space-60)]" />
        <Skeleton className="h-[var(--space-185-013)]" />
        <Skeleton className="h-[var(--space-328-617)]" />
        <LanternSparksPanelSkeleton />
      </div>
    );
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
      </header>

      <ChainHeroBanner banner={data.banner} />

      <ConnectionStack connectionStatus={data.connectionStatus} mentor={data.mentor} mentee={data.mentee} />

      <div className="grid min-w-0 gap-[var(--space-layout)] lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
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

      <JourneyTimeline stages={data.journeyStages} />

      <ChainChatPanel />
    </div>
  );
}
