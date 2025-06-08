import path from "path";

export function getSafeFilename(originalName: string): string {
  const ext = path.extname(originalName).replace(/[^a-zA-Z0-9.]/g, "");
  const base = path.basename(originalName, ext).replace(/[^a-zA-Z0-9_\-]/g, "");
  return `${Date.now()}-${Math.round(Math.random() * 1e9)}-${base}${ext}`;
}