"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface NewsPost {
  id: number;
  title: string;
  content: string;
  image: string | null;
  status: "draft" | "published";
  created_at: string;
}

const emptyForm: { title: string; content: string; image: string; status: "draft" | "published" } = {
  title: "", content: "", image: "", status: "draft",
};

export default function AdminNewsPage() {
  const [posts, setPosts] = useState<NewsPost[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/news");
    const data = await res.json();
    setPosts(data.posts ?? []);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const uploadImage = async (file: File) => {
    setUploading(true);
    const formData = new FormData();
    formData.set("file", file);
    formData.set("folder", "news");
    const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
    const data = await res.json();
    setUploading(false);
    if (data.path) setForm((f) => ({ ...f, image: data.path }));
  };

  const save = async () => {
    const payload = { ...form, status: form.status };
    if (editingId) {
      await fetch(`/api/admin/news/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      await fetch("/api/admin/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
    load();
  };

  const edit = (post: NewsPost) => {
    setForm({
      title: post.title,
      content: post.content,
      image: post.image ?? "",
      status: post.status,
    });
    setEditingId(post.id);
    setShowForm(true);
  };

  const remove = async (id: number) => {
    if (!confirm("Delete this post?")) return;
    await fetch(`/api/admin/news/${id}`, { method: "DELETE" });
    load();
  };

  const togglePublish = async (post: NewsPost) => {
    await fetch(`/api/admin/news/${post.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: post.status === "published" ? "draft" : "published" }),
    });
    load();
  };

  return (
    <div>
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-slate-900">News & Updates</h1>
          <p className="text-slate-500">Create and manage website announcements</p>
        </div>
        <Button onClick={() => { setShowForm(true); setEditingId(null); setForm(emptyForm); }}>
          <Plus className="mr-2 h-4 w-4" /> New Post
        </Button>
      </div>

      {showForm && (
        <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-semibold">{editingId ? "Edit Post" : "Create Post"}</h2>
          <div className="space-y-4">
            <Input
              placeholder="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
            <Textarea
              placeholder="Content"
              rows={6}
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
            />
            <div className="flex flex-wrap items-center gap-4">
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => e.target.files?.[0] && uploadImage(e.target.files[0])}
              />
              {uploading && <span className="text-sm text-slate-400">Uploading...</span>}
              {form.image && (
                <div className="relative h-20 w-32 overflow-hidden rounded-lg">
                  <Image src={form.image} alt="Preview" fill className="object-cover" sizes="128px" />
                </div>
              )}
            </div>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as "draft" | "published" })}
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
            <div className="flex gap-2">
              <Button onClick={save}>Save</Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            {post.image && (
              <div className="relative h-24 w-32 shrink-0 overflow-hidden rounded-lg">
                <Image src={post.image} alt={post.title} fill className="object-cover" sizes="128px" />
              </div>
            )}
            <div className="flex-1">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-slate-900">{post.title}</h3>
                  <p className="mt-1 line-clamp-2 text-sm text-slate-500">{post.content}</p>
                  <p className="mt-2 text-xs text-slate-400">
                    {new Date(post.created_at).toLocaleDateString()} ·{" "}
                    <span className={post.status === "published" ? "text-green" : "text-amber-600"}>
                      {post.status}
                    </span>
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Button size="sm" variant="outline" onClick={() => edit(post)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => togglePublish(post)}>
                    {post.status === "published" ? "Unpublish" : "Publish"}
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => remove(post.id)}>
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {posts.length === 0 && (
          <p className="py-12 text-center text-slate-400">No news posts yet</p>
        )}
      </div>
    </div>
  );
}
