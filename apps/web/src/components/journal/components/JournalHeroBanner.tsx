import { Card } from "../../primitives";

const journalBannerSrc = "/journal/banner.png";

export function JournalHeroBanner() {
  return (
    <Card className="max-w-full overflow-hidden rounded-[var(--radius-lg)] bg-gradient-healing-panel p-[var(--space-layout)]" variant="muted">
      <div className="grid min-w-0 max-w-full grid-cols-1 gap-[var(--space-layout)] md:grid-cols-[493fr_411fr] md:items-center md:gap-[var(--space-85-904)] xl:grid-cols-1">
        <div className="min-w-0">
          <h2 className="text-heading-sm font-weight-heading text-text-heading md:whitespace-nowrap xl:whitespace-normal">
            Recovery Reflection Stories
          </h2>
          <p className="mt-[var(--space-component-xs)] text-body font-weight-button text-doctor-cta">
            You are not the only one carrying this pain.
          </p>
          <p className="mt-[var(--space-component-md)] text-body text-text-secondary">
            Write privately about the moments illness has taken away. If you choose, we will show you stories from others
            who truly understand.
          </p>
        </div>
        <div className="relative hidden h-[var(--space-185-013)] w-full max-w-[var(--space-418)] shrink-0 justify-self-end md:block xl:justify-self-start">
          <img
            alt=""
            className="size-full object-contain object-center"
            decoding="async"
            src={journalBannerSrc}
          />
        </div>
      </div>
    </Card>
  );
}
