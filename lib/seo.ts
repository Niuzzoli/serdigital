import type { PostMeta } from "./blog-utils";
import type { SiteContent } from "./types";

// Datos estructurados (JSON-LD) de la empresa para Google.
// Dirección real en Cipolletti y zona de atención Neuquén, Río Negro y Argentina.
export function organizationJsonLd(site: SiteContent): object {
  const c = site.contact;
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${site.url}/#organizacion`,
    name: site.name,
    description: site.description,
    url: site.url,
    ...(site.logo && { logo: new URL(site.logo.srcLight, site.url).toString() }),
    email: c.email,
    telephone: c.whatsappDisplay,
    address: {
      "@type": "PostalAddress",
      ...(c.showStreet && c.street && { streetAddress: c.street }),
      addressLocality: c.city,
      addressRegion: c.region,
      addressCountry: "AR",
    },
    areaServed: ["Neuquén", "Río Negro", "Argentina"],
    openingHours: "Mo-Fr 09:00-18:00",
    sameAs: [c.linkedin],
    makesOffer: site.services.map((s) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: s.title },
    })),
  };
}

// Serializa el JSON-LD escapando "<" para que ningún texto pueda cerrar el <script>.
export function serializeJsonLd(data: object): string {
  const escapedLt = String.fromCharCode(92) + "u003c";
  return JSON.stringify(data).replace(/</g, escapedLt);
}

// Organización + sitio web juntos en un @graph (va en el layout, una sola vez por página).
export function siteJsonLd(site: SiteContent): object {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { "@context": _ctx, ...org } = organizationJsonLd(site) as Record<string, unknown>;
  return {
    "@context": "https://schema.org",
    "@graph": [
      org,
      {
        "@type": "WebSite",
        "@id": `${site.url}/#sitio`,
        url: site.url,
        name: site.name,
        description: site.description,
        inLanguage: "es-AR",
        publisher: { "@id": `${site.url}/#organizacion` },
      },
    ],
  };
}

// Datos estructurados de una nota del blog. Autor y editor = la empresa
// (las notas no tienen firma individual).
export function blogPostingJsonLd(site: SiteContent, post: PostMeta): object {
  const url = `${site.url}/blog/${post.slug}`;
  const org = { "@id": `${site.url}/#organizacion` };
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    url,
    mainEntityOfPage: url,
    image: `${url}/opengraph-image`,
    inLanguage: "es-AR",
    ...(post.tags.length > 0 && { keywords: post.tags.join(", ") }),
    author: org,
    publisher: org,
    isPartOf: { "@id": `${site.url}/#sitio` },
  };
}

// Migas de pan para Google. "Inicio" se agrega solo al principio.
export function breadcrumbJsonLd(site: SiteContent, items: { name: string; path: string }[]): object {
  const all = [{ name: "Inicio", path: "/" }, ...items];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: all.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: new URL(it.path, site.url).toString(),
    })),
  };
}

// Metadata de una página interna. Next reemplaza el bloque openGraph completo en cada
// página (no lo combina con el del layout), por eso se arma entero acá.
// Las notas del blog no llevan imagen acá: usan la suya (app/blog/[slug]/opengraph-image.tsx).
// Si se fijara una imagen en la metadata, Next la usaría en lugar de la de la nota.
export function pageMetadata(opts: {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
  article?: { publishedTime: string; tags: string[] };
}) {
  const fullTitle = `${opts.title} · Serdigital`;
  return {
    title: opts.title,
    description: opts.description,
    alternates: { canonical: opts.path },
    openGraph: {
      type: opts.article ? ("article" as const) : (opts.type ?? "website"),
      locale: "es_AR",
      siteName: "Serdigital",
      url: opts.path,
      title: fullTitle,
      description: opts.description,
      ...(!opts.article && { images: [{ url: "/opengraph-image", width: 1200, height: 630 }] }),
      ...(opts.article && { publishedTime: opts.article.publishedTime, tags: opts.article.tags }),
    },
  };
}
