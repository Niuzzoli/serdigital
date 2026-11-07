import GhostButton from "@/components/ui/GhostButton";
import Magnetic from "@/components/ui/Magnetic";
import PillButton from "@/components/ui/PillButton";
import { Container } from "@/components/ui/Section";
import BlurText from "@/components/ui/BlurText";
import Tag from "@/components/ui/Tag";
import { site } from "@/content/site";
import HeroNetwork from "./HeroNetwork";
import ServicesStrip from "./ServicesStrip";

// Hero del inicio: título a la izquierda, red de nodos a la derecha, servicios abajo.
// El título se renderiza en el servidor (es el elemento LCP); el canvas aparece después.
export default function Hero() {
  const { hero } = site;
  return (
    <section aria-labelledby="hero-title" className="relative isolate flex min-h-[100svh] flex-col overflow-hidden">
      <div aria-hidden className="absolute inset-0 -z-10">
        {/* Luz azul de fondo, muy suave, del lado de la red */}
        <div className="absolute top-[-10%] right-[-10%] size-[70vmax] rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--blue)_14%,transparent),transparent)]" />
        <HeroNetwork />
        {/* Funde la red hacia el texto para que siempre se lea */}
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/75 to-bg/30 md:bg-gradient-to-r md:from-bg md:from-20% md:via-bg/60 md:via-45% md:to-transparent" />
      </div>

      <Container className="flex flex-1 flex-col justify-center pt-32 pb-14 md:pt-36 md:pb-20">
        <div className="max-w-[52rem]">
          <Tag>{hero.tag}</Tag>
          <BlurText
            as="h1"
            id="hero-title"
            className="mt-7 text-[clamp(2.4rem,5vw,4.25rem)] leading-[1.02] font-semibold tracking-[-0.035em] text-text"
            segments={[
              { text: hero.titleBefore },
              { text: hero.titleHighlight, className: "text-accent-text" },
              { text: hero.titleAfter },
            ]}
          />
        </div>
        <p className="mt-6 max-w-[46ch] text-lg leading-relaxed text-muted sm:text-xl">{hero.lead}</p>
        <div className="mt-9 flex flex-wrap items-center gap-3">
          <Magnetic>
            <PillButton href={hero.primaryCta.href} label={hero.primaryCta.label} />
          </Magnetic>
          <GhostButton href={hero.secondaryCta.href} label={hero.secondaryCta.label} />
        </div>
      </Container>

      <ServicesStrip />
    </section>
  );
}
