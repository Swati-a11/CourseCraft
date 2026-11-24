import express from 'express';
import auth from '../middleware/auth.js';
import { getDailyReminder } from '../controllers/reminderController.js';

const router = express.Router();

router.get('/', auth, getDailyReminder);

export default router;