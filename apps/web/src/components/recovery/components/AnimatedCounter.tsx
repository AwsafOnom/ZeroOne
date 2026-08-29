import { useEffect } from "react";
import { motion, useSpring, useTransform } from "framer-motion";

export interface AnimatedCounterProps {
  value: number;
  className?: string;
}

export function AnimatedCounter({ value, className }: AnimatedCounterProps) {
  const spring = useSpring(value, { stiffness: 65, damping: 20, mass: 0.8 });
  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  const display = useTransform(spring, (current) => Math.round(current).toLocaleString());

  return <motion.span className={className}>{display}</motion.span>;
}
