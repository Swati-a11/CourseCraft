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

router.get('/course/:courseId', getLearningCourseData);
router.put('/course/:courseId/notes', savePersonalNotes);
router.get('/course/:courseId/topic/:topicIndex', getTopicData);
router.post('/quiz/submit', submitQuiz);
router.get('/progress', getProgressData);
router.post('/quiz/adaptive-next', getNextAdaptiveQuestion);

export default router;
