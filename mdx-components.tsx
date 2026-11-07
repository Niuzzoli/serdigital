import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import PlaceholderNotice from "@/components/blog/PlaceholderNotice";

// Estilos de las notas del blog (MDX). Todo sale de los tokens del sitio.
const components: MDXComponents = {
  h2: (props) => (
    <h2 className="mt-14 mb-4 text-[1.75rem] leading-tight font-semibold tracking-[-0.025em] text-text" {...props} />
  ),
  h3: (props) => <h3 className="mt-10 mb-3 text-xl leading-snug font-semibold text-text" {...props} />,
  p: (props) => <p className="my-5 text-lg leading-[1.75] text-text/85" {...props} />,
  ul: (props) => <ul className="my-5 list-disc space-y-2 pl-6 text-lg leading-[1.7] text-text/85 marker:text-accent" {...props} />,
  ol: (props) => <ol className="my-5 list-decimal space-y-2 pl-6 text-lg leading-[1.7] text-text/85 marker:text-muted" {...props} />,
  strong: (props) => <strong className="font-semibold text-text" {...props} />,
  blockquote: (props) => (
    <blockquote className="my-8 border-l border-line-strong pl-6 text-xl leading-relaxed text-text" {...props} />
  ),
  code: (props) => <code className="rounded bg-surface px-1.5 py-0.5 font-mono text-[0.9em]" {...props} />,
  a: ({ href = "", ...props }) =>
    href.startsWith("/") ? (
      <Link href={href} className="text-accent-text underline underline-offset-4" {...props} />
    ) : (
      <a href={href} target="_blank" rel="noopener noreferrer" className="text-accent-text underline underline-offset-4" {...props} />
    ),
  PlaceholderNotice,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
