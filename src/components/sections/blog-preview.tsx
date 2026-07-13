import Link from "next/link";
import Image from "next/image";
import { blogPosts } from "@/data/blog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function BlogPreview() {
  const posts = blogPosts.filter((p) => p.featured).slice(0, 3);
  const display = posts.length > 0 ? posts : blogPosts.slice(0, 3);

  return (
    <section className="py-20 lg:py-28" aria-labelledby="blog-heading">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mb-12 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-green">Blog</p>
            <h2 id="blog-heading" className="mt-2 font-display text-3xl font-bold text-gray md:text-4xl">
              Insights &amp; Expertise
            </h2>
          </div>
          <Button asChild variant="outline">
            <Link href="/blog">Read All Articles</Link>
          </Button>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {display.map((post) => (
            <article key={post.slug} className="group overflow-hidden rounded-2xl shadow-lg">
              <div className="relative h-44 overflow-hidden">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover transition group-hover:scale-105"
                  sizes="400px"
                />
              </div>
              <div className="p-5">
                <Badge className="mb-2">{post.category}</Badge>
                <h3 className="font-display text-lg font-semibold text-gray">
                  <Link href={`/blog/${post.slug}`} className="hover:text-green">
                    {post.title}
                  </Link>
                </h3>
                <p className="mt-2 text-sm text-gray-muted line-clamp-2">{post.excerpt}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
