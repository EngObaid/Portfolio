import express from 'express';
import {
  getProjects,
  getProjectBySlug,
  createProject,
  updateProject,
  deleteProject,
} from '../controllers/project.controller';
import { protect } from '../middleware/auth.middleware';
import { upload, validateDimensions, handleUploadError } from '../middleware/upload.middleware';

const router = express.Router();

router.route('/')
  .get(getProjects)
  .post(protect, upload.fields([{ name: 'coverImage', maxCount: 1 }, { name: 'screenshots', maxCount: 10 }]), handleUploadError, validateDimensions, createProject as any);

router.route('/:slug')
  .get(getProjectBySlug);

router.route('/:id')
  .put(protect, upload.fields([{ name: 'coverImage', maxCount: 1 }, { name: 'screenshots', maxCount: 10 }]), handleUploadError, validateDimensions, updateProject as any)
  .delete(protect, deleteProject as any);


export default router;
