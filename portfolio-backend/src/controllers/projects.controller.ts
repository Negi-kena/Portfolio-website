import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../config/prisma";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import { slugify } from "../utils/slugify";

const projectSchema = z.object({
  title: z.string().min(1),
  summary: z.string().min(1),
  description: z.string().min(1),
  imageUrl: z.string().optional(),
  liveUrl: z.string().url().optional().or(z.literal("")),
  repoUrl: z.string().url().optional().or(z.literal("")),
  featured: z.boolean().optional(),
  order: z.number().optional(),
  tags: z.array(z.string().min(1)).optional(),
});

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
  const project = await prisma.project.findUnique({
    where: { slug: req.params.slug },
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
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) throw ApiError.badRequest("Invalid project id");

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
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) throw ApiError.badRequest("Invalid project id");
  await prisma.project.delete({ where: { id } });
  res.json({ success: true, message: "Project deleted" });
});
