import { ImageResponse } from "next/og";
import { notFound } from "next/navigation";
import { site } from "@/content/site";
import { getPost, isPostSlug, POST_SLUGS } from "@/lib/blog";
import { formatDate } from "@/lib/blog-utils";
import { OG_COLORS, OG_SIZE, ogLogo } from "@/lib/og";

// Imagen para compartir cada nota: logo, título de la nota y fecha.
export const alt = `Nota del blog de ${site.name}`;
export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return POST_SLUGS.map((slug) => ({ slug }));
}

export default async function PostOgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!isPostSlug(slug)) notFound();
  const [{ meta }, logo] = await Promise.all([getPost(slug), ogLogo(52)]);
  // Títulos largos con letra más chica para que entren en 3 líneas
  const fontSize = meta.title.length > 60 ? 56 : 68;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: OG_COLORS.background,
          color: OG_COLORS.text,
        }}
      >
        {logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={logo.src} alt={site.name} height={logo.height} width={logo.width} />
        ) : (
          <div style={{ fontSize: 30, fontWeight: 700, letterSpacing: -1 }}>{site.name}</div>
        )}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 24, color: OG_COLORS.accent, textTransform: "uppercase", letterSpacing: 3 }}>Blog</div>
          <div style={{ display: "flex", fontSize, fontWeight: 700, lineHeight: 1.05, letterSpacing: -2, maxWidth: 1040 }}>
            {meta.title}
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 26, color: OG_COLORS.muted }}>
          <span>{formatDate(meta.date)}</span>
          <span>serdigital.com.ar</span>
        </div>
      </div>
    ),
    size,
  );
}
