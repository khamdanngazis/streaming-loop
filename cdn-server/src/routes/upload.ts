import { Router } from "express";
import multer from "multer";
import fs from "fs";
import { UPLOAD_DIR, ALLOWED_VIDEO_MIME, MAX_FILE_SIZE, CDN_PORT } from "../config";
import { getSafeFilename } from "../utils/fileUtils";
import { uploadRateLimiter } from "../middleware/rateLimit";

if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => cb(null, getSafeFilename(file.originalname)),
});
const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_VIDEO_MIME.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Invalid file type. Only video files allowed."));
  },
});

const router = Router();

router.post(
  "/upload",
  uploadRateLimiter,
  upload.single("file"),
  (req, res) => {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });
    // You may want to return full URL: Use req.headers.host for dynamic cases
    res.status(201).json({
      url: `http://localhost:${CDN_PORT}/videos/${req.file.filename}`,
      filename: req.file.filename,
      size: req.file.size,
      mimetype: req.file.mimetype,
      originalName: req.file.originalname,
    });
  }
);

export default router;