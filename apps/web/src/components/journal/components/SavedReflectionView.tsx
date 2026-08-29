import type { ApiAiFeedback, ApiPeerStory } from "@zeroone/shared";
import { AiFeedbackPanel } from "./AiFeedbackPanel";
import { PeerStoriesPanel } from "./PeerStoriesPanel";

export function SavedReflectionView({
  aiError,
  aiFeedback,
  aiFeedbackStatus,
  bodyText,
  isAiLoading,
  matchLabel,
  peerStories,
  peerStoriesLoading,
}: {
  bodyText: string;
  peerStories: ApiPeerStory[];
  matchLabel: string | null;
  isAiLoading: boolean;
  aiFeedback: ApiAiFeedback | null;
  aiFeedbackStatus?: "ready" | "crisis" | "unavailable" | "failed";
  aiError?: string;
  peerStoriesLoading: boolean;
}) {
  return (
    <div className="flex flex-col gap-[var(--space-layout)]">
      <section className="rounded-[var(--radius-lg)] bg-[var(--primitive-color-activity-peach)] p-[var(--space-layout)]">
        <h2 className="text-heading-sm font-weight-heading text-text-heading">My Reflection</h2>
        <p className="mt-[var(--space-component-md)] whitespace-pre-wrap text-body text-text-primary">{bodyText}</p>
      </section>

      <PeerStoriesPanel
        isLoading={peerStoriesLoading}
        layout="grid"
        matchLabel={matchLabel}
        stories={peerStories}
        title="Stories From People Who Understand"
      />

      <AiFeedbackPanel
        error={aiError}
        feedback={aiFeedback}
        isLoading={isAiLoading}
        status={aiFeedbackStatus}
        variant="saved"
      />
    </div>
  );
}
