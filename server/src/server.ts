import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { env } from './config/env';
import { connectDB } from './config/db';
import authRoutes from './routes/auth.routes';
import projectRoutes from './routes/project.routes';
import messageRoutes from './routes/message.routes';
import blogRoutes from './routes/blog.routes';
import { errorHandler } from './middleware/errorHandler';
import { createAdmin } from './scripts/create_admin';
import { globalLimiter } from './middleware/rateLimiter';

const app = express();

// Security Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(globalLimiter);
// app.use(cors({
//   origin: (origin, callback) => {
//     // Allow requests with no origin (like mobile apps or curl requests)
//     if (!origin) return callback(null, true);
//     // Allow any localhost origin
//     if (origin.startsWith('http://localhost') || origin.startsWith('http://127.0.0.1')) {
//       return callback(null, true);
//     }
//     // Allow local network IP addresses (for mobile/phone testing)
//     if (origin.match(/^http:\/\/(10\.|192\.168\.|172\.(1[6-9]|2[0-9]|3[01])\.)/)) {
//       return callback(null, true);
//     }
//     // Check against CLIENT_URL env
//     if (origin === process.env.CLIENT_URL || origin === env.FRONTEND_ORIGIN) {
//       return callback(null, true);
//     }
//     callback(new Error('Not allowed by CORS'));
//   },
//   credentials: true
// }));
app.use(cors());
app.use(express.json());

// Serve uploads
app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));

app.get('/api/health', (req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/blogs', blogRoutes);

app.use(errorHandler);

const startServer = async () => {
  await connectDB();
  
  app.listen(env.PORT, () => {
    console.log(`Server running on port ${env.PORT}`);
  });
  // createAdmin()
};

startServer();
