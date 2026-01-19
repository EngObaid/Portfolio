"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const env_1 = require("../config/env");
const User_1 = __importDefault(require("../models/User"));
const Project_1 = __importDefault(require("../models/Project"));
const db_1 = require("../config/db");
const seedData = async () => {
    try {
        await (0, db_1.connectDB)();
        // Clear existing data
        await User_1.default.deleteMany();
        await Project_1.default.deleteMany();
        // Create Admin User
        const admin = await User_1.default.create({
            email: env_1.env.ADMIN_EMAIL,
            passwordHash: env_1.env.ADMIN_PASSWORD, // Pre-save hook will hash this
        });
        console.log('Admin User Created:', admin.email);
        // Create Demo Projects
        const projects = [
            {
                title: "E-Commerce OS",
                slug: "ecommerce-os",
                summary: "A high-performance analytics dashboard and management system for high-volume online retailers.",
                description: `
## Problem & Motivation
High-volume retailers often struggle with fragmented data across multiple sales channels. Managing inventory, sales, and customer insights in real-time becomes a significant bottleneck as the business scales.

## Solution & Architecture
I developed 'E-Commerce OS' to bridge this gap. Using a MERN-stack architecture and WebSocket integration, the platform aggregates data into a single, cohesive dashboard.

- **Real-time Pipeline**: Socket.io for live order tracking and stock updates.
- **Predictive Analytics**: Integrated custom models for demand forecasting.
- **Scale-Ready**: Deployed on AWS with Redis caching for ultra-low latency.

## Results & Impact
- **45% reduction** in manual data entry for trial users.
- **Improved inventory accuracy** by 30% through automated reconciliation.
- **Lighthouse Score of 98** for both performance and accessibility.
        `,
                featured: true,
                tags: ["React", "TypeScript", "Node.js", "AWS"],
                techStack: ["React", "Tailwind CSS", "Node.js", "Express", "MongoDB", "Socket.io", "Redis"],
                links: {
                    github: "https://github.com",
                    live: "https://example.com"
                },
                coverImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
                screenshots: [
                    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
                    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop"
                ],
                createdAt: new Date("2025-11-15")
            },
            {
                title: "NexGen Banking UI",
                slug: "nexgen-banking",
                summary: "A sleek, modern mobile banking interface focused on simplicity, trust, and accessibility for Gen-Z.",
                description: `
## Problem & Motivation
Traditional banking apps are often cluttered, intimidating, and lack the fluidity expected by younger generations. The goal was to redefine the digital wallet experience from the ground up.

## Solution & Architecture
I designed and prototyped a mobile-first banking interface using React Native and Framer Motion. The UI leverages 'glassmorphism' to create a sense of depth and transparency.

- **Fluid Interactions**: Custom gesture-based navigation for all financial actions.
- **Adaptive Design**: Fully accessible with high-contrast modes and dynamic font scaling.
- **Biometric Ready**: Integrated multi-layer security visualizations.

## Results & Impact
- **User testing showed a 40% faster** task completion rate for fund transfers.
- **Top 5% design ranking** on several major curated UI showcase platforms.
- **Seamless dark/light mode** transition across the entire ecosystem.
        `,
                featured: true,
                tags: ["Mobile", "Fintech", "Design", "React Native"],
                techStack: ["React Native", "TypeScript", "Framer Motion", "Reanimated", "Figma"],
                links: {
                    github: "https://github.com",
                    live: "https://example.com"
                },
                coverImage: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1470&auto=format&fit=crop",
                screenshots: [
                    "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1470&auto=format&fit=crop",
                    "https://images.unsplash.com/photo-1616077168079-7e09a677fb2c?q=80&w=1470&auto=format&fit=crop"
                ],
                createdAt: new Date("2025-12-01")
            },
            {
                title: "AI Content Studio",
                slug: "ai-content-studio",
                summary: "SaaS platform leveraging LLMs to help teams generate high-quality, SEO-optimized content at scale.",
                description: `
## Problem & Motivation
Content creation is the highest cost for most marketing teams. Maintaining quality while increasing output is a constant challenge.

## Solution & Architecture
I built 'AI Content Studio' as a managed service for collaborative content generation. 

- **Async Generation**: Used a message queue (BullMQ) to handle long-running OpenAI requests.
- **Rich Text Editor**: Custom integrated editor with real-time AI suggestions.
- **Multi-Tenant**: Secure organization-based data isolation and user management.

## Results & Impact
- **Successfully processed** over 5,000 articles during beta testing.
- **Averaged 90+ SEO score** across all generated content.
- **Full Stripe integration** for automated tiered subscriptions.
        `,
                featured: false,
                tags: ["AI", "SaaS", "Next.js", "Node.js"],
                techStack: ["Next.js", "Express", "PostgreSQL", "OpenAI AI", "Redis", "BullMQ", "Stripe"],
                links: {
                    github: "https://github.com",
                    live: "https://example.com"
                },
                coverImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1632&auto=format&fit=crop",
                screenshots: [
                    "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1632&auto=format&fit=crop"
                ],
                createdAt: new Date("2025-10-20")
            },
            {
                title: "WorldView 3D Explorer",
                slug: "worldview-explorer",
                summary: "An interactive, map-based 3D globe for tracking geopolitical data and climate trends.",
                description: `
## Problem & Motivation
Visualizing large-scale global data in strictly 2D formats often hides significant spatial relationships and creates mental friction for researchers.

## Solution & Architecture
I developed WorldView to provide an immersive 3D experience for climate and socioeconomic data visualization.

- **3D Geospatial Engine**: Custom implementation of Mapbox GL JS 3D terrain and globes.
- **Dynamic Data Layers**: Real-time fetching of climate data from public APIs.
- **Cloud Optimized**: Used AWS S3 and CloudFront for high-resolution topographical assets.

## Results & Impact
- **Achieved 60fps performance** on moderate mobile hardware.
- **Used by 3 non-profit research teams** for preliminary visualization.
- **Extensible API** allowing for custom user-created data layers.
        `,
                featured: true,
                tags: ["Visualization", "Maps", "3D", "AWS"],
                techStack: ["React", "Mapbox GL JS", "Node.js", "AWS S3", "MongoDB"],
                links: {
                    github: "https://github.com",
                    live: "https://example.com"
                },
                coverImage: "https://images.unsplash.com/photo-1503220317375-aaad61436b1b?q=80&w=1470&auto=format&fit=crop",
                screenshots: [
                    "https://images.unsplash.com/photo-1503220317375-aaad61436b1b?q=80&w=1470&auto=format&fit=crop",
                    "https://images.unsplash.com/photo-1524850011238-e3d235c7d4c9?q=80&w=1474&auto=format&fit=crop"
                ],
                createdAt: new Date("2025-09-10")
            }
        ];
        await Project_1.default.insertMany(projects);
        console.log(`${projects.length} Demo Projects Created`);
        process.exit();
    }
    catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};
seedData();
