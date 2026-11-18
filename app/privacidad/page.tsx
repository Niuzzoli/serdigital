import type { Metadata } from "next";
import LegalPage from "@/components/layout/LegalPage";
import Content from "@/content/legal/privacidad.mdx";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Política de Privacidad",
  description: "Política de privacidad de Danix: qué datos de Google usa, para qué, cómo se guardan y cómo revocar el acceso.",
  path: "/privacidad",
});

export default function PrivacidadPage() {
  return <LegalPage title="Política de Privacidad de Danix" updated="18 de noviembre de 2026" Content={Content} />;
}
