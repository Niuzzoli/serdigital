"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { site } from "@/content/site";
import { cn } from "@/lib/cn";
import { scrollToTop } from "@/lib/scroll";

// Logo del sitio (configurado en content/site.ts → logo).
// Tiene dos versiones: srcDark (SER en blanco) para el modo oscuro y srcLight para el claro;
// se muestra la que corresponde al tema activo. Sin logo cargado, se ve el nombre en texto.
// Si ya estás en el inicio, tocarlo sube al principio de la página.
export default function Logo({
  className,
  imgClassName = "h-9 md:h-10",
  onClick,
}: {
  className?: string;
  /** Alto del logo (el ancho se ajusta solo) */
  imgClassName?: string;
  onClick?: () => void;
}) {
  const pathname = usePathname();
  const logo = site.logo;
  const ratioWidth = (h: number) => Math.round((logo ? logo.width / logo.height : 1) * h);
  return (
    <Link
      href="/"
      aria-label={`${site.name}, inicio`}
      onClick={(e) => {
        onClick?.();
        if (pathname === "/") {
          e.preventDefault();
          // Pequeña espera por si se está cerrando el menú del celular (bloquea el scroll)
          window.setTimeout(scrollToTop, 60);
        }
      }}
      className={cn("inline-flex shrink-0 items-center rounded-md", className)}
    >
      {logo ? (
        <>
          <Image
            src={logo.srcDark}
            width={ratioWidth(64)}
            height={64}
            alt={logo.alt}
            sizes="200px"
            loading="eager"
            className={cn("w-auto light:hidden", imgClassName)}
          />
          <Image
            src={logo.srcLight}
            width={ratioWidth(64)}
            height={64}
            alt={logo.alt}
            sizes="200px"
            loading="eager"
            className={cn("hidden w-auto light:block", imgClassName)}
          />
        </>
      ) : (
        <span className="text-[1.3rem] leading-none font-semibold tracking-[-0.03em] text-text">{site.name}</span>
      )}
    </Link>
  );
}
