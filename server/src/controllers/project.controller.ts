import { Request, Response } from 'express';
import Project from '../models/Project';
import { successResponse, errorResponse } from '../utils/ApiResponse';

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
export const getProjects = async (req: Request, res: Response) => {
  try {
    const projects = await Project.find({}).sort({ createdAt: -1 });
    return successResponse(res, projects, 'Projects retrieved successfully');
  } catch (error: any) {
    return errorResponse(res, error.message || 'Failed to retrieve projects');
  }
};

// @desc    Get single project by slug
// @route   GET /api/projects/:slug
// @access  Public
export const getProjectBySlug = async (req: Request, res: Response) => {
  try {
    const project = await Project.findOne({ slug: req.params.slug });
    
    if (project) {
      return successResponse(res, project, 'Project retrieved successfully');
    } else {
      return errorResponse(res, 'Project not found', 404);
    }
  } catch (error: any) {
    return errorResponse(res, error.message || 'Failed to retrieve project');
  }
};

// @desc    Create a project
// @route   POST /api/projects
// @access  Private/Admin
export const createProject = async (req: Request, res: Response) => {
  try {
    const { title, summary, description, tags } = req.body;
    
    // Handle files
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    let coverImage = '';
    let screenshots: string[] = [];

    if (files?.coverImage) {
      coverImage = `/uploads/${files.coverImage[0].filename}`;
    }
    
    if (files?.screenshots) {
      screenshots = files.screenshots.map(file => `/uploads/${file.filename}`);
    }

    const project = new Project({
       ...req.body,
       // Parse arrays if sent as strings (multipart/form-data quirks)
       tags: typeof tags === 'string' ? JSON.parse(tags) : tags, 
       coverImage,
       screenshots
    });

    const createdProject = await project.save();
    return successResponse(res, createdProject, 'Project created successfully', 201);
  } catch (error: any) {
    return errorResponse(res, error.message || 'Failed to create project');
  }
};

// @desc    Update a project
// @route   PUT /api/projects/:id
// @access  Private/Admin
export const updateProject = async (req: Request, res: Response) => {
  try {
    const project = await Project.findById(req.params.id);

    if (project) {
      // Basic fields update
      Object.assign(project, req.body);
      
      // Handle files if new ones uploaded
      const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
      if (files?.coverImage) {
         project.coverImage = `/uploads/${files.coverImage[0].filename}`;
      }
      if (files?.screenshots) {
         const newScreenshots = files.screenshots.map(file => `/uploads/${file.filename}`);
         project.screenshots = [...project.screenshots, ...newScreenshots];
      }

      if (req.body.tags && typeof req.body.tags === 'string') {
          project.tags = JSON.parse(req.body.tags);
      }

      const updatedProject = await project.save();
      return successResponse(res, updatedProject, 'Project updated successfully');
    } else {
      return errorResponse(res, 'Project not found', 404);
    }
  } catch (error: any) {
    return errorResponse(res, error.message || 'Failed to update project');
  }
};

// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private/Admin
export const deleteProject = async (req: Request, res: Response) => {
  try {
    const project = await Project.findById(req.params.id);

    if (project) {
      await project.deleteOne();
      return successResponse(res, null, 'Project removed successfully');
    } else {
      return errorResponse(res, 'Project not found', 404);
    }
  } catch (error: any) {
    return errorResponse(res, error.message || 'Failed to remove project');
  }
};
