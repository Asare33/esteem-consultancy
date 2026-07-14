import path from "path";
import fs from "fs";
import { randomUUID } from "crypto";

/** Vercel project FS is read-only; persist uploads in /tmp (ephemeral per instance). */
const UPLOAD_DIR = process.env.VERCEL
  ? path.join("/tmp", "esteem-uploads")
  : path.join(/* turbopackIgnore: true */ process.cwd(), "public", "uploads");

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

export async function saveUpload(
  file: File,
  subfolder?: string,
  options?: { asDataUrl?: boolean }
): Promise<{ filename: string; path: string }> {
  const error = validateImageFile(file);
  if (error) throw new Error(error);

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const safeExt = ["jpg", "jpeg", "png", "webp"].includes(ext) ? ext : "jpg";
  const filename = `${randomUUID()}.${safeExt}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  // Inventory images are stored as data URLs so the public catalogue can show
  // them from the DB without relying on the Vercel filesystem.
  const useDataUrl =
    options?.asDataUrl === true ||
    subfolder === "inventory" ||
    Boolean(process.env.VERCEL);

  if (useDataUrl) {
    const mime = file.type || (safeExt === "png" ? "image/png" : safeExt === "webp" ? "image/webp" : "image/jpeg");
    const pathData = `data:${mime};base64,${buffer.toString("base64")}`;
    return { filename, path: pathData };
  }

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

export function deleteUpload(publicPath: string) {
  if (!publicPath.startsWith("/uploads/") && !publicPath.startsWith("/api/uploads/")) return;
  const fullPath = resolveUploadPath(publicPath);
  if (fullPath && fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
}

export { UPLOAD_DIR, ALLOWED_TYPES, MAX_SIZE };
