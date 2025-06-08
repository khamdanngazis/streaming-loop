import path from "path";

export const CDN_PORT = Number(process.env.CDN_PORT) || 4000;
export const UPLOAD_DIR = path.resolve(process.env.UPLOAD_DIR || "./data/videos");
export const ALLOWED_VIDEO_MIME = [
  "video/mp4",
  "video/mpeg",
  "video/ogg",
  "video/webm",
  "video/x-matroska"
];
export const MAX_FILE_SIZE = 1024 * 1024 * 1024 * 2; // 2GB