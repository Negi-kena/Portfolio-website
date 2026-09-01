import multer from "multer";
import path from "path";
import fs from "fs";
import { env } from "../config/env";

export const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Buffer the upload in memory instead of writing it straight to disk —
// the controller runs it through sharp first (resize + re-encode to
// WebP) so what actually lands on disk is already optimized, rather
// than storing whatever format/resolution the visitor's browser or
// phone camera produced.
const storage = multer.memoryStorage();

const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "application/pdf"];

export const upload = multer({
  storage,
  limits: { fileSize: Number(env.MAX_UPLOAD_MB) * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Unsupported file type. Allowed: JPG, PNG, WEBP, GIF, PDF."));
    }
  },
});
