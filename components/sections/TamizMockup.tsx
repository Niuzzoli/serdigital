import {
  CheckCircleIcon,
  DatabaseIcon,
  FileCsvIcon,
  FilePdfIcon,
  FileXlsIcon,
  PlugsConnectedIcon,
  TableIcon,
} from "@phosphor-icons/react/dist/ssr";

// Vista ilustrativa de Tamiz, hecha en código (no es una captura real).
// Muestra el recorrido de una corrida: archivos que entran como vienen, el
// "tamiz" que los lee, valida y transforma, y las salidas posibles, con el
// registro de auditoría al pie. Los datos son de ejemplo y están rotulados.

// Degradé del logo de Tamiz (violeta a celeste). Solo decorativo.
const TAMIZ_FROM = "#4e24d3";
const TAMIZ_TO = "#2eb8e7";

const inputs = [
  { name: "facturas_octubre.pdf", Icon: FilePdfIcon },
  { name: "viajes_semana.xlsx", Icon: FileXlsIcon },
  { name: "proveedores.csv", Icon: FileCsvIcon },
];

const steps = ["Leer", "Validar", "Transformar"];

const outputs = [
  { name: "Excel consolidado", Icon: TableIcon },
  { name: "Base de datos", Icon: DatabaseIcon },
  { name: "API del ERP", Icon: PlugsConnectedIcon },
];

// Fila de agujeros del tamiz, eco del logo
function SieveDots() {
  const n = 22;
  return (
    <div aria-hidden className="flex items-center justify-between px-1">
      {Array.from({ length: n }, (_, i) => (
        <span
          key={i}
          className="size-1.5 rounded-full"
          style={{
            background: `color-mix(in oklab, ${TAMIZ_FROM} ${100 - (i / (n - 1)) * 100}%, ${TAMIZ_TO})`,
            opacity: 0.55 + 0.45 * Math.sin((i / (n - 1)) * Math.PI),
          }}
        />
      ))}
    </div>
  );
}

export default function TamizMockup() {
  return (
    <figure
      aria-label="Vista ilustrativa de una corrida de Tamiz con datos de ejemplo"
      className="relative overflow-hidden rounded-[var(--radius-card)] border border-line-strong bg-gradient-to-b from-surface-2 to-bg-2 shadow-[0_30px_80px_-40px_color-mix(in_oklab,var(--blue)_60%,transparent)]"
    >
      <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-3.5">
        <span className="min-w-0 truncate text-sm font-semibold">Tamiz · Facturas PDF a Excel</span>
        <span className="shrink-0 font-mono text-[11px] text-muted">Ejemplo ilustrativo</span>
      </div>

      <div className="space-y-5 px-5 py-5">
        {/* Entrada: como venga */}
        <div>
          <p className="font-mono text-[11px] text-muted">Entrada</p>
          <ul className="mt-2.5 flex flex-wrap gap-2">
            {inputs.map(({ name, Icon }) => (
              <li
                key={name}
                className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-bg-2 px-2.5 py-1.5 text-xs text-text/90"
              >
                <Icon aria-hidden weight="duotone" className="size-4 shrink-0 text-muted" />
                {name}
              </li>
            ))}
          </ul>
        </div>

        {/* El tamiz: siempre los mismos pasos */}
        <div className="rounded-xl border border-line bg-bg-2/60 px-3 py-3">
          <SieveDots />
          <ol className="mt-3 grid grid-cols-3 gap-2">
            {steps.map((s) => (
              <li key={s} className="flex items-center justify-center gap-1.5 text-xs font-medium text-text">
                <CheckCircleIcon aria-hidden weight="fill" className="size-4 shrink-0 text-success" />
                {s}
              </li>
            ))}
          </ol>
          <div className="mt-3">
            <SieveDots />
          </div>
        </div>

        {/* Salida: a donde haga falta */}
        <div>
          <p className="font-mono text-[11px] text-muted">Salida</p>
          <ul className="mt-2.5 grid grid-cols-3 gap-2">
            {outputs.map(({ name, Icon }) => (
              <li
                key={name}
                className="flex flex-col items-start gap-2 rounded-lg border border-line bg-bg-2 px-2.5 py-2.5 text-xs leading-tight text-text/90"
              >
                <Icon aria-hidden weight="duotone" className="size-4.5 text-blue" />
                {name}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Registro de auditoría */}
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-t border-line px-5 py-3.5 font-mono text-[11px] text-muted">
        <span>usuario · PC-ADMIN · 09:42</span>
        <span className="inline-flex items-center gap-1.5 text-success">
          <CheckCircleIcon aria-hidden weight="fill" className="size-3.5" />
          Corrida registrada
        </span>
      </div>
    </figure>
  );
}
