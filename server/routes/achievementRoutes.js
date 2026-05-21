// server/routes/achievementRoutes.js

import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  getAchievements,
  getAchievementById,
  getAchievementByCourse,
  createAchievement,
  deleteAchievement,
  getAchievementStats,
} from '../controllers/achievementController.js';

const router = express.Router();

// Protected routes
router.get('/', protect, getAchievements);
router.get('/stats/user', protect, getAchievementStats);
router.get('/:id', protect, getAchievementById);
router.get('/course/:courseId', protect, getAchievementByCourse);

// Admin only (create and delete)
router.post('/', protect, createAchievement);
router.delete('/:id', protect, deleteAchievement);

export default router;
