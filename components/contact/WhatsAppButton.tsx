import { ArrowUpRightIcon, WhatsappLogoIcon } from "@phosphor-icons/react/dist/ssr";
import { site } from "@/content/site";
import { whatsappUrl } from "@/lib/site-helpers";

// Botón directo a WhatsApp con mensaje prellenado (texto en content/site.ts → contact.whatsappMessage)
export default function WhatsAppButton() {
  return (
    <a
      href={whatsappUrl(site.contact.whatsapp, site.contact.whatsappMessage)}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-4 rounded-[var(--radius-card)] border border-line-strong bg-surface/60 p-5 transition-[border-color,background-color,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-accent/60 hover:bg-surface active:scale-[0.99]"
    >
      <span className="grid size-12 shrink-0 place-items-center rounded-full bg-accent text-accent-ink">
        <WhatsappLogoIcon aria-hidden weight="fill" className="size-6" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-semibold">Escribinos por WhatsApp</span>
        <span className="block text-sm text-muted">{site.contact.whatsappDisplay}</span>
      </span>
      <ArrowUpRightIcon
        aria-hidden
        weight="bold"
        className="size-5 shrink-0 text-muted transition-[transform,color] duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent"
      />
    </a>
  );
}
