export interface Tag {
  id: number;
  name: string;
  slug: string;
}

export interface Project {
  id: number;
  title: string;
  slug: string;
  summary: string;
  description: string;
  imageUrl?: string | null;
  liveUrl?: string | null;
  repoUrl?: string | null;
  featured: boolean;
  order: number;
  tags: Tag[];
  createdAt: string;
  updatedAt: string;
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string | null;
  published: boolean;
  publishedAt?: string | null;
  tags: Tag[];
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: number;
  name: string;
  email: string;
  subject?: string | null;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface SiteSettings {
  id: number;
  heroTitle: string;
  heroSubtitle: string;
  bio: string;
  avatarUrl?: string | null;
  resumeUrl?: string | null;
  email?: string | null;
  github?: string | null;
  linkedin?: string | null;
  twitter?: string | null;
  updatedAt: string;
}

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: "ADMIN";
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
