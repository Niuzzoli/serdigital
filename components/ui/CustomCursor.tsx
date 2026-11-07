"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useState } from "react";
import { site } from "@/content/site";
import { usePointerEffects } from "@/lib/pointer";

// Cursor discreto: un anillo que sigue al puntero con un leve retraso y crece
// sobre links y botones. El cursor nativo NO se oculta (accesibilidad).
// Se apaga con site.interactions.customCursor = false y en pantallas táctiles.

const INTERACTIVE = "a, button, [role='button'], summary, label, [data-cursor]";
const TEXT_FIELD = "input, textarea, select, [contenteditable='true']";

export default function CustomCursor() {
  const enabled = usePointerEffects() && site.interactions.customCursor;
  if (!enabled) return null;
  return <Ring />;
}

function Ring() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.5 });
  const [mode, setMode] = useState<"idle" | "hover" | "hidden">("hidden");

  useEffect(() => {
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x.set(e.clientX);
      y.set(e.clientY);
      const target = e.target as Element | null;
      if (target?.closest(TEXT_FIELD)) setMode("hidden");
      else if (target?.closest(INTERACTIVE)) setMode("hover");
      else setMode("idle");
    };
    const leave = () => setMode("hidden");
    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, [x, y]);

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-[var(--z-cursor)] -translate-x-1/2 -translate-y-1/2"
      style={{ x: sx, y: sy }}
    >
      <div
        className="size-8 rounded-full border transition-[transform,opacity,border-color,background-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{
          transform: `scale(${mode === "hover" ? 1.5 : 1})`,
          opacity: mode === "hidden" ? 0 : 1,
          borderColor: mode === "hover" ? "var(--accent)" : "var(--line-strong)",
          backgroundColor:
            mode === "hover" ? "color-mix(in oklab, var(--accent) 10%, transparent)" : "transparent",
        }}
      />
    </motion.div>
  );
}
