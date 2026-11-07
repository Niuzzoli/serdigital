import type { ComponentType } from "react";
import { sortPosts, type PostMeta } from "./blog-utils";

// Para sumar una nota: creá content/blog/<slug>.mdx (con export const meta = {...})
// y agregá el slug a esta lista.
export const POST_SLUGS = [
  "ahorra-ya-con-odoo",
  "costos-ocultos-de-operar-un-negocio-con-excel",
  "factura-homologada",
  "zoho-creator",
] as const;

export function isPostSlug(slug: string): slug is (typeof POST_SLUGS)[number] {
  return (POST_SLUGS as readonly string[]).includes(slug);
}

type PostModule = { default: ComponentType; meta: Omit<PostMeta, "slug"> };

export async function getPost(slug: string): Promise<{ meta: PostMeta; Content: ComponentType }> {
  const mod = (await import(`@/content/blog/${slug}.mdx`)) as PostModule;
  return { meta: { slug, ...mod.meta }, Content: mod.default };
}

export async function getAllPosts(): Promise<PostMeta[]> {
  const posts = await Promise.all(POST_SLUGS.map(async (slug) => (await getPost(slug)).meta));
  return sortPosts(posts);
}
