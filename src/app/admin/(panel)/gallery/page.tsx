"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Album {
  id: number;
  name: string;
  slug: string;
}

interface GalleryImage {
  id: number;
  album_id: number;
  path: string;
  alt: string | null;
  album_name: string;
  album_slug: string;
}

export default function AdminGalleryPage() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [albumId, setAlbumId] = useState("");
  const [files, setFiles] = useState<FileList | null>(null);
  const [uploading, setUploading] = useState(false);
  const [filterAlbum, setFilterAlbum] = useState("");

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/gallery");
    const data = await res.json();
    setAlbums(data.albums ?? []);
    setImages(data.images ?? []);
    if (!albumId && data.albums?.[0]) setAlbumId(String(data.albums[0].id));
  }, [albumId]);

  useEffect(() => {
    load();
  }, [load]);

  const upload = async () => {
    if (!files || !albumId) return;
    setUploading(true);
    const formData = new FormData();
    formData.set("album_id", albumId);
    for (const file of Array.from(files)) {
      formData.append("files", file);
    }
    await fetch("/api/admin/gallery", { method: "POST", body: formData });
    setFiles(null);
    setUploading(false);
    load();
  };

  const remove = async (id: number) => {
    if (!confirm("Delete this image?")) return;
    await fetch(`/api/admin/gallery/${id}`, { method: "DELETE" });
    load();
  };

  const filtered = filterAlbum
    ? images.filter((i) => i.album_slug === filterAlbum)
    : images;

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-slate-900">Gallery Manager</h1>
        <p className="text-slate-500">Upload and organize photos by album</p>
      </div>

      <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 font-semibold text-slate-900">Upload Images</h2>
        <div className="flex flex-wrap gap-4">
          <select
            value={albumId}
            onChange={(e) => setAlbumId(e.target.value)}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
          >
            {albums.map((a) => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={(e) => setFiles(e.target.files)}
            className="text-sm"
          />
          <Button onClick={upload} disabled={uploading || !files}>
            <Upload className="mr-2 h-4 w-4" />
            {uploading ? "Uploading..." : "Upload"}
          </Button>
        </div>
        <p className="mt-2 text-xs text-slate-400">JPG, PNG, WebP · Max 5MB each</p>
      </div>

      <div className="mb-4">
        <select
          value={filterAlbum}
          onChange={(e) => setFilterAlbum(e.target.value)}
          className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
        >
          <option value="">All albums</option>
          {albums.map((a) => (
            <option key={a.slug} value={a.slug}>{a.name}</option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filtered.map((img) => (
          <div key={img.id} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="relative aspect-square">
              <Image src={img.path} alt={img.alt ?? img.album_name} fill className="object-cover" sizes="250px" />
            </div>
            <div className="p-3">
              <p className="text-xs font-medium text-slate-700">{img.album_name}</p>
              <button
                onClick={() => remove(img.id)}
                className="mt-2 flex items-center gap-1 text-xs text-red-600 hover:underline"
              >
                <Trash2 className="h-3 w-3" /> Delete
              </button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="col-span-full py-12 text-center text-slate-400">No images uploaded yet</p>
        )}
      </div>
    </div>
  );
}
