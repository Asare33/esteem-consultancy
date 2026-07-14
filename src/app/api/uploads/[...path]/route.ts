import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { resolveUploadPath } from "@/lib/upload";

export const runtime = "nodejs";

const CONTENT_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path: segments } = await context.params;
  if (!segments?.length) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const publicPath = `/api/uploads/${segments.join("/")}`;
  const fullPath = resolveUploadPath(publicPath);

  if (!fullPath || !fs.existsSync(fullPath)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const ext = path.extname(fullPath).toLowerCase();
  const contentType = CONTENT_TYPES[ext] ?? "application/octet-stream";
  const buffer = fs.readFileSync(fullPath);

  return new NextResponse(buffer, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
