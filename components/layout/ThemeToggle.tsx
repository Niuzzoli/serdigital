"use client";

import { DesktopIcon, MoonIcon, SunIcon } from "@phosphor-icons/react";
import { useSyncExternalStore } from "react";
import { cn } from "@/lib/cn";
import { nextPreference, parsePreference, type ThemePreference } from "@/lib/theme";

// Botón de tema con tres estados en ciclo: automático → claro → oscuro → automático.
// El ícono muestra el estado ACTUAL (pantalla = automático, sol = claro, luna = oscuro).
// La lógica de aplicar el tema vive en el script de lib/theme.ts (window.__setThemePref).

declare global {
  interface Window {
    __setThemePref?: (pref: ThemePreference) => void;
  }
}

const LABELS: Record<ThemePreference, string> = {
  system: "automático (según tu sistema)",
  light: "claro",
  dark: "oscuro",
};

function subscribe(onChange: () => void) {
  const obs = new MutationObserver(onChange);
  obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme-pref"] });
  return () => obs.disconnect();
}

const getPref = (): ThemePreference => parsePreference(document.documentElement.getAttribute("data-theme-pref"));

const ICONS = [
  { pref: "system", Icon: DesktopIcon },
  { pref: "light", Icon: SunIcon },
  { pref: "dark", Icon: MoonIcon },
] as const;

export default function ThemeToggle({ className }: { className?: string }) {
  // En el servidor no se conoce la preferencia: se asume automático
  const pref = useSyncExternalStore(subscribe, getPref, () => "system" as ThemePreference);
  const next = nextPreference(pref);
  const label = `Tema: ${LABELS[pref]}. Cambiar a ${LABELS[next]}`;

  const cycle = () => {
    const apply = () => window.__setThemePref?.(next);
    // Fundido suave entre temas donde el navegador lo soporta (y sin "reducir movimiento")
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduce && "startViewTransition" in document) document.startViewTransition(apply);
    else apply();
  };

  return (
    <button
      type="button"
      onClick={cycle}
      aria-label={label}
      title={label}
      className={cn(
        "grid size-10 shrink-0 place-items-center rounded-full text-muted transition-[color,background-color,transform] duration-200 hover:bg-surface hover:text-text active:scale-[0.94]",
        className,
      )}
    >
      <span className="relative grid size-5 place-items-center">
        {ICONS.map(({ pref: p, Icon }) => (
          <Icon
            key={p}
            aria-hidden
            weight="bold"
            className={cn(
              "absolute size-5 transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
              p === pref ? "scale-100 rotate-0 opacity-100" : "scale-75 -rotate-90 opacity-0",
            )}
          />
        ))}
      </span>
    </button>
  );
}
