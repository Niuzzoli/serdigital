import { expect, test } from "vitest";
import { site } from "@/content/site";
import { REDIRECTS } from "@/lib/redirects";
import { organizationJsonLd } from "@/lib/seo";

type Json = Record<string, unknown> & { address: Record<string, unknown> };

test("redirecciones 301 del sitio viejo", () => {
  expect(REDIRECTS).toEqual([
    { source: "/consultoria-productos", destination: "/servicios", permanent: true },
    { source: "/consultoria-servicios", destination: "/servicios", permanent: true },
    { source: "/consultoria-contacto", destination: "/contacto", permanent: true },
    { source: "/blog-list", destination: "/blog", permanent: true },
    { source: "/w11", destination: "/", permanent: true },
    // Notas del blog viejo (estaban en la raíz) → /blog/<slug>
    { source: "/ahorra-ya-con-odoo", destination: "/blog/ahorra-ya-con-odoo", permanent: true },
    {
      source: "/costos-ocultos-de-operar-un-negocio-con-excel",
      destination: "/blog/costos-ocultos-de-operar-un-negocio-con-excel",
      permanent: true,
    },
    { source: "/factura-homologada", destination: "/blog/factura-homologada", permanent: true },
    { source: "/zoho-creator", destination: "/blog/zoho-creator", permanent: true },
  ]);
});

test("JSON-LD con dirección real y zona de atención", () => {
  const j = organizationJsonLd(site) as Json;
  expect(j["@type"]).toBe("ProfessionalService");
  expect(j.address.streetAddress).toBe("Mengelle 748");
  expect(j.address.addressLocality).toBe("Cipolletti");
  expect(j.address.addressRegion).toBe("Río Negro");
  expect(j.areaServed).toEqual(["Neuquén", "Río Negro", "Argentina"]);
  expect(j.email).toBe("daniel@serdigital.com.ar");
  expect(j.sameAs).toEqual([site.contact.linkedin]);
});

test("JSON-LD oculta la calle si showStreet es false", () => {
  const j = organizationJsonLd({ ...site, contact: { ...site.contact, showStreet: false } }) as Json;
  expect(j.address.streetAddress).toBeUndefined();
});

test("JSON-LD usa el logo cargado (versión para fondo claro)", () => {
  expect((organizationJsonLd(site) as Json).logo).toBe("https://serdigital.com.ar/brand/logo-horizontal-claro.png");
  expect((organizationJsonLd({ ...site, logo: null }) as Json).logo).toBeUndefined();
});

test("serializeJsonLd escapa < para no cerrar el script", async () => {
  const { serializeJsonLd } = await import("@/lib/seo");
  const out = serializeJsonLd({ a: "</script>" });
  expect(out).not.toContain("<");
  expect(JSON.parse(out)).toEqual({ a: "</script>" });
});

test("pageMetadata arma openGraph completo con imagen", async () => {
  const { pageMetadata } = await import("@/lib/seo");
  const m = pageMetadata({ title: "Casos", description: "d", path: "/casos" });
  expect(m.alternates.canonical).toBe("/casos");
  expect(m.openGraph).toMatchObject({ siteName: "Serdigital", url: "/casos", title: "Casos · Serdigital" });
  expect(m.openGraph.images?.[0].url).toBe("/opengraph-image");
});

test("siteJsonLd agrupa organización y sitio web en un @graph", async () => {
  const { siteJsonLd } = await import("@/lib/seo");
  const j = siteJsonLd(site) as { "@context": string; "@graph": Record<string, unknown>[] };
  expect(j["@context"]).toBe("https://schema.org");
  const [org, web] = j["@graph"];
  expect(org["@type"]).toBe("ProfessionalService");
  expect(org["@context"]).toBeUndefined();
  expect(web).toMatchObject({
    "@type": "WebSite",
    url: "https://serdigital.com.ar",
    inLanguage: "es-AR",
    publisher: { "@id": "https://serdigital.com.ar/#organizacion" },
  });
});

test("blogPostingJsonLd describe la nota con fecha, autor e imagen", async () => {
  const { blogPostingJsonLd } = await import("@/lib/seo");
  const j = blogPostingJsonLd(site, {
    slug: "zoho-creator",
    title: "Zoho Creator",
    description: "d",
    date: "2025-06-05",
    tags: ["Zoho Creator", "Desarrollo a medida"],
    placeholder: false,
  }) as Record<string, unknown>;
  expect(j).toMatchObject({
    "@type": "BlogPosting",
    headline: "Zoho Creator",
    datePublished: "2025-06-05",
    url: "https://serdigital.com.ar/blog/zoho-creator",
    mainEntityOfPage: "https://serdigital.com.ar/blog/zoho-creator",
    image: "https://serdigital.com.ar/blog/zoho-creator/opengraph-image",
    keywords: "Zoho Creator, Desarrollo a medida",
    author: { "@id": "https://serdigital.com.ar/#organizacion" },
    publisher: { "@id": "https://serdigital.com.ar/#organizacion" },
  });
});

test("breadcrumbJsonLd numera las migas con URL absoluta", async () => {
  const { breadcrumbJsonLd } = await import("@/lib/seo");
  const j = breadcrumbJsonLd(site, [
    { name: "Blog", path: "/blog" },
    { name: "Zoho Creator", path: "/blog/zoho-creator" },
  ]) as { itemListElement: Record<string, unknown>[] };
  expect(j.itemListElement).toEqual([
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://serdigital.com.ar/" },
    { "@type": "ListItem", position: 2, name: "Blog", item: "https://serdigital.com.ar/blog" },
    { "@type": "ListItem", position: 3, name: "Zoho Creator", item: "https://serdigital.com.ar/blog/zoho-creator" },
  ]);
});

test("pageMetadata de nota agrega fecha y etiquetas al openGraph", async () => {
  const { pageMetadata } = await import("@/lib/seo");
  const m = pageMetadata({
    title: "Nota",
    description: "d",
    path: "/blog/nota",
    article: { publishedTime: "2025-06-05", tags: ["ARCA"] },
  });
  expect(m.openGraph).toMatchObject({ type: "article", publishedTime: "2025-06-05", tags: ["ARCA"] });
  // Sin imagen fija: la nota usa su propia opengraph-image
  expect("images" in m.openGraph).toBe(false);
});
