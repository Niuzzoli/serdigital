import BlurText from "@/components/ui/BlurText";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { site } from "@/content/site";
import { initials } from "@/lib/site-helpers";

// Testimonios reales, sin fotos: un círculo con iniciales.
export default function Testimonials({
  title = "Lo que dicen nuestros clientes",
  animateTitle = false,
}: {
  title?: string;
  /** Título con efecto letra por letra (BlurText). Hoy solo en el Inicio. */
  animateTitle?: boolean;
}) {
  const titleClass = "max-w-3xl text-[clamp(2rem,4vw,3.25rem)] leading-[1.05] font-semibold tracking-[-0.03em]";
  return (
    <div>
      {animateTitle ? (
        <BlurText id="testimonios-title" className={titleClass} text={title} />
      ) : (
        <h2 id="testimonios-title" className={titleClass}>
          {title}
        </h2>
      )}
      <RevealGroup className="mt-12 grid gap-12 md:grid-cols-2 md:gap-16">
        {site.testimonials.map((t) => (
          <RevealItem key={t.name}>
            <figure className="flex h-full flex-col">
              <blockquote className="text-[clamp(1.3rem,2.2vw,1.65rem)] leading-[1.35] font-medium tracking-[-0.015em] text-text">
                <p>“{t.quote}”</p>
              </blockquote>
              <figcaption className="mt-8 flex items-center gap-4">
                <span
                  aria-hidden
                  className="grid size-11 shrink-0 place-items-center rounded-full border border-line-strong font-mono text-sm text-text"
                >
                  {initials(t.name)}
                </span>
                <span>
                  <span className="block font-semibold">{t.name}</span>
                  {(t.role || t.company) && (
                    <span className="block text-sm text-muted">{[t.role, t.company].filter(Boolean).join(", ")}</span>
                  )}
                </span>
              </figcaption>
            </figure>
          </RevealItem>
        ))}
      </RevealGroup>
    </div>
  );
}
