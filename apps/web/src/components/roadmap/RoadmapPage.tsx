import { useState } from "react";
import type { RoadmapFeature } from "./roadmapContent";
import { ROADMAP_SCREENSHOT_VERSION } from "./roadmapContent";
import { Badge, Card } from "../primitives";

export interface RoadmapPageProps {
  feature: RoadmapFeature;
}

function RoadmapScreenshot({ slug, title }: { slug: string; title: string }) {
  const [failed, setFailed] = useState(false);
  const imageSrc = `/roadmap/${slug}.png?v=${ROADMAP_SCREENSHOT_VERSION}`;

  if (failed) {
    return (
      <div className="flex aspect-[16/10] w-full items-center justify-center rounded-md border border-dashed border-border-subtle bg-surface-muted">
        <p className="max-w-[var(--space-328-617)] px-[var(--space-card-padding)] text-center font-body text-body-sm text-text-secondary">
          Design preview for {title} is unavailable. The roadmap image at roadmap/{slug}.png could not be loaded.
        </p>
      </div>
    );
  }

  return (
    <img
      alt={`${title} design preview`}
      className="w-full rounded-md border border-border-subtle bg-surface-default object-cover object-top shadow-card"
      onError={() => setFailed(true)}
      src={imageSrc}
    />
  );
}

export function RoadmapPage({ feature }: RoadmapPageProps) {
  return (
    <section className="mx-auto flex w-full max-w-[var(--space-612)] flex-col gap-[var(--space-section)]">
      <header className="flex flex-col gap-[var(--space-component-md)]">
        <div className="flex flex-wrap items-center gap-[var(--space-component-md)]">
          <h1 className="font-body text-heading-md font-weight-heading text-text-heading">{feature.title}</h1>
          <Badge variant="neutral">Planned</Badge>
        </div>
        <p className="font-body text-body-lg text-text-primary">{feature.description}</p>
      </header>

      <RoadmapScreenshot slug={feature.slug} title={feature.title} />

      <Card variant="outlined">
        <h2 className="font-body text-heading-sm font-weight-heading text-text-heading">On the roadmap</h2>
        <ul className="mt-[var(--space-component-md)] flex flex-col gap-[var(--space-component-sm)]">
          {feature.plannedItems.map((item) => (
            <li className="flex gap-[var(--space-component-sm)] font-body text-body text-text-primary" key={item}>
              <span aria-hidden className="text-primary">
                •
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </Card>
    </section>
  );
}
