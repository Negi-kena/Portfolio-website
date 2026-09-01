import { Request, Response } from "express";
import path from "path";
import fs from "fs/promises";
import sharp from "sharp";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import { uploadDir } from "../middleware/upload";

// Images are never stored at their original resolution/format — profile
// photos and project screenshots are frequently multi-megabyte camera or
// screenshot output, which is wasted bandwidth for a portfolio site.
// Re-encoding to WebP typically cuts file size dramatically versus the
// source JPEG/PNG at an equivalent, still-sharp quality setting.
const MAX_DIMENSION = 1920; // px, longest side — plenty for any layout this site uses
const WEBP_QUALITY = 82;

const sanitizeBaseName = (originalname: string) => {
  const ext = path.extname(originalname);
  return path.basename(originalname, ext).replace(/[^a-zA-Z0-9-_]/g, "-") || "file";
};

// POST /api/admin/upload  (admin) — expects a single "file" field via multer
export const uploadFile = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) throw ApiError.badRequest("No file uploaded");

  const base = sanitizeBaseName(req.file.originalname);
  const isImage = req.file.mimetype.startsWith("image/");

  let filename: string;
  let mimetype: string;
  let size: number;

  if (isImage) {
    filename = `${base}-${Date.now()}.webp`;
    const outputPath = path.join(uploadDir, filename);

    const optimized = await sharp(req.file.buffer)
      .rotate() // respect EXIF orientation before stripping metadata
      .resize({ width: MAX_DIMENSION, height: MAX_DIMENSION, fit: "inside", withoutEnlargement: true })
      .webp({ quality: WEBP_QUALITY })
      .toBuffer();

    await fs.writeFile(outputPath, optimized);
    mimetype = "image/webp";
    size = optimized.length;
  } else {
    // Non-image (PDF, e.g. a resume) — store as-is, no re-encoding to do.
    const ext = path.extname(req.file.originalname) || "";
    filename = `${base}-${Date.now()}${ext}`;
    await fs.writeFile(path.join(uploadDir, filename), req.file.buffer);
    mimetype = req.file.mimetype;
    size = req.file.buffer.length;
  }

  res.status(201).json({
    success: true,
    data: {
      filename,
      url: `/uploads/${filename}`,
      mimetype,
      size,
    },
  });
});
