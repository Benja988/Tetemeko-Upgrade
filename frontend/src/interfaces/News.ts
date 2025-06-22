// @/interfaces/News.ts

import { Category } from "./Category";

export interface News {
  _id: string;
  title: string;
  content: string;
  summary?: string;
  author?: string; // or Author object if populated
  category?: string | Category;
  tags?: string[];
  publishedAt?: string;
  isPublished: boolean;
  thumbnail?: string;
  featuredImage?: string;
  videoUrl?: string;
  seoTitle?: string;
  seoDescription?: string;
  readingTime?: number;
  viewsCount: number;
  isFeatured: boolean;
  isBreaking: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type NewsInput = Omit<
  News,
  "_id" | "viewsCount" | "createdAt" | "updatedAt"
>;
