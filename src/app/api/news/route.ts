import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  const posts = getDb()
    .prepare("SELECT id, title, content, image, created_at FROM news_posts WHERE status = 'published' ORDER BY created_at DESC")
    .all();

  return NextResponse.json({ posts });
}
