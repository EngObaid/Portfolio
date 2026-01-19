import axios from 'axios';
import type { Blog, BlogFormData, BlogFilters, BlogResponse } from '../types/blog.types';

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Fetch all blogs with optional filters
 */
export const fetchBlogs = async (filters?: BlogFilters): Promise<BlogResponse> => {
  const params = new URLSearchParams();
  
  if (filters?.published !== undefined) {
    params.append('published', String(filters.published));
  }
  if (filters?.search) {
    params.append('search', filters.search);
  }
  if (filters?.tags && filters.tags.length > 0) {
    filters.tags.forEach(tag => params.append('tags', tag));
  }
  if (filters?.categories && filters.categories.length > 0) {
    filters.categories.forEach(cat => params.append('categories', cat));
  }
  if (filters?.featured !== undefined) {
    params.append('featured', String(filters.featured));
  }
  if (filters?.page) {
    params.append('page', String(filters.page));
  }
  if (filters?.limit) {
    params.append('limit', String(filters.limit));
  }

  const response = await api.get<BlogResponse>(`/blogs?${params.toString()}`);
  return response.data;
};

/**
 * Fetch a single blog by slug
 */
export const fetchBlogBySlug = async (slug: string): Promise<Blog> => {
  const response = await api.get<Blog>(`/blogs/${slug}`);
  return response.data;
};

/**
 * Create a new blog post (admin only)
 */
export const createBlog = async (data: BlogFormData): Promise<Blog> => {
  const response = await api.post<Blog>('/blogs', data);
  return response.data;
};

/**
 * Update an existing blog post (admin only)
 */
export const updateBlog = async (slug: string, data: Partial<BlogFormData>): Promise<Blog> => {
  const response = await api.put<Blog>(`/blogs/${slug}`, data);
  return response.data;
};

/**
 * Delete a blog post (admin only)
 */
export const deleteBlog = async (slug: string): Promise<void> => {
  await api.delete(`/blogs/${slug}`);
};

/**
 * Toggle publish status of a blog post (admin only)
 */
export const togglePublishBlog = async (slug: string): Promise<Blog> => {
  const response = await api.patch<Blog>(`/blogs/${slug}/publish`);
  return response.data;
};
