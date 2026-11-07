// Utilidades puras del blog (sin importar MDX, así se pueden testear).

export type PostMeta = {
  slug: string;
  title: string;
  description: string;
  /** Formato YYYY-MM-DD */
  date: string;
  tags: string[];
  /** true = nota de ejemplo: no se indexa en Google ni entra al sitemap */
  placeholder: boolean;
};

export function sortPosts(posts: PostMeta[]): PostMeta[] {
  return [...posts].sort((x, y) => y.date.localeCompare(x.date));
}

export function indexablePosts(posts: PostMeta[]): PostMeta[] {
  return posts.filter((p) => !p.placeholder);
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat("es-AR", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(
    new Date(`${date}T00:00:00Z`),
  );
}
