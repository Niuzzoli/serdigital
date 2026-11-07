import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { site } from "@/content/site";

// Compartido por las imágenes para redes (app/opengraph-image.tsx y la de cada nota).
// Los colores están escritos acá porque estas imágenes no leen el CSS del sitio:
// si cambiás la paleta en globals.css, actualizalos también.
export const OG_SIZE = { width: 1200, height: 630 };
export const OG_COLORS = {
  background: "radial-gradient(circle at 85% 20%, #14304f 0%, #0d131a 55%)",
  text: "#e9eef4",
  muted: "#8c9aab",
  accent: "#ff5a1f",
};

/** Logo para fondo oscuro como data URI (o null si el sitio no tiene logo cargado). */
export async function ogLogo(height: number): Promise<{ src: string; width: number; height: number } | null> {
  if (!site.logo) return null;
  const data = await readFile(join(process.cwd(), "public", site.logo.srcDark));
  return {
    src: `data:image/png;base64,${data.toString("base64")}`,
    height,
    width: Math.round((height * site.logo.width) / site.logo.height),
  };
}
