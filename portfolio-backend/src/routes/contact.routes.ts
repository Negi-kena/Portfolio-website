import { Router } from "express";
import { submitContactForm, listMessages, markMessageRead, deleteMessage, replyToMessage } from "../controllers/contact.controller";
import { authenticate, requireAdmin } from "../middleware/auth";
import { contactLimiter } from "../middleware/rateLimiter";

const router = Router();

// Public
router.post("/", contactLimiter, submitContactForm);

// Admin (mounted under /api/admin/messages in app.ts)
export const adminMessagesRouter = Router();
adminMessagesRouter.get("/", authenticate, requireAdmin, listMessages);
adminMessagesRouter.patch("/:id/read", authenticate, requireAdmin, markMessageRead);
adminMessagesRouter.post("/:id/reply", authenticate, requireAdmin, replyToMessage);
adminMessagesRouter.delete("/:id", authenticate, requireAdmin, deleteMessage);

export default router;