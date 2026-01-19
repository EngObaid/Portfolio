import { Router } from 'express';
import {
  getAllBlogs,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
  togglePublish,
} from '../controllers/blog.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

// Public routes
router.get('/', getAllBlogs);
router.get('/:slug', getBlogBySlug);

// Protected admin routes
router.post('/', protect, createBlog);
router.put('/:slug', protect, updateBlog);
router.delete('/:slug', protect, deleteBlog);
router.patch('/:slug/publish', protect, togglePublish);

export default router;
