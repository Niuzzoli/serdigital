// Formas de los datos de content/site.ts. Si agregás un campo, empezá por acá.

export type Link = { label: string; href: string };

export type NavItem = Link & { highlight?: boolean };

export type Service = {
  slug: string;
  number: string;
  title: string;
  summary: string;
  includes: string[];
};

export type Product = {
  slug: string;
  name: string;
  /** Logo del producto */
  logo: ImageAsset;
  tagline: string;
  description: string;
  highlights: string[];
  /** Procesos que ya están en producción */
  processes: { name: string; detail: string }[];
  cta: Link;
  /** Sitio propio del producto */
  website: Link;
};

export type Metric = { label: string; value: string | null };

export type ImageAsset = {
  /** Ruta dentro de /public */
  src: string;
  width: number;
  height: number;
  /** true para logos blancos: en modo claro se invierten a oscuro */
  invertOnLight?: boolean;
};

export type CaseStudy = {
  slug: string;
  client: string;
  logo?: ImageAsset;
  title: string;
  summary: string;
  problem: string;
  solution: string;
  result: string | null;
  resultMetrics: Metric[];
  tags: string[];
};

export type Testimonial = {
  quote: string;
  name: string;
  role?: string;
  company?: string;
  caseSlug?: string;
};

export type Contact = {
  email: string;
  /** Solo dígitos, con código de país: 549... */
  whatsapp: string;
  whatsappDisplay: string;
  whatsappMessage: string;
  street: string;
  city: string;
  region: string;
  country: string;
  /** false = se muestra solo "Ciudad, Provincia" en todo el sitio y en Google */
  showStreet: boolean;
  hours: string;
  coverage: string;
  linkedin: string;
};

export type SiteContent = {
  name: string;
  url: string;
  description: string;
  /** Logo horizontal: una versión para fondo oscuro y otra para fondo claro (cambia con el tema) */
  logo: { srcDark: string; srcLight: string; width: number; height: number; alt: string } | null;
  nav: NavItem[];
  hero: {
    tag: string;
    titleBefore: string;
    titleHighlight: string;
    titleAfter: string;
    lead: string;
    primaryCta: Link;
    secondaryCta: Link;
  };
  services: Service[];
  product: Product;
  cases: CaseStudy[];
  testimonials: Testimonial[];
  metrics: Metric[];
  contact: Contact;
  interactions: {
    customCursor: boolean;
    magnetic: boolean;
    spotlight: boolean;
    heroNetwork: boolean;
  };
};
