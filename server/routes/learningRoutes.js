import express from 'express';
import authMiddleware from '../middleware/auth.js';
import {
  getLearningCourseData,
  getTopicData,
  submitQuiz,
  getProgressData,
  getNextAdaptiveQuestion,
  savePersonalNotes
} from '../controllers/learningController.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/api/course/:courseId', getLearningCourseData);
router.put('/api/course/:courseId/notes', savePersonalNotes);
router.get('/api/course/:courseId/topic/:topicIndex', getTopicData);
router.post('/api/quiz/submit', submitQuiz);
router.get('/api/progress', getProgressData);
router.post('/api/quiz/adaptive-next', getNextAdaptiveQuestion);

export default router;
