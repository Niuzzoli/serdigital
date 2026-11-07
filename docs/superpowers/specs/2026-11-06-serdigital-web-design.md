# Serdigital — Rediseño del sitio web (documento de diseño)

Fecha: 2026-11-06 · Fuente principal: `prompt.txt` (en la raíz del proyecto) + conversación de brainstorming.

## 1. Intención y por qué

Serdigital es una consultora de transformación digital del Alto Valle (Cipolletti, Río Negro). Su sitio actual (serdigital.com.ar) está hecho en Hostinger Website Builder, se ve genérico y tiene 6 páginas con nombres confusos. El dueño quiere una **base sólida, moderna y pulida** sobre la que después iterar él mismo con ajustes chicos. Por eso todo lo editable (textos, colores, tipografías, interacciones, métricas) tiene que estar centralizado y ser obvio de encontrar.

La meta comercial es **generar confianza y ventas** en empresas de Neuquén, Río Negro y el resto del país: un sitio que se sienta serio, claro y técnicamente cuidado, sin inventar nada.

## 2. Objetivos, no-objetivos, anti-objetivos

**Objetivos**
- Sitio nuevo con el sitemap de la sección 5, en Next.js (App Router) + TypeScript + Tailwind + Motion.
- Misma sensación de pulido que el portafolio del dueño (`D:\Dev\Pruebas con claude code\portafolio-web-niuzzoli`), reutilizando su enfoque y componentes.
- Responsive real (mobile primero), accesible, SEO completo, Lighthouse 90+ en performance y accesibilidad.
- `npm run build` y `npm run lint` limpios al final de cada fase.

**No-objetivos (por ahora)**
- Landing propia de Audire (solo se deja preparado el espacio).
- CMS o base de datos: el blog es MDX local.
- Conectar un proveedor real de email (queda TODO en el route handler).
- Modo claro (el tema es oscuro por defecto; los tokens quedan listos para agregarlo después, pero no se construye).

**Anti-objetivos (sería un fracaso aunque funcione)**
- "Scroll world": nada de scroll secuestrado, smooth-scroll tipo Lenis, secciones pineadas ni scroll horizontal forzado. El scroll es nativo.
- Inventar métricas, clientes, logos o testimonios. El "150+ clientes" del sitio viejo **no** se usa.
- Fotos o avatares de stock.
- Una dirección falsa en Neuquén.
- Animaciones que causen layout shift o que no respeten `prefers-reduced-motion`.
- Que cambiar un color o un texto requiera tocar varios archivos.

## 3. Restricciones

- **Stack:** Next.js App Router + TypeScript + Tailwind CSS v4 + `motion` (framer-motion). Prohibido GSAP y Lenis. Sin librerías pesadas.
- **Versión de Next:** usar la misma línea que el portafolio (Next 16.x, React 19). El portafolio tiene un `AGENTS.md` que advierte que esta versión de Next tiene cambios incompatibles con lo conocido: **antes de escribir código, leer las guías en `node_modules/next/dist/docs/`** del proyecto nuevo y respetar las deprecaciones.
- **Deploy:** Vercel.
- **Sin credenciales en el código.**
- **Idioma:** español rioplatense neutro, profesional, claro, directo. `lang="es-AR"`.

## 4. Decisiones visuales (tomadas con el dueño)

### Paleta (extraída del sitio actual, validada en bocetos)
| Token | Valor | Origen / uso |
|---|---|---|
| `--bg` | `#0D131A` | Fondo azul noche del sitio actual |
| `--bg-2` | `#111A24` | Fondo alterno de secciones |
| `--surface` | `#152130` | Tarjetas y superficies |
| `--line` | `rgba(176,196,222,.12)` | Bordes sutiles |
| `--text` | `#E9EEF4` | Texto principal |
| `--muted` | `#8C9AAB` | Texto secundario (verificar contraste AA sobre `--bg` y `--surface`) |
| `--accent` | `#FF5A1F` | **Único acento**: CTAs, foco, brillos, nodos activos. Derivado del `#FF4500` de marca |
| `--accent-ink` | `#1A0A03` | Texto sobre el acento |
| `--blue` | `#176BE0` | Azul de marca, **solo como apoyo**: líneas de la red del hero, spotlight de tarjetas, detalles mono. Nunca compite con el acento |

El violeta del sitio viejo se descarta.

### Tipografía
- **Una sola familia:** Bricolage Grotesque (Google Fonts vía `next/font`, con eje óptico `opsz`) para títulos y cuerpo.
- **Mono:** JetBrains Mono para numeración, etiquetas, datos y detalles técnicos.
- Ambas se definen como variables (`--font-sans`, `--font-mono`) en un solo lugar.

### Hero (dirección "A con tipografía de B")
- Composición editorial alineada a la izquierda.
- Arriba, una etiqueta mono con un punto naranja: "Consultora de transformación digital · Alto Valle".
- Título grande: "Digitalizamos procesos para que tu empresa **decida y opere** más rápido." ("decida y opere" en acento).
- Bajada: consultoría, software a medida y seguridad informática (texto en `content/site.ts`).
- CTAs: "Hablemos" (pastilla naranja magnética → /contacto) y "Ver casos" (botón de borde → /casos).
- Canvas de red de nodos/líneas en la mitad derecha que se funde hacia el texto con un degradado. Líneas en azul; los nodos cerca del cursor se encienden en naranja y se "ordenan" hacia una grilla (metáfora de procesos que se ordenan).
- Abajo, una franja de 3 columnas con los servicios numerados (01–03) que lleva a /servicios. En mobile pasa a lista.
- Parallax muy leve (pocos px, según el puntero) en la etiqueta y el título. Solo desktop con puntero fino.
- Referencia visual: `.superpowers/brainstorm/397-1793984286/content/paleta-y-hero.html` (opción A). El script de canvas de ese boceto es un punto de partida válido.

### Mockup de Audire en código
El panel de interfaz del boceto B (legajos, vencimientos, auditoría, barra de cumplimiento) se reutiliza como componente `AudireMockup` para la sección destacada de Audire en /servicios y en su caso de éxito. Datos visibles claramente ilustrativos (sin cifras que parezcan métricas reales).

### Logo
Componente `Logo` con un lugar fijo en la navbar, el footer y la imagen OG. Mientras no haya logo, muestra el texto "Serdigital" con un marcador discreto. Cuando exista, el dueño copia el archivo a `public/brand/` y cambia **una sola línea** en `content/site.ts` (por ejemplo `logo: { src: "/brand/logo.svg", width, height } | null`).

## 5. Sitemap y contenido

Menú de 4 ítems: **Servicios, Casos, Blog, Contacto** (Contacto como botón destacado). Footer con datos de contacto.

| Ruta | Contenido |
|---|---|
| `/` | Hero · franja de servicios · resumen de servicios (3 tarjetas con spotlight) · Audire destacado (teaser → /servicios#audire) · casos (2 tarjetas → /casos) · bloque de métricas (valores TODO) · franja de testimonios · CTA final |
| `/servicios` | Los 3 servicios a medida, cada uno con detalle de qué incluye y cómo se trabaja · **sección destacada aparte para Audire como producto** (ancla `#audire`, armada como bloque autocontenido para poder moverla después a `/audire`) · CTA |
| `/casos` | Casos de Audire y Transporte Tortoriello, cada uno con cliente, problema, solución y resultado (resultados numéricos como TODO) · testimonios · CTA |
| `/blog` | Listado de notas MDX |
| `/blog/[slug]` | Detalle de la nota (generación estática) |
| `/contacto` | Formulario + botón de WhatsApp + datos de contacto |

### Criterio servicio vs producto
- **Servicio** = se hace a medida con el cliente: Consultoría de digitalización ágil, Desarrollo de software a medida, Seguridad informática.
- **Producto** = algo que ya existe y se contrata. Hoy solo **Audire**: plataforma de gestión documental de personal, flota y contratos, con auditoría de la documentación requerida según la normativa de cada vertical.

### Casos
- **Audire:** caso propio/producto.
- **Transporte Tortoriello:** digitalización de logística, taller, pañol y RRHH, con integración de datos transversales.
- Los resultados sin dato quedan como `TODO` visibles en el contenido (no en pantalla como números falsos). En pantalla se muestra un texto neutro o el bloque se oculta si el valor es `null`.

### Testimonios (textos reales, sin avatares; se usan iniciales)
- "La consultora Ser Digital transformó nuestros procesos, mejorando la eficiencia y facilitando la toma de decisiones." — Rodrigo Iparraguirre
- "Gracias a Ser Digital, implementamos soluciones ágiles que optimizaron nuestro trabajo y aumentaron nuestra productividad." — Federico Mazzei

### Métricas
Bloque con valores `TODO` fáciles de editar en `content/site.ts`. Mientras un valor sea `null`, la métrica no se renderiza. Si todas son `null`, el bloque entero se oculta, para no mostrar "TODO" en producción.

### Blog
2 notas de ejemplo en MDX, marcadas claramente como placeholder: en el frontmatter (`placeholder: true`) y con un aviso visible en la nota. Tema a criterio del builder, relacionado con digitalización y seguridad.

### Datos reales de contacto
- Email: contacto@serdigital.com.ar
- WhatsApp: +54 9 299 548 2790 (link `wa.me/5492995482790` con mensaje prellenado)
- Dirección: Mengelle 748, Cipolletti, Río Negro (Argentina). Es el domicilio del dueño, así que la calle va en un campo propio de `content/site.ts` y se puede ocultar dejando solo "Cipolletti, Río Negro".
- Horario: lunes a viernes de 9 a 18 h
- LinkedIn: https://www.linkedin.com/in/danieliuzzolino/
- Línea de cobertura: "Trabajamos con empresas de Neuquén, Río Negro y todo el país."

### Ubicación y SEO local (decisión tomada para generar confianza)
No se declara sede en Neuquén. El hero usa "Alto Valle". El JSON-LD de `Organization` (o `ProfessionalService`) lleva la dirección real de Cipolletti y `areaServed`: Neuquén, Río Negro, Argentina.

## 6. Contenido centralizado

`content/site.ts` concentra todo lo editable: textos del hero, servicios, Audire, casos, testimonios, métricas, datos de contacto, menú, logo, metadata base (nombre, descripción, URL `https://serdigital.com.ar`). Tipado con TypeScript para que el dueño no rompa la forma de los datos. El blog vive en `content/blog/*.mdx`.

## 7. Tokens de diseño

Todo color, tipografía, radio, sombra, easing y duración se define una sola vez en `app/globals.css` (variables CSS + `@theme` de Tailwind v4). Ningún componente usa hex sueltos.

- **Easing único:** `cubic-bezier(0.22, 1, 0.36, 1)` (el mismo del portafolio), exportado también como constante para Motion (`lib/motion.ts`).
- **Duraciones:** entre 300 y 700 ms. Desplazamientos cortos (8–24 px).

## 8. Interacciones

Todas se desactivan en dispositivos táctiles (`(hover: none)` / `(pointer: coarse)`) y con `prefers-reduced-motion`.

| Interacción | Origen | Detalle |
|---|---|---|
| Botón pastilla con flecha | **Reutilizar** `PillButton` del portafolio | Adaptado a tokens. CTA principal |
| Botón magnético | Nuevo | Envuelve el CTA principal. Atracción sutil (máx. ~6–8 px), con spring de Motion |
| Navbar con spotlight | **Reutilizar** `SpotlightNavbar` del portafolio | Luz que sigue al mouse en los 4 ítems. Se compacta y gana fondo con blur al scrollear |
| Tarjetas con spotlight | Nuevo | Brillo radial (azul/acento suave) que sigue al puntero mediante variables CSS. Sin re-render por movimiento |
| Parallax del hero | Nuevo | Muy leve, según el puntero |
| Microtransiciones | Nuevo | Links, menú y tarjetas (subrayado, flechas, elevación leve) |
| Cursor personalizado | Nuevo | Discreto, solo desktop. Se apaga con una constante (`ENABLE_CUSTOM_CURSOR` en `content/site.ts` o `lib/config.ts`). Sin ocultar el cursor nativo en campos de texto |

El portafolio no tenía cursor, botón magnético ni tarjetas con spotlight: se escriben desde cero con el mismo estilo de código (comentarios en castellano y props simples).

**Se deja afuera del portafolio:** Lenis, GSAP, tarjetas sticky apiladas, scroll horizontal con pin, intro de logo que bloquea el scroll, `Dither`, `TextLoop`.

## 9. Animaciones

- Aparición al entrar en viewport **una sola vez** (`whileInView`, `once: true`), con stagger leve en listas. Componente `Reveal` reutilizable.
- Transiciones de página discretas: fade + leve desplazamiento. Con App Router, usar `template.tsx` o el mecanismo que indiquen las docs de Next 16. No bloquear la navegación.
- Navbar: se compacta o cambia de fondo al pasar un umbral de scroll.
- Solo `transform` y `opacity`.
- Con `prefers-reduced-motion`, todo aparece sin desplazamiento (a lo sumo, fade corto).

## 10. Hero canvas (requisitos técnicos)

- Canvas 2D liviano (sin librerías), en un componente cliente.
- Densidad de nodos proporcional al área, con tope. `devicePixelRatio` limitado a 2.
- Se **pausa** con `IntersectionObserver` cuando no está visible y con `visibilitychange` cuando la pestaña está oculta.
- **Fallback estático** (un solo frame dibujado o un SVG/CSS equivalente) en mobile o puntero táctil y con `prefers-reduced-motion`.
- Reacción suave al cursor: ilumina y ordena los nodos cercanos.
- No debe afectar LCP: el título del hero es el elemento LCP y se renderiza en el servidor. El canvas se monta después, sin bloquear.
- Se limpia al desmontar (listeners, rAF, observers).

## 11. Contacto

- Formulario: nombre, email y mensaje. Validación en cliente y en servidor (mismo esquema). Estados: inactivo, enviando, éxito y error, con mensajes claros y accesibles (`aria-live`).
- Envío a `app/api/contact/route.ts` (route handler). Valida y responde. Tiene un **TODO claro** para conectar el servicio de email (Resend u otro), con las variables de entorno documentadas en `.env.example` sin valores.
- Anti-spam liviano: un campo honeypot.
- Botón directo a WhatsApp con mensaje prellenado.

## 12. Redirecciones 301 (next.config)

| Desde | Hacia |
|---|---|
| `/consultoria-productos` | `/servicios` |
| `/consultoria-servicios` | `/servicios` |
| `/consultoria-contacto` | `/contacto` |
| `/blog-list` | `/blog` |
| `/w11` | `/` |

`permanent: true`.

## 13. Calidad, SEO y accesibilidad

- HTML semántico, un `h1` por página, foco visible (anillo en acento), contraste AA, navegación por teclado, menú mobile accesible (`aria-expanded`, cierre con Esc, bloqueo de foco).
- `next/image` para cualquier imagen.
- Metadata por página con template de título. Open Graph e imagen OG generada en código (`opengraph-image.tsx`, como en el portafolio). `sitemap.ts` (incluye las notas del blog), `robots.ts`, `manifest.ts`.
- JSON-LD de Organization en el layout. Opcional: `Article` en las notas del blog.
- Lighthouse 90+ en performance y accesibilidad (verificar en un build de producción).

## 14. Forma de trabajo (definida por el dueño)

Construir por fases. Al terminar cada una, correr `npm run build` y `npm run lint` y resumir lo hecho:
- (a) setup + tokens + layout + navbar/footer
- (b) Inicio con hero
- (c) Servicios y Casos
- (d) Blog con 2 notas placeholder
- (e) Contacto + redirecciones + SEO

Al final, entregar una lista corta de **"qué podés cambiar fácilmente y dónde"** (colores, tipografías, textos, interacciones, métricas, logo) y otra de **TODO pendientes del dueño** (métricas, resultados de casos, logo, proveedor de email, notas reales del blog, confirmar si se muestra la calle).

## 15. Lo que queda a criterio del builder

- Estructura exacta de carpetas y nombres de componentes, salvo `content/site.ts`, `Logo`, `PillButton` y `SpotlightNavbar`.
- Elección del paquete MDX (`@next/mdx` o `next-mdx-remote`, lo más liviano compatible con Next 16).
- Copys de apoyo no especificados (descripciones de servicios, bajada del hero, textos de Audire y de los casos), en el tono pedido y sin inventar datos.
- Temas de las 2 notas placeholder.
- Diseño interno de cada sección, siguiendo la dirección visual y las skills de diseño (emil-design-eng, impeccable, design-taste-frontend).

## 16. Decisiones que tomó Claude (para que el dueño las revise)

- El naranja `#FF4500` se ajusta a `#FF5A1F` para mejorar el contraste en el tema oscuro.
- El azul de marca queda como color de apoyo, no como segundo acento, y el violeta se descarta.
- Bricolage Grotesque se usa también para el cuerpo de texto (una sola familia).
- "Alto Valle" en el hero en lugar de "Neuquén". Dirección real en Cipolletti más `areaServed` con Neuquén.
- El mockup de Audire se reutiliza desde el boceto B.
- Las métricas y los resultados en `null` se ocultan en pantalla en vez de mostrar "TODO".
- Honeypot como anti-spam del formulario.
- **Formulario sin proveedor de email:** mientras la variable de entorno del proveedor no esté configurada, el route handler responde 503 y el formulario muestra un estado claro: "El formulario todavía no está activo, escribinos por WhatsApp o a contacto@serdigital.com.ar", con los dos botones. Nunca muestra "enviado" si el mensaje no salió, así el sitio puede publicarse antes de conectar el email sin perder consultas.
- **Notas placeholder del blog:** llevan `noindex` y quedan fuera de `sitemap.ts` mientras tengan `placeholder: true`.
- **Redirecciones 301:** activas desde el primer deploy (no molestan aunque el dominio siga en Hostinger).
- **Dirección en JSON-LD:** un solo campo `showStreet` en `content/site.ts` controla la calle en footer, contacto y `streetAddress`. Por defecto está en `true`, porque el dueño la dio como dato real. Si pasa a `false`, se muestra solo "Cipolletti, Río Negro" en todos lados.
- **Modelo de testimonio:** `{ quote, name, role?, company?, caseSlug? }`. Los campos opcionales permiten ponerlo junto a su caso cuando corresponda.
- **Datos de Audire, casos y testimonios (decisión del dueño: TODO por ahora):** rubros y normativas de Audire, módulos, demo o acceso, cliente real o producto propio, permiso para nombrar a Tortoriello, alcance concreto, y cargo y empresa de los testimonios. Todo queda como campos `TODO` u opcionales en `content/site.ts`. El copy usa solo lo que dice este documento. Audire se presenta como producto propio y su CTA lleva a /contacto. Los testimonios muestran solo el nombre y van en franja aparte, no ligados a un caso.
- **Fases:** al terminar cada una se corren build y lint, se resume lo hecho y se sigue con la próxima sin esperar OK, salvo que el dueño pida lo contrario.
