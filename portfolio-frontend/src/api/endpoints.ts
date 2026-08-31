import { apiClient } from "./client";
import type { ApiResponse, Project, BlogPost, Message, SiteSettings, AdminUser } from "../types";

// --- Auth ---
export const login = (email: string, password: string) =>
  apiClient
    .post<ApiResponse<{ token: string; user: AdminUser }>>("/auth/login", { email, password })
    .then((r) => r.data.data);

export const getMe = () => apiClient.get<ApiResponse<AdminUser>>("/auth/me").then((r) => r.data.data);

// --- Projects (public) ---
export const getProjects = (featuredOnly = false) =>
  apiClient
    .get<ApiResponse<Project[]>>("/projects", { params: featuredOnly ? { featured: "true" } : {} })
    .then((r) => r.data.data);

export const getProjectBySlug = (slug: string) =>
  apiClient.get<ApiResponse<Project>>(`/projects/${slug}`).then((r) => r.data.data);

// --- Projects (admin) ---
export interface ProjectInput {
  title: string;
  summary: string;
  description: string;
  imageUrl?: string;
  liveUrl?: string;
  repoUrl?: string;
  featured?: boolean;
  order?: number;
  tags?: string[];
}
export const createProject = (data: ProjectInput) =>
  apiClient.post<ApiResponse<Project>>("/projects", data).then((r) => r.data.data);
export const updateProject = (id: number, data: Partial<ProjectInput>) =>
  apiClient.put<ApiResponse<Project>>(`/projects/${id}`, data).then((r) => r.data.data);
export const deleteProject = (id: number) => apiClient.delete(`/projects/${id}`);

// --- Blog (public) ---
export const getPublishedPosts = () =>
  apiClient.get<ApiResponse<BlogPost[]>>("/blog").then((r) => r.data.data);
export const getPostBySlug = (slug: string) =>
  apiClient.get<ApiResponse<BlogPost>>(`/blog/${slug}`).then((r) => r.data.data);

// --- Blog (admin) ---
export interface PostInput {
  title: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  published?: boolean;
  tags?: string[];
}
export const getAllPosts = () =>
  apiClient.get<ApiResponse<BlogPost[]>>("/admin/blog").then((r) => r.data.data);
export const createPost = (data: PostInput) =>
  apiClient.post<ApiResponse<BlogPost>>("/admin/blog", data).then((r) => r.data.data);
export const updatePost = (id: number, data: Partial<PostInput>) =>
  apiClient.put<ApiResponse<BlogPost>>(`/admin/blog/${id}`, data).then((r) => r.data.data);
export const deletePost = (id: number) => apiClient.delete(`/admin/blog/${id}`);

// --- Contact ---
export const submitContact = (data: { name: string; email: string; subject?: string; message: string }) =>
  apiClient.post<ApiResponse<{ id: number }>>("/contact", data).then((r) => r.data.data);

// --- Messages (admin) ---
export const getMessages = () =>
  apiClient.get<ApiResponse<Message[]>>("/admin/messages").then((r) => r.data.data);
export const markMessageRead = (id: number) =>
  apiClient.patch<ApiResponse<Message>>(`/admin/messages/${id}/read`).then((r) => r.data.data);
export const replyToMessage = (id: number, body: string) =>
  apiClient.post<ApiResponse<Message>>(`/admin/messages/${id}/reply`, { body }).then((r) => r.data.data);
export const deleteMessage = (id: number) => apiClient.delete(`/admin/messages/${id}`);

// --- Settings ---
export const getSettings = () =>
  apiClient.get<ApiResponse<SiteSettings>>("/settings").then((r) => r.data.data);
export const updateSettings = (data: Partial<SiteSettings>) =>
  apiClient.put<ApiResponse<SiteSettings>>("/admin/settings", data).then((r) => r.data.data);

// --- Upload ---
export const uploadFile = (file: File) => {
  const form = new FormData();
  form.append("file", file);
  return apiClient
    .post<ApiResponse<{ url: string; filename: string }>>("/admin/upload", form, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((r) => r.data.data);
};