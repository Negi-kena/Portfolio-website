import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../config/prisma";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import { sendContactNotification, sendReplyEmail } from "../services/email.service";

const contactSchema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email(),
  subject: z.string().max(200).optional(),
  message: z.string().min(1).max(5000),
});

// POST /api/contact  (public)
export const submitContactForm = asyncHandler(async (req: Request, res: Response) => {
  const data = contactSchema.parse(req.body);

  // The message is the source of truth — it's saved first, and the response
  // reflects that outcome. Email notification is a best-effort side effect:
  // if it fails (bad SMTP creds, provider hiccup, etc.) that must NEVER turn
  // a successful submission into a false "Internal Server Error" for the
  // person who just contacted you.
  const saved = await prisma.message.create({ data });

  try {
    await sendContactNotification(data);
  } catch (err) {
    console.error("Contact notification email failed to send (message was still saved):", err);
  }

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

const replySchema = z.object({
  body: z.string().min(1).max(5000),
});

// POST /api/admin/messages/:id/reply  (admin) — sends the reply directly
// from the server via SMTP, marks the message as replied.
export const replyToMessage = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { body } = replySchema.parse(req.body);

  const original = await prisma.message.findUnique({ where: { id } });
  if (!original) throw ApiError.notFound("Message not found");

  await sendReplyEmail({
    toName: original.name,
    toEmail: original.email,
    originalSubject: original.subject,
    replyBody: body,
  });

  const updated = await prisma.message.update({
    where: { id },
    data: { replied: true, repliedAt: new Date() },
  });

  res.json({ success: true, message: "Reply sent", data: updated });
});