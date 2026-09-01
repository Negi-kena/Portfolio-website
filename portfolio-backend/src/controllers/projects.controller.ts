import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../config/prisma";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import { slugify } from "../utils/slugify";

const sanitizeString = (val: unknown) =>
  typeof val === "string" ? val.replace(/[\u0000-\u0008\u000B-\u000C\u000E-\u001F]/g, "").trim() : val;

const safeUrlSchema = z.preprocess(
  (v) => (v === "" || v === null ? undefined : sanitizeString(v)),
  z.string().url("Must be a valid URL (http/https)").optional(),
);

const projectSchema = z.object({
  title: z.preprocess(sanitizeString, z.string().min(1, "Title is required").max(300)),
  summary: z.preprocess(sanitizeString, z.string().min(1, "Summary is required").max(1000)),
  description: z.preprocess(sanitizeString, z.string().min(1, "Description is required")),
  imageUrl: z.preprocess(sanitizeString, z.string().max(500).optional()),
  liveUrl: safeUrlSchema,
  repoUrl: safeUrlSchema,
  featured: z.boolean().optional(),
  order: z.number().int().optional(),
  tags: z.array(z.preprocess(sanitizeString, z.string().min(1).max(50))).optional(),
});

const slugParamSchema = z.string().min(1).max(200);
const idParamSchema = z.coerce.number().int().positive("Invalid project ID");

const projectInclude = { tags: { include: { tag: true } } } as const;

type ProjectWithJoinTags = Awaited<ReturnType<typeof prisma.project.findMany<{ include: typeof projectInclude }>>>[number];

const serializeProject = (project: ProjectWithJoinTags) => ({
  ...project,
  tags: project.tags.map(({ tag }) => tag),
});

const tagWrites = (names: string[]) =>
  [...new Set(names.map((name) => name.trim()).filter(Boolean))].map((name) => ({
    tag: {
      connectOrCreate: {
        where: { name },
        create: { name, slug: slugify(name) },
      },
    },
  }));

// GET /api/projects (public — supports ?featured=true)
export const listProjects = asyncHandler(async (req: Request, res: Response) => {
  const featuredOnly = req.query.featured === "true";

  const projects = await prisma.project.findMany({
    where: featuredOnly ? { featured: true } : undefined,
    include: projectInclude,
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });

  res.json({ success: true, data: projects.map(serializeProject) });
});

// GET /api/projects/:slug (public)
export const getProjectBySlug = asyncHandler(async (req: Request, res: Response) => {
  const slug = slugParamSchema.parse(req.params.slug);
  const project = await prisma.project.findUnique({
    where: { slug },
    include: projectInclude,
  });
  if (!project) throw ApiError.notFound("Project not found");
  res.json({ success: true, data: serializeProject(project) });
});

// POST /api/projects (admin)
export const createProject = asyncHandler(async (req: Request, res: Response) => {
  const data = projectSchema.parse(req.body);
  const slug = slugify(data.title);

  const project = await prisma.project.create({
    data: {
      title: data.title,
      slug,
      summary: data.summary,
      description: data.description,
      imageUrl: data.imageUrl,
      liveUrl: data.liveUrl || undefined,
      repoUrl: data.repoUrl || undefined,
      featured: data.featured ?? false,
      order: data.order ?? 0,
      tags: data.tags ? { create: tagWrites(data.tags) } : undefined,
    },
    include: projectInclude,
  });

  res.status(201).json({ success: true, data: serializeProject(project) });
});

// PUT /api/projects/:id (admin)
export const updateProject = asyncHandler(async (req: Request, res: Response) => {
  const id = idParamSchema.parse(req.params.id);

  const data = projectSchema.partial().parse(req.body);

  const project = await prisma.project.update({
    where: { id },
    data: {
      title: data.title,
      summary: data.summary,
      description: data.description,
      imageUrl: data.imageUrl,
      liveUrl: data.liveUrl || undefined,
      repoUrl: data.repoUrl || undefined,
      featured: data.featured,
      order: data.order,
      slug: data.title ? slugify(data.title) : undefined,
      tags: data.tags
        ? {
            deleteMany: {},
            create: tagWrites(data.tags),
          }
        : undefined,
    },
    include: projectInclude,
  });

  res.json({ success: true, data: serializeProject(project) });
});

// DELETE /api/projects/:id (admin)
export const deleteProject = asyncHandler(async (req: Request, res: Response) => {
  const id = idParamSchema.parse(req.params.id);
  await prisma.project.delete({ where: { id } });
  res.json({ success: true, message: "Project deleted" });
});
