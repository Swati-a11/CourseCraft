// server/controllers/achievementController.js

import Achievement from '../models/Achievement.js';
import CourseProgress from '../models/CourseProgress.js';
import Enrollment from '../models/Enrollment.js';

// GET /api/achievements - Get all achievements/certificates for logged-in user
export const getAchievements = async (req, res) => {
  try {
    const userId = req.user._id;
    const { type } = req.query;

    let query = { user: userId };

    if (type) {
      query.type = type;
    }

    const achievements = await Achievement.find(query)
      .populate('course', 'title description')
      .sort({ earnedAt: -1 });

    res.status(200).json(achievements);
  } catch (error) {
    console.error('Get Achievements Error:', error);
    res.status(500).json({ message: error.message });
  }
};

// GET /api/achievements/:id - Get specific achievement/certificate
export const getAchievementById = async (req, res) => {
  try {
    const achievement = await Achievement.findById(req.params.id).populate(
      'course',
      'title description'
    );

    if (!achievement) {
      return res.status(404).json({ message: 'Achievement not found' });
    }

    // Check ownership
    if (achievement.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: 'Not authorized to view this achievement' });
    }

    res.status(200).json(achievement);
  } catch (error) {
    console.error('Get Achievement By ID Error:', error);
    res.status(500).json({ message: error.message });
  }
};

// GET /api/achievements/course/:courseId - Get achievement for a specific course
export const getAchievementByCourse = async (req, res) => {
  try {
    const userId = req.user._id;
    const { courseId } = req.params;

    const achievement = await Achievement.findOne({
      user: userId,
      course: courseId,
      type: 'certificate',
    }).populate('course', 'title description');

    if (!achievement) {
      return res
        .status(404)
        .json({ message: 'No certificate found for this course' });
    }

    res.status(200).json(achievement);
  } catch (error) {
    console.error('Get Achievement By Course Error:', error);
    res.status(500).json({ message: error.message });
  }
};

// POST /api/achievements - Create manual achievement (admin only)
export const createAchievement = async (req, res) => {
  try {
    const { user, course, type, title, description, certificateUrl } = req.body;

    const achievement = new Achievement({
      user,
      course,
      type: type || 'badge',
      title,
      description,
      certificateUrl,
      issueDate: new Date(),
    });

    await achievement.save();

    res.status(201).json(achievement);
  } catch (error) {
    console.error('Create Achievement Error:', error);
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/achievements/:id - Delete achievement (admin only)
export const deleteAchievement = async (req, res) => {
  try {
    const achievement = await Achievement.findById(req.params.id);

    if (!achievement) {
      return res.status(404).json({ message: 'Achievement not found' });
    }

    await achievement.deleteOne();

    res.status(200).json({ message: 'Achievement deleted successfully' });
  } catch (error) {
    console.error('Delete Achievement Error:', error);
    res.status(500).json({ message: error.message });
  }
};

// GET /api/achievements/stats/user - Get achievement statistics for user
export const getAchievementStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const totalCertificates = await Achievement.countDocuments({
      user: userId,
      type: 'certificate',
    });

    const totalBadges = await Achievement.countDocuments({
      user: userId,
      type: 'badge',
    });

    const totalEnrolledCourses = await Enrollment.countDocuments({ user: userId });

    const enrollments = await Enrollment.find({ user: userId }).select('course');
    const progressRecords = await CourseProgress.find({ user: userId }).select(
      'course totalProgress isCompleted'
    );

    const progressMap = new Map(
      progressRecords.map((progress) => [
        progress.course.toString(),
        progress.totalProgress ?? 0,
      ])
    );

    let completedCourses = 0;
    let totalProgressSum = 0;

    enrollments.forEach((enrollment) => {
      const courseId = enrollment.course.toString();
      const progressValue = progressMap.get(courseId) ?? 0;
      totalProgressSum += progressValue;
      if (progressValue === 100) {
        completedCourses += 1;
      }
    });

    const inProgressCourses = totalEnrolledCourses - completedCourses;
    const averageProgress = totalEnrolledCourses
      ? Math.round(totalProgressSum / totalEnrolledCourses)
      : 0;

    res.status(200).json({
      totalCertificates,
      totalBadges,
      totalEnrolledCourses,
      completedCourses,
      inProgressCourses,
      averageProgress,
    });
  } catch (error) {
    console.error('Get Achievement Stats Error:', error);
    res.status(500).json({ message: error.message });
  }
};
