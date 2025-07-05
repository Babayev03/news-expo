import { BaseEntity } from './common';

// News-related types
export interface NewsArticle extends BaseEntity {
  title: string;
  content: string;
  summary: string;
  imageUrl?: string;
  author: string;
  publishedAt: string;
  category: NewsCategory;
  tags: string[];
  sourceUrl: string;
  isBookmarked: boolean;
}

export interface NewsCategory {
  id: string;
  name: string;
  slug: string;
}

export interface NewsSource {
  id: string;
  name: string;
  url: string;
  isActive: boolean;
}

export type NewsFilter = {
  category?: string;
  author?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  tags?: string[];
};
