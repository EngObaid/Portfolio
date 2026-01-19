import { Request, Response } from 'express';
import Blog from '../models/Blog';
import { slugify, calculateReadingTime } from '../utils/slugify';

/**
 * Get all blogs with optional filtering
 * Public endpoint - only returns published blogs for non-authenticated users
 */
export const getAllBlogs = async (req: Request, res: Response) => {
  try {
    const { 
      published, 
      search, 
      tags, 
      categories, 
      featured,
      page = 1, 
      limit = 10 
    } = req.query;

    const query: any = {};

    // Only show published blogs to public users
    if (published !== undefined) {
      query.published = published === 'true';
    } else if (!req.user) {
      query.published = true;
    }

    // Search in title, content, and excerpt
    if (search) {
      query.$text = { $search: search as string };
    }

    // Filter by tags
    if (tags) {
      const tagArray = Array.isArray(tags) ? tags : [tags];
      query.tags = { $in: tagArray };
    }

    // Filter by categories
    if (categories) {
      const categoryArray = Array.isArray(categories) ? categories : [categories];
      query.categories = { $in: categoryArray };
    }

    // Filter by featured
    if (featured !== undefined) {
      query.featured = featured === 'true';
    }

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const blogs = await Blog.find(query)
      .populate('author', 'username email')
      .sort({ publishedAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Blog.countDocuments(query);

    res.json({
      blogs,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching blogs', error: error.message });
  }
};

/**
 * Get a single blog by slug
 */
export const getBlogBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const blog = await Blog.findOne({ slug }).populate('author', 'username email');

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Only allow unpublished blogs to be viewed by authenticated users
    if (!blog.published && !req.user) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    res.json(blog);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching blog', error: error.message });
  }
};

/**
 * Create a new blog post (Admin only)
 */
export const createBlog = async (req: Request, res: Response) => {
  try {
    const {
      title,
      content,
      excerpt,
      coverImage,
      tags,
      categories,
      featured,
      published,
      externalLink,
      seo,
    } = req.body;

    // Generate slug from title
    let slug = slugify(title);
    
    // Ensure slug is unique
    let existingBlog = await Blog.findOne({ slug });
    let counter = 1;
    while (existingBlog) {
      slug = `${slugify(title)}-${counter}`;
      existingBlog = await Blog.findOne({ slug });
      counter++;
    }

    // Calculate reading time
    const readingTime = calculateReadingTime(content);

    const blog = new Blog({
      title,
      slug,
      content,
      excerpt,
      coverImage,
      tags: tags || [],
      categories: categories || [],
      featured: featured || false,
      published: published || false,
      publishedAt: published ? new Date() : undefined,
      author: req.user?._id,
      readingTime,
      externalLink,
      seo,
    });

    await blog.save();
    await blog.populate('author', 'username email');

    res.status(201).json(blog);
  } catch (error: any) {
    console.error('Error in createBlog:', error);
    res.status(400).json({ message: 'Error creating blog', error: error.message });
  }
};

/**
 * Update a blog post (Admin only)
 */
export const updateBlog = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const updates = req.body;

    const blog = await Blog.findOne({ slug });

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // If title changed, regenerate slug
    if (updates.title && updates.title !== blog.title) {
      let newSlug = slugify(updates.title);
      let existingBlog = await Blog.findOne({ slug: newSlug, _id: { $ne: blog._id } });
      let counter = 1;
      while (existingBlog) {
        newSlug = `${slugify(updates.title)}-${counter}`;
        existingBlog = await Blog.findOne({ slug: newSlug, _id: { $ne: blog._id } });
        counter++;
      }
      updates.slug = newSlug;
    }

    // Recalculate reading time if content changed
    if (updates.content && updates.content !== blog.content) {
      updates.readingTime = calculateReadingTime(updates.content);
    }

    // Update publishedAt if publishing for the first time
    if (updates.published && !blog.published) {
      updates.publishedAt = new Date();
    }

    // Update the blog
    Object.assign(blog, updates);
    await blog.save();
    await blog.populate('author', 'username email');

    res.json(blog);
  } catch (error: any) {
    res.status(400).json({ message: 'Error updating blog', error: error.message });
  }
};

/**
 * Delete a blog post (Admin only)
 */
export const deleteBlog = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const blog = await Blog.findOneAndDelete({ slug });

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    res.json({ message: 'Blog deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: 'Error deleting blog', error: error.message });
  }
};

/**
 * Toggle publish status (Admin only)
 */
export const togglePublish = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const blog = await Blog.findOne({ slug });

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    blog.published = !blog.published;
    if (blog.published && !blog.publishedAt) {
      blog.publishedAt = new Date();
    }

    await blog.save();
    await blog.populate('author', 'username email');

    res.json(blog);
  } catch (error: any) {
    res.status(500).json({ message: 'Error toggling publish status', error: error.message });
  }
};
