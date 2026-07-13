import path from "path";
import fs from "fs";
import { randomUUID } from "crypto";

const UPLOAD_DIR = path.join(/* turbopackIgnore: true */ process.cwd(), "public", "uploads");
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

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

export async function saveUpload(file: File, subfolder?: string): Promise<{ filename: string; path: string }> {
  const error = validateImageFile(file);
  if (error) throw new Error(error);

  ensureUploadDir();

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const safeExt = ["jpg", "jpeg", "png", "webp"].includes(ext) ? ext : "jpg";
  const filename = `${randomUUID()}.${safeExt}`;

  const dir = subfolder ? path.join(UPLOAD_DIR, subfolder) : UPLOAD_DIR;
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const buffer = Buffer.from(await file.arrayBuffer());
  fs.writeFileSync(path.join(dir, filename), buffer);

  const publicPath = subfolder ? `/uploads/${subfolder}/${filename}` : `/uploads/${filename}`;
  return { filename, path: publicPath };
}

export function deleteUpload(publicPath: string) {
  if (!publicPath.startsWith("/uploads/")) return;
  const fullPath = path.join(/* turbopackIgnore: true */ process.cwd(), "public", publicPath.replace(/^\//, ""));
  if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
}

export { UPLOAD_DIR, ALLOWED_TYPES, MAX_SIZE };
