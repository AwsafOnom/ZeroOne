import { motion } from "framer-motion";

export const ONGGI_VESSEL_IMAGE = "/assets/onggi-vessel.png";

export type OnggiVesselSize = "guardian" | "card";

export interface OnggiVesselVisualProps {
  size?: OnggiVesselSize;
  themeColor?: string;
  fillLevel?: number;
  animated?: boolean;
}

export function OnggiVesselVisual({
  animated,
  fillLevel = 100,
  size = "guardian",
  themeColor = "var(--color-primary)",
}: OnggiVesselVisualProps) {
  const shouldAnimate = animated ?? size === "guardian";
  const normalizedFill = Math.min(100, Math.max(0, fillLevel));
  const glowOpacity = 0.2 + (normalizedFill / 100) * 0.35;
  const tintOpacity = 0.12 + (normalizedFill / 100) * 0.18;

  if (size === "card") {
    return (
      <div className="relative flex h-[var(--space-190)] w-[var(--space-183)] shrink-0 items-center justify-center overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-[var(--space-component-sm)] rounded-round blur-[var(--space-16)]"
          style={{ backgroundColor: themeColor, opacity: glowOpacity }}
        />
        <div className="relative size-full overflow-hidden">
          <img
            alt=""
            className="absolute left-[-11%] top-[-9%] h-[116%] w-[122%] max-w-none object-contain"
            src={ONGGI_VESSEL_IMAGE}
            style={{ filter: `drop-shadow(0 0 var(--space-12) ${themeColor})` }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 mix-blend-color"
            style={{ backgroundColor: themeColor, opacity: tintOpacity }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="relative mx-auto flex w-full max-w-[var(--space-373)] items-center justify-center px-[var(--space-component-md)] py-[var(--space-component-lg)]">
      {shouldAnimate ? (
        <motion.div
          animate={{ opacity: [glowOpacity * 0.7, glowOpacity, glowOpacity * 0.7], scale: [0.92, 1.05, 0.92] }}
          aria-hidden
          className="absolute inset-[var(--space-component-lg)] rounded-round blur-[var(--space-24)]"
          style={{ backgroundColor: themeColor }}
          transition={{ duration: 5, ease: "easeInOut", repeat: Infinity }}
        />
      ) : (
        <div
          aria-hidden
          className="absolute inset-[var(--space-component-lg)] rounded-round blur-[var(--space-24)]"
          style={{ backgroundColor: themeColor, opacity: glowOpacity }}
        />
      )}
      {shouldAnimate ? (
        <motion.img
          alt=""
          animate={{ scale: [1, 1.02, 1], opacity: [0.96, 1, 0.96] }}
          className="relative z-[1] h-auto w-full max-h-[var(--space-328-617)] object-contain"
          src={ONGGI_VESSEL_IMAGE}
          style={{ filter: `drop-shadow(0 0 var(--space-16) ${themeColor})` }}
          transition={{ duration: 4.5, ease: "easeInOut", repeat: Infinity }}
        />
      ) : (
        <img
          alt=""
          className="relative z-[1] h-auto w-full max-h-[var(--space-328-617)] object-contain"
          src={ONGGI_VESSEL_IMAGE}
          style={{ filter: `drop-shadow(0 0 var(--space-16) ${themeColor})` }}
        />
      )}
    </div>
  );
}
