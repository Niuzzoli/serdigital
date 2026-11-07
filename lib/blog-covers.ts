// Notas que tienen portada ilustrada (components/illustrations/BlogCover.tsx).
// Vive fuera del componente cliente para poder consultarlo desde el servidor.
export const BLOG_COVER_SLUGS = [
  "ahorra-ya-con-odoo",
  "costos-ocultos-de-operar-un-negocio-con-excel",
  "factura-homologada",
  "zoho-creator",
] as const;

export function hasBlogCover(slug: string): boolean {
  return (BLOG_COVER_SLUGS as readonly string[]).includes(slug);
}
