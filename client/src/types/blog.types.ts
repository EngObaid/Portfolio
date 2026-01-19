export interface Blog {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  coverImage?: string;
  tags: string[];
  categories: string[];
  featured: boolean;
  published: boolean;
  publishedAt?: string;
  author: {
    _id: string;
    username: string;
    email: string;
  };
  readingTime?: number;
  externalLink?: string;
  seo?: {
    metaDescription?: string;
    metaKeywords?: string[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface BlogFormData {
  title: string;
  content: string;
  excerpt: string;
  coverImage?: string;
  tags: string[];
  categories: string[];
  featured: boolean;
  published: boolean;
  seo?: {
    metaDescription?: string;
    metaKeywords?: string[];
  };
}

export interface BlogFilters {
  published?: boolean;
  search?: string;
  tags?: string[];
  categories?: string[];
  featured?: boolean;
  page?: number;
  limit?: number;
}

export interface BlogResponse {
  blogs: Blog[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
