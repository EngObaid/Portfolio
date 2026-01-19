import mongoose from 'mongoose';
import { env } from '../config/env';
import User from '../models/User';
import Blog from '../models/Blog';
import { connectDB } from '../config/db';

const seedBlogs = async () => {
  try {
    await connectDB();

    // Find the admin user
    const admin = await User.findOne({ email: env.ADMIN_EMAIL });

    if (!admin) {
      console.error('Admin user not found. Please run the main seed script first.');
      process.exit(1);
    }

    // Check if demo blog exists
    const existingBlog = await Blog.findOne({ slug: 'future-of-web-development-2026' });
    if (existingBlog) {
      console.log('Demo blog already exists.');
      process.exit(0);
    }

    const demoBlog = {
      title: "The Future of Web Development in 2026",
      slug: "future-of-web-development-2026",
      content: `
## The Evolution of the Web
As we step into 2026, the landscape of web development has shifted dramatically. The line between native and web applications has blurred almost completely.

### AI-Driven Development
AI is no longer just a tool; it's a pair programmer. From generating boilerplate to optimizing DB queries, AI agents are integrated into every step of the workflow.

### The Rise of Edge Computing
Serverless is old news. Edge computing allows us to deploy logic closer to the user than ever before, minimizing latency to near-zero.

### WebGPU and Immersive Experiences
With WebGPU now standard across all major browsers, high-fidelity 3D experiences are becoming the norm for marketing sites and e-commerce alike.
      `,
      excerpt: "Exploring the top trends shaping the web development landscape in 2026, from AI agents to WebGPU.",
      coverImage: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1530&auto=format&fit=crop",
      tags: ["Tech Trends", "Web Development", "AI", "Future"],
      categories: ["Technology"],
      featured: true,
      published: true,
      publishedAt: new Date(),
      author: admin._id,
      readingTime: 5,
      seo: {
        metaDescription: "A deep dive into 2026 web dev trends.",
        metaKeywords: ["web dev", "2026", "AI", "WebGPU"]
      }
    };

    await Blog.create(demoBlog);
    console.log('Demo Blog Created Successfully');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding blogs:', error);
    process.exit(1);
  }
};

seedBlogs();
