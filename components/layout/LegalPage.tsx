import type { ComponentType } from "react";
import BlurText from "@/components/ui/BlurText";
import { Container } from "@/components/ui/Section";

// Plantilla de las páginas legales (privacidad, términos). El texto vive en content/legal/*.mdx
// y toma los mismos estilos que las notas del blog (mdx-components.tsx).
export default function LegalPage({
  title,
  updated,
  Content,
}: {
  title: string;
  updated: string;
  Content: ComponentType;
}) {
  return (
    <article className="pt-32 pb-24 md:pt-40 md:pb-32">
      <Container className="max-w-[820px]">
        <header>
          <BlurText
            as="h1"
            className="text-[clamp(2.2rem,4.8vw,3.6rem)] leading-[1.05] font-semibold tracking-[-0.035em]"
            text={title}
          />
          <p className="mt-5 font-mono text-xs leading-relaxed text-muted">
            Última actualización: {updated} · Responsable: Daniel Iuzzolino (SERDIGITAL), Cipolletti, Río Negro,
            Argentina
          </p>
        </header>
        <div className="mt-4 max-w-[68ch]">
          <Content />
        </div>
      </Container>
    </article>
  );
}
