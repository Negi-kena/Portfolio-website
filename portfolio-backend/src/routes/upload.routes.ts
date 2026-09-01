import { Router } from "express";
import { uploadFile } from "../controllers/upload.controller";
import { authenticate, requireAdmin } from "../middleware/auth";
import { upload } from "../middleware/upload";

const router = Router();

router.post("/", authenticate, requireAdmin, upload.single("file"), uploadFile);

export default router;
