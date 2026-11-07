import type { ReactNode } from "react";

// Etiqueta mono del hero (se usa una sola vez en la página de Inicio).
export default function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2.5 rounded-full border border-line bg-bg/60 px-3.5 py-1.5 font-mono text-xs text-muted backdrop-blur-sm">
      <span aria-hidden className="size-1.5 rounded-full bg-accent" />
      {children}
    </span>
  );
}
