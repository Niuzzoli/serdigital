import { useSyncExternalStore } from "react";

type PointerQuery = { fine: boolean; hover: boolean; reducedMotion: boolean };

/**
 * Las interacciones de puntero (cursor, magnetismo, spotlight, parallax, red animada)
 * solo corren con mouse/trackpad y sin "reducir movimiento".
 */
export function canUsePointerEffects(q: PointerQuery): boolean {
  return q.fine && q.hover && !q.reducedMotion;
}

const QUERIES = {
  fine: "(pointer: fine)",
  hover: "(hover: hover)",
  reducedMotion: "(prefers-reduced-motion: reduce)",
} as const;

function subscribe(onChange: () => void) {
  const lists = Object.values(QUERIES).map((q) => window.matchMedia(q));
  lists.forEach((l) => l.addEventListener("change", onChange));
  return () => lists.forEach((l) => l.removeEventListener("change", onChange));
}

function getSnapshot(): boolean {
  return canUsePointerEffects({
    fine: window.matchMedia(QUERIES.fine).matches,
    hover: window.matchMedia(QUERIES.hover).matches,
    reducedMotion: window.matchMedia(QUERIES.reducedMotion).matches,
  });
}

/** En el servidor siempre es false: el HTML inicial sale sin efectos. */
export function usePointerEffects(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
