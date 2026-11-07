"use client";

import { animate } from "motion/react";
import Link from "next/link";
import { useEffect, useRef } from "react";
import type { NavItem } from "@/lib/types";
import { cn } from "@/lib/cn";
import { scrollToTop } from "@/lib/scroll";

// Menú con luz que sigue al mouse (portado del portafolio, versión liviana).
// La línea inferior marca la sección actual y viaja con un spring al cambiar de página.
// Todo se mueve con variables CSS: no hay estado de React por cada movimiento.

export default function SpotlightNav({
  items,
  activeHref,
  bare = false,
}: {
  items: NavItem[];
  activeHref: string | null;
  /** true dentro de la barra unida: sin borde ni fondo propios (evita una pastilla dentro de otra) */
  bare?: boolean;
}) {
  const navRef = useRef<HTMLElement>(null);
  const ambience = useRef(0);
  const activeIndex = items.findIndex((i) => i.href === activeHref);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    const targetFor = () => {
      const el = nav.querySelector<HTMLElement>(`[data-index="${activeIndex}"]`);
      if (!el) return null;
      return el.offsetLeft + el.offsetWidth / 2;
    };

    const target = targetFor();
    nav.style.setProperty("--ambience-opacity", target === null ? "0" : "1");
    const controls =
      target === null
        ? undefined
        : animate(ambience.current, target, {
            type: "spring",
            stiffness: 220,
            damping: 26,
            onUpdate: (v) => {
              ambience.current = v;
              nav.style.setProperty("--ambience-x", `${v}px`);
            },
          });

    const ro = new ResizeObserver(() => {
      const x = targetFor();
      if (x === null) return;
      ambience.current = x;
      nav.style.setProperty("--ambience-x", `${x}px`);
    });
    ro.observe(nav);
    return () => {
      controls?.stop();
      ro.disconnect();
    };
  }, [activeIndex]);

  return (
    <nav
      ref={navRef}
      aria-label="Principal"
      onPointerMove={(e) => {
        const nav = navRef.current;
        if (!nav || e.pointerType !== "mouse") return;
        nav.style.setProperty("--spot-x", `${e.clientX - nav.getBoundingClientRect().left}px`);
        nav.style.setProperty("--spot-opacity", "1");
      }}
      onPointerLeave={() => navRef.current?.style.setProperty("--spot-opacity", "0")}
      className={cn(
        "relative h-11 overflow-hidden rounded-full border transition-[background-color,border-color] duration-300",
        bare ? "border-transparent bg-transparent" : "border-line bg-bg-2/70",
      )}
    >
      <ul className="relative z-10 flex h-full items-center px-1.5">
        {items.map((item, idx) => {
          const active = idx === activeIndex;
          return (
            <li key={item.href} className="h-full">
              <Link
                href={item.href}
                data-index={idx}
                aria-current={active ? "page" : undefined}
                onClick={(e) => {
                  // "Inicio" estando en el inicio: sube al principio de la página
                  if (item.href === "/" && active) {
                    e.preventDefault();
                    scrollToTop();
                  }
                }}
                className={cn(
                  "flex h-full items-center rounded-full px-4 text-sm font-medium transition-colors duration-200",
                  active ? "text-text" : "text-muted hover:text-text",
                )}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Luz que sigue al mouse */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: "var(--spot-opacity, 0)",
          background:
            "radial-gradient(110px circle at var(--spot-x, 50%) 100%, color-mix(in oklab, var(--text) 12%, transparent), transparent 60%)",
        }}
      />
      {/* Línea de la sección activa */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px transition-opacity duration-300"
        style={{
          opacity: "var(--ambience-opacity, 0)",
          background: "radial-gradient(48px circle at var(--ambience-x, 50%) 0%, var(--accent), transparent 100%)",
        }}
      />
    </nav>
  );
}
