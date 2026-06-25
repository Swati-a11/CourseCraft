import User from '../models/User.js';
import Course from '../models/Course.js';
import QuizResult from '../models/QuizResult.js';
import Enrollment from '../models/Enrollment.js';
import CourseProgress from '../models/CourseProgress.js';
import Progress from '../models/Progress.js';

const normalizeDateKey = (date) =>
  date ? new Date(date).toISOString().slice(0, 10) : null;

const computeDailyStreak = (dates) => {
  const uniqueDates = [...new Set(dates.filter(Boolean))].sort();

  if (uniqueDates.length === 0) return 0;

  let streak = 0;
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  const dateSet = new Set(uniqueDates);

  let current = new Date(today);

  while (dateSet.has(current.toISOString().slice(0, 10))) {
    streak++;
    current.setUTCDate(current.getUTCDate() - 1);
  }

  return streak;
};

export const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized - user not found",
      });
    }

    const progressDoc = await Progress.findOne({ user: userId });

    const enrollments = await Enrollment.find({ user: userId }).populate('course');

    const courseProgressRecords = await CourseProgress.find({ user: userId }).populate('course');

    const quizResults = await QuizResult.find({ user: userId }).populate('course');

    // SAFE ENROLLMENTS
    const enrolledCourses =
      enrollments
        ?.map((e) => e?.course)
        .filter(Boolean) || [];

    const enrolledCourseIds = enrolledCourses.map(c => c._id.toString());

    // Filter out orphaned records from unenrolled courses
    const validCourseProgressRecords = (courseProgressRecords || []).filter(
      r => r?.course && enrolledCourseIds.includes(r.course._id.toString())
    );

    const validQuizResults = (quizResults || []).filter(
      r => r?.course && enrolledCourseIds.includes(r.course._id.toString())
    );

    const coursesEnrolled = enrolledCourses.length;

    // TOPICS COMPLETED (SAFE)
    const topicsCompleted = validCourseProgressRecords.reduce((count, record) => {
      const topics = Array.isArray(record?.completedTopics)
        ? record.completedTopics
        : [];

      const completed = topics.filter(
        (t) => t?.notesCompleted && t?.videoCompleted && t?.quizPassed
      ).length;

      return count + completed;
    }, 0) || 0;

    const quizAttempts = validQuizResults.length;

    const averageQuizScore = quizAttempts
      ? Math.round(
          validQuizResults.reduce((sum, r) => sum + (r?.percentage || 0), 0) /
            quizAttempts
        )
      : 0;

    // QUIZ STATS MAP
    const topicStats = validQuizResults.reduce((acc, result) => {
      const topic = result?.topicTitle || 'Unknown Topic';
      const courseTitle = result?.course?.title || 'Unknown Course';

      if (!acc[topic]) {
        acc[topic] = {
          topic,
          courseTitle,
          totalScore: 0,
          attempts: 0,
        };
      }

      acc[topic].totalScore += result?.percentage || 0;
      acc[topic].attempts += 1;

      return acc;
    }, {});

    const weakTopics = Object.values(topicStats)
      .map((t) => {
        const avg = Math.round(t.totalScore / t.attempts);

        return {
          topic: t.topic,
          averageScore: avg,
          difficulty: avg < 60 ? 'Weak' : avg < 80 ? 'Moderate' : 'Strong',
          recommendation:
            avg < 60 ? 'Revise Notes' : avg < 80 ? 'Retake Quiz' : 'Watch Video',
          course: t.courseTitle,
        };
      })
      .sort((a, b) => a.averageScore - b.averageScore);

    const topicPerformance = Object.values(topicStats).map((t) => ({
      topic: t.topic,
      averageScore: Math.round(t.totalScore / t.attempts),
    }));

    const quizTrend = validQuizResults
      .sort(
        (a, b) =>
          new Date(a?.createdAt || 0) - new Date(b?.createdAt || 0)
      )
      .map((r) => ({
        date: normalizeDateKey(r?.createdAt),
        score: r?.percentage || 0,
      }));

    const courseProgress = enrolledCourses.map((course) => {
      const progress = validCourseProgressRecords.find(
        (r) =>
          r?.course?._id?.toString() === course?._id?.toString()
      );

      const totalTopics = course?.topics?.length || 0;

      const completedTopics = progress
        ? (progress.completedTopics || []).filter(
            (t) =>
              t?.notesCompleted &&
              t?.videoCompleted &&
              t?.quizPassed
          ).length
        : 0;

      return {
        courseId: course?._id,
        title: course?.title,
        completion: progress?.totalProgress || 0,
        completedTopics,
        totalTopics,
      };
    });

    const coursesCompleted =
      validCourseProgressRecords.filter((r) => r?.isCompleted).length || 0;

    const perfectScores =
      validQuizResults.filter((r) => r?.percentage === 100).length || 0;

    // STREAK SAFE
    const accessDates = validCourseProgressRecords
      .map((r) => normalizeDateKey(r?.lastAccessedAt || r?.createdAt))
      .filter(Boolean);

    const streak = computeDailyStreak(accessDates);

    // XP SYSTEM
    const totalXP =
      topicsCompleted * 50 +
      quizAttempts * 20 +
      perfectScores * 100 +
      streak * 10 +
      coursesCompleted * 500 +
      (streak >= 7 ? 200 : 0);

    const level = Math.floor(totalXP / 500) + 1;

    const badges = [];
    if (topicsCompleted > 0) badges.push('First Step');
    if (quizAttempts >= 3) badges.push('Quiz Master');
    if (perfectScores > 0) badges.push('Perfect Score');
    if (streak >= 7) badges.push('7-Day Streak');
    if (coursesCompleted > 0) badges.push('Course Finisher');
    if (totalXP >= 1000) badges.push('Knowledge Warrior');

    const recommendations = [];

    if (weakTopics.length > 0) {
      recommendations.push(
        `Revise ${weakTopics[0].topic}. Avg score ${weakTopics[0].averageScore}%`
      );
    }

    if (coursesCompleted < coursesEnrolled) {
      recommendations.push(
        `Complete ${coursesEnrolled - coursesCompleted} course(s)`
      );
    }

    recommendations.push(
      `Complete ${Math.max(0, 6 - topicsCompleted)} topics to level up`
    );

    const user = await User.findById(userId);

    return res.status(200).json({
      coursesEnrolled,
      coursesCompleted,
      topicsCompleted,
      averageQuizScore,
      weakTopics,
      gamification: {
        xp: totalXP,
        level,
        streak,
        badges,
        lastStreakReminderSent: user?.lastStreakReminderSent || null,
        lastActivityDate: user?.lastActivityDate || null,
      },
      recommendations,
      quizTrend,
      topicPerformance,
      courseProgress,
      leaderboard: [
        { rank: 1, name: 'You', xp: totalXP },
        { rank: 2, name: 'Aditi', xp: totalXP - 120 },
        { rank: 3, name: 'Rahul', xp: totalXP - 240 },
      ],
    });
  } catch (error) {
    console.error('Dashboard Stats Error:', error);
    return res.status(500).json({
      message: error.message,
    });
  }
};