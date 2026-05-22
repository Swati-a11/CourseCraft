import dotenv from 'dotenv';
import path from 'path';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

// Routes
import authRoutes from './routes/authRoutes.js';
import progressRoutes from './routes/progressRoutes.js';
import studyPlanRoutes from './routes/studyPlan.routes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import gamificationRoutes from './routes/gamificationRoutes.js';
import reminderRoutes from './routes/reminderRoutes.js';
import dashboardRoutes from "./routes/dashboardRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import courseProgressRoutes from "./routes/courseProgressRoutes.js";
import achievementRoutes from "./routes/achievementRoutes.js";
import quizRoutes from './routes/quizRoutes.js';
import Progress from './models/Progress.js';
import enrollmentRoutes from './routes/enrollmentRoutes.js';
import youtubeRoutes from './routes/youtubeRoutes.js';
import pdfRoutes from './routes/pdfRoutes.js';


// Load environment variables from server/.env
dotenv.config({
  path: path.resolve('./.env'),
  override: true,
});

const app = express();

// Middleware
// Configure CORS to accept origins from an environment variable (comma-separated)

// Also allow the Vercel deployment origin so production builds can call the API
const vercelOrigin = 'https://course-craft-ten.vercel.app';
if (!allowedOrigins.includes(vercelOrigin)) allowedOrigins.push(vercelOrigin);

app.use(
  const rawOrigins = process.env.CORS_ORIGINS || 'http://localhost:5173';
const allowedOrigins = rawOrigins.split(',').map(s => s.trim());

app.use(
  cors({
    origin: (incomingOrigin, callback) => {
      if (!incomingOrigin) return callback(null, true);

      if (allowedOrigins.includes(incomingOrigin)) {
        return callback(null, true);
      }

      return callback(null, true); // TEMP SAFE MODE (no crash)
    },
    credentials: true,
  })
);
);

// Remove any unexpected Content-Security-Policy header from backend responses
app.use((req, res, next) => {
  res.removeHeader('Content-Security-Policy');
  next();
});

app.use(express.json());

// API Routes
app.use('/api/auths', authRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/course-progress', courseProgressRoutes);
app.use('/api/study-plan', studyPlanRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/gamification', gamificationRoutes);
app.use('/api/reminders', reminderRoutes);
app.use('/api/quiz-results', quizRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/youtube', youtubeRoutes);
app.use('/api/pdf', pdfRoutes);

// Serve uploads folder statically for PDF downloads
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Root Route
app.get('/', (req, res) => {
  res.send('CourseCraft API is running...');
});

// Prevent favicon 404 warning
app.get('/favicon.ico', (req, res) => res.status(204).end());

// Debug Logs
console.log('CWD:', process.cwd());
console.log(
  'MONGODB_URI:',
  process.env.MONGODB_URI ? 'LOADED' : 'MISSING'
);
console.log(
  'JWT_SECRET:',
  process.env.JWT_SECRET ? 'LOADED' : 'MISSING'
);
console.log(
  'GEMINI_API_KEY:',
  process.env.GEMINI_API_KEY ? 'LOADED' : 'MISSING'
);
console.log(Progress.schema.obj);

// Database Connection and Server Start
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGODB_URI;

if (!MONGO_URI) {
  console.error('❌ MONGODB_URI is missing in .env file');
  process.exit(1);
}

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected');

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌐 http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB Connection Error:', err.message);
    process.exit(1);
  });