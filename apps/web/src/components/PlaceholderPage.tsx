export interface PlaceholderPageProps {
  screenName: string;
}

export function PlaceholderPage({ screenName }: PlaceholderPageProps) {
  return (
    <section className="flex min-h-[var(--space-328-617)] flex-col items-center justify-center gap-[var(--space-component-md)] text-center">
      <h1 className="font-body text-heading-md font-weight-heading text-text-heading">{screenName}</h1>
      <p className="font-body text-body-lg text-text-secondary">Coming soon</p>
    </section>
  );
}
