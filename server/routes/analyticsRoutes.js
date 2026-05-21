import express from 'express';
import { getWeakTopics } from '../controllers/analyticsController.js';

const router = express.Router();

router.get('/weak-topics', getWeakTopics);

export default router;