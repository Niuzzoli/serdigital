import { WhatsappLogoIcon } from "@phosphor-icons/react/dist/ssr";
import { NextStepsIllustration } from "@/components/illustrations/ServiceIllustration";
import BlurText from "@/components/ui/BlurText";
import Magnetic from "@/components/ui/Magnetic";
import PillButton from "@/components/ui/PillButton";
import { Reveal } from "@/components/ui/Reveal";
import { Container } from "@/components/ui/Section";
import { site } from "@/content/site";
import { whatsappUrl } from "@/lib/site-helpers";

// Cierre de página: un mensaje y las dos formas de contacto.
export default function CtaBand({
  title = "Contanos cómo trabaja tu empresa hoy.",
  text = "Coordinamos una primera charla para entender tu caso y proponerte un primer paso concreto.",
  animateTitle = false,
}: {
  title?: string;
  text?: string;
  /** Título con efecto letra por letra (BlurText). Hoy en el Inicio y en las notas del blog. */
  animateTitle?: boolean;
}) {
  const titleClass = "text-[clamp(2.2rem,4.4vw,3.5rem)] leading-[1.04] font-semibold tracking-[-0.035em]";
  return (
    <section aria-labelledby="cta-title" className="relative overflow-hidden border-t border-line">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -bottom-1/2 mx-auto h-[120%] max-w-5xl rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--accent)_12%,transparent),transparent)]"
      />
      <Container className="relative grid items-center gap-12 py-24 sm:py-32 lg:grid-cols-[1.3fr_1fr]">
        <Reveal className="max-w-3xl">
          {animateTitle ? (
            <BlurText id="cta-title" className={titleClass} text={title} />
          ) : (
            <h2 id="cta-title" className={titleClass}>
              {title}
            </h2>
          )}
          <p className="mt-5 max-w-[48ch] text-lg text-muted">{text}</p>
          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
            <Magnetic>
              <PillButton href="/contacto" label={site.hero.primaryCta.label} />
            </Magnetic>
            <a
              href={whatsappUrl(site.contact.whatsapp, site.contact.whatsappMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-medium text-text underline-offset-4 decoration-line-strong hover:underline"
            >
              <WhatsappLogoIcon aria-hidden className="size-5 text-accent" />
              Escribinos por WhatsApp
            </a>
          </div>
        </Reveal>
        {/* El primer paso, ilustrado (solo en pantallas anchas) */}
        <NextStepsIllustration className="hidden max-w-[24rem] justify-self-end lg:block" />
      </Container>
    </section>
  );
}
