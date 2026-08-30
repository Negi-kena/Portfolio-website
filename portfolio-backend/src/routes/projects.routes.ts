import { Router } from "express";
import {
  listProjects,
  getProjectBySlug,
  createProject,
  updateProject,
  deleteProject,
} from "../controllers/projects.controller";
import { authenticate, requireAdmin } from "../middleware/auth";

const router = Router();

// Public
router.get("/", listProjects);
router.get("/:slug", getProjectBySlug);

// Admin
router.post("/", authenticate, requireAdmin, createProject);
router.put("/:id", authenticate, requireAdmin, updateProject);
router.delete("/:id", authenticate, requireAdmin, deleteProject);

export default router;
