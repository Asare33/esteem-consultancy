import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-guard";
import { getDb, logActivity } from "@/lib/db";
import { deleteUpload } from "@/lib/upload";

export const runtime = "nodejs";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAdmin(request);
  if (error) return error;

  const { id } = await params;
  const imageId = parseInt(id, 10);
  const db = await getDb();
  const image = (await db.prepare("SELECT * FROM gallery_images WHERE id = ?").get(imageId)) as
    | { path: string }
    | undefined;

  if (!image) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await deleteUpload(image.path);
  await db.prepare("DELETE FROM gallery_images WHERE id = ?").run(imageId);
  await logActivity("delete", "gallery", imageId);

  return NextResponse.json({ ok: true });
}
