import express from 'express';
import authMiddleware from '../middleware/auth.js';
import { getQuizResults, saveQuizResult } from '../controllers/quizController.js';

const router = express.Router();

router.get('/', authMiddleware, getQuizResults);
router.post('/', authMiddleware, saveQuizResult);

export default router;
