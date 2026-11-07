import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { getAllPosts } from "@/lib/blog";
import { indexablePosts } from "@/lib/blog-utils";

// Las notas de ejemplo (placeholder: true) quedan afuera hasta que tengan contenido real.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const indexable = indexablePosts(await getAllPosts());
  const pages = ["", "/servicios", "/casos", "/blog", "/contacto"].map((path) => ({
    url: `${site.url}${path}`,
    // El listado del blog cambia cuando sale una nota nueva (vienen ordenadas, la primera es la última)
    ...(path === "/blog" && indexable[0] && { lastModified: indexable[0].date }),
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : 0.8,
  }));
  const posts = indexable.map((p) => ({
    url: `${site.url}/blog/${p.slug}`,
    lastModified: p.date,
    changeFrequency: "yearly" as const,
    priority: 0.6,
  }));
  return [...pages, ...posts];
}
