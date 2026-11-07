"use client";

import { ArrowUpIcon } from "@phosphor-icons/react";
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import { useState } from "react";
import { DUR, EASE } from "@/lib/motion";
import { scrollToTop, showBackToTop } from "@/lib/scroll";

// Botón flotante para volver al principio. Aparece después de bajar ~una pantalla.
export default function BackToTop() {
  const { scrollY } = useScroll();
  const reduce = useReducedMotion();
  const [visible, setVisible] = useState(false);
  useMotionValueEvent(scrollY, "change", (y) => {
    const next = showBackToTop(y, window.innerHeight);
    if (next !== visible) setVisible(next);
  });

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          onClick={() => {
            scrollToTop();
            // El foco vuelve al principio para quien navega con teclado
            document.getElementById("main")?.focus({ preventScroll: true });
          }}
          aria-label="Volver arriba"
          title="Volver arriba"
          className="fixed right-4 bottom-4 z-[var(--z-nav)] grid size-12 place-items-center rounded-full border border-line-strong bg-bg-2/85 text-text shadow-[var(--shadow-float)] backdrop-blur-md transition-[background-color,border-color,color] duration-200 hover:border-accent hover:text-accent-text active:scale-[0.94] sm:right-6 sm:bottom-6"
          initial={{ opacity: 0, scale: reduce ? 1 : 0.8, y: reduce ? 0 : 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: reduce ? 1 : 0.8, y: reduce ? 0 : 8, transition: { duration: 0.2 } }}
          transition={{ duration: DUR.fast, ease: EASE }}
        >
          <ArrowUpIcon aria-hidden weight="bold" className="size-5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
