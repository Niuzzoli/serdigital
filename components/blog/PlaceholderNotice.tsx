import { InfoIcon } from "@phosphor-icons/react/dist/ssr";

// Aviso visible en las notas de ejemplo. Borralo de la nota cuando cargues contenido real
// (y poné placeholder: false en su meta).
export default function PlaceholderNotice() {
  return (
    <aside className="my-8 flex gap-3 rounded-[var(--radius-input)] border border-accent/40 bg-accent/10 px-5 py-4 text-sm leading-relaxed text-text">
      <InfoIcon aria-hidden weight="bold" className="mt-0.5 size-4 shrink-0 text-accent" />
      <p>Nota de ejemplo: reemplazar por contenido real antes de publicar.</p>
    </aside>
  );
}
