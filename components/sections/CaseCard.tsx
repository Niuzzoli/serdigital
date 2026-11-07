import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { CaseIllustration } from "@/components/illustrations/ServiceIllustration";
import SpotlightCard from "@/components/ui/SpotlightCard";
import AudireMockup from "./AudireMockup";
import CaseLogo from "./CaseLogo";
import { visibleMetrics } from "@/lib/site-helpers";
import type { CaseStudy } from "@/lib/types";

// Tarjeta compacta de un caso (Inicio).
export function CaseCard({ item }: { item: CaseStudy }) {
  return (
    <SpotlightCard as="article" className="h-full">
      <Link href={`/casos#${item.slug}`} className="group flex h-full flex-col p-6 sm:p-8">
        <div className="flex items-center gap-3">
          <CaseLogo item={item} className="h-10" />
          <p className="font-mono text-xs text-muted">{item.client}</p>
        </div>
        <h3 className="mt-5 text-2xl leading-tight font-semibold tracking-[-0.025em] sm:text-[1.7rem]">
          {item.title}
        </h3>
        <p className="mt-4 max-w-[48ch] leading-relaxed text-muted">{item.summary}</p>
        <ul className="mt-6 flex flex-wrap gap-2">
          {item.tags.map((t) => (
            <li key={t} className="rounded-full border border-line px-3 py-1 text-xs text-muted">
              {t}
            </li>
          ))}
        </ul>
        <span className="mt-auto inline-flex items-center gap-2 pt-8 text-sm font-medium">
          Ver el caso
          <ArrowRightIcon
            aria-hidden
            weight="bold"
            className="size-4 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1"
          />
        </span>
      </Link>
    </SpotlightCard>
  );
}

// Caso completo (/casos): cliente, problema, solución y resultado.
export function CaseDetail({ item }: { item: CaseStudy }) {
  const metrics = visibleMetrics(item.resultMetrics);
  const blocks = [
    { title: "El problema", body: item.problem },
    { title: "La solución", body: item.solution },
    // "El resultado" solo se muestra cuando el caso tiene result cargado en content/site.ts.
    // Para volver a mostrar el aviso cuando no hay resultado, reemplazá la línea de abajo por:
    // { title: "El resultado", body: item.result ?? "Resultados en preparación." },
    ...(item.result ? [{ title: "El resultado", body: item.result }] : []),
  ];
  return (
    <article id={item.slug} className="scroll-mt-28 border-t border-line py-14 md:py-20">
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div>
          <div className="flex items-center gap-4">
            <CaseLogo item={item} className="h-14" />
            <p className="font-mono text-xs text-muted">Cliente: {item.client}</p>
          </div>
          <h2 className="mt-4 text-[clamp(1.9rem,3.6vw,2.9rem)] leading-[1.06] font-semibold tracking-[-0.03em]">
            {item.title}
          </h2>
          <ul className="mt-6 flex flex-wrap gap-2">
            {item.tags.map((t) => (
              <li key={t} className="rounded-full border border-line px-3 py-1 text-xs text-muted">
                {t}
              </li>
            ))}
          </ul>
          {/* Imagen del caso: Audire muestra su panel; el resto, su ilustración */}
          <div className="mt-10 max-w-[28rem]">
            {item.slug === "audire" ? <AudireMockup /> : <CaseIllustration slug={item.slug} />}
          </div>
        </div>
        <dl className="grid gap-8">
          {blocks.map((b) => (
            <div key={b.title} className="grid gap-2 sm:grid-cols-[9rem_1fr] sm:gap-6">
              <dt className="text-sm font-semibold text-text">{b.title}</dt>
              <dd className={b.title === "El resultado" && !item.result ? "text-muted italic" : "text-lg leading-relaxed text-text/85"}>
                {b.body}
              </dd>
            </div>
          ))}
          {metrics.length > 0 && (
            <div className="grid grid-cols-2 gap-6 border-t border-line pt-6 sm:grid-cols-3">
              {metrics.map((m) => (
                <div key={m.label}>
                  <dd className="text-3xl font-semibold tracking-[-0.03em] tabular-nums">{m.value}</dd>
                  <dt className="mt-1 text-sm text-muted">{m.label}</dt>
                </div>
              ))}
            </div>
          )}
        </dl>
      </div>
    </article>
  );
}
