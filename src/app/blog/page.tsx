import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { PageHeader } from "@/components/layout/page-header";
import { blogPosts, blogCategories } from "@/data/blog";
import { siteInfo } from "@/data/site";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Blog",
  description: `Insights on events, leadership, communication, and professional excellence from ${siteInfo.name}.`,
};

export default function BlogPage() {
  return (
    <>
      <PageHeader
        eyebrow="Blog"
        title="Insights & Inspiration"
        description="Expert perspectives on events, business, communication, leadership, and more."
      />
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mb-10 flex flex-wrap gap-2">
            {blogCategories.map((c) => (
              <Badge key={c.id} variant="outline" className="cursor-default px-4 py-2">
                {c.label}
              </Badge>
            ))}
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {blogPosts.map((post) => (
              <article key={post.slug} className="group overflow-hidden rounded-2xl shadow-lg transition hover:shadow-xl">
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover transition group-hover:scale-105"
                    sizes="400px"
                  />
                </div>
                <div className="p-6">
                  <Badge className="mb-2">{post.category}</Badge>
                  <h2 className="font-display text-xl font-semibold text-gray">
                    <Link href={`/blog/${post.slug}`} className="hover:text-green">
                      {post.title}
                    </Link>
                  </h2>
                  <p className="mt-2 text-sm text-gray-muted line-clamp-3">{post.excerpt}</p>
                  <div className="mt-4 flex items-center justify-between text-xs text-gray-muted">
                    <span>{post.author}</span>
                    <time dateTime={post.publishedAt}>{new Date(post.publishedAt).toLocaleDateString("en-GH", { dateStyle: "medium" })}</time>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
