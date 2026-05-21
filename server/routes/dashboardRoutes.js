// server/routes/dashboardRoutes.js

import express from 'express';
import { protect } from '../middleware/auth.js';
import { getDashboardStats } from '../controllers/dashboardController.js';

const router = express.Router();

// GET /api/dashboard/stats
router.get('/stats', protect, getDashboardStats);

export default router;