import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-guard";
import { getDb, logActivity } from "@/lib/db";
import { saveUpload } from "@/lib/upload";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const { error } = await requireAdmin(request);
  if (error) return error;

  const db = await getDb();
  const albums = await db.prepare("SELECT * FROM gallery_albums ORDER BY name").all();
  const images = await db
    .prepare(
      `SELECT gi.*, ga.name as album_name, ga.slug as album_slug
       FROM gallery_images gi
       JOIN gallery_albums ga ON ga.id = gi.album_id
       ORDER BY gi.created_at DESC`
    )
    .all();

  return NextResponse.json({ albums, images });
}

export async function POST(request: NextRequest) {
  const { error } = await requireAdmin(request);
  if (error) return error;

  try {
    const formData = await request.formData();
    const albumId = parseInt(formData.get("album_id") as string, 10);
    const alt = (formData.get("alt") as string) || "";
    const files = formData.getAll("files") as File[];

    if (!albumId || files.length === 0) {
      return NextResponse.json({ error: "Album and files required" }, { status: 400 });
    }

    const db = await getDb();
    const album = await db.prepare("SELECT * FROM gallery_albums WHERE id = ?").get(albumId);
    if (!album) return NextResponse.json({ error: "Album not found" }, { status: 404 });

    const inserted = [];

    for (const file of files) {
      if (!(file instanceof File) || file.size === 0) continue;
      const saved = await saveUpload(file, "gallery");
      const result = await db
        .prepare("INSERT INTO gallery_images (album_id, filename, path, alt) VALUES (?, ?, ?, ?)")
        .run(albumId, saved.filename, saved.path, alt || file.name);
      inserted.push({ id: result.lastInsertRowid, ...saved });
      await logActivity("upload", "gallery", Number(result.lastInsertRowid), saved.path);
    }

    return NextResponse.json({ ok: true, images: inserted }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Upload failed" },
      { status: 400 }
    );
  }
}
