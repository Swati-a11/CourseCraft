// server/routes/progressRoutes.js

import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  getUserProgress,
  updateProgress,
} from '../controllers/progressController.js';

const router = express.Router();

// Get logged-in user's progress
router.get('/', protect, getUserProgress);

// Update progress
router.post('/', protect, updateProgress);

export default router;