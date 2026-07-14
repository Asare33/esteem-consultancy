import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const album = searchParams.get("album");

  const db = await getDb();

  let images;
  if (album) {
    images = await db
      .prepare(
        `SELECT gi.*, ga.name as album_name, ga.slug as album_slug
         FROM gallery_images gi
         JOIN gallery_albums ga ON ga.id = gi.album_id
         WHERE ga.slug = ?
         ORDER BY gi.created_at DESC`
      )
      .all(album);
  } else {
    images = await db
      .prepare(
        `SELECT gi.*, ga.name as album_name, ga.slug as album_slug
         FROM gallery_images gi
         JOIN gallery_albums ga ON ga.id = gi.album_id
         ORDER BY gi.created_at DESC`
      )
      .all();
  }

  const albums = await db.prepare("SELECT * FROM gallery_albums ORDER BY name").all();

  return NextResponse.json({ albums, images });
}
