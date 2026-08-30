import { Router } from "express";
import {
  listPublishedPosts,
  getPostBySlug,
  listAllPosts,
  createPost,
  updatePost,
  deletePost,
} from "../controllers/blog.controller";
import { authenticate, requireAdmin } from "../middleware/auth";

const router = Router();

// Public
router.get("/", listPublishedPosts);
router.get("/:slug", getPostBySlug);

// Admin (mounted separately under /api/admin/blog in app.ts for clarity)
export const adminBlogRouter = Router();
adminBlogRouter.get("/", authenticate, requireAdmin, listAllPosts);
adminBlogRouter.post("/", authenticate, requireAdmin, createPost);
adminBlogRouter.put("/:id", authenticate, requireAdmin, updatePost);
adminBlogRouter.delete("/:id", authenticate, requireAdmin, deletePost);

export default router;
