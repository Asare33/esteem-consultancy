import path from "path";
import fs from "fs";
import { randomUUID } from "crypto";
import { del, put } from "@vercel/blob";

/** Local/dev filesystem uploads (not used when Vercel Blob is configured). */
const UPLOAD_DIR = process.env.VERCEL
  ? path.join("/tmp", "esteem-uploads")
  : path.join(/* turbopackIgnore: true */ process.cwd(), "public", "uploads");

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export function isBlobConfigured() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

export function ensureUploadDir() {
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }
}

export function validateImageFile(file: File): string | null {
  if (!ALLOWED_TYPES.has(file.type)) {
    return "Only JPG, PNG, and WebP images are allowed.";
  }
  if (file.size > MAX_SIZE) {
    return "File size must be under 5MB.";
  }
  return null;
}

export async function saveUpload(
  file: File,
  subfolder?: string
): Promise<{ filename: string; path: string }> {
  const error = validateImageFile(file);
  if (error) throw new Error(error);

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const safeExt = ["jpg", "jpeg", "png", "webp"].includes(ext) ? ext : "jpg";
  const filename = `${randomUUID()}.${safeExt}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  const key = subfolder ? `uploads/${subfolder}/${filename}` : `uploads/${filename}`;

  if (isBlobConfigured()) {
    const blob = await put(key, buffer, {
      access: "public",
      contentType: file.type || `image/${safeExt === "jpg" ? "jpeg" : safeExt}`,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
    return { filename, path: blob.url };
  }

  // Local/dev: write under public/uploads (or /tmp on Vercel without Blob — ephemeral)
  ensureUploadDir();
  const dir = subfolder ? path.join(UPLOAD_DIR, subfolder) : UPLOAD_DIR;
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, filename), buffer);

  const publicPath = subfolder ? `/api/uploads/${subfolder}/${filename}` : `/api/uploads/${filename}`;
  return { filename, path: publicPath };
}

export function resolveUploadPath(publicPath: string): string | null {
  const normalized = publicPath
    .replace(/^\/api\/uploads\//, "")
    .replace(/^\/uploads\//, "");
  if (!normalized || normalized.includes("..")) return null;
  return path.join(UPLOAD_DIR, normalized);
}

export async function deleteUpload(publicPath: string) {
  if (publicPath.startsWith("https://") && isBlobConfigured()) {
    try {
      await del(publicPath, { token: process.env.BLOB_READ_WRITE_TOKEN });
    } catch (error) {
      console.error("Failed to delete blob:", error);
    }
    return;
  }

  if (!publicPath.startsWith("/uploads/") && !publicPath.startsWith("/api/uploads/")) return;
  const fullPath = resolveUploadPath(publicPath);
  if (fullPath && fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
}

export { UPLOAD_DIR, ALLOWED_TYPES, MAX_SIZE };
