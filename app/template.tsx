import { ViewTransition } from "react";

// Transición discreta entre páginas: fade + leve desplazamiento (ver .page en globals.css).
// El template se vuelve a montar en cada navegación, por eso acá sí corren enter/exit.
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition enter="page" exit="page" default="none">
      <div>{children}</div>
    </ViewTransition>
  );
}
