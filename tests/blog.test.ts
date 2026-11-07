import { expect, test } from "vitest";
import { indexablePosts, sortPosts, type PostMeta } from "@/lib/blog-utils";

const a: PostMeta = { slug: "a", title: "", description: "", date: "2026-01-01", tags: [], placeholder: false };
const b: PostMeta = { ...a, slug: "b", date: "2026-03-01", placeholder: true };

test("sortPosts deja primero la más nueva", () => {
  expect(sortPosts([a, b]).map((p) => p.slug)).toEqual(["b", "a"]);
});

test("sortPosts no modifica el array original", () => {
  const list = [a, b];
  sortPosts(list);
  expect(list.map((p) => p.slug)).toEqual(["a", "b"]);
});

test("indexablePosts excluye las notas de ejemplo", () => {
  expect(indexablePosts([a, b]).map((p) => p.slug)).toEqual(["a"]);
});

test("isPostSlug reconoce solo las notas cargadas", async () => {
  const { isPostSlug } = await import("@/lib/blog");
  expect(isPostSlug("zoho-creator")).toBe(true);
  expect(isPostSlug("seguridad-pymes")).toBe(false);
  expect(isPostSlug("no-existe")).toBe(false);
});

test("el blog tiene las 4 notas reales y ninguna de ejemplo", async () => {
  const { POST_SLUGS } = await import("@/lib/blog");
  expect([...POST_SLUGS].sort()).toEqual([
    "ahorra-ya-con-odoo",
    "costos-ocultos-de-operar-un-negocio-con-excel",
    "factura-homologada",
    "zoho-creator",
  ]);
});
