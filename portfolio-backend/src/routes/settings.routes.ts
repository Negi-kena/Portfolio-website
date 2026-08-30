import { Router } from "express";
import { getSettings, updateSettings } from "../controllers/settings.controller";
import { authenticate, requireAdmin } from "../middleware/auth";

const router = Router();

// Public
router.get("/", getSettings);

// Admin (mounted under /api/admin/settings in app.ts)
export const adminSettingsRouter = Router();
adminSettingsRouter.put("/", authenticate, requireAdmin, updateSettings);

export default router;
