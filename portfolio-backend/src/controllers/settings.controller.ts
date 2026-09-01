import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../config/prisma";
import { asyncHandler } from "../utils/asyncHandler";

/**
 * Convert values that represent "not provided" into undefined.
 *
 * This lets the API safely accept:
 *   null
 *   ""
 *   undefined
 *
 * for optional settings fields.
 */
const emptyToUndefined = (value: unknown) => {
  if (value === null || value === undefined || value === "") return undefined;
  if (typeof value === "string") {
    const cleaned = value.replace(/[\u0000-\u0008\u000B-\u000C\u000E-\u001F]/g, "").trim();
    return cleaned === "" ? undefined : cleaned;
  }
  return value;
};

/**
 * Optional plain string.
 *
 * Used for asset URLs such as:
 *   /uploads/avatar.png
 *   /uploads/resume.pdf
 *
 * These are relative URLs, so z.string().url() must NOT be used.
 */
const optionalString = z.preprocess(
  emptyToUndefined,
  z.string().trim().optional(),
);

/**
 * Optional email.
 *
 * Empty/null values are treated as "not provided".
 */
const optionalEmail = z.preprocess(
  emptyToUndefined,
  z.string().trim().email().optional(),
);

/**
 * Optional external URL.
 *
 * Used for GitHub, LinkedIn and Twitter/X.
 */
const optionalUrl = z.preprocess(
  emptyToUndefined,
  z.string().trim().url().optional(),
);

const settingsSchema = z.object({
  heroTitle: z.string().trim().min(1),
  heroSubtitle: z.string().trim().min(1),
  bio: z.string().trim().min(1),

  avatarUrl: optionalString,
  resumeUrl: optionalString,

  email: optionalEmail,

  github: optionalUrl,
  linkedin: optionalUrl,
  twitter: optionalUrl,
});

// GET /api/settings
// Public
export const getSettings = asyncHandler(
  async (_req: Request, res: Response) => {
    const settings = await prisma.siteSettings.findUnique({
      where: { id: 1 },
    });

    res.json({
      success: true,
      data: settings,
    });
  },
);

// PUT /api/admin/settings
// Admin
export const updateSettings = asyncHandler(
  async (req: Request, res: Response) => {
    const data = settingsSchema.partial().parse(req.body);

    const settings = await prisma.siteSettings.upsert({
      where: { id: 1 },

      update: data,

      create: {
        id: 1,
        heroTitle: data.heroTitle ?? "Hello, I'm...",
        heroSubtitle: data.heroSubtitle ?? "Full-Stack Developer",
        bio: data.bio ?? "",
        ...data,
      },
    });

    res.json({
      success: true,
      data: settings,
    });
  },
);
