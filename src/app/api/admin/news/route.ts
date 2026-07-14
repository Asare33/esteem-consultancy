import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin-guard";
import { getDb, logActivity } from "@/lib/db";

export const runtime = "nodejs";

const newsSchema = z.object({
  title: z.string().min(3),
  content: z.string().min(10),
  image: z.string().optional(),
  status: z.enum(["draft", "published"]).optional(),
});

export async function GET(request: NextRequest) {
  const { error } = await requireAdmin(request);
  if (error) return error;

  const posts = await (await getDb())
    .prepare("SELECT * FROM news_posts ORDER BY created_at DESC")
    .all();

  return NextResponse.json({ posts });
}

export async function POST(request: NextRequest) {
  const { error } = await requireAdmin(request);
  if (error) return error;

  try {
    const body = newsSchema.parse(await request.json());
    const db = await getDb();
    const result = await db
      .prepare(
        "INSERT INTO news_posts (title, content, image, status) VALUES (?, ?, ?, ?)"
      )
      .run(body.title, body.content, body.image ?? null, body.status ?? "draft");

    await logActivity("create", "news", Number(result.lastInsertRowid), body.title);
    const post = await db.prepare("SELECT * FROM news_posts WHERE id = ?").get(result.lastInsertRowid);
    return NextResponse.json({ ok: true, post }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid news data" }, { status: 400 });
  }
}
