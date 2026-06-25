import express from 'express';
import { getGamification, checkInUser } from '../controllers/gamificationController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

router.get('/', authMiddleware, getGamification);
router.post('/check-in', authMiddleware, checkInUser);

export default router;