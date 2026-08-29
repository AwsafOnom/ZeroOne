import type { ReactNode } from "react";
import { Activity, ArrowRight, Droplets, Flame, Heart, Wind } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ZEROONE_CONFIG, type ApiImpactEvent } from "@zeroone/shared";
import { Avatar, Button, Card, ProgressBar } from "../primitives";
import { ActivityIcon } from "./activityIcons";
import { GuardianMetricCard } from "./components/GuardianMetricCard";
import { LiveImpactFeed } from "./components/LiveImpactFeed";
import { OnggiVesselVisual } from "./components/OnggiVesselVisual";
import { formatOnggiTitle, StatTile } from "./shared";

const squadConditions = [
  "Diabetes",
  "Cancer",
  "Hypertension",
  "Depression",
  "Anxiety",
  "Arthritis",
  "Obesity",
  "Dementia",
] as const;

const exampleImpactEvents: ApiImpactEvent[] = [
  {
    id: "how-it-works-impact-breathing",
    squadId: "example-squad",
    cycleId: "example-cycle",
    activityCategory: "EMOTIONAL",
    message: "A squad member completed a breathing exercise",
    metric: "BREATHING_VEINS",
    delta: 4,
    metrics: [{ metric: "BREATHING_VEINS", delta: 4 }],
    occurredAt: new Date(Date.now() - 12 * 60_000).toISOString(),
    actor: null,
    activity: null,
  },
  {
    id: "how-it-works-impact-harmony",
    squadId: "example-squad",
    cycleId: "example-cycle",
    activityCategory: "SOCIAL",
    message: "The squad completed a sunlight session together",
    metric: "HARMONY",
    delta: 6,
    metrics: [{ metric: "HARMONY", delta: 6 }],
    occurredAt: new Date(Date.now() - 45 * 60_000).toISOString(),
    actor: null,
    activity: null,
  },
];

const guardianMetricExamples = [
  {
    key: "breathingExercise",
    label: "Breathing Exercise",
    icon: Wind,
    accentColor: "var(--primitive-color-teal-end)",
    value: 62,
  },
  {
    key: "breathingVeins",
    label: "Breathing Veins",
    icon: Activity,
    accentColor: "var(--primitive-color-secondary)",
    value: 71,
  },
  {
    key: "warmth",
    label: "Warmth",
    icon: Flame,
    accentColor: "var(--primitive-color-orange)",
    value: 58,
  },
  {
    key: "circulation",
    label: "Circulation",
    icon: Droplets,
    accentColor: "var(--primitive-color-healing-accent)",
    value: 64,
  },
  {
    key: "harmony",
    label: "Harmony",
    icon: Heart,
    accentColor: "var(--primitive-color-ai-accent)",
    value: 69,
    fullWidth: true,
  },
] as const;

function ScrollSection({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.section
      className={className}
      initial={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: true, amount: 0.12 }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      {children}
    </motion.section>
  );
}

function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <header>
      <p className="text-body-xs font-weight-button uppercase tracking-wide text-primary">{eyebrow}</p>
      <h2 className="mt-[var(--space-component-xs)] text-heading-sm font-weight-heading text-text-heading">{title}</h2>
    </header>
  );
}

function SectionLink({ children, to }: { children: string; to: string }) {
  return (
    <Link
      className="mt-[var(--space-component-lg)] inline-flex items-center gap-[var(--space-component-xs)] text-body-sm font-weight-button text-primary transition-opacity hover:opacity-80"
      to={to}
    >
      {children}
      <ArrowRight aria-hidden className="size-[var(--space-16)]" />
    </Link>
  );
}

function ExampleActivityCard() {
  return (
    <article className="flex h-full flex-col gap-[var(--space-component-md)] rounded-sm border border-border-subtle bg-surface-default p-[var(--space-card-padding)] shadow-card">
      <div className="flex min-w-0 items-start gap-[var(--space-component-md)]">
        <span className="flex size-[var(--space-48)] shrink-0 items-center justify-center rounded-round bg-surface-blue-light">
          <ActivityIcon activityId="activity-breathing" className="size-[var(--space-24)] text-primary" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-[var(--space-component-sm)]">
            <h3 className="font-body text-body-lg font-weight-button text-text-primary">Guided Breathing</h3>
            <span className="shrink-0 rounded-pill bg-surface-success px-[var(--space-component-sm)] py-[var(--space-component-xs)] text-body-xs font-weight-button text-primary">
              40 pts
            </span>
          </div>
          <p className="mt-[var(--space-component-xs)] text-body-sm text-text-secondary">
            Complete a guided breathing exercise at your own pace.
          </p>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-[var(--space-component-md)] border-t border-border-subtle pt-[var(--space-component-md)]">
        <span className="text-body-xs font-weight-button text-primary">Committed</span>
        <Button disabled size="sm">
          Complete
        </Button>
      </div>
    </article>
  );
}

function ExampleFreezeCard() {
  return (
    <Card variant="outlined">
      <h3 className="text-body-sm font-weight-button text-text-primary">
        {ZEROONE_CONFIG.activityFreezeHours}-Hour Freeze
      </h3>
      <p className="mt-[var(--space-component-xs)] text-body-xs text-text-secondary">
        Abandoned commitment — locked until you can choose again.
      </p>
      <div className="mt-[var(--space-component-md)] rounded-sm bg-surface-blue-light p-[var(--space-card-padding)]">
        <p className="text-body-sm font-weight-button text-text-primary">Mobility Routines</p>
        <p className="mt-[var(--space-component-xs)] font-body text-body-xs text-orange">Frozen for 04:18:32</p>
      </div>
    </Card>
  );
}

export function HowItWorksPage() {
  return (
    <div className="flex flex-col gap-[var(--space-layout)]">
      <Card className="bg-surface-blue-light" variant="muted">
        <h2 className="text-heading-sm font-weight-heading text-text-primary">How Recovery works</h2>
        <p className="mt-[var(--space-component-md)] max-w-[var(--space-612)] text-body-sm text-text-secondary">
          Recovery is built around a squad of eight people growing a shared Onggi vessel together. These are the
          mechanics that hold it together — why each rule exists, and what it asks of you.
        </p>
      </Card>

      <ScrollSection>
        <Card variant="outlined">
          <SectionHeading eyebrow="1" title="The Recovery Squad" />
          <div className="mt-[var(--space-layout)] grid gap-[var(--space-layout)] lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
            <div className="flex flex-col gap-[var(--space-component-md)]">
              <p className="text-body-sm text-text-primary">
                Every squad has exactly {ZEROONE_CONFIG.squadSize} members. Each member carries a{" "}
                <span className="font-weight-button">different</span> condition — never two people with the same
                diagnosis in one group.
              </p>
              <p className="text-body-sm text-text-secondary">
                That cross-condition composition is deliberate. Recovery discipline — showing up, committing, supporting
                others — is shared even when diagnoses are not. The squad is not grouped by what you have; it is grouped
                by what you are willing to do together.
              </p>
              <p className="text-body-sm text-text-secondary">
                You are accountable to seven other people, each walking a different path. The system never ranks
                individuals inside a squad — only the group moves forward.
              </p>
            </div>
            <div className="rounded-sm border border-border-subtle bg-surface-success p-[var(--space-card-padding)]">
              <p className="text-body-xs font-weight-button text-text-secondary">
                {ZEROONE_CONFIG.squadSize} members · {ZEROONE_CONFIG.squadSize} conditions
              </p>
              <ul className="mt-[var(--space-component-md)] grid grid-cols-2 gap-[var(--space-component-sm)]">
                {squadConditions.map((condition) => (
                  <li
                    className="flex items-center gap-[var(--space-component-sm)] rounded-sm bg-surface-default px-[var(--space-component-sm)] py-[var(--space-component-xs)]"
                    key={condition}
                  >
                    <Avatar name={condition} size="sm" />
                    <span className="text-body-xs text-text-primary">{condition}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <SectionLink to="/recovery/squad-details">See your squad →</SectionLink>
        </Card>
      </ScrollSection>

      <ScrollSection>
        <Card variant="outlined">
          <SectionHeading eyebrow="2" title="The Onggi Guardian" />
          <div className="mt-[var(--space-layout)] grid gap-[var(--space-layout)] xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
            <div className="flex flex-col items-center justify-center rounded-sm bg-[var(--primitive-color-primary-10)] p-[var(--space-card-padding)]">
              <OnggiVesselVisual animated={false} fillLevel={72} size="card" />
              <p className="mt-[var(--space-component-md)] text-center text-body-xs text-text-secondary">
                One vessel · eight members · visible to all
              </p>
            </div>
            <div className="flex flex-col gap-[var(--space-component-md)]">
              <p className="text-body-sm text-text-primary">
                The Onggi is a shared vessel owned by the squad — not by any individual. Inspired by Korean Onggi
                pottery, it is a dark clay form threaded with golden veins. Active squads make it glow and breathe;
                falling engagement dims it. Dimming is passive — it never reads as blame directed at a member.
              </p>
              <p className="text-body-sm text-text-secondary">
                Five dimensions, each held at the squad level from 0 to 100, rise and fall together as the squad acts.
                None belong to an individual member. A derived Resonance Score aggregates them.
              </p>
              <div className="grid grid-cols-2 gap-[var(--space-component-sm)]">
                <StatTile
                  hint="Breathing exercises, mobility, personal check-ins"
                  label="Individual actions move"
                  value="Breathing Veins · Circulation"
                />
                <StatTile
                  hint="Cooking challenges, sunlight sessions, squad games"
                  label="Shared actions move"
                  value="Warmth · Harmony"
                />
              </div>
              <p className="text-body-sm text-text-secondary">
                The causal link is always visible: your action changes something all eight people can see.
              </p>
            </div>
          </div>
          <div className="mt-[var(--space-layout)] grid grid-cols-2 gap-[var(--space-component-md)]">
            {guardianMetricExamples.map((metric) => (
              <GuardianMetricCard
                accentColor={metric.accentColor}
                fullWidth={"fullWidth" in metric ? metric.fullWidth : false}
                icon={metric.icon}
                key={metric.key}
                label={metric.label}
                value={metric.value}
              />
            ))}
          </div>
          <div className="mt-[var(--space-layout)]">
            <LiveImpactFeed events={exampleImpactEvents} isLoading={false} limit={2} />
          </div>
          <SectionLink to="/recovery/onggi-guardian">See your squad&apos;s Onggi →</SectionLink>
        </Card>
      </ScrollSection>

      <ScrollSection>
        <Card variant="outlined">
          <SectionHeading eyebrow="3" title="Activities and Claiming" />
          <div className="mt-[var(--space-layout)] grid gap-[var(--space-layout)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <div className="flex flex-col gap-[var(--space-component-md)]">
              <p className="text-body-sm text-text-primary">
                Each day the AI surfaces {ZEROONE_CONFIG.dailyDoublePointsActivities} double-points activities, then a
                grid of {ZEROONE_CONFIG.dailyActivityGridSize} activities adapted to your condition, energy, and needs.
              </p>
              <p className="text-body-sm text-text-secondary">
                Press <span className="font-weight-button">Claim</span> to accept an activity. Claiming is a deliberate
                act of acceptance — a commitment, not passive logging and not a checkbox.
              </p>
              <p className="text-body-sm text-text-secondary">
                Abandon or skip a claimed activity and it locks for {ZEROONE_CONFIG.activityFreezeHours} hours with a
                visible countdown. Deliberately calibrated: long enough to carry weight, short enough that you can
                restart the same day.
              </p>
            </div>
            <div className="flex flex-col gap-[var(--space-component-md)]">
              <ExampleActivityCard />
              <ExampleFreezeCard />
            </div>
          </div>
          <SectionLink to="/recovery/activities">Browse today&apos;s activities →</SectionLink>
        </Card>
      </ScrollSection>

      <ScrollSection>
        <Card variant="outlined">
          <SectionHeading eyebrow="4" title="The 28-Day Cycle and Crystallization" />
          <div className="mt-[var(--space-layout)] grid gap-[var(--space-layout)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <div className="flex flex-col gap-[var(--space-component-md)]">
              <p className="text-body-sm text-text-primary">
                Every {ZEROONE_CONFIG.cycleLengthDays} days the squad&apos;s Onggi crystallizes, permanently locking
                that cycle&apos;s state. Themes include Hope, Growth, Strength, and Wisdom — each crystallized Onggi
                preserves the photos, voice recordings, songs, and memories contributed during the cycle.
              </p>
              <p className="text-body-sm text-text-secondary">
                A crystallized Onggi cannot be deleted. There is no delete path — only collection. Crystallized is the
                highest status in the system: an achievement artifact, not a trophy score. Permanence is the point.
              </p>
              <div className="mt-[var(--space-component-sm)]">
                <div className="flex flex-wrap items-end justify-between gap-[var(--space-component-md)]">
                  <p className="text-body-sm text-text-secondary">Cycle complete</p>
                  <p className="text-body-sm font-weight-button text-primary">
                    Day {ZEROONE_CONFIG.cycleLengthDays} of {ZEROONE_CONFIG.cycleLengthDays}
                  </p>
                </div>
                <ProgressBar className="mt-[var(--space-component-sm)]" showValue={false} value={100} />
              </div>
            </div>
            <div className="flex flex-col items-center justify-center gap-[var(--space-component-md)] rounded-sm border border-border-subtle bg-surface-success p-[var(--space-card-padding)]">
              <OnggiVesselVisual
                animated={false}
                fillLevel={100}
                size="card"
                themeColor="var(--color-secondary)"
              />
              <div className="text-center">
                <p className="text-body-sm font-weight-button text-text-primary">
                  {formatOnggiTitle("NEW_BEGINNING")}
                </p>
                <p className="mt-[var(--space-component-xs)] text-body-xs text-text-secondary">
                  Collected · permanent · never removed
                </p>
              </div>
            </div>
          </div>
          <SectionLink to="/recovery/crystallize-onggi">View crystallization progress →</SectionLink>
        </Card>
      </ScrollSection>

      <ScrollSection>
        <Card variant="outlined">
          <SectionHeading eyebrow="5" title="Resonance and Squad Matchups" />
          <div className="mt-[var(--space-layout)] grid gap-[var(--space-layout)] lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
            <div className="flex flex-col gap-[var(--space-component-md)]">
              <p className="text-body-sm text-text-primary">
                Resonance accumulates from squad activity across all five Onggi dimensions. It is what squads are ranked
                on — the aggregate pulse of how consistently eight people show up together.
              </p>
              <p className="text-body-sm text-text-secondary">
                Both squads are visible in a matchup: yours and your opponent&apos;s. Competition is squad-level, never
                individual. You are accountable to seven other people; the UI reinforces that framing rather than
                surfacing rankings within your own group.
              </p>
            </div>
            <div className="grid gap-[var(--space-component-md)] sm:grid-cols-[1fr_auto_1fr] sm:items-center">
              <StatTile hint="Your squad" label="Resonance" value="4,280" />
              <p aria-hidden className="text-center text-body-sm font-weight-heading text-text-secondary">
                VS
              </p>
              <StatTile hint="Opponent squad" label="Resonance" value="3,940" />
            </div>
          </div>
          <SectionLink to="/recovery/squad-details">See the squad matchup →</SectionLink>
        </Card>
      </ScrollSection>
    </div>
  );
}
