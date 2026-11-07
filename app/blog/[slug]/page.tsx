import { ArrowLeftIcon } from "@phosphor-icons/react/dist/ssr";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import CtaBand from "@/components/sections/CtaBand";
import { Container } from "@/components/ui/Section";
import { getPost, isPostSlug, POST_SLUGS } from "@/lib/blog";
import BlogCover from "@/components/illustrations/BlogCover";
import BlurText from "@/components/ui/BlurText";
import { formatDate } from "@/lib/blog-utils";
import { site } from "@/content/site";
import { blogPostingJsonLd, breadcrumbJsonLd, pageMetadata, serializeJsonLd } from "@/lib/seo";

export function generateStaticParams() {
  return POST_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata(props: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  if (!isPostSlug(slug)) return {};
  const { meta } = await getPost(slug);
  return {
    ...pageMetadata({
      title: meta.title,
      description: meta.description,
      path: `/blog/${slug}`,
      article: { publishedTime: meta.date, tags: meta.tags },
    }),
    // Las notas de ejemplo no se indexan
    robots: meta.placeholder ? { index: false, follow: true } : undefined,
  };
}

// La página arma su estructura fija y la nota se resuelve dentro de un <Suspense>
// (Cache Components pide que los params se lean dentro de un límite de carga).
export default function PostPage(props: PageProps<"/blog/[slug]">) {
  return (
    <>
      <article className="pt-32 pb-20 md:pt-40">
        <Container className="max-w-[820px]">
          <Link
            href="/blog"
            className="group inline-flex items-center gap-2 text-sm text-muted transition-colors duration-200 hover:text-text"
          >
            <ArrowLeftIcon
              aria-hidden
              weight="bold"
              className="size-4 transition-transform duration-300 group-hover:-translate-x-0.5"
            />
            Volver al blog
          </Link>
          <Suspense fallback={<PostSkeleton />}>
            <PostBody params={props.params} />
          </Suspense>
        </Container>
      </article>
      <CtaBand animateTitle />
    </>
  );
}

async function PostBody({ params }: { params: PageProps<"/blog/[slug]">["params"] }) {
  const { slug } = await params;
  // Un slug que no está en la lista da 404
  if (!isPostSlug(slug)) notFound();
  const { meta, Content } = await getPost(slug);
  const jsonLd = [
    blogPostingJsonLd(site, meta),
    breadcrumbJsonLd(site, [
      { name: "Blog", path: "/blog" },
      { name: meta.title, path: `/blog/${slug}` },
    ]),
  ];
  return (
    <>
      {/* Las notas de ejemplo no llevan datos estructurados (no se indexan) */}
      {!meta.placeholder && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }} />
      )}
      <header className="mt-10">
        <p className="font-mono text-xs text-muted">
          <time dateTime={meta.date}>{formatDate(meta.date)}</time>
        </p>
        <BlurText
          as="h1"
          className="mt-4 text-[clamp(2.2rem,4.8vw,3.6rem)] leading-[1.05] font-semibold tracking-[-0.035em]"
          text={meta.title}
        />
        <p className="mt-5 text-xl leading-relaxed text-muted">{meta.description}</p>
        <BlogCover slug={slug} className="mt-10 max-w-[34rem]" />
      </header>
      <div className="mt-6 max-w-[68ch]">
        <Content />
      </div>
    </>
  );
}

function PostSkeleton() {
  return (
    <div aria-hidden className="mt-10 animate-pulse space-y-5">
      <div className="h-3 w-32 rounded bg-surface" />
      <div className="h-12 w-4/5 rounded bg-surface" />
      <div className="h-5 w-3/5 rounded bg-surface" />
    </div>
  );
}
