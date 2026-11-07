"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import { useRef, type ReactNode } from "react";
import { site } from "@/content/site";
import { usePointerEffects } from "@/lib/pointer";

// Efecto magnético sutil: el contenido se acerca un poco al cursor (máx. `max` px).
// Sin mouse, con "reducir movimiento" o con site.interactions.magnetic = false, no hace nada.

type Props = { children: ReactNode; strength?: number; max?: number; className?: string };

export default function Magnetic({ children, strength = 0.25, max = 8, className }: Props) {
  const enabled = usePointerEffects() && site.interactions.magnetic;
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 15, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 200, damping: 15, mass: 0.4 });

  if (!enabled) return <div className={className ?? "inline-flex"}>{children}</div>;

  const clamp = (v: number) => Math.max(-max, Math.min(max, v));

  return (
    <motion.div
      ref={ref}
      className={className ?? "inline-flex"}
      style={{ x: sx, y: sy }}
      onPointerMove={(e) => {
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        x.set(clamp((e.clientX - (r.left + r.width / 2)) * strength));
        y.set(clamp((e.clientY - (r.top + r.height / 2)) * strength));
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}
