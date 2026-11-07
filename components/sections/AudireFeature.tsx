import { CheckIcon } from "@phosphor-icons/react/dist/ssr";
import GhostButton from "@/components/ui/GhostButton";
import PillButton from "@/components/ui/PillButton";
import { Reveal } from "@/components/ui/Reveal";
import { site } from "@/content/site";
import AudireMockup from "./AudireMockup";
import CaseLogo from "./CaseLogo";

// Audire, el producto. "teaser" para el Inicio, "full" para /servicios#audire.
// Este bloque es autocontenido: para pasar Audire a su propia landing (/audire)
// alcanza con crear app/audire/page.tsx y renderizar <AudireFeature variant="full" />.

export default function AudireFeature({ variant }: { variant: "teaser" | "full" }) {
  const a = site.audire;
  const full = variant === "full";
  // El logo de Audire está cargado en su caso (content/site.ts → cases)
  const audireCase = site.cases.find((c) => c.slug === "audire");
  return (
    <div className="relative overflow-hidden rounded-[calc(var(--radius-card)+8px)] border border-line bg-bg-2 p-6 sm:p-10 lg:p-14">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-1/3 -right-1/4 size-[60vmax] rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--accent)_10%,transparent),transparent)]"
      />
      <div className="relative grid items-center gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
        <Reveal>
          <div className="flex items-center gap-3">
            {audireCase && <CaseLogo item={audireCase} className="h-11" />}
            <p className="font-mono text-xs text-accent-text">Producto propio</p>
          </div>
          <h2
            id={full ? undefined : "audire-title"}
            className="mt-4 text-[clamp(2.2rem,4.5vw,3.6rem)] leading-[1.02] font-semibold tracking-[-0.035em]"
          >
            {a.name}
          </h2>
          <p className="mt-4 max-w-[34ch] text-xl leading-snug text-text/90">{a.tagline}</p>
          <p className="mt-5 max-w-[52ch] leading-relaxed text-muted">{a.description}</p>
          {full && (
            <ul className="mt-8 space-y-3">
              {a.highlights.map((h) => (
                <li key={h} className="flex gap-3 text-text/90">
                  <CheckIcon aria-hidden weight="bold" className="mt-1 size-4 shrink-0 text-accent" />
                  {h}
                </li>
              ))}
            </ul>
          )}
          <div className="mt-9 flex flex-wrap gap-3">
            {full ? (
              <PillButton href={a.cta.href} label={a.cta.label} />
            ) : (
              <GhostButton href="/servicios#audire" label="Conocer Audire" />
            )}
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <AudireMockup />
        </Reveal>
      </div>
    </div>
  );
}
