import { Card } from "../primitives";

const assistantHeroIcon = "/assets/assistant-sparkle.svg";

export function AssistantWelcomeHero({ firstName }: { firstName: string }) {
  return (
    <Card className="overflow-hidden rounded-[var(--radius-lg)] bg-gradient-primary p-[var(--space-layout)] text-surface-default shadow-hero" variant="primary">
      <div className="flex items-start justify-between gap-[var(--space-component-lg)]">
        <div className="min-w-0 flex-1">
          <p className="inline-flex rounded-pill bg-[color:var(--primitive-color-white-20)] px-[var(--space-component-md)] py-[var(--space-component-xs)] text-body-sm font-weight-button">
            AI-powered wellness
          </p>
          <h2 className="mt-[var(--space-component-md)] text-heading-md font-weight-heading">
            Hi {firstName} 👋
          </h2>
          <p className="mt-[var(--space-component-sm)] text-body-lg">I&apos;m your AI Wellness Assistant</p>
          <p className="mt-[var(--space-component-md)] max-w-[var(--space-612)] text-body-sm opacity-90">
            I can help you use ZeroOne — recovery activities, your squad, Healing Chain, and the Healing Journal. I
            don&apos;t provide medical advice; for clinical questions, please talk with a healthcare professional.
          </p>
        </div>
        <div className="hidden size-[var(--space-128-856)] shrink-0 items-center justify-center rounded-[var(--radius-lg)] border border-[color:var(--primitive-color-white-30)] bg-[color:var(--primitive-color-white-20)] sm:flex">
          <img alt="" className="size-[var(--space-64-428)]" src={assistantHeroIcon} />
        </div>
      </div>
    </Card>
  );
}
