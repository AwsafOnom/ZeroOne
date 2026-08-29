import { Card } from "../../primitives";

const chainBannerSrc = "/assets/healing-chain-hero.png";

export function ChainHeroBanner() {
  return (
    <Card
      className="max-w-full overflow-hidden rounded-[var(--radius-lg)] bg-gradient-healing-panel p-[var(--space-component-lg)] md:p-[var(--space-layout)]"
      variant="muted"
    >
      <div className="grid min-w-0 max-w-full grid-cols-1 items-center gap-[var(--space-component-lg)] md:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] md:gap-[var(--space-layout)]">
        <div className="min-w-0">
          <p className="text-body-lg font-weight-button text-doctor-cta">Start Or Continue Your Healing Journey</p>
          <p className="mt-[var(--space-component-xs)] text-body-sm text-text-secondary">
            Find a mentor who has walked ahead of you, and a mentee you can guide and support — both at once, when you
            are matched.
          </p>
        </div>
        <div className="relative mx-auto h-[var(--space-128-856)] w-full max-w-[var(--space-328-617)] md:mx-0 md:h-[var(--space-185-013)] md:max-w-[var(--space-418)]">
          <img
            alt=""
            className="size-full object-contain object-center"
            decoding="async"
            src={chainBannerSrc}
          />
        </div>
      </div>
    </Card>
  );
}
