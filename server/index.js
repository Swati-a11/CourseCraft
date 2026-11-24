import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve('./.env') });
process.env.JWT_SECRET = process.env.JWT_SECRET ? process.env.JWT_SECRET.trim().replace(/\r/g, '') : undefined;

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { corsOptions } from './middleware/corsOptions.js';

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
import enrollmentRoutes from './routes/enrollmentRoutes.js';
import youtubeRoutes from './routes/youtubeRoutes.js';
import pdfRoutes from './routes/pdfRoutes.js';
import learningRoutes from './routes/learningRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import documentRoutes from './routes/documentRoutes.js';
import Progress from './models/Progress.js';

const app = express();

/* =========================
   CORS CONFIG (FIXED)
========================= */


app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));

/* =========================
   MIDDLEWARE
========================= */

app.use(express.json());

// remove unwanted headers & set permissions policy
app.use((req, res, next) => {
  res.removeHeader("Content-Security-Policy");
  res.setHeader('Permissions-Policy', 'compute-pressure=*');
  next();
});

/* =========================
   ROUTES
========================= */

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
app.use('/api/learning', learningRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/documents', documentRoutes);

// static files
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

/* =========================
   BASIC ROUTES
========================= */

app.get('/', (req, res) => {
  res.send('CourseCraft API is running...');
});

app.get('/api/status', (req, res) => {
  const states = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting"
  };
  res.json({
    status: "online",
    database: states[mongoose.connection.readyState] || "unknown",
    jwtSecretLoaded: !!process.env.JWT_SECRET,
    port: PORT
  });
});

app.get('/favicon.ico', (req, res) => res.status(204).end());

/* =========================
   DEBUG LOGS
========================= */

console.log('CWD:', process.cwd());
console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'LOADED' : 'MISSING');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'LOADED' : 'MISSING');
console.log('GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? 'LOADED' : 'MISSING');
console.log('YOUTUBE_API_KEY:', process.env.YOUTUBE_API_KEY ? 'LOADED' : 'MISSING');
console.log(Progress.schema.obj);

/* =========================
   DB + SERVER START
 ========================= */

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('❌ CRITICAL ENGINE ACCELERATION FAILURE: Both process.env.MONGODB_URI and process.env.MONGO_URI resolved to undefined.');
  console.log('Current available process.env keys:', Object.keys(process.env));
  process.exit(1);
}

// Start listening immediately so that Render health checks pass and preflight requests do not hang
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected Successfully');
  })
  .catch((err) => {
    console.error('❌ MongoDB Connection Error:', err.message);
    // Log the error but keep the server running so the routing proxy doesn't return 502/CORS errors
  });
