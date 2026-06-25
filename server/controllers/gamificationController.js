import User from '../models/User.js';
import { sendSystemNotification } from '../services/emailService.js';

export const getGamification = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
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