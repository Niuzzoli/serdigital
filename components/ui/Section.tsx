import type { ReactNode } from "react";
import BlurText from "./BlurText";
import { cn } from "@/lib/cn";

// Contenedor de página: ancho máximo y márgenes laterales iguales en todo el sitio.
export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("mx-auto w-full max-w-[1240px] px-4 sm:px-6 lg:px-10", className)}>{children}</div>;
}

export function Section({
  children,
  className,
  id,
  labelledBy,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  labelledBy?: string;
}) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={cn("py-20 sm:py-28", className)}>
      <Container>{children}</Container>
    </section>
  );
}

// Título de sección: un solo mensaje, con bajada opcional debajo (no al costado).
export function SectionHeading({
  id,
  title,
  lead,
  className,
  as: Tag = "h2",
}: {
  id?: string;
  title: ReactNode;
  lead?: ReactNode;
  className?: string;
  as?: "h1" | "h2";
}) {
  const titleClass = cn(
    "font-semibold tracking-[-0.03em] text-text",
    Tag === "h1" ? "text-[clamp(2.4rem,5.5vw,4.5rem)] leading-[1.02]" : "text-[clamp(2rem,4vw,3.25rem)] leading-[1.05]",
  );
  return (
    <div className={cn("max-w-3xl", className)}>
      {/* Los títulos de texto aparecen letra por letra (BlurText) */}
      {typeof title === "string" ? (
        <BlurText as={Tag} id={id} className={titleClass} text={title} />
      ) : (
        <Tag id={id} className={titleClass}>
          {title}
        </Tag>
      )}
      {lead && <p className="mt-5 max-w-[60ch] text-lg leading-relaxed text-muted">{lead}</p>}
    </div>
  );
}
