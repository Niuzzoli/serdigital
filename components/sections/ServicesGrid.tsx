import { ArrowRightIcon, CheckIcon } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import ServiceIllustration from "@/components/illustrations/ServiceIllustration";
import SpotlightCard from "@/components/ui/SpotlightCard";
import { site } from "@/content/site";
import { cn } from "@/lib/cn";

// Servicios.
// - Inicio (compacto): grilla asimétrica, el primero grande y los otros dos apilados.
//   Cada tarjeta lleva su ilustración (components/illustrations/ServiceIllustration.tsx).
// - /servicios (detailed): una fila por servicio, con título a la izquierda y qué incluye a la derecha.

export default function ServicesGrid({ detailed = false }: { detailed?: boolean }) {
  if (detailed) return <ServicesDetailed />;

  const [first, ...rest] = site.services;
  return (
    <RevealGroup className="grid gap-4 md:grid-cols-2 md:grid-rows-2">
      <RevealItem className="md:row-span-2">
        <ServiceCard service={first} large />
      </RevealItem>
      {rest.map((s) => (
        <RevealItem key={s.slug}>
          <ServiceCard service={s} />
        </RevealItem>
      ))}
    </RevealGroup>
  );
}

function ServiceCard({ service, large = false }: { service: (typeof site.services)[number]; large?: boolean }) {
  return (
    <SpotlightCard className="h-full">
      <Link
        href={`/servicios#${service.slug}`}
        className={cn("group flex h-full flex-col p-6 sm:p-8", large && "md:p-10")}
      >
        {large ? (
          // En la tarjeta grande la ilustración ocupa el alto sobrante (en escritorio la tarjeta es más alta)
          <div className="mb-8 flex flex-1 items-center justify-center md:min-h-56">
            <ServiceIllustration slug={service.slug} className="max-w-[34rem]" />
          </div>
        ) : (
          <ServiceIllustration slug={service.slug} className="mb-7 max-w-[22rem]" />
        )}
        <h3
          className={cn(
            "font-semibold tracking-[-0.025em] text-text",
            large ? "text-[clamp(1.7rem,3vw,2.4rem)] leading-[1.08]" : "text-2xl leading-tight",
          )}
        >
          {service.title}
        </h3>
        <p className={cn("mt-4 max-w-[46ch] leading-relaxed text-muted", large && "text-lg")}>{service.summary}</p>
        {large && (
          <ul className="mt-8 space-y-3">
            {service.includes.map((item) => (
              <li key={item} className="flex gap-3 text-text/85">
                <CheckIcon aria-hidden weight="bold" className="mt-1 size-4 shrink-0 text-accent" />
                {item}
              </li>
            ))}
          </ul>
        )}
        <span className={cn("inline-flex items-center gap-2 pt-8 text-sm font-medium text-text", !large && "mt-auto")}>
          Ver servicio
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

function ServicesDetailed() {
  return (
    <RevealGroup as="ol" className="border-t border-line">
      {site.services.map((s) => (
        <RevealItem
          as="li"
          key={s.slug}
          className="scroll-mt-28 border-b border-line py-12 md:py-16"
        >
          <article id={s.slug} className="grid gap-8 md:grid-cols-[1fr_1fr] md:gap-16">
            <div>
              <h2 className="text-[clamp(1.8rem,3.4vw,2.75rem)] leading-[1.06] font-semibold tracking-[-0.03em]">
                {s.title}
              </h2>
              <p className="mt-5 max-w-[48ch] text-lg leading-relaxed text-muted">{s.summary}</p>
              <ServiceIllustration slug={s.slug} className="mt-10 max-w-[26rem]" />
            </div>
            <div>
              <h3 className="font-mono text-xs text-muted">Qué incluye</h3>
              <ul className="mt-5 grid gap-4">
                {s.includes.map((item) => (
                  <li key={item} className="flex gap-3 text-lg leading-snug text-text/90">
                    <CheckIcon aria-hidden weight="bold" className="mt-1 size-4 shrink-0 text-accent" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </article>
        </RevealItem>
      ))}
    </RevealGroup>
  );
}
