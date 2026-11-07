import type { SiteContent } from "@/lib/types";

/* =====================================================================
  CONTENIDO DEL SITIO: todos los textos editables viven acá.
  Buscá "TODO" para ver lo que falta completar.
   ===================================================================== */

export const site: SiteContent = {
  name: "Serdigital",
  url: "https://serdigital.com.ar",
  description:
    "Consultora de transformación digital del Alto Valle. Consultoría de digitalización, desarrollo de software a medida y seguridad informática.",

  // LOGO (paquete completo en brand-assets/SerDigital-Logo-Pack, fuera de public; el sitio usa las copias de public/brand/).
  // srcDark se ve en modo oscuro y srcLight en modo claro. Con null se muestra el nombre en texto.
  logo: {
    srcDark: "/brand/logo-horizontal-oscuro.png",
    srcLight: "/brand/logo-horizontal-claro.png",
    width: 1200,
    height: 257,
    alt: "Ser Digital",
  },

  // MENÚ (el que tiene highlight se muestra como botón)
  nav: [
    { label: "Inicio", href: "/" },
    { label: "Servicios", href: "/servicios" },
    { label: "Casos", href: "/casos" },
    { label: "Blog", href: "/blog" },
    { label: "Contacto", href: "/contacto", highlight: true },
  ],

  // HERO DEL INICIO. El título se arma: antes + destacado (en naranja) + después
  hero: {
    tag: "Consultora de transformación digital",
    titleBefore: "Digitalizamos procesos para que tu empresa ",
    titleHighlight: "decida y opere",
    titleAfter: " más rápido.",
    lead: "Consultoría, software a medida y seguridad informática, con un equipo que entiende la operación antes de escribir código.",
    primaryCta: { label: "Hablemos", href: "/contacto" },
    secondaryCta: { label: "Ver casos", href: "/casos" },
  },

  // SERVICIOS: lo que hacemos a medida con cada cliente
  services: [
    {
      slug: "consultoria",
      number: "01",
      title: "Consultoría de digitalización ágil",
      summary:
        "Relevamos cómo trabaja tu empresa hoy, detectamos dónde se pierde tiempo e información y armamos un plan de digitalización por etapas.",
      includes: [
        "Relevamiento de procesos y circuitos de información",
        "Diagnóstico y priorización de mejoras",
        "Hoja de ruta por etapas, con entregas cortas",
        "Acompañamiento en la adopción por parte del equipo",
      ],
    },
    {
      slug: "desarrollo",
      number: "02",
      title: "Desarrollo de software a medida",
      summary:
        "Construimos las herramientas que tu operación necesita, integradas con lo que ya usás, para que los datos se carguen una sola vez.",
      includes: [
        "Aplicaciones web y móviles para la operación diaria",
        "Integración de sistemas y datos entre áreas",
        "Tableros para seguir indicadores y tomar decisiones",
        "Mantenimiento y evolución del software",
      ],
    },
    {
      slug: "seguridad",
      number: "03",
      title: "Seguridad informática",
      summary:
        "Protegemos la información y los sistemas de tu empresa con medidas concretas, proporcionadas a tu tamaño y a tus riesgos reales.",
      includes: [
        "Evaluación del estado actual de seguridad",
        "Políticas de accesos, contraseñas y copias de respaldo",
        "Configuración segura de equipos y servicios",
        "Capacitación del equipo en buenas prácticas",
      ],
    },
  ],

  // PRODUCTO: Audire (preparado para tener su propia landing en el futuro)
  audire: {
    slug: "audire",
    name: "Audire",
    tagline: "La documentación de tu personal, flota y contratos, siempre auditada.",
    description:
      "Audire es nuestra plataforma de gestión documental. Centraliza la documentación de personal, flota y contratos, y audita que esté completa y vigente según la normativa de cada vertical.",
    highlights: [
      "Documentación de personal, flota y contratos en un solo lugar",
      "Auditoría de la documentación requerida según cada vertical",
      "Control de vencimientos",
    ],
    verticals: [], // TODO: rubros y normativas que cubre (ej. petróleo y gas, transporte)
    modules: [], // TODO: módulos principales
    cta: { label: "Consultar por Audire", href: "/contacto" }, // TODO: cambiar si hay demo o acceso
  },

  // CASOS DE ÉXITO. Con result: null no se muestra la fila "El resultado"; al cargar un texto, aparece sola.
  cases: [
    {
      slug: "audire",
      client: "Audire",
      logo: { src: "/casos/logo-audire.png", width: 439, height: 329, invertOnLight: true },
      title: "Una plataforma para auditar documentación por vertical",
      summary:
        "Diseñamos y desarrollamos Audire, nuestra plataforma de gestión documental con auditoría según la normativa de cada vertical.",
      problem:
        "Las empresas que trabajan con personal, flota y contratos deben mantener al día documentación exigida por normativas distintas según el rubro, y ese control suele hacerse a mano.",
      solution:
        "Una plataforma que centraliza la documentación de personal, flota y contratos y audita automáticamente qué falta o qué está por vencer según la vertical.",
      result: null, // TODO: resultado verificable
      resultMetrics: [], // TODO: ej. { label: "Empresas que lo usan", value: "..." }
      tags: ["Producto", "Gestión documental"],
    },
    {
      slug: "transporte-tortoriello",
      client: "Transporte Tortoriello",
      logo: { src: "/casos/logo-tortoriello.png", width: 512, height: 512 },
      title: "Logística, taller, pañol y RRHH en un mismo sistema",
      summary:
        "Digitalizamos áreas clave de la operación de una empresa de transporte e integramos sus datos entre sectores.",
      problem:
        "La información de logística, taller, pañol y recursos humanos estaba repartida entre áreas, lo que dificultaba tener una visión completa de la operación.",
      solution:
        "Digitalizamos los procesos de logística, taller, pañol y RRHH, e integramos los datos transversales para que cada área trabaje sobre la misma información.",
      result: null, // TODO: resultado verificable
      resultMetrics: [], // TODO
      tags: ["Transporte", "Desarrollo a medida", "Integración de datos"],
    },
  ],

  // TESTIMONIOS (sin fotos: se muestran iniciales). Podés sumar role y company.
  testimonials: [
    {
      quote:
        "La consultora Ser Digital transformó nuestros procesos, mejorando la eficiencia y facilitando la toma de decisiones.",
      name: "Rodrigo Iparraguirre",
      // role: "TODO", company: "TODO",
    },
    {
      quote:
        "Gracias a Ser Digital, implementamos soluciones ágiles que optimizaron nuestro trabajo y aumentaron nuestra productividad.",
      name: "Federico Mazzei",
      // role: "TODO", company: "TODO",
    },
  ],

  // MÉTRICAS: mientras value sea null no se muestran. Si todas son null, el bloque se oculta.
  metrics: [
    { label: "Proyectos implementados", value: null }, // TODO
    { label: "Años de experiencia", value: null }, // TODO
    { label: "Empresas acompañadas", value: null }, // TODO
  ],

  contact: {
    email: "daniel@serdigital.com.ar",
    whatsapp: "5492995482790",
    whatsappDisplay: "+54 9 299 548 2790",
    whatsappMessage: "Hola Serdigital, quiero hacer una consulta.",
    street: "Mengelle 748",
    city: "Cipolletti",
    region: "Río Negro",
    country: "Argentina",
    showStreet: true,
    hours: "Lunes a viernes de 9 a 18 h",
    coverage: "Trabajamos con empresas de Neuquén, Río Negro y todo el país.",
    linkedin: "https://www.linkedin.com/in/danieliuzzolino/",
  },

  // INTERRUPTORES DE INTERACCIONES (false = apagado en todo el sitio)
  interactions: {
    customCursor: true,
    magnetic: true,
    spotlight: true,
    heroNetwork: true,
  },
};
