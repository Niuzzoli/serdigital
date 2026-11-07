"use client";

import { useRef, type ReactNode } from "react";
import { site } from "@/content/site";
import { cn } from "@/lib/cn";
import { usePointerEffects } from "@/lib/pointer";

// Tarjeta con brillo que sigue al mouse: una luz suave adentro y el borde que se
// ilumina cerca del cursor. La posición se escribe en variables CSS del propio
// elemento (sin estado de React), así no hay re-renders al mover el mouse.

type Props = {
  children: ReactNode;
  className?: string;
  as?: "div" | "article" | "li";
};

export default function SpotlightCard({ children, className, as: Tag = "div" }: Props) {
  const enabled = usePointerEffects() && site.interactions.spotlight;
  const ref = useRef<HTMLElement>(null);

  return (
    <Tag
      // @ts-expect-error: el ref sirve para cualquiera de las etiquetas permitidas
      ref={ref}
      onPointerMove={
        enabled
          ? (e: React.PointerEvent<HTMLElement>) => {
              const el = ref.current;
              if (!el) return;
              const r = el.getBoundingClientRect();
              el.style.setProperty("--mx", `${e.clientX - r.left}px`);
              el.style.setProperty("--my", `${e.clientY - r.top}px`);
            }
          : undefined
      }
      className={cn(
        "group/spot relative isolate overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface/60",
        "transition-[border-color,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
        className,
      )}
    >
      {enabled && (
        <>
          {/* Luz interior */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-500 group-hover/spot:opacity-100"
            style={{
              background:
                "radial-gradient(420px circle at var(--mx, 50%) var(--my, 50%), color-mix(in oklab, var(--blue) 16%, transparent), transparent 65%)",
            }}
          />
          {/* Borde iluminado cerca del cursor */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover/spot:opacity-100"
            style={{
              padding: 1,
              background:
                "radial-gradient(260px circle at var(--mx, 50%) var(--my, 50%), color-mix(in oklab, var(--accent) 70%, transparent), transparent 70%)",
              WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
              WebkitMaskComposite: "xor",
              maskComposite: "exclude",
            }}
          />
        </>
      )}
      {children}
    </Tag>
  );
}
