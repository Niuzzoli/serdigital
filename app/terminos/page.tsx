import type { Metadata } from "next";
import LegalPage from "@/components/layout/LegalPage";
import Content from "@/content/legal/terminos.mdx";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Condiciones del Servicio",
  description: "Condiciones del servicio de Danix, la herramienta de productividad de Serdigital conectada a Google.",
  path: "/terminos",
});

export default function TerminosPage() {
  return <LegalPage title="Condiciones del Servicio de Danix" updated="18 de noviembre de 2026" Content={Content} />;
}
