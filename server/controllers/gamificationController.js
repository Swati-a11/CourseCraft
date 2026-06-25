import User from '../models/User.js';
import { sendSystemNotification, sendContinuityReminder } from '../services/emailService.js';

export const getGamification = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the user is in danger of losing their streak (last check-in between 20 and 24 hours ago)
    if (user.lastActivityDate && user.streak > 0) {
      const now = new Date();
      const lastActive = new Date(user.lastActivityDate);
      const diffTime = now - lastActive;
      const diffHours = diffTime / (1000 * 60 * 60);

      // Check if they are in the danger zone (between 20 and 24 hours)
      // and a reminder has not been sent recently (within last 20 hours)
      const lastReminder = user.lastStreakReminderSent ? new Date(user.lastStreakReminderSent) : null;
      const hoursSinceReminder = lastReminder ? (now - lastReminder) / (1000 * 60 * 60) : Infinity;

      if (diffHours >= 20 && diffHours < 24 && hoursSinceReminder >= 20) {
        console.log(`🔥 Sending streak continuity reminder to ${user.email} (streak: ${user.streak})`);
        sendContinuityReminder(user.email, user.name, user.streak).catch(err => {
          console.error("Background Continuity Reminder Error:", err);
        });

        user.lastStreakReminderSent = now;
        await user.save();
      }
    }

    const badges = ['🏅 First Step'];
    if (user.streak >= 5) {
      badges.push('🔥 Consistency Champion');
    }
    if (user.xp >= 100) {
      badges.push('🧠 Quiz Master');
    }
    if (user.xp >= 500) {
      badges.push('🏆 Course Finisher');
    }

    res.json({
      streak: user.streak || 0,
      totalPoints: user.xp || 0,
      badges: badges,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch gamification data',
      error: error.message
    });
  }
};

export const checkInUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const now = new Date();
    let currentStreak = user.streak || 0;

    if (!user.lastActivityDate) {
      currentStreak = 1;
    } else {
      const lastActive = new Date(user.lastActivityDate);
      const lastActiveDateOnly = new Date(lastActive.getFullYear(), lastActive.getMonth(), lastActive.getDate());
      const nowDateOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      const diffTime = nowDateOnly - lastActiveDateOnly;
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        currentStreak += 1;
      } else if (diffDays > 1) {
        currentStreak = 1;
      }
    }

    user.streak = currentStreak;
    user.lastActivityDate = now;
    user.xp = (user.xp || 0) + 10; // Reward 10 XP for checking in

    await user.save();

    // Trigger milestone notification email
    if (currentStreak > 0 && currentStreak % 5 === 0) {
      await sendSystemNotification(
        user.email,
        "🔥 Consistency Milestone Achieved!",
        `Congratulations ${user.name}! You've reached a check-in streak of ${currentStreak} days on CourseCraft. Keep up the amazing momentum!`
      );
    }

    res.status(200).json({
      success: true,
      message: 'Checked in successfully',
      streak: user.streak,
      xp: user.xp,
    });
  } catch (error) {
    console.error('Check-in Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to perform daily check-in',
      error: error.message,
    });
  }
};

export const subscribeNotification = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email parameter is required',
      });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    user.email = email.toLowerCase().trim();
    await user.save();

    try {
      await sendContinuityReminder(email, user.name, user.streak);
    } catch (emailErr) {
      console.error('Failed to send subscription confirmation email:', emailErr);
    }

    return res.status(200).json({
      success: true,
      message: 'Subscribed to notifications successfully',
      email: user.email,
    });
  } catch (error) {
    console.error('Subscribe Notification Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to subscribe to notifications',
      error: error.message,
    });
  }
};

export const runNotificationSweep = async (req, res) => {
  try {
    const users = await User.find({ streak: { $gt: 0 }, lastActivityDate: { $ne: null } });
    const now = new Date();
    let sentCount = 0;

    for (const user of users) {
      const lastActive = new Date(user.lastActivityDate);
      const diffTime = now - lastActive;
      const diffHours = diffTime / (1000 * 60 * 60);

      const lastReminder = user.lastStreakReminderSent ? new Date(user.lastStreakReminderSent) : null;
      const hoursSinceReminder = lastReminder ? (now - lastReminder) / (1000 * 60 * 60) : Infinity;

      if (diffHours >= 20 && diffHours < 24 && hoursSinceReminder >= 20) {
        console.log(`🔥 [Sweep] Sending streak continuity reminder to user: ${user.email}`);
        await sendContinuityReminder(user.email, user.name, user.streak);
        user.lastStreakReminderSent = now;
        await user.save();
        sentCount++;
      }
    }

    return res.status(200).json({
      success: true,
      message: `Notification sweep completed. Sent ${sentCount} reminders.`,
    });
  } catch (error) {
    console.error('Sweep Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Sweep failed',
      error: error.message,
    });
  }
};