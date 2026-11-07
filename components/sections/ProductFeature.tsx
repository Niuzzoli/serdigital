import Image from "next/image";
import { CheckIcon } from "@phosphor-icons/react/dist/ssr";
import GhostButton from "@/components/ui/GhostButton";
import PillButton from "@/components/ui/PillButton";
import { Reveal } from "@/components/ui/Reveal";
import { site } from "@/content/site";
import TamizMockup from "./TamizMockup";

// El producto propio (hoy Tamiz). "teaser" para el Inicio, "full" para /servicios#tamiz.
// Bloque autocontenido: para pasarlo a su propia landing alcanza con crear
// app/tamiz/page.tsx y renderizar <ProductFeature variant="full" />.

export default function ProductFeature({ variant }: { variant: "teaser" | "full" }) {
  const p = site.product;
  const full = variant === "full";
  return (
    <div className="relative overflow-hidden rounded-[calc(var(--radius-card)+8px)] border border-line bg-bg-2 p-6 sm:p-10 lg:p-14">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-1/3 -right-1/4 size-[60vmax] rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--blue)_12%,transparent),transparent)]"
      />
      <div className="relative grid items-center gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
        <Reveal>
          <div className="flex items-center gap-3">
            {/* Logo directo sobre el fondo en ambos modos. Si hace falta más contraste
                en modo oscuro: envolverlo en una placa clara (bg-[#f5f7fa] px-2.5 py-2 rounded-xl). */}
            <span className="inline-flex">
              <Image
                src={p.logo.src}
                width={p.logo.width}
                height={p.logo.height}
                alt={`Logo de ${p.name}`}
                sizes="96px"
                className="h-7 w-auto object-contain"
              />
            </span>
            <p className="font-mono text-xs text-accent-text">Producto propio</p>
          </div>
          <h2
            id={full ? undefined : "producto-title"}
            className="mt-4 text-[clamp(2.2rem,4.5vw,3.6rem)] leading-[1.02] font-semibold tracking-[-0.035em]"
          >
            {p.name}
          </h2>
          <p className="mt-4 max-w-[34ch] text-xl leading-snug text-text/90">{p.tagline}</p>
          <p className="mt-5 max-w-[52ch] leading-relaxed text-muted">{p.description}</p>
          {full && (
            <ul className="mt-8 space-y-3">
              {p.highlights.map((h) => (
                <li key={h} className="flex gap-3 text-text/90">
                  <CheckIcon aria-hidden weight="bold" className="mt-1 size-4 shrink-0 text-accent" />
                  {h}
                </li>
              ))}
            </ul>
          )}
          <div className="mt-9 flex flex-wrap gap-3">
            {full ? (
              <>
                <PillButton href={p.cta.href} label={p.cta.label} />
                <GhostButton href={p.website.href} label={p.website.label} />
              </>
            ) : (
              <GhostButton href={`/servicios#${p.slug}`} label={`Conocer ${p.name}`} />
            )}
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <TamizMockup />
        </Reveal>
      </div>

      {full && p.processes.length > 0 && (
        <Reveal className="relative mt-14 border-t border-line pt-10">
          <p className="font-mono text-xs text-muted">Procesos que ya corren en producción</p>
          <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {p.processes.map((pr) => (
              <li key={pr.name}>
                <p className="font-medium text-text">{pr.name}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{pr.detail}</p>
              </li>
            ))}
          </ul>
        </Reveal>
      )}
    </div>
  );
}
