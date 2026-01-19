import mongoose from 'mongoose';

export interface IProject extends mongoose.Document {
  title: string;
  slug: string;
  summary: string;
  description: string;
  challenge?: string;  // Problem statement
  solution?: string;   // How you solved it
  impact?: {
    metrics: Array<{
      label: string;
      value: string;
      description?: string;
    }>;
  };
  featured: boolean;
  tags: string[];
  techStack: string[];
  role?: string;
  timeframe?: string;
  keyFeatures: string[];
  results: string[];
  lessons: string[];
  links: {
    github?: string;
    live?: string;
    caseStudy?: string;
  };
  coverImage?: string;
  screenshots: string[];
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  summary: { type: String },
  description: { type: String },
  challenge: { type: String },
  solution: { type: String },
  impact: {
    metrics: [{
      label: { type: String },
      value: { type: String },
      description: { type: String }
    }]
  },
  featured: { type: Boolean, default: false },
  tags: [{ type: String }],
  techStack: [{ type: String }],
  role: { type: String },
  timeframe: { type: String },
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

const Project = mongoose.model<IProject>('Project', projectSchema);
export default Project;
