import express from 'express';
import { subscribeNotification, runNotificationSweep } from '../controllers/gamificationController.js';
import authMiddleware from '../middleware/auth.js';
import { sendSystemNotification } from '../services/emailService.js';

const router = express.Router();

// Route to subscribe to notifications (requires authentication)
router.post('/subscribe', authMiddleware, subscribeNotification);

// Route to trigger a notification sweep manually or via a cron job
router.post('/sweep', runNotificationSweep);

// Test welcome email verification route
router.get('/test-welcome', authMiddleware, async (req, res) => {
  try {
    const userEmail = req.user.email;
    const username = req.user.name || 'User';

    if (!userEmail) {
      return res.status(400).json({
        success: false,
        message: "No email address found for the registered user profile."
      });
    }

    const subject = "Welcome to CourseCraft 🚀 - Verification Success";
    const body = `Hello ${username}, Your CourseCraft account communication engine is fully operational! Your emails are safely routing via Resend configuration.`;

    await sendSystemNotification(userEmail, subject, body);

    return res.status(200).json({
      success: true,
      message: "Verification email successfully dispatched to registered inbox."
    });
  } catch (error) {
    console.error("Test welcome email error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error dispatching test welcome email.",
      error: error.message
    });
  }
});

export default router;
