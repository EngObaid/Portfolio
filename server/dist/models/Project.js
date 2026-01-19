"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const projectSchema = new mongoose_1.default.Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    summary: { type: String, required: true },
    description: { type: String, required: true },
    featured: { type: Boolean, default: false },
    tags: [{ type: String }],
    techStack: [{ type: String }],
    role: { type: String },
    timeframe: { type: String },
    problem: { type: String },
    solution: { type: String },
    keyFeatures: [{ type: String }],
    results: [{ type: String }],
    lessons: [{ type: String }],
    links: {
        github: { type: String },
        live: { type: String },
        caseStudy: { type: String },
    },
    coverImage: { type: String },
    screenshots: [{ type: String }],
}, {
    timestamps: true,
});
const Project = mongoose_1.default.model('Project', projectSchema);
exports.default = Project;
