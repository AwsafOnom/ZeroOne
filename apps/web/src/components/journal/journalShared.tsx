export const moodOptions = [
  { value: "SAD", label: "Sad" },
  { value: "ANXIOUS", label: "Anxious" },
  { value: "FRUSTRATED", label: "Frustrated" },
  { value: "LONELY", label: "Lonely" },
  { value: "EXHAUSTED", label: "Exhausted" },
  { value: "HOPEFUL", label: "Hopeful" },
  { value: "OTHER", label: "Other" },
] as const;

export const emotionalTagOptions = [
  { value: "MISSED_EVENT", label: "Missed Event" },
  { value: "PAIN_FLARE", label: "Pain Flare" },
  { value: "SOCIAL_ISOLATION", label: "Social Isolation" },
  { value: "IDENTITY_LOSS", label: "Identity Loss" },
  { value: "FATIGUE", label: "Fatigue" },
  { value: "RELATIONSHIP_STRUGGLE", label: "Relationship Struggle" },
  { value: "ABANDONED_HOBBIES", label: "Abandoned Hobbies" },
  { value: "OTHERS", label: "Others" },
] as const;

export const journalHowItWorks = [
  "Write privately about what illness or recovery has taken from your day.",
  "Tag what you are carrying so we can surface stories from others who chose to share.",
  "Receive AI feedback that names your weight — never generic encouragement.",
  "Your reflection stays yours unless you explicitly share it as an anonymous story.",
] as const;

export const journalHelpBenefits = [
  { title: "Express Freely", description: "Write without performing strength or pretending you are fine." },
  { title: "Heal Emotionally", description: "Naming what you carry can loosen its grip over time." },
  { title: "See Your Growth", description: "Look back and notice patterns, not scores." },
  { title: "Connect Better", description: "Recognition from others who understand can soften isolation." },
  { title: "Stay Motivated", description: "Revisit honest entries when the path feels long." },
] as const;

export const journalKeyFeatures = [
  "Write private reflections",
  "Add emotional tags",
  "Track your daily mood",
  "See stories from others",
  "Get feedback on what you wrote",
  "Stay consistent on your healing journey",
] as const;

export function formatMoodLabel(value: string): string {
  return moodOptions.find((option) => option.value === value)?.label ?? value;
}

export function formatEmotionalTagLabel(value: string): string {
  return emotionalTagOptions.find((option) => option.value === value)?.label ?? value;
}

export function formatPeerMatchLabel(count: number): string | null {
  if (count <= 0) {
    return null;
  }
  if (count === 1) {
    return "1 person has written something similar";
  }
  return `${count} people have written something similar`;
}

export function SectionError({ message }: { message: string }) {
  return (
    <p className="rounded-sm bg-surface-success p-[var(--space-component-md)] text-body-sm text-orange" role="alert">
      {message}
    </p>
  );
}
