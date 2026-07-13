"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { PageHeader } from "@/components/layout/page-header";

interface NewsPost {
  id: number;
  title: string;
  content: string;
  image: string | null;
  created_at: string;
}

export default function NewsPage() {
  const [posts, setPosts] = useState<NewsPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/news")
      .then((r) => r.json())
      .then((d) => setPosts(d.posts ?? []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <PageHeader
        eyebrow="News & Updates"
        title="Latest from Esteem"
        description="Announcements, event highlights, and company updates."
      />
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-4 lg:px-8">
          {loading && <p className="text-center text-gray-muted">Loading updates...</p>}
          {!loading && posts.length === 0 && (
            <p className="text-center text-gray-muted">No updates published yet. Check back soon.</p>
          )}
          <div className="space-y-8">
            {posts.map((post) => (
              <article key={post.id} className="overflow-hidden rounded-2xl border border-border bg-background shadow-lg">
                {post.image && (
                  <div className="relative h-56 w-full">
                    <Image src={post.image} alt={post.title} fill className="object-cover" sizes="800px" />
                  </div>
                )}
                <div className="p-6 md:p-8">
                  <time dateTime={post.created_at} className="text-sm text-green">
                    {new Date(post.created_at).toLocaleDateString("en-GH", { dateStyle: "long" })}
                  </time>
                  <h2 className="mt-2 font-display text-2xl font-bold text-gray">{post.title}</h2>
                  <div className="mt-4 whitespace-pre-line text-gray-muted leading-relaxed">{post.content}</div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
