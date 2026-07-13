import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { getBlogPostBySlug, getAllBlogSlugs, blogPosts } from "@/data/blog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllBlogSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) return { title: "Post Not Found" };
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: { title: post.title, description: post.excerpt, images: [post.image] },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) notFound();

  const related = blogPosts.filter((p) => p.slug !== slug && p.category === post.category).slice(0, 2);

  return (
    <>
      <PageHeader eyebrow={post.category} title={post.title} description={post.excerpt} />
      <article className="py-16">
        <div className="mx-auto max-w-3xl px-4 lg:px-8">
          <div className="relative mb-8 h-64 overflow-hidden rounded-2xl md:h-96">
            <Image src={post.image} alt={post.title} fill className="object-cover" priority sizes="800px" />
          </div>
          <div className="mb-6 flex items-center gap-4 text-sm text-gray-muted">
            <span>{post.author}</span>
            <time dateTime={post.publishedAt}>
              {new Date(post.publishedAt).toLocaleDateString("en-GH", { dateStyle: "long" })}
            </time>
            <Badge>{post.readTimeMinutes} min read</Badge>
          </div>
          <div className="prose prose-lg max-w-none text-gray-muted">
            {(post.content ?? post.excerpt).split("\n\n").map((para, i) => (
              <p key={i} className="mb-4 leading-relaxed">{para}</p>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="outline">{tag}</Badge>
            ))}
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section className="bg-muted py-16">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <h2 className="mb-8 font-display text-2xl font-bold text-gray">Related Articles</h2>
            <div className="grid gap-6 md:grid-cols-2">
              {related.map((p) => (
                <Link key={p.slug} href={`/blog/${p.slug}`} className="rounded-2xl bg-background p-6 shadow-sm hover:shadow-md">
                  <Badge className="mb-2">{p.category}</Badge>
                  <h3 className="font-semibold text-gray">{p.title}</h3>
                  <p className="mt-2 text-sm text-gray-muted line-clamp-2">{p.excerpt}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-16 text-center">
        <Button asChild size="lg"><Link href="/book-consultation">Book a Consultation</Link></Button>
      </section>
    </>
  );
}
