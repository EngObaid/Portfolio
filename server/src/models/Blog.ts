import mongoose from 'mongoose';

export interface IBlog extends mongoose.Document {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  coverImage?: string;
  tags: string[];
  categories: string[];
  featured: boolean;
  published: boolean;
  publishedAt?: Date;
  author: mongoose.Types.ObjectId;
  readingTime?: number; // in minutes
  externalLink?: string;
  seo?: {
    metaDescription?: string;
    metaKeywords?: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  content: { type: String },
  excerpt: { type: String },
  coverImage: { type: String },
  tags: [{ type: String }],
  categories: [{ type: String }],
  featured: { type: Boolean, default: false },
  published: { type: Boolean, default: false },
  publishedAt: { type: Date },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  readingTime: { type: Number },
  externalLink: { type: String },
  seo: {
    metaDescription: { type: String },
    metaKeywords: [{ type: String }],
  },
}, {
  timestamps: true,
});

// Index for searching and filtering
blogSchema.index({ title: 'text', content: 'text', excerpt: 'text' });
blogSchema.index({ published: 1, publishedAt: -1 });
blogSchema.index({ tags: 1 });
blogSchema.index({ categories: 1 });

const Blog = mongoose.model<IBlog>('Blog', blogSchema);
export default Blog;
