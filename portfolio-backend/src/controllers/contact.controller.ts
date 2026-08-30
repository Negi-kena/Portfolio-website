import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../config/prisma";
import { asyncHandler } from "../utils/asyncHandler";
import { sendContactNotification } from "../services/email.service";

const contactSchema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email(),
  subject: z.string().max(200).optional(),
  message: z.string().min(1).max(5000),
});

// POST /api/contact  (public)
export const submitContactForm = asyncHandler(async (req: Request, res: Response) => {
  const data = contactSchema.parse(req.body);

  const saved = await prisma.message.create({ data });
  await sendContactNotification(data);

  res.status(201).json({ success: true, message: "Message sent", data: { id: saved.id } });
});

// GET /api/admin/messages  (admin)
export const listMessages = asyncHandler(async (_req: Request, res: Response) => {
  const messages = await prisma.message.findMany({ orderBy: { createdAt: "desc" } });
  res.json({ success: true, data: messages });
});

// PATCH /api/admin/messages/:id/read  (admin)
export const markMessageRead = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const message = await prisma.message.update({ where: { id }, data: { read: true } });
  res.json({ success: true, data: message });
});

// DELETE /api/admin/messages/:id  (admin)
export const deleteMessage = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  await prisma.message.delete({ where: { id } });
  res.json({ success: true, message: "Message deleted" });
});
