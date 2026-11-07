import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { site } from "@/content/site";
import { visibleMetrics } from "@/lib/site-helpers";

// Métricas: solo aparecen las que tienen valor en content/site.ts.
// Mientras todas estén en null, la sección entera no se muestra.
export default function Metrics() {
  const metrics = visibleMetrics(site.metrics);
  if (metrics.length === 0) return null;
  return (
    <Section labelledBy="metricas-title" className="py-16 sm:py-20">
      <h2 id="metricas-title" className="sr-only">
        Serdigital en números
      </h2>
      <Reveal>
        <dl className="grid gap-10 sm:grid-cols-3">
          {metrics.map((m) => (
            <div key={m.label} className="flex flex-col-reverse gap-2">
              <dt className="text-muted">{m.label}</dt>
              <dd className="text-[clamp(2.6rem,5vw,4rem)] leading-none font-semibold tracking-[-0.04em] tabular-nums">
                {m.value}
              </dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </Section>
  );
}
