import express from 'express';
import { subscribeNotification, runNotificationSweep } from '../controllers/gamificationController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// Route to subscribe to notifications (requires authentication)
router.post('/subscribe', authMiddleware, subscribeNotification);

// Route to trigger a notification sweep manually or via a cron job
router.post('/sweep', runNotificationSweep);

export default router;
