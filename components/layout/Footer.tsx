import { LinkedinLogoIcon, WhatsappLogoIcon, EnvelopeSimpleIcon } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import Logo from "@/components/brand/Logo";
import { Container } from "@/components/ui/Section";
import { site } from "@/content/site";
import { formatAddress, whatsappUrl } from "@/lib/site-helpers";

const linkClass =
  "text-muted underline-offset-4 decoration-line-strong transition-colors duration-200 hover:text-text hover:underline";

// El año se calcula al construir el sitio (cada deploy lo actualiza)
async function currentYear() {
  "use cache";
  return new Date().getFullYear();
}

export default async function Footer() {
  const year = await currentYear();
  const c = site.contact;
  return (
    <footer className="border-t border-line bg-bg-2">
      <Container className="grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr] md:gap-8">
        <div className="max-w-sm">
          <Logo imgClassName="h-12" />
          <p className="mt-4 leading-relaxed text-muted">{c.coverage}</p>
          <a
            href={c.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn de Serdigital"
            className="mt-6 inline-grid size-10 place-items-center rounded-full border border-line text-muted transition-colors duration-200 hover:border-line-strong hover:text-text"
          >
            <LinkedinLogoIcon className="size-5" />
          </a>
        </div>

        <nav aria-label="Pie de página">
          <h2 className="font-mono text-xs text-muted">Sitio</h2>
          <ul className="mt-4 space-y-3">
            {site.nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={linkClass}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="font-mono text-xs text-muted">Contacto</h2>
          <ul className="mt-4 space-y-3">
            <li>
              <a href={`mailto:${c.email}`} className={`${linkClass} inline-flex items-center gap-2 break-all`}>
                <EnvelopeSimpleIcon aria-hidden className="size-4 shrink-0" />
                {c.email}
              </a>
            </li>
            <li>
              <a
                href={whatsappUrl(c.whatsapp, c.whatsappMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className={`${linkClass} inline-flex items-center gap-2`}
              >
                <WhatsappLogoIcon aria-hidden className="size-4 shrink-0" />
                {c.whatsappDisplay}
              </a>
            </li>
            <li className="text-muted">
              <address className="not-italic">{formatAddress(c)}</address>
              <span className="mt-1 block">{c.hours}</span>
            </li>
          </ul>
        </div>
      </Container>
      <Container className="flex flex-col gap-2 border-t border-line py-6 text-sm text-muted sm:flex-row sm:justify-between">
        <p>
          © {year} {site.name}
        </p>
        <p>Alto Valle, Argentina</p>
      </Container>
    </footer>
  );
}
