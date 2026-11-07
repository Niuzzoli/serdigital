# Serdigital Web Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir desde cero el sitio de Serdigital: 5 secciones, tema oscuro con tokens, hero con canvas interactivo, blog MDX y contacto, listo para Vercel.

**Architecture:** Next.js 16 App Router sin `src/`. Todo el contenido editable vive en `content/site.ts` (tipado) y `content/blog/*.mdx`. Los tokens viven en `app/globals.css`. La lógica pura (validación, simulación de la red, helpers de contenido) está en `lib/` y se testea con Vitest. Los componentes visuales se verifican con build, lint y revisión en el navegador.

**Tech Stack:** Next 16.4.x, React 19.3, TypeScript, Tailwind CSS v4, `motion`, `@next/mdx`, Vitest.

**Spec:** `docs/superpowers/specs/2026-11-06-serdigital-web-design.md`. Leelo completo antes de empezar; el plan argumenta desde ahí.

## Global Constraints

- Prohibido: GSAP, Lenis, smooth-scroll, secciones pineadas, scroll horizontal, fotos o avatares de stock, métricas, clientes o logos inventados, "150+ clientes".
- Antes de escribir código de Next, leer `node_modules/next/dist/docs/` (Next 16 tiene cambios incompatibles: `params` es async, Turbopack por defecto y `mdx-components.tsx` obligatorio).
- Ningún componente usa hex sueltos: todo color sale de tokens en `app/globals.css`.
- Easing único `cubic-bezier(0.22, 1, 0.36, 1)`. Duraciones de 300–700 ms. Solo se animan `transform` y `opacity`.
- Todas las interacciones de puntero se apagan con `(hover: none)`, `(pointer: coarse)` o `prefers-reduced-motion: reduce`.
- Tipografías: Bricolage Grotesque (única familia) y JetBrains Mono, vía `next/font/google`.
- Copy en español rioplatense neutro. `lang="es-AR"`. Comentarios del código en castellano, como en el portafolio.
- Nada de credenciales en el código. Las variables de entorno se documentan en `.env.example` sin valores.
- `npm run build` y `npm run lint` limpios al cierre de cada fase (tareas 4, 6, 8, 9 y 11), seguidos de un resumen al dueño.
- **No hay repo git y el dueño no pidió commits:** no se commitea. Donde iría un commit, se corre la verificación de la tarea.

## Review Focus

1. **Laptop táctil o tablet con mouse (puntero híbrido):** la detección se evalúa con `matchMedia` y se re-evalúa ante `change`. Sin puntero fino no hay cursor custom, botón magnético ni parallax. Test en Task 3 (`canUsePointerEffects`).
2. **Envío fallido o doble clic en el formulario:** nunca se muestra "enviado" si la respuesta no es 200. El botón queda deshabilitado mientras envía. Un 503 muestra el fallback a WhatsApp y email. Tests en Task 10.
3. **Menú mobile con teclado:** Esc lo cierra y devuelve el foco al botón, cambiar de ruta lo cierra, el foco queda dentro mientras está abierto y el body no scrollea. Verificación en Task 4.
4. **Pantalla de 320 px:** el título del hero, los títulos de casos y las direcciones no generan scroll horizontal (`overflow-wrap:anywhere` donde haga falta y `clamp()` en los títulos). Verificación en Tasks 5 y 11.
5. **Canvas ante resize, pestaña oculta o navegación:** no quedan rAF, listeners ni observers vivos al desmontar, y la red se regenera sin saltos al redimensionar. Test de `createNodes` y `stepNodes` en Task 5, verificación en el navegador.

---

## Estructura de archivos

```
app/
  layout.tsx            fuentes, Navbar, Footer, CustomCursor, JSON-LD, metadata base
  template.tsx          envoltorio de transición de página (ViewTransition)
  globals.css           TOKENS + base + utilidades + keyframes de transición
  page.tsx              Inicio
  servicios/page.tsx
  casos/page.tsx
  blog/page.tsx
  blog/[slug]/page.tsx
  contacto/page.tsx
  api/contact/route.ts
  opengraph-image.tsx  sitemap.ts  robots.ts  manifest.ts  icon.svg  not-found.tsx
components/
  brand/Logo.tsx
  layout/Navbar.tsx  layout/SpotlightNav.tsx  layout/MobileMenu.tsx  layout/Footer.tsx
  ui/PillButton.tsx  ui/Magnetic.tsx  ui/SpotlightCard.tsx  ui/Reveal.tsx
  ui/CustomCursor.tsx  ui/Section.tsx  ui/Tag.tsx  ui/GhostButton.tsx
  hero/Hero.tsx  hero/HeroNetwork.tsx  hero/ServicesStrip.tsx
  sections/ServicesGrid.tsx  sections/AudireFeature.tsx  sections/AudireMockup.tsx
  sections/CasesList.tsx  sections/CaseCard.tsx  sections/Metrics.tsx
  sections/Testimonials.tsx  sections/CtaBand.tsx
  contact/ContactForm.tsx  contact/WhatsAppButton.tsx
  blog/PostCard.tsx  blog/PlaceholderNotice.tsx
content/
  site.ts               TODO lo editable (tipos en lib/types.ts)
  blog/automatizar-documentacion.mdx  blog/seguridad-pymes.mdx
lib/
  types.ts  motion.ts  pointer.ts  network.ts  contact.ts  site-helpers.ts  blog.ts  seo.ts
mdx-components.tsx
next.config.ts  .env.example  vitest.config.ts
tests/
  site-helpers.test.ts  pointer.test.ts  network.test.ts  contact.test.ts  blog.test.ts  redirects.test.ts
```

---

### Task 1: Scaffold, dependencias y tokens — Fase (a)

**Files:**
- Create: proyecto Next en `D:\Dev\Pruebas con claude code\serdigital` (preservar `prompt.txt`, `docs/` y `.superpowers/`)
- Create: `app/globals.css`, `lib/motion.ts`, `vitest.config.ts`, `.gitignore` (incluye `.superpowers/` y `.env*.local`)
- Test: `tests/smoke.test.ts`

**Interfaces:**
- Produces: tokens CSS `--bg --bg-2 --surface --line --text --muted --accent --accent-ink --blue --ring --radius-card --shadow-card --ease-out --dur-fast(300ms) --dur-base(500ms) --dur-slow(700ms)`, expuestos en `@theme inline` como `bg-bg`, `bg-surface`, `text-muted`, `text-accent`, `border-line`, `font-sans`, `font-mono`, etc.
- Produces: `lib/motion.ts` → `export const EASE = [0.22, 1, 0.36, 1] as const; export const DUR = { fast: 0.3, base: 0.5, slow: 0.7 } as const; export const SHIFT = 16;`

- [ ] **Step 1:** Generar el proyecto con `npx create-next-app@16.4.2 . --ts --tailwind --eslint --app --no-src-dir --import-alias "@/*" --use-npm` en un directorio temporal del scratchpad y copiar el resultado a la raíz (la carpeta no está vacía). Instalar `motion @next/mdx @mdx-js/loader @mdx-js/react @types/mdx` y, como dev, `vitest`.
- [ ] **Step 2:** Leer en `node_modules/next/dist/docs/01-app/`: `02-guides/mdx.md`, `02-guides/view-transitions.md`, `03-api-reference/05-config/01-next-config-js/redirects.md`, `02-guides/upgrading/version-16.md`.
- [ ] **Step 3:** Escribir `app/globals.css` con los valores de la paleta de la sección 4 del spec, en `:root`, y mapearlos en `@theme inline`. Agregar el foco visible global (`:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px }`) y `@media (prefers-reduced-motion: reduce)` para anular transiciones.
- [ ] **Step 4:** Agregar el script `"test": "vitest run"` y escribir `tests/smoke.test.ts` con `expect(EASE).toEqual([0.22,1,0.36,1])`.
- [ ] **Step 5:** Correr `npm test`, `npm run lint` y `npm run build`. Esperado: los tres pasan.

### Task 2: Contenido centralizado

**Files:**
- Create: `lib/types.ts`, `content/site.ts`, `lib/site-helpers.ts`
- Test: `tests/site-helpers.test.ts`

**Interfaces:**
- Produces (`lib/types.ts`):
  - `Service { slug: string; number: string; title: string; summary: string; includes: string[] }`
  - `Product { slug: "audire"; name: string; tagline: string; description: string; verticals: string[] /* TODO */; modules: string[] /* TODO */; cta: { label: string; href: string } }`
  - `CaseStudy { slug: string; client: string; title: string; problem: string; solution: string; result: string | null /* TODO */; resultMetrics: Metric[]; tags: string[] }`
  - `Testimonial { quote: string; name: string; role?: string; company?: string; caseSlug?: string }`
  - `Metric { label: string; value: string | null }`
  - `SiteContent { name; url; description; logo: { src: string; width: number; height: number; alt: string } | null; nav: { label: string; href: string; highlight?: boolean }[]; hero: { tag: string; titleBefore: string; titleHighlight: string; titleAfter: string; lead: string; primaryCta; secondaryCta }; services: Service[]; audire: Product; cases: CaseStudy[]; testimonials: Testimonial[]; metrics: Metric[]; contact: { email: string; whatsapp: string /* solo dígitos */; whatsappMessage: string; street: string; city: string; region: string; country: string; showStreet: boolean; hours: string; coverage: string; linkedin: string }; interactions: { customCursor: boolean; magnetic: boolean; spotlight: boolean; heroParallax: boolean; heroNetwork: boolean } }`
- Produces (`lib/site-helpers.ts`): `visibleMetrics(m: Metric[]): Metric[]`, `whatsappUrl(phone: string, message: string): string`, `formatAddress(c: SiteContent["contact"]): string`, `initials(name: string): string`

- [ ] **Step 1: Escribir los tests que fallan**

```ts
test("visibleMetrics descarta los null", () => {
  expect(visibleMetrics([{label:"a",value:null},{label:"b",value:"10"}])).toEqual([{label:"b",value:"10"}]);
});
test("whatsappUrl arma wa.me con mensaje codificado", () => {
  expect(whatsappUrl("5492995482790","Hola, quiero consultar")).toBe("https://wa.me/5492995482790?text=Hola%2C%20quiero%20consultar");
});
test("formatAddress respeta showStreet", () => {
  const c = { ...site.contact, showStreet: true };
  expect(formatAddress(c)).toBe("Mengelle 748, Cipolletti, Río Negro");
  expect(formatAddress({ ...c, showStreet: false })).toBe("Cipolletti, Río Negro");
});
test("initials", () => { expect(initials("Rodrigo Iparraguirre")).toBe("RI"); });
test("contenido real cargado", () => {
  expect(site.contact.email).toBe("contacto@serdigital.com.ar");
  expect(site.testimonials).toHaveLength(2);
  expect(site.services.map(s => s.title)).toEqual(["Consultoría de digitalización ágil","Desarrollo de software a medida","Seguridad informática"]);
  expect(site.nav.map(n => n.label)).toEqual(["Servicios","Casos","Blog","Contacto"]);
});
```

- [ ] **Step 2:** Correr `npm test`. Esperado: FAIL (los módulos no existen).
- [ ] **Step 3:** Implementar los tipos, los helpers y `content/site.ts`. Valores fijos que vienen del spec:
  - Hero: tag "Consultora de transformación digital · Alto Valle"; título partido en "Digitalizamos procesos para que tu empresa " / "decida y opere" / " más rápido.".
  - Contacto: whatsapp `5492995482790`, street "Mengelle 748", city "Cipolletti", region "Río Negro", country "Argentina", showStreet `true`, hours "Lunes a viernes de 9 a 18 h", coverage "Trabajamos con empresas de Neuquén, Río Negro y todo el país.", linkedin del spec.
  - Testimonios: textos literales del spec, solo con nombre.
  - Métricas: 3 o 4 con `value: null` y un comentario `// TODO`.
  - Casos: `result: null // TODO`.
  - Audire: `verticals: []` y `modules: []` con `// TODO`, CTA a `/contacto`.
  - `logo: null` con un comentario que explique cómo cargarlo.
  - Todas las interacciones en `true`.

  Cada bloque lleva un comentario arriba que explica qué editar.
- [ ] **Step 4:** Correr `npm test`. Esperado: PASS.

### Task 3: Primitivas de interacción y animación

**Files:**
- Create: `lib/pointer.ts`, `components/ui/{Reveal,PillButton,Magnetic,SpotlightCard,CustomCursor,GhostButton,Tag,Section}.tsx`
- Test: `tests/pointer.test.ts`

**Interfaces:**
- Produces: `canUsePointerEffects(q: { fine: boolean; hover: boolean; reducedMotion: boolean }): boolean` (pura) y `usePointerEffects(): boolean` (hook cliente que escucha `matchMedia('(hover:hover) and (pointer:fine)')` y `('(prefers-reduced-motion: reduce)')` con `change`; arranca en `false` para que el SSR no difiera).
- Produces: `<Reveal as? delay? stagger?>` (con `whileInView`, `viewport={{ once: true, margin: "-10% 0px" }}`, `y: SHIFT → 0` y opacidad; con reduced motion, solo opacidad) y `<RevealItem>` para hijos con stagger de 0.06 s.
- Produces: `<PillButton href? label size="sm"|"md" variant="accent"|"light">`, portado desde `portafolio-web-niuzzoli/src/components/PillButton.tsx` y reemplazando `accentClassName` y `hoverTextClassName` por `variant` con tokens. Si `href` empieza con `/`, usa `next/link`.
- Produces: `<Magnetic strength={0.25} max={8}>` (spring de Motion: `stiffness 200`, `damping 15`; inerte si `!usePointerEffects() || !site.interactions.magnetic`).
- Produces: `<SpotlightCard as? className>`. En `pointermove` escribe `--mx` y `--my` en el estilo del elemento (sin estado de React) y pinta un `radial-gradient` con `--blue` y `--accent` a baja opacidad en un pseudo-elemento. Fuera del modo interactivo no pinta nada.
- Produces: `<CustomCursor />`, un punto de 8 px más un anillo con retardo por spring y `mix-blend-mode: difference`. Crece sobre `a, button, [data-cursor]`, se oculta sobre `input, textarea` y no oculta el cursor nativo en campos. No se renderiza si `!site.interactions.customCursor` o sin puntero fino.

- [ ] **Step 1: Escribir los tests que fallan**

```ts
test.each([
  [{fine:true, hover:true, reducedMotion:false}, true],
  [{fine:false,hover:true, reducedMotion:false}, false],
  [{fine:true, hover:false,reducedMotion:false}, false],
  [{fine:true, hover:true, reducedMotion:true }, false],
])("canUsePointerEffects(%o) = %s", (q, ok) => expect(canUsePointerEffects(q)).toBe(ok));
```

- [ ] **Step 2:** Correr `npm test`. Esperado: FAIL.
- [ ] **Step 3:** Implementar `lib/pointer.ts` y los componentes. Antes, cargar las skills `emil-design-eng` y `design-taste-frontend` para los detalles finos de las microinteracciones.
- [ ] **Step 4:** Correr `npm test` y `npm run lint`. Esperado: PASS.

### Task 4: Layout, navbar, footer y transiciones — cierre de Fase (a)

**Files:**
- Create: `components/brand/Logo.tsx`, `components/layout/{Navbar,SpotlightNav,MobileMenu,Footer}.tsx`, `app/template.tsx`, `app/not-found.tsx`
- Modify: `app/layout.tsx`, `app/page.tsx` (placeholder mínimo), `app/globals.css` (keyframes de la transición)

**Interfaces:**
- Consumes: `site`, `PillButton`, `Magnetic`, `CustomCursor`, `formatAddress`, `whatsappUrl`.
- Produces: `<Logo className? />`. Si `site.logo` existe, renderiza `next/image` con sus medidas; si no, el texto "Serdigital" con un marcador mono discreto. Siempre envuelto en `<Link href="/" aria-label="Serdigital, inicio">`.
- Produces: `<SpotlightNav items activeHref>`, portado desde `portafolio-web-niuzzoli/src/components/ui/spotlight-navbar.tsx`. El ítem activo sale de `usePathname()` y no del scroll, se quita la detección de tema y se pasa a tokens.

- [ ] **Step 1:** `layout.tsx` carga las dos fuentes (`--font-sans` y `--font-mono`), tiene `lang="es-AR"`, el body con `bg-bg text-text`, un skip link "Saltar al contenido" hacia `#main`, `<Navbar/>`, `<main id="main">` y `<Footer/>`, más `<CustomCursor/>`. Metadata base: `metadataBase` y un `title.template` `"%s · Serdigital"`.
- [ ] **Step 2:** Navbar fija. Con `scrollY > 24` (listener pasivo con rAF) pasa a modo compacto: menos padding, fondo `--bg` al 80 % con `backdrop-blur` y borde inferior `--line`. Solo cambian `transform`, `opacity` y el fondo de una capa absoluta. De 768 px para arriba muestra el Logo, SpotlightNav (Servicios, Casos, Blog) y el `PillButton` "Contacto" dentro de `Magnetic`. Debajo, un botón hamburguesa abre `MobileMenu`.
- [ ] **Step 3:** `MobileMenu`: panel a pantalla completa, `aria-expanded` y `aria-controls`, Esc cierra y devuelve el foco, focus trap, body sin scroll mientras está abierto y cierre con `usePathname` al cambiar de ruta. Los ítems entran con stagger.
- [ ] **Step 4:** Footer con Logo, `formatAddress`, horario, coverage, email (`mailto:`), WhatsApp, LinkedIn y el mapa del sitio. Año dinámico.
- [ ] **Step 5:** `app/template.tsx` envuelve `children` en `<ViewTransition>` de React. En `globals.css`, `::view-transition-old/new(root)` con fade y `translateY(8px)` a 400 ms con `--ease-out`, y desactivado con reduced motion. El header lleva `viewTransitionName: 'site-header'` y sin animación, como indica `view-transitions.md` en "Anchoring the header".
- [ ] **Step 6:** Correr `npm run lint` y `npm run build` (esperado: limpios). Después `npm run dev` y revisar en el navegador a 375 px y 1440 px: el navbar compacta al scrollear y el menú mobile cumple el punto 3 de Review Focus. **Resumir la Fase (a) al dueño.**

### Task 5: Hero con canvas de red

**Files:**
- Create: `lib/network.ts`, `components/hero/{Hero,HeroNetwork,ServicesStrip}.tsx`
- Test: `tests/network.test.ts`

**Interfaces:**
- Produces (`lib/network.ts`, puro, sin DOM):
  - `type Node = { x: number; y: number; vx: number; vy: number; heat: number }`
  - `createNodes(w: number, h: number, opts: { region: "right" | "full"; density: number /* px² por nodo, 9000 */; max: number /* 120 */; rand?: () => number }): Node[]`
  - `stepNodes(nodes: Node[], w: number, h: number, pointer: { x: number; y: number } | null, opts: { radius: 160; grid: 48; pull: 0.06 }): void` (mueve los nodos, rebota en los bordes, calcula `heat` en 0–1 y atrae hacia la grilla según `heat`)
  - `forEachLink(nodes: Node[], maxDist: 110, cb: (a: Node, b: Node, t: number) => void): void`
- Algoritmo: el del boceto `.superpowers/brainstorm/397-1793984286/content/paleta-y-hero.html`, ya validado por el dueño.

- [ ] **Step 1: Escribir los tests que fallan**

```ts
test("createNodes respeta tope y región derecha", () => {
  const n = createNodes(2000, 1000, { region: "right", density: 9000, max: 120, rand: () => 0.5 });
  expect(n.length).toBe(120);
  n.forEach(p => expect(p.x).toBeGreaterThanOrEqual(2000 * 0.38));
});
test("stepNodes mantiene los nodos dentro del lienzo", () => {
  const n = createNodes(300, 200, { region: "full", density: 600, max: 50 });
  for (let i = 0; i < 500; i++) stepNodes(n, 300, 200, null, { radius: 160, grid: 48, pull: 0.06 });
  n.forEach(p => { expect(p.x).toBeGreaterThanOrEqual(-1); expect(p.x).toBeLessThanOrEqual(301); });
});
test("heat es 1 bajo el puntero y 0 lejos", () => {
  const n = [{ x: 100, y: 100, vx: 0, vy: 0, heat: 0 }, { x: 900, y: 900, vx: 0, vy: 0, heat: 0 }];
  stepNodes(n, 1000, 1000, { x: 100, y: 100 }, { radius: 160, grid: 48, pull: 0.06 });
  expect(n[0].heat).toBeCloseTo(1, 1); expect(n[1].heat).toBe(0);
});
```

- [ ] **Step 2:** Correr `npm test`. Esperado: FAIL.
- [ ] **Step 3:** Implementar `lib/network.ts`.
- [ ] **Step 4:** Correr `npm test`. Esperado: PASS.
- [ ] **Step 5:** `HeroNetwork`, componente cliente con `aria-hidden`:
  - Dibuja con `devicePixelRatio` limitado a 2: líneas con `--blue` y alfa `0.28*t`, y con `--accent` cuando hay `heat`. Lee los colores de los tokens con `getComputedStyle`.
  - Corre el loop de rAF solo si `usePointerEffects()` es verdadero y `site.interactions.heroNetwork` está activo. Si no, dibuja un único frame estático (mobile o reduced motion).
  - Se pausa con `IntersectionObserver` y con `document.visibilitychange`.
  - Regenera los nodos con `ResizeObserver` y debounce de 150 ms.
  - En el cleanup cancela el rAF, desconecta los observers y quita los listeners.
  - Se monta del lado cliente y aparece con un fade de opacidad de 700 ms. No bloquea el LCP.
- [ ] **Step 6:** `Hero`, componente de servidor:
  - La etiqueta va en `Tag` mono con un punto de acento y el `h1` con `titleHighlight` en `text-accent`. Tamaño `clamp(2.5rem, 6vw, 5.5rem)`, `leading-[0.98]`, `tracking-[-0.045em]` y `max-w-[16ch]`.
  - Debajo van la bajada y los CTAs: "Hablemos", un `PillButton` dentro de `Magnetic`, y "Ver casos" como `GhostButton`.
  - Un degradado de `--bg` hacia transparente separa el texto de la red.
  - Parallax leve: un wrapper cliente aplica `transform` de ±6 px según la posición del puntero dentro del hero, solo en el modo interactivo.
  - `ServicesStrip` va abajo: 3 columnas con número mono que enlazan a `/servicios#<slug>`, y en mobile pasa a lista.
- [ ] **Step 7:** Revisar en el navegador a 320, 375, 768 y 1440 px (punto 4 de Review Focus): sin scroll horizontal y el canvas pausado al bajar. En la consola, ningún error. En Performance, ningún rAF activo con el hero fuera de vista.

### Task 6: Resto del Inicio — cierre de Fase (b)

**Files:**
- Create: `components/sections/{ServicesGrid,AudireFeature,AudireMockup,CasesList,CaseCard,Metrics,Testimonials,CtaBand}.tsx`
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `site`, `visibleMetrics`, `initials`, `SpotlightCard`, `Reveal` y `RevealItem`.
- Produces:
  - `<ServicesGrid detailed?: boolean>`: tarjetas spotlight; con `detailed` muestra `includes`, y cada tarjeta lleva `id={slug}`.
  - `<AudireFeature variant="teaser" | "full">`.
  - `<AudireMockup />`: el panel en código del boceto B, con datos ilustrativos rotulados como tales y `aria-hidden`.
  - `<CasesList variant="compact" | "full">` y `<CaseCard>`.
  - `<Metrics />`: devuelve `null` si `visibleMetrics` queda vacío.
  - `<Testimonials />`: iniciales en un círculo con borde, sin imágenes.
  - `<CtaBand title text />`.

- [ ] **Step 1:** Armar `app/page.tsx` en este orden: Hero, ServicesGrid, AudireFeature teaser (enlaza a `/servicios#audire`), CasesList compact (enlaza a `/casos`), Metrics, Testimonials y CtaBand. Cada sección dentro de `Reveal`. Antes, cargar la skill `impeccable` para el ritmo vertical y la jerarquía.
- [ ] **Step 2:** Correr `npm run lint` y `npm run build`, y revisar en el navegador a 375 y 1440 px: el bloque de métricas no aparece porque todas son `null`. **Resumir la Fase (b) al dueño.**

### Task 7: Página /servicios

**Files:**
- Create: `app/servicios/page.tsx`

- [ ] **Step 1:** Metadata (`title: "Servicios"` y description). Armar la página con: encabezado, `ServicesGrid detailed`, un separador visual claro de "Producto" y `<section id="audire">` con `AudireFeature variant="full"` y `AudireMockup`, más un comentario que diga que el bloque está listo para pasar a `/audire`. Cierra con CtaBand.
- [ ] **Step 2:** Correr `npm run build`. Esperado: limpio. En el navegador, `/servicios#audire` posiciona bien y no queda tapado por el navbar (`scroll-margin-top`).

### Task 8: Página /casos — cierre de Fase (c)

**Files:**
- Create: `app/casos/page.tsx`

- [ ] **Step 1:** Metadata. Por cada caso (`CasesList variant="full"`) se muestran cliente, problema, solución y resultado. Si el resultado es `null`, se muestra "Resultados en preparación" y no un número. Después van Testimonials y CtaBand.
- [ ] **Step 2:** Correr `npm run lint` y `npm run build` y revisar en el navegador a 320 y 1440 px. **Resumir la Fase (c) al dueño.**

### Task 9: Blog MDX — Fase (d)

**Files:**
- Create: `mdx-components.tsx`, `lib/blog.ts`, `content/blog/automatizar-documentacion.mdx`, `content/blog/seguridad-pymes.mdx`, `app/blog/page.tsx`, `app/blog/[slug]/page.tsx`, `components/blog/{PostCard,PlaceholderNotice}.tsx`
- Modify: `next.config.ts` (`createMDX` y `pageExtensions`)
- Test: `tests/blog.test.ts`

**Interfaces:**
- Cada `.mdx` exporta `export const meta = { title, description, date: "YYYY-MM-DD", tags: string[], placeholder: boolean }`. `@next/mdx` no parsea YAML frontmatter, por eso va como export.
- Produces (`lib/blog.ts`):
  - `type PostMeta = { slug: string; title: string; description: string; date: string; tags: string[]; placeholder: boolean }`
  - `POST_SLUGS: readonly string[]`
  - `getAllPosts(): Promise<PostMeta[]>`, ordenado por fecha descendente, con `import(\`@/content/blog/${slug}.mdx\`)`.
  - `sortPosts(p: PostMeta[]): PostMeta[]` (pura)
  - `indexablePosts(p: PostMeta[]): PostMeta[]`, que filtra `placeholder`.

- [ ] **Step 1: Escribir los tests que fallan**

```ts
const a = { slug:"a", title:"", description:"", date:"2026-01-01", tags:[], placeholder:false };
const b = { ...a, slug:"b", date:"2026-03-01", placeholder:true };
test("sortPosts más nuevo primero", () => expect(sortPosts([a,b]).map(p=>p.slug)).toEqual(["b","a"]));
test("indexablePosts excluye placeholders", () => expect(indexablePosts([a,b]).map(p=>p.slug)).toEqual(["a"]));
```

- [ ] **Step 2:** Correr `npm test`. Esperado: FAIL.
- [ ] **Step 3:** Implementar `lib/blog.ts`. Configurar MDX según `mdx.md` y estilar `mdx-components.tsx` con tokens (h2, h3, p, a, ul, code y blockquote con ancho de lectura de unos 68ch).
- [ ] **Step 4:** Correr `npm test`. Esperado: PASS.
- [ ] **Step 5:** Escribir 2 notas con `placeholder: true`, de 400–600 palabras, sin datos inventados. Cada una arranca con `<PlaceholderNotice />` ("Nota de ejemplo: reemplazar por contenido real").
- [ ] **Step 6:** `/blog` lista `PostCard`s en `SpotlightCard`. `/blog/[slug]` con `generateStaticParams` desde `POST_SLUGS`, `dynamicParams = false` y `params` async. `generateMetadata` devuelve `robots: { index: false }` cuando `placeholder` es verdadero.
- [ ] **Step 7:** Correr `npm run lint` y `npm run build`. Esperado: las 2 rutas aparecen como estáticas en la salida del build. **Resumir la Fase (d) al dueño.**

### Task 10: Contacto

**Files:**
- Create: `lib/contact.ts`, `app/api/contact/route.ts`, `components/contact/{ContactForm,WhatsAppButton}.tsx`, `app/contacto/page.tsx`, `.env.example`
- Test: `tests/contact.test.ts`

**Interfaces:**
- Produces (`lib/contact.ts`):
  - `type ContactInput = { name: string; email: string; message: string; company?: string /* honeypot */ }`
  - `type ContactErrors = Partial<Record<"name" | "email" | "message", string>>`
  - `validateContact(input: unknown): { ok: true; data: ContactInput } | { ok: false; errors: ContactErrors }`. Reglas: `name` de 2 a 80 caracteres tras trim; `email` con la regex `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` y hasta 120 caracteres; `message` de 10 a 2000. Los mensajes de error van en castellano.
  - `isSpam(input: ContactInput): boolean`, verdadero si `company` no está vacío.
- Route `POST /api/contact`:
  - JSON inválido: 400.
  - Validación fallida: 422 `{ errors }`.
  - Spam: 200 `{ ok: true }` silencioso.
  - Sin `process.env.CONTACT_PROVIDER_API_KEY`: 503 `{ error: "not_configured" }`.
  - Con la clave: `// TODO: conectar el proveedor de email (ej. Resend). Ver .env.example` y 200.
- Estados de `ContactForm`: `"idle" | "sending" | "success" | "error" | "unavailable"`.

- [ ] **Step 1: Escribir los tests que fallan**

```ts
test("valida campos", () => {
  const r = validateContact({ name: "A", email: "x", message: "corto" });
  expect(r.ok).toBe(false);
  if (!r.ok) expect(Object.keys(r.errors).sort()).toEqual(["email","message","name"]);
});
test("acepta un input correcto y recorta espacios", () => {
  const r = validateContact({ name: "  Ana  ", email: "ana@empresa.com", message: "Quiero digitalizar el taller." });
  expect(r).toEqual({ ok: true, data: { name: "Ana", email: "ana@empresa.com", message: "Quiero digitalizar el taller.", company: "" } });
});
test("honeypot", () => expect(isSpam({ name:"a", email:"a@a.co", message:"xxxxxxxxxx", company:"bot" })).toBe(true));
test("route: 503 sin proveedor", async () => {
  delete process.env.CONTACT_PROVIDER_API_KEY;
  const res = await POST(new Request("http://x/api/contact", { method: "POST", body: JSON.stringify({ name:"Ana", email:"ana@empresa.com", message:"Hola, quiero consultar." }) }));
  expect(res.status).toBe(503);
});
test("route: 422 con datos inválidos", async () => {
  const res = await POST(new Request("http://x/api/contact", { method: "POST", body: JSON.stringify({}) }));
  expect(res.status).toBe(422);
});
```

- [ ] **Step 2:** Correr `npm test`. Esperado: FAIL.
- [ ] **Step 3:** Implementar `lib/contact.ts` y el route handler.
- [ ] **Step 4:** Correr `npm test`. Esperado: PASS.
- [ ] **Step 5:** `ContactForm`, componente cliente:
  - Valida con `validateContact` en el blur y en el submit, y muestra errores por campo con `aria-invalid` y `aria-describedby`.
  - Mientras envía, el botón queda deshabilitado (evita el doble envío, punto 2 de Review Focus) y el estado se anuncia por `aria-live="polite"`.
  - Un 200 lleva a "success": mensaje de gracias y botón para enviar otro.
  - Un 503 lleva a "unavailable": "El formulario todavía no está activo, escribinos por WhatsApp o a contacto@serdigital.com.ar", con los dos botones.
  - Un error de red u otro status lleva a "error", con reintento.
  - Inputs de 16 px o más para que iOS no haga zoom, y el honeypot oculto con `sr-only`, `tabIndex={-1}` y `autoComplete="off"`.
- [ ] **Step 6:** `/contacto`: formulario a la izquierda; a la derecha, `WhatsAppButton` (`whatsappUrl` con `site.contact.whatsappMessage`), email, `formatAddress`, horario y coverage. En mobile se apilan. El `.env.example` lleva `CONTACT_PROVIDER_API_KEY=` y `CONTACT_TO_EMAIL=`.
- [ ] **Step 7:** En el navegador, enviar sin clave: aparece el estado "unavailable". Enviar vacío: aparecen errores por campo y el foco va al primero.

### Task 11: Redirecciones y SEO — cierre de Fase (e) y entrega

**Files:**
- Create: `lib/seo.ts`, `app/{opengraph-image.tsx,sitemap.ts,robots.ts,manifest.ts,icon.svg}`
- Modify: `next.config.ts`, `app/layout.tsx`, la metadata de cada página
- Test: `tests/redirects.test.ts`

**Interfaces:**
- Produces: `export const REDIRECTS` en `next.config.ts` (o en `lib/redirects.ts`, importado por la config), con las 5 reglas de la sección 12 del spec y `permanent: true`.
- Produces (`lib/seo.ts`): `organizationJsonLd(site: SiteContent): object`, de tipo `ProfessionalService`, con `name`, `url`, `email`, `telephone: "+54 9 299 548 2790"`, `address` (con `streetAddress` solo si `showStreet`), `addressLocality: "Cipolletti"`, `addressRegion: "Río Negro"`, `addressCountry: "AR"`, `areaServed: ["Neuquén", "Río Negro", "Argentina"]`, `sameAs: [linkedin]` y `openingHours: "Mo-Fr 09:00-18:00"`.

- [ ] **Step 1: Escribir los tests que fallan**

```ts
test("redirects 301", () => {
  expect(REDIRECTS).toEqual([
    { source: "/consultoria-productos", destination: "/servicios", permanent: true },
    { source: "/consultoria-servicios", destination: "/servicios", permanent: true },
    { source: "/consultoria-contacto", destination: "/contacto", permanent: true },
    { source: "/blog-list", destination: "/blog", permanent: true },
    { source: "/w11", destination: "/", permanent: true },
  ]);
});
test("JSON-LD oculta la calle si showStreet es false", () => {
  const j = organizationJsonLd({ ...site, contact: { ...site.contact, showStreet: false } }) as any;
  expect(j.address.streetAddress).toBeUndefined();
  expect(j.areaServed).toEqual(["Neuquén","Río Negro","Argentina"]);
});
```

- [ ] **Step 2:** Correr `npm test`. Esperado: FAIL.
- [ ] **Step 3:** Implementar `REDIRECTS` y `organizationJsonLd`. Inyectar el JSON-LD en el layout con el reemplazo de `<` que usa el portafolio.
- [ ] **Step 4:** Correr `npm test`. Esperado: PASS.
- [ ] **Step 5:** Completar la metadata y los archivos de SEO:
  - Metadata con `title`, `description`, `alternates.canonical` y `openGraph` en cada página.
  - `opengraph-image.tsx` con tipografía grande sobre `--bg` y el Logo o texto (params async, Next 16).
  - `sitemap.ts` con las rutas estáticas más `indexablePosts`.
  - `robots.ts` que permite todo y apunta al sitemap.
  - `manifest.ts` con `theme_color #0D131A` y un `icon.svg` provisorio.
- [ ] **Step 6:** Correr `npm run lint`, `npm run build` y `npm test` (los tres limpios). Con `npm run start`, verificar:
  - `curl -I localhost:3000/w11` devuelve `308` o `301` con `location: /`. Next usa 308 para `permanent`, que equivale a 301 para SEO; se le avisa al dueño.
  - `/sitemap.xml` no incluye las notas placeholder.
  - Lighthouse móvil sobre `/` y `/contacto`: performance y accesibilidad 90 o más. Si no llega, corregir antes de cerrar.
- [ ] **Step 7:** Barrido final a 320 px en las 5 rutas (punto 4 de Review Focus). Después, entregar al dueño el resumen de la Fase (e) y las dos listas de la sección 14 del spec: **qué podés cambiar fácilmente y dónde** (tokens en `app/globals.css`, fuentes en `app/layout.tsx`, textos e interacciones en `content/site.ts`, logo, métricas, notas) y **TODO pendientes de tu parte**.
