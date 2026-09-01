import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../config/prisma";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import { slugify } from "../utils/slugify";

const sanitizeString = (val: unknown) =>
  typeof val === "string" ? val.replace(/[\u0000-\u0008\u000B-\u000C\u000E-\u001F]/g, "").trim() : val;

const postSchema = z.object({
  title: z.preprocess(sanitizeString, z.string().min(1, "Title is required").max(300)),
  excerpt: z.preprocess(sanitizeString, z.string().min(1, "Excerpt is required").max(1000)),
  content: z.preprocess(sanitizeString, z.string().min(1, "Content is required")),
  coverImage: z.preprocess(sanitizeString, z.string().max(500).optional()),
  published: z.boolean().optional(),
  tags: z.array(z.preprocess(sanitizeString, z.string().min(1).max(50))).optional(),
});

const slugParamSchema = z.string().min(1).max(200);
const idParamSchema = z.coerce.number().int().positive("Invalid post ID");

const postInclude = { tags: { include: { tag: true } } } as const;

type PostWithJoinTags = Awaited<ReturnType<typeof prisma.blogPost.findMany<{ include: typeof postInclude }>>>[number];

const serializePost = (post: PostWithJoinTags) => ({
  ...post,
  tags: post.tags.map(({ tag }) => tag),
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

// GET /api/blog (public — published only)
export const listPublishedPosts = asyncHandler(async (_req: Request, res: Response) => {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    include: postInclude,
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
  });
  res.json({ success: true, data: posts.map(serializePost) });
});

// GET /api/blog/:slug (public)
export const getPostBySlug = asyncHandler(async (req: Request, res: Response) => {
  const slug = slugParamSchema.parse(req.params.slug);
  const post = await prisma.blogPost.findFirst({
    where: { slug, published: true },
    include: postInclude,
  });
  if (!post) throw ApiError.notFound("Post not found");
  res.json({ success: true, data: serializePost(post) });
});

// GET /api/admin/blog (admin — all posts)
export const listAllPosts = asyncHandler(async (_req: Request, res: Response) => {
  const posts = await prisma.blogPost.findMany({
    include: postInclude,
    orderBy: { createdAt: "desc" },
  });
  res.json({ success: true, data: posts.map(serializePost) });
});

// POST /api/admin/blog (admin)
export const createPost = asyncHandler(async (req: Request, res: Response) => {
  const data = postSchema.parse(req.body);
  const slug = slugify(data.title);
  const published = data.published ?? false;

  const post = await prisma.blogPost.create({
    data: {
      title: data.title,
      slug,
      excerpt: data.excerpt,
      content: data.content,
      coverImage: data.coverImage,
      published,
      publishedAt: published ? new Date() : null,
      tags: data.tags ? { create: tagWrites(data.tags) } : undefined,
    },
    include: postInclude,
  });

  res.status(201).json({ success: true, data: serializePost(post) });
});

// PUT /api/admin/blog/:id (admin)
export const updatePost = asyncHandler(async (req: Request, res: Response) => {
  const id = idParamSchema.parse(req.params.id);

  const data = postSchema.partial().parse(req.body);
  const existing = await prisma.blogPost.findUnique({ where: { id } });
  if (!existing) throw ApiError.notFound("Post not found");

  const published = data.published;
  const shouldSetPublishedAt = published === true && !existing.publishedAt;
  const shouldClearPublishedAt = published === false;

  const post = await prisma.blogPost.update({
    where: { id },
    data: {
      title: data.title,
      excerpt: data.excerpt,
      content: data.content,
      coverImage: data.coverImage,
      published,
      publishedAt: shouldSetPublishedAt ? new Date() : shouldClearPublishedAt ? null : undefined,
      slug: data.title ? slugify(data.title) : undefined,
      tags: data.tags
        ? {
            deleteMany: {},
            create: tagWrites(data.tags),
          }
        : undefined,
    },
    include: postInclude,
  });

  res.json({ success: true, data: serializePost(post) });
});

// DELETE /api/admin/blog/:id (admin)
export const deletePost = asyncHandler(async (req: Request, res: Response) => {
  const id = idParamSchema.parse(req.params.id);
  await prisma.blogPost.delete({ where: { id } });
  res.json({ success: true, message: "Post deleted" });
});
