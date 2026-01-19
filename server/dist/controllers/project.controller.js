"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProject = exports.updateProject = exports.createProject = exports.getProjectBySlug = exports.getProjects = void 0;
const Project_1 = __importDefault(require("../models/Project"));
const ApiResponse_1 = require("../utils/ApiResponse");
// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
const getProjects = async (req, res) => {
    try {
        const projects = await Project_1.default.find({}).sort({ createdAt: -1 });
        return (0, ApiResponse_1.successResponse)(res, projects, 'Projects retrieved successfully');
    }
    catch (error) {
        return (0, ApiResponse_1.errorResponse)(res, error.message || 'Failed to retrieve projects');
    }
};
exports.getProjects = getProjects;
// @desc    Get single project by slug
// @route   GET /api/projects/:slug
// @access  Public
const getProjectBySlug = async (req, res) => {
    try {
        const project = await Project_1.default.findOne({ slug: req.params.slug });
        if (project) {
            return (0, ApiResponse_1.successResponse)(res, project, 'Project retrieved successfully');
        }
        else {
            return (0, ApiResponse_1.errorResponse)(res, 'Project not found', 404);
        }
    }
    catch (error) {
        return (0, ApiResponse_1.errorResponse)(res, error.message || 'Failed to retrieve project');
    }
};
exports.getProjectBySlug = getProjectBySlug;
// @desc    Create a project
// @route   POST /api/projects
// @access  Private/Admin
const createProject = async (req, res) => {
    try {
        const { title, summary, description, tags } = req.body;
        // Handle files
        const files = req.files;
        let coverImage = '';
        let screenshots = [];
        if (files?.coverImage) {
            coverImage = `/uploads/${files.coverImage[0].filename}`;
        }
        if (files?.screenshots) {
            screenshots = files.screenshots.map(file => `/uploads/${file.filename}`);
        }
        const project = new Project_1.default({
            ...req.body,
            // Parse arrays if sent as strings (multipart/form-data quirks)
            tags: typeof tags === 'string' ? JSON.parse(tags) : tags,
            coverImage,
            screenshots
        });
        const createdProject = await project.save();
        return (0, ApiResponse_1.successResponse)(res, createdProject, 'Project created successfully', 201);
    }
    catch (error) {
        return (0, ApiResponse_1.errorResponse)(res, error.message || 'Failed to create project');
    }
};
exports.createProject = createProject;
// @desc    Update a project
// @route   PUT /api/projects/:id
// @access  Private/Admin
const updateProject = async (req, res) => {
    try {
        const project = await Project_1.default.findById(req.params.id);
        if (project) {
            // Basic fields update
            Object.assign(project, req.body);
            // Handle files if new ones uploaded
            const files = req.files;
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
            return (0, ApiResponse_1.successResponse)(res, updatedProject, 'Project updated successfully');
        }
        else {
            return (0, ApiResponse_1.errorResponse)(res, 'Project not found', 404);
        }
    }
    catch (error) {
        return (0, ApiResponse_1.errorResponse)(res, error.message || 'Failed to update project');
    }
};
exports.updateProject = updateProject;
// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private/Admin
const deleteProject = async (req, res) => {
    try {
        const project = await Project_1.default.findById(req.params.id);
        if (project) {
            await project.deleteOne();
            return (0, ApiResponse_1.successResponse)(res, null, 'Project removed successfully');
        }
        else {
            return (0, ApiResponse_1.errorResponse)(res, 'Project not found', 404);
        }
    }
    catch (error) {
        return (0, ApiResponse_1.errorResponse)(res, error.message || 'Failed to remove project');
    }
};
exports.deleteProject = deleteProject;
