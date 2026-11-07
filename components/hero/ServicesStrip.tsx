import { ArrowUpRightIcon } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { site } from "@/content/site";

// Franja inferior del hero: los 3 servicios como accesos directos a /servicios.
export default function ServicesStrip() {
  return (
    <nav aria-label="Servicios" className="relative border-t border-line bg-bg/70 backdrop-blur-md">
      <ul className="mx-auto grid max-w-[1240px] md:grid-cols-3">
        {site.services.map((s) => (
          <li key={s.slug} className="border-line not-last:border-b md:not-last:border-r md:not-last:border-b-0">
            <Link
              href={`/servicios#${s.slug}`}
              className="group flex items-center justify-between gap-4 px-4 py-4 sm:px-6 md:py-6 lg:px-10"
            >
              <span className="flex items-baseline gap-3">
                <span className="font-mono text-xs text-muted tabular-nums">{s.number}</span>
                <span className="text-[15px] font-medium text-text/85 transition-colors duration-200 group-hover:text-text">
                  {s.title}
                </span>
              </span>
              <ArrowUpRightIcon
                aria-hidden
                weight="bold"
                className="size-4 shrink-0 text-muted transition-[transform,color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent"
              />
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
