import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin-guard";
import { getDb, logActivity } from "@/lib/db";
import { deleteUpload } from "@/lib/upload";

export const runtime = "nodejs";

const updateSchema = z.object({
  title: z.string().min(3).optional(),
  content: z.string().min(10).optional(),
  image: z.string().nullable().optional(),
  status: z.enum(["draft", "published"]).optional(),
});

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAdmin(request);
  if (error) return error;

  const { id } = await params;
  const postId = parseInt(id, 10);

  try {
    const body = updateSchema.parse(await request.json());
    const db = await getDb();
    const existing = (await db.prepare("SELECT * FROM news_posts WHERE id = ?").get(postId)) as
      | { image: string | null }
      | undefined;

    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const fields: string[] = [];
    const values: unknown[] = [];

    for (const [key, value] of Object.entries(body)) {
      if (value !== undefined) {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    }

    if (fields.length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }

    fields.push("updated_at = datetime('now')");
    values.push(postId);

    await db.prepare(`UPDATE news_posts SET ${fields.join(", ")} WHERE id = ?`).run(...values);
    await logActivity("update", "news", postId, JSON.stringify(body));

    const updated = await db.prepare("SELECT * FROM news_posts WHERE id = ?").get(postId);
    return NextResponse.json({ ok: true, post: updated });
  } catch {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAdmin(request);
  if (error) return error;

  const { id } = await params;
  const postId = parseInt(id, 10);
  const db = await getDb();
  const post = (await db.prepare("SELECT * FROM news_posts WHERE id = ?").get(postId)) as
    | { image: string | null }
    | undefined;

  if (
    post?.image &&
    (post.image.startsWith("/uploads/") ||
      post.image.startsWith("/api/uploads/") ||
      post.image.startsWith("https://"))
  ) {
    await deleteUpload(post.image);
  }

  await db.prepare("DELETE FROM news_posts WHERE id = ?").run(postId);
  await logActivity("delete", "news", postId);

  return NextResponse.json({ ok: true });
}
