import { CheckCircleIcon, ClockIcon, WarningCircleIcon } from "@phosphor-icons/react/dist/ssr";

// Vista ilustrativa de Audire, hecha en código (no es una captura real).
// Los datos son de ejemplo y están rotulados como tales. Reemplazar por una
// captura real cuando exista (next/image en /public).

const rows = [
  { doc: "Licencia de conducir", area: "Personal", state: "ok" },
  { doc: "Revisión técnica", area: "Flota", state: "soon" },
  { doc: "Seguro de la unidad", area: "Flota", state: "ok" },
  { doc: "Certificado de ART", area: "Contratos", state: "missing" },
] as const;

const states = {
  ok: { label: "Vigente", icon: CheckCircleIcon, className: "text-success" },
  soon: { label: "Por vencer", icon: ClockIcon, className: "text-accent-text" },
  missing: { label: "Falta", icon: WarningCircleIcon, className: "text-danger" },
};

export default function AudireMockup() {
  return (
    <figure
      aria-label="Vista ilustrativa de Audire con datos de ejemplo"
      className="relative overflow-hidden rounded-[var(--radius-card)] border border-line-strong bg-gradient-to-b from-surface-2 to-bg-2 shadow-[0_30px_80px_-40px_color-mix(in_oklab,var(--blue)_60%,transparent)]"
    >
      <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
        <span className="text-sm font-semibold">Audire</span>
        <span className="font-mono text-[11px] text-muted">Ejemplo ilustrativo</span>
      </div>
      <div className="grid grid-cols-3 gap-px border-b border-line bg-line">
        {[
          { k: "Personal", v: "Al día" },
          { k: "Flota", v: "1 por vencer" },
          { k: "Contratos", v: "1 faltante" },
        ].map((c) => (
          <div key={c.k} className="bg-bg-2 px-4 py-4 sm:px-5">
            <p className="font-mono text-[11px] text-muted">{c.k}</p>
            <p className="mt-1.5 text-sm font-medium text-text">{c.v}</p>
          </div>
        ))}
      </div>
      <ul className="divide-y divide-line">
        {rows.map((r) => {
          const s = states[r.state];
          const Icon = s.icon;
          return (
            <li key={r.doc} className="flex items-center justify-between gap-4 px-5 py-3.5">
              <span className="min-w-0">
                <span className="block truncate text-sm text-text">{r.doc}</span>
                <span className="block font-mono text-[11px] text-muted">{r.area}</span>
              </span>
              <span className={`inline-flex shrink-0 items-center gap-1.5 text-xs font-medium ${s.className}`}>
                <Icon aria-hidden weight="fill" className="size-4" />
                {s.label}
              </span>
            </li>
          );
        })}
      </ul>
    </figure>
  );
}
