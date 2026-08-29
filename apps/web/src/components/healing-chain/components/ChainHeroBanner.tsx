import { Card } from "../../primitives";

const chainBannerSrc = "/healing-chain/banner.png";

export function ChainHeroBanner({ banner }: { banner: string }) {
  return (
    <Card className="max-w-full overflow-hidden rounded-[var(--radius-lg)] bg-gradient-healing-panel p-[var(--space-layout)]" variant="muted">
      <div className="grid min-w-0 max-w-full grid-cols-1 gap-[var(--space-layout)] md:grid-cols-[493fr_411fr] md:items-center md:gap-[var(--space-85-904)]">
        <div className="min-w-0">
          <p className="text-body-lg font-weight-button text-doctor-cta md:whitespace-nowrap">{banner}</p>
          <p className="mt-[var(--space-component-md)] text-body text-text-secondary">
            Find a mentor who has walked ahead of you, and a mentee you can guide and support — both at once, when you
            are matched.
          </p>
        </div>
        <div className="relative hidden h-[var(--space-185-013)] w-full max-w-[var(--space-418)] shrink-0 justify-self-end md:block">
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
