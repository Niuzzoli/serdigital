import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import BackToTop from "@/components/ui/BackToTop";
import CustomCursor from "@/components/ui/CustomCursor";
import { site } from "@/content/site";
import { serializeJsonLd, siteJsonLd } from "@/lib/seo";
import { THEME_INIT_SCRIPT } from "@/lib/theme";
import "./globals.css";

// Tipografías del sitio: cambialas acá (una familia principal + una mono)
const display = Bricolage_Grotesque({
  variable: "--font-display-src",
  subsets: ["latin"],
  display: "swap",
});
const mono = JetBrains_Mono({
  variable: "--font-mono-src",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | Consultora de transformación digital`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  openGraph: {
    type: "website",
    locale: "es_AR",
    siteName: site.name,
    title: `${site.name} | Consultora de transformación digital`,
    description: site.description,
  },
  twitter: { card: "summary_large_image" },
};

// Color de la barra del navegador en celulares, según el tema del sistema
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0d131a" },
    { media: "(prefers-color-scheme: light)", color: "#f5f7fa" },
  ],
  colorScheme: "dark light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning: el script de tema agrega data-theme antes de que cargue React
    <html lang="es-AR" className={`${display.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        {/* Aplica el tema antes de pintar (patrón de la guía oficial "Preventing flash before hydration").
            En desarrollo React avisa por el <script>; es esperado y no afecta producción. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        {/* Sin JavaScript, los títulos animados se muestran directamente */}
        <noscript>
          <style>{`.bt-letter{opacity:1!important;filter:none!important;transform:none!important;color:inherit!important}`}</style>
        </noscript>
      </head>
      <body className="flex min-h-dvh flex-col">
        <script
          type="application/ld+json"
          // El reemplazo de "<" evita que un texto cierre el <script>
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(siteJsonLd(site)) }}
        />
        <a
          href="#main"
          className="fixed top-3 left-3 z-[100] -translate-y-20 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-accent-ink transition-transform focus:translate-y-0"
        >
          Saltar al contenido
        </a>
        <Navbar />
        <main id="main" tabIndex={-1} className="flex-1 outline-none">
          {children}
        </main>
        <Footer />
        <BackToTop />
        <CustomCursor />
        <Analytics />
      </body>
    </html>
  );
}
