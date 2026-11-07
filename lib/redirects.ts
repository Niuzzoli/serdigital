// Redirecciones permanentes desde las páginas del sitio anterior (Hostinger).
// Next responde 308 para "permanent", que Google trata igual que un 301.
export const REDIRECTS = [
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
];
