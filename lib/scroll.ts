// Utilidades de scroll compartidas (logo, "Inicio" y botón "Volver arriba").

/** El botón flotante aparece después de bajar ~80 % de una pantalla */
export function showBackToTop(scrollY: number, viewportHeight: number): boolean {
  return scrollY > viewportHeight * 0.8;
}

/** Sube al principio de la página (suave, salvo con "reducir movimiento") */
export function scrollToTop(): void {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
}
