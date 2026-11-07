import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import ProductFeature from "@/components/sections/ProductFeature";
import CtaBand from "@/components/sections/CtaBand";
import ServicesGrid from "@/components/sections/ServicesGrid";
import { Container, SectionHeading } from "@/components/ui/Section";

export const metadata: Metadata = pageMetadata({
  title: "Servicios",
  description:
    "Consultoría de digitalización ágil, desarrollo de software a medida y seguridad informática. Y Tamiz, nuestra plataforma para automatizar el procesamiento de datos.",
  path: "/servicios",
});

export default function ServiciosPage() {
  return (
    <>
      <Container className="pt-36 pb-14 md:pt-44 md:pb-20">
        <SectionHeading
            as="h1"
            title="Servicios a medida para digitalizar tu operación."
            lead="Cada proyecto arranca entendiendo cómo trabaja tu empresa. A partir de ahí combinamos consultoría, desarrollo y seguridad según lo que necesites."
          />
      </Container>

      <Container>
        <ServicesGrid detailed />
      </Container>

      {/* Producto: bloque autocontenido, listo para pasar a /tamiz en el futuro */}
      <section id="tamiz" aria-label="Tamiz" className="scroll-mt-24 py-20 sm:py-28">
        <Container>
          <ProductFeature variant="full" />
        </Container>
      </section>

      <CtaBand title="¿No sabés por dónde empezar?" text="Contanos qué te preocupa de tu operación y te ayudamos a definir el primer paso." />
    </>
  );
}
