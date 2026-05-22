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
import enrollmentRoutes from './routes/enrollmentRoutes.js';
import youtubeRoutes from './routes/youtubeRoutes.js';
import pdfRoutes from './routes/pdfRoutes.js';
import Progress from './models/Progress.js';

// ENV
dotenv.config({ path: path.resolve('./.env') });

const app = express();

/* =========================
   CORS CONFIG (FIXED)
========================= */

const allowedOrigins = [
  "http://localhost:5173",
  "https://course-craft-ten.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    const allowed = [
      "http://localhost:5173",
      "https://course-craft-ten.vercel.app"
    ];

    if (allowed.includes(origin)) {
      return callback(null, true);
    }

    return callback(null, false);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// IMPORTANT: handle preflight requests
app.options("*", cors());

/* =========================
   MIDDLEWARE
========================= */

app.use(express.json());

// remove unwanted headers
app.use((req, res, next) => {
  res.removeHeader("Content-Security-Policy");
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

// static files
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

/* =========================
   BASIC ROUTES
========================= */

app.get('/', (req, res) => {
  res.send('CourseCraft API is running...');
});

app.get('/favicon.ico', (req, res) => res.status(204).end());

/* =========================
   DEBUG LOGS
========================= */

console.log('CWD:', process.cwd());
console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'LOADED' : 'MISSING');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'LOADED' : 'MISSING');
console.log('GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? 'LOADED' : 'MISSING');
console.log(Progress.schema.obj);

/* =========================
   DB + SERVER START
========================= */

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGODB_URI;

if (!MONGO_URI) {
  console.error('❌ MONGODB_URI is missing');
  process.exit(1);
}

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected');

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB Error:', err.message);
    process.exit(1);
  });