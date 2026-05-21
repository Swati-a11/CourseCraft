import express from 'express';
import { protect } from '../middleware/auth.js';
import { getQuizResults, saveQuizResult } from '../controllers/quizController.js';

const router = express.Router();

router.get('/', protect, getQuizResults);
router.post('/', protect, saveQuizResult);

export default router;
