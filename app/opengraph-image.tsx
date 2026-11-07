import { ImageResponse } from "next/og";
import { site } from "@/content/site";
import { OG_COLORS, OG_SIZE, ogLogo } from "@/lib/og";

// Imagen para compartir en redes (1200x630), generada en código con la paleta del sitio.
export const alt = `${site.name}: consultora de transformación digital`;
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function OpengraphImage() {
  const { hero } = site;
  const logo = await ogLogo(64);
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
          <div style={{ fontSize: 34, fontWeight: 700, letterSpacing: -1 }}>{site.name}</div>
        )}
        <div style={{ display: "flex", flexWrap: "wrap", fontSize: 68, fontWeight: 700, lineHeight: 1.05, letterSpacing: -2, maxWidth: 1000 }}>
          {hero.titleBefore}
          <span style={{ color: OG_COLORS.accent, margin: "0 16px" }}>{hero.titleHighlight}</span>
          {hero.titleAfter}
        </div>
        <div style={{ fontSize: 26, color: OG_COLORS.muted }}>serdigital.com.ar</div>
      </div>
    ),
    size,
  );
}
