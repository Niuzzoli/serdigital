import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import CasesList from "@/components/sections/CasesList";
import CtaBand from "@/components/sections/CtaBand";
import Testimonials from "@/components/sections/Testimonials";
import { Container, Section, SectionHeading } from "@/components/ui/Section";

export const metadata: Metadata = pageMetadata({
  title: "Casos de éxito",
  description:
    "Proyectos de digitalización de Serdigital: Audire y Transporte Tortoriello. Cliente, problema, solución y resultado.",
  path: "/casos",
});

export default function CasosPage() {
  return (
    <>
      <Container className="pt-36 pb-6 md:pt-44 md:pb-10">
        <SectionHeading
            as="h1"
            title="Casos de éxito"
            lead="Proyectos reales: qué problema tenía cada cliente, qué hicimos y qué cambió."
          />
      </Container>

      <Container>
        <CasesList variant="full" />
      </Container>

      <Section labelledBy="testimonios-title" className="mt-8 bg-bg-2">
        <Testimonials title="Testimonios" />
      </Section>

      <CtaBand title="¿Tu empresa tiene un problema parecido?" />
    </>
  );
}
