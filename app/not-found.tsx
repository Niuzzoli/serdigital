import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";
import type { Metadata } from "next";
import Link from "next/link";
import DisconnectedNode from "@/components/illustrations/DisconnectedNode";
import BlurText from "@/components/ui/BlurText";
import GhostButton from "@/components/ui/GhostButton";
import PillButton from "@/components/ui/PillButton";
import { Container } from "@/components/ui/Section";

// Página 404. Muchas visitas llegan por links del sitio viejo, por eso además del
// botón al inicio hay accesos directos a las secciones principales.
const SHORTCUTS = [
  { href: "/servicios", label: "Servicios", hint: "Consultoría, software a medida y seguridad informática" },
  { href: "/casos", label: "Casos", hint: "Proyectos reales con clientes" },
  { href: "/blog", label: "Blog", hint: "Notas sobre digitalización de procesos" },
];

export const metadata: Metadata = {
  title: "Página no encontrada",
};

export default function NotFound() {
  return (
    <Container className="pt-28 pb-20 md:pt-40 md:pb-28">
      <div className="grid items-center gap-10 md:grid-cols-[1.15fr_1fr] md:gap-16">
        <div>
          <BlurText
            as="h1"
            className="text-[clamp(2.4rem,5vw,4rem)] leading-[1.04] font-semibold tracking-[-0.035em]"
            text="Esta página quedó fuera del circuito."
          />
          <p className="mt-6 max-w-[46ch] text-lg leading-relaxed text-muted">
            Puede que la dirección esté mal escrita o que haya cambiado con el sitio nuevo. Volvé al inicio o
            contanos qué estabas buscando.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <PillButton href="/" label="Ir al inicio" />
            <GhostButton href="/contacto" label="Contanos qué buscabas" />
          </div>
        </div>

        <DisconnectedNode className="order-first mx-auto max-w-[300px] md:order-none md:max-w-[460px]" />
      </div>

      <nav aria-label="Secciones principales" className="mt-20 md:mt-28">
        <p className="text-sm text-muted">O seguí por acá:</p>
        <ul className="mt-4 grid sm:grid-cols-3 sm:gap-8">
          {SHORTCUTS.map((s) => (
            <li key={s.href}>
              <Link
                href={s.href}
                className="group flex items-start justify-between gap-4 border-t border-line py-5 transition-colors duration-300 hover:border-line-strong"
              >
                <span>
                  <span className="block text-lg font-semibold tracking-[-0.01em]">{s.label}</span>
                  <span className="mt-1 block text-sm leading-relaxed text-muted">{s.hint}</span>
                </span>
                <ArrowRightIcon
                  aria-hidden
                  weight="bold"
                  className="mt-1.5 size-4 shrink-0 text-muted transition-[transform,color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1 group-hover:text-accent-text"
                />
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </Container>
  );
}
