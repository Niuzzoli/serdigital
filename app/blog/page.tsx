import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import PostCard from "@/components/blog/PostCard";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { Container, SectionHeading } from "@/components/ui/Section";
import { getAllPosts } from "@/lib/blog";

export const metadata: Metadata = pageMetadata({
  title: "Blog",
  description: "Notas sobre digitalización de procesos, gestión documental y seguridad informática para empresas.",
  path: "/blog",
});

export default async function BlogPage() {
  const posts = await getAllPosts();
  return (
    <Container className="pt-36 pb-24 md:pt-44 md:pb-32">
      <SectionHeading
          as="h1"
          title="Blog"
          lead="Ideas prácticas para digitalizar procesos y proteger la información de tu empresa."
        />
      {posts.length === 0 ? (
        <p className="mt-14 text-muted">Todavía no hay notas publicadas.</p>
      ) : (
        <RevealGroup className="mt-14 grid gap-4 md:grid-cols-2">
          {posts.map((post) => (
            <RevealItem key={post.slug}>
              <PostCard post={post} />
            </RevealItem>
          ))}
        </RevealGroup>
      )}
    </Container>
  );
}
