import express from 'express';
import auth from '../middleware/auth.js';
import { getWeakTopics } from '../controllers/analyticsController.js';

const router = express.Router();

router.get('/api/weak-topics', auth, getWeakTopics);

export default router;