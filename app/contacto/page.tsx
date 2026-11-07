import { ClockIcon, EnvelopeSimpleIcon, MapPinIcon } from "@phosphor-icons/react/dist/ssr";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import ContactForm from "@/components/contact/ContactForm";
import WhatsAppButton from "@/components/contact/WhatsAppButton";
import { Reveal } from "@/components/ui/Reveal";
import { Container, SectionHeading } from "@/components/ui/Section";
import { site } from "@/content/site";
import { formatAddress } from "@/lib/site-helpers";

export const metadata: Metadata = pageMetadata({
  title: "Contacto",
  description: "Escribinos por el formulario, por WhatsApp o por email. Atendemos de lunes a viernes de 9 a 18 h.",
  path: "/contacto",
});

export default function ContactoPage() {
  const c = site.contact;
  return (
    <Container className="pt-36 pb-24 md:pt-44 md:pb-32">
      <SectionHeading
          as="h1"
          title="Hablemos"
          lead="Contanos qué necesitás y cómo trabaja tu empresa hoy. Te respondemos por el medio que prefieras."
        />

      <div className="mt-14 grid gap-14 lg:grid-cols-[1.3fr_1fr] lg:gap-20">
        <Reveal>
          <ContactForm />
        </Reveal>

        <Reveal delay={0.08} className="grid content-start gap-8">
          <WhatsAppButton />
          <ul className="grid gap-5 text-text/90">
            <li className="flex gap-3">
              <EnvelopeSimpleIcon aria-hidden className="mt-0.5 size-5 shrink-0 text-muted" />
              <a href={`mailto:${c.email}`} className="break-all underline-offset-4 hover:underline">
                {c.email}
              </a>
            </li>
            <li className="flex gap-3">
              <MapPinIcon aria-hidden className="mt-0.5 size-5 shrink-0 text-muted" />
              <address className="not-italic">{formatAddress(c)}</address>
            </li>
            <li className="flex gap-3">
              <ClockIcon aria-hidden className="mt-0.5 size-5 shrink-0 text-muted" />
              <span>{c.hours}</span>
            </li>
          </ul>
          <p className="border-t border-line pt-6 text-muted">{c.coverage}</p>
        </Reveal>
      </div>
    </Container>
  );
}
