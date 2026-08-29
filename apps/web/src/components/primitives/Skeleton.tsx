import type { HTMLAttributes } from "react";
import { cx } from "./utils";

export type SkeletonShape = "rect" | "circle" | "text";

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  shape?: SkeletonShape;
}

const shapeClasses: Record<SkeletonShape, string> = {
  rect: "rounded-sm",
  circle: "rounded-round",
  text: "rounded-xs",
};

export function Skeleton({ className, shape = "rect", ...props }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cx("animate-pulse bg-surface-subtle", shapeClasses[shape], className)}
      {...props}
    />
  );
}
