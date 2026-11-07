import type { Metadata } from "next";
import Hero from "@/components/hero/Hero";
import ProductFeature from "@/components/sections/ProductFeature";
import CasesList from "@/components/sections/CasesList";
import CtaBand from "@/components/sections/CtaBand";
import Metrics from "@/components/sections/Metrics";
import ServicesGrid from "@/components/sections/ServicesGrid";
import Testimonials from "@/components/sections/Testimonials";
import GhostButton from "@/components/ui/GhostButton";
import { Section, SectionHeading } from "@/components/ui/Section";

// Título y descripción salen del layout; acá solo la URL canónica del inicio.
export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: { url: "/" },
};

export default function Home() {
  return (
    <>
      <Hero />

      <Section labelledBy="servicios-title">
        <SectionHeading
          id="servicios-title"
          title="Ordenamos la operación y construimos las herramientas que la sostienen."
          lead="Trabajamos con tu equipo, por etapas, empezando por lo que más tiempo te hace perder."
        />
        <div className="mt-12">
          <ServicesGrid />
        </div>
      </Section>

      <Section labelledBy="producto-title" className="pt-0 sm:pt-0">
        <ProductFeature variant="teaser" />
      </Section>

      <Section labelledBy="casos-title" className="pt-0 sm:pt-4">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading id="casos-title" title="Casos de éxito" />
          <GhostButton href="/casos" label="Ver todos los casos" />
        </div>
        <div className="mt-12">
          <CasesList variant="compact" />
        </div>
      </Section>

      <Metrics />

      <Section labelledBy="testimonios-title" className="bg-bg-2">
        <Testimonials animateTitle />
      </Section>

      <CtaBand animateTitle />
    </>
  );
}
