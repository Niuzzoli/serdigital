import Image from "next/image";
import type { CaseStudy } from "@/lib/types";
import { cn } from "@/lib/cn";

// Logo de un cliente/caso. Los logos blancos (invertOnLight) se invierten en modo claro.
export default function CaseLogo({ item, className }: { item: CaseStudy; className?: string }) {
  if (!item.logo) return null;
  const { src, width, height, invertOnLight } = item.logo;
  return (
    <Image
      src={src}
      width={width}
      height={height}
      alt={`Logo de ${item.client}`}
      sizes="120px"
      className={cn("w-auto object-contain", invertOnLight && "light:invert", className)}
    />
  );
}
