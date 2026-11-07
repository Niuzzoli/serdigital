import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import BlogCover from "@/components/illustrations/BlogCover";
import { hasBlogCover } from "@/lib/blog-covers";
import SpotlightCard from "@/components/ui/SpotlightCard";
import { formatDate, type PostMeta } from "@/lib/blog-utils";

export default function PostCard({ post }: { post: PostMeta }) {
  return (
    <SpotlightCard as="article" className="h-full">
      <Link href={`/blog/${post.slug}`} className="group flex h-full flex-col">
        {/* Portada ilustrada (components/illustrations/BlogCover.tsx) */}
        {hasBlogCover(post.slug) && (
          <div className="border-b border-line bg-bg-2/50 px-8 py-6 sm:px-12">
            <BlogCover slug={post.slug} className="mx-auto max-w-[24rem]" />
          </div>
        )}
        <div className="flex flex-1 flex-col p-6 sm:p-8">
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-muted">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          {post.placeholder && <span className="text-accent-text">Nota de ejemplo</span>}
        </p>
        <h2 className="mt-4 text-2xl leading-tight font-semibold tracking-[-0.025em]">{post.title}</h2>
        <p className="mt-3 line-clamp-3 leading-relaxed text-muted">{post.description}</p>
        <span className="mt-auto inline-flex items-center gap-2 pt-8 text-sm font-medium">
          Leer nota
          <ArrowRightIcon
            aria-hidden
            weight="bold"
            className="size-4 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1"
          />
        </span>
        </div>
      </Link>
    </SpotlightCard>
  );
}
