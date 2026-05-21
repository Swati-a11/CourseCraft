import express from 'express';
import { getDailyReminder } from '../controllers/reminderController.js';

const router = express.Router();

router.get('/', getDailyReminder);

export default router;