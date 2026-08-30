import { Router } from "express";

import authRoutes from "./auth.routes";
import projectRoutes from "./projects.routes";
import blogRoutes, { adminBlogRouter } from "./blog.routes";
import contactRoutes, { adminMessagesRouter } from "./contact.routes";
import settingsRoutes, { adminSettingsRouter } from "./settings.routes";
import uploadRoutes from "./upload.routes";

const router = Router();

// --- Public API ---
router.use("/auth", authRoutes);
router.use("/projects", projectRoutes);
router.use("/blog", blogRoutes);
router.use("/contact", contactRoutes);
router.use("/settings", settingsRoutes);

// --- Admin-only API (each also individually protected by middleware) ---
router.use("/admin/blog", adminBlogRouter);
router.use("/admin/messages", adminMessagesRouter);
router.use("/admin/settings", adminSettingsRouter);
router.use("/admin/upload", uploadRoutes);

export default router;
