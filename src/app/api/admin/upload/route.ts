import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-guard";
import { saveUpload } from "@/lib/upload";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const { error } = await requireAdmin(request);
  if (error) return error;

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const folder = (formData.get("folder") as string) || "news";

    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

    const saved = await saveUpload(file, folder);
    return NextResponse.json({ ok: true, ...saved });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Upload failed" },
      { status: 400 }
    );
  }
}
