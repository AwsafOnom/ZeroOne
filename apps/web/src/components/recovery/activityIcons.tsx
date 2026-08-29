import {
  Brain,
  Droplet,
  Dumbbell,
  Footprints,
  HeartPulse,
  Lightbulb,
  Moon,
  Smile,
  Sparkles,
  TreePine,
  Wind,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const activityIconById: Record<string, LucideIcon> = {
  "activity-breathing": Wind,
  "activity-cbt": Lightbulb,
  "activity-cognitive": Brain,
  "activity-fatigue": HeartPulse,
  "activity-grounding": TreePine,
  "activity-hydration": Droplet,
  "activity-memory": Brain,
  "activity-meditation": Sparkles,
  "activity-mobility": Dumbbell,
  "activity-mood": Smile,
  "activity-sleep": Moon,
  "activity-walking": Footprints,
};

export function ActivityIcon({ activityId, className }: { activityId: string; className?: string }) {
  const Icon = activityIconById[activityId] ?? Sparkles;
  return <Icon aria-hidden="true" className={className} />;
}
