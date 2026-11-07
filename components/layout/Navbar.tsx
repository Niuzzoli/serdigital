"use client";

import { LayoutGroup, motion, useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Logo from "@/components/brand/Logo";
import Magnetic from "@/components/ui/Magnetic";
import PillButton from "@/components/ui/PillButton";
import { site } from "@/content/site";
import { cn } from "@/lib/cn";
import { EASE } from "@/lib/motion";
import MobileMenu from "./MobileMenu";
import SpotlightNav from "./SpotlightNav";
import ThemeToggle from "./ThemeToggle";

// Barra superior fija.
// - Arriba de todo: ocupa todo el ancho; logo a la izquierda, menú al centro y Contacto a la derecha, sin fondo.
// - Al bajar: se cierra en una pastilla flotante centrada, del ancho del contenido de la página.
//   La unión la anima Motion con "layout" (FLIP): mueve y escala con transform,
//   nunca anima propiedades que recalculen el layout.

const SCROLL_THRESHOLD = 24;

export default function Navbar() {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const [compact, setCompact] = useState(false);
  useMotionValueEvent(scrollY, "change", (y) => {
    const next = y > SCROLL_THRESHOLD;
    if (next !== compact) setCompact(next);
  });

  const links = site.nav.filter((i) => !i.highlight);
  const cta = site.nav.find((i) => i.highlight);
  const activeHref =
    links.find((i) => (i.href === "/" ? pathname === "/" : pathname === i.href || pathname.startsWith(`${i.href}/`)))
      ?.href ?? null;

  const layoutTransition = reduce ? { duration: 0 } : { duration: 0.55, ease: EASE };

  return (
    <header
      className="pointer-events-none fixed inset-x-0 top-0 z-[var(--z-nav)] flex justify-center px-3 sm:px-4"
      style={{ viewTransitionName: "site-header" }}
    >
      <LayoutGroup>
        <motion.div
          layout
          transition={layoutTransition}
          // El radio va en style para que Motion lo corrija mientras escala la caja
          style={{ borderRadius: 9999 }}
          className={cn(
            "pointer-events-auto flex items-center justify-between border transition-[background-color,border-color,box-shadow] duration-300",
            compact
              ? // Al bajar: pastilla del ancho del contenido (1240 del Container menos su padding lateral)
                "mt-3 w-full max-w-[1160px] gap-3 border-line bg-bg-2/80 py-1.5 pr-1.5 pl-4 shadow-[var(--shadow-float)] backdrop-blur-md md:gap-6 md:pl-5"
              : // Arriba de todo: todo el ancho de la pantalla, con margen a los costados
                "mt-0 w-full gap-6 border-transparent bg-transparent px-1 py-3 sm:px-2 md:py-4 lg:px-4",
          )}
        >
          <motion.div layout="position" transition={layoutTransition} className="flex shrink-0">
            <Logo />
          </motion.div>

          <motion.div layout="position" transition={layoutTransition} className="hidden md:block">
            <SpotlightNav items={links} activeHref={activeHref} bare={compact} />
          </motion.div>

          <motion.div layout="position" transition={layoutTransition} className="flex items-center gap-1.5">
            <ThemeToggle />
            {cta && (
              <Magnetic className="hidden md:inline-flex">
                <PillButton href={cta.href} label={cta.label} size="sm" />
              </Magnetic>
            )}
            <MobileMenu items={site.nav} pathname={pathname} />
          </motion.div>
        </motion.div>
      </LayoutGroup>
    </header>
  );
}
