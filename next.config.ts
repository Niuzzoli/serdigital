import createMDX from "@next/mdx";
import type { NextConfig } from "next";
import { REDIRECTS } from "./lib/redirects";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // Las notas del blog son .mdx en content/blog
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  // Páginas del sitio anterior → nuevas rutas (ver lib/redirects.ts)
  async redirects() {
    return REDIRECTS;
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
