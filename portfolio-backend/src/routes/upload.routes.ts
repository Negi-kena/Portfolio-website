import { Router } from "express";
import { uploadFile } from "../controllers/upload.controller";
import { authenticate, requireAdmin } from "../middleware/auth";
import { upload } from "../middleware/upload";
import { uploadLimiter } from "../middleware/rateLimiter";

const router = Router();

router.post("/", authenticate, requireAdmin, uploadLimiter, upload.single("file"), uploadFile);

export default router;
