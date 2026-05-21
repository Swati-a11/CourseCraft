// server/controllers/dashboardController.js

import User from '../models/User.js';
import Course from '../models/Course.js';
import QuizResult from '../models/QuizResult.js';
import Enrollment from '../models/Enrollment.js';
import CourseProgress from '../models/CourseProgress.js';
import Progress from '../models/Progress.js';

const normalizeDateKey = (date) =>
  new Date(date).toISOString().slice(0, 10);

const computeDailyStreak = (dates) => {
  const uniqueDates = [...new Set(dates)].sort();
  if (uniqueDates.length === 0) return 0;

  let streak = 0;
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const dateSet = new Set(uniqueDates);

  let current = new Date(today);
  while (dateSet.has(current.toISOString().slice(0, 10))) {
    streak += 1;
    current.setUTCDate(current.getUTCDate() - 1);
  }

  return streak;
};

export const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const progressDoc = await Progress.findOne({ user: userId }).populate(
      'enrolledCourses'
    );
    const enrollments = await Enrollment.find({ user: userId }).populate(
      'course'
    );
    const courseProgressRecords = await CourseProgress.find({ user: userId }).populate(
      'course'
    );
    const quizResults = await QuizResult.find({ user: userId }).populate(
      'course'
    );

    const enrolledCourses = enrollments.length
      ? enrollments.map((enrollment) => enrollment.course)
      : progressDoc?.enrolledCourses || [];
    const coursesEnrolled = enrolledCourses.length;
    const topicsCompleted = courseProgressRecords.length
      ? courseProgressRecords.reduce((count, record) => {
          return (
            count +
            (record.completedTopics || []).filter(
              (topic) =>
                topic.notesCompleted && topic.videoCompleted && topic.quizPassed
            ).length
          );
        }, 0)
      : progressDoc?.completedTopics?.length || 0;

    const quizAttempts = quizResults.length;
    const averageQuizScore = quizAttempts
      ? Math.round(
          quizResults.reduce((sum, result) => sum + result.percentage, 0) /
            quizAttempts
        )
      : 0;

    const topicStats = quizResults.reduce((acc, result) => {
      const topic = result.topicTitle || 'Unknown Topic';
      const courseTitle = result.course?.title || 'Unknown Course';

      if (!acc[topic]) {
        acc[topic] = {
          topic,
          courseTitle,
          totalScore: 0,
          attempts: 0,
        };
      }

      acc[topic].totalScore += result.percentage;
      acc[topic].attempts += 1;
      return acc;
    }, {});

    const weakTopics = Object.values(topicStats)
      .map((topicData) => {
        const averageScore = Math.round(
          topicData.totalScore / topicData.attempts
        );
        const difficulty =
          averageScore < 60
            ? 'Weak'
            : averageScore < 80
            ? 'Moderate'
            : 'Strong';
        const recommendation =
          averageScore < 60
            ? 'Revise Notes'
            : averageScore < 80
            ? 'Retake Quiz'
            : 'Watch Video';

        return {
          topic: topicData.topic,
          averageScore,
          difficulty,
          recommendation,
          course: topicData.courseTitle,
        };
      })
      .sort((a, b) => a.averageScore - b.averageScore);

    const topicPerformance = Object.values(topicStats)
      .map((topicData) => ({
        topic: topicData.topic,
        averageScore: Math.round(topicData.totalScore / topicData.attempts),
      }))
      .sort((a, b) => b.averageScore - a.averageScore);

    const quizTrend = quizResults
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      .map((result) => ({
        date: normalizeDateKey(result.createdAt),
        score: result.percentage,
      }));

    const courseProgress = enrolledCourses.map((course) => {
      const progress = courseProgressRecords.find(
        (record) => record.course?._id?.toString() === course._id.toString()
      );
      const courseTopics = course.topics?.length || 0;
      const completedTopicCount = progress
        ? (progress.completedTopics || []).filter(
            (topic) =>
              topic.notesCompleted && topic.videoCompleted && topic.quizPassed
          ).length
        : 0;

      return {
        courseId: course._id,
        title: course.title,
        completion: progress?.totalProgress ?? 0,
        completedTopics: completedTopicCount,
        totalTopics: courseTopics,
      };
    });

    const coursesCompleted = courseProgressRecords.length
      ? courseProgressRecords.filter((record) => record.isCompleted).length
      : progressDoc?.progressPercentage >= 100
      ? coursesEnrolled
      : 0;

    const perfectScores = quizResults.filter(
      (result) => result.percentage === 100
    ).length;

    // Improved streak calculation based on CourseProgress lastAccessedAt
    const progressAccessDates = courseProgressRecords
      .map((record) => record.lastAccessedAt || record.createdAt)
      .filter((date) => date)
      .sort((a, b) => new Date(b) - new Date(a));

    const streak = computeDailyStreak(
      progressAccessDates.map((date) => normalizeDateKey(date))
    );

    // Get incomplete topics for reminders
    const incompleteCourseTopics = courseProgressRecords
      .filter((record) => !record.isCompleted)
      .map((record) => {
        const incompleteTopics = (record.completedTopics || []).filter(
          (topic) =>
            !(
              topic.notesCompleted &&
              topic.videoCompleted &&
              topic.quizPassed
            )
        );
        return {
          courseTitle: record.course?.title,
          courseId: record.course?._id,
          incompleteTopics: incompleteTopics.slice(0, 3), // Top 3 unfinished
          totalIncomplete: incompleteTopics.length,
        };
      })
      .filter((item) => item.totalIncomplete > 0);

    // Get upcoming quiz deadlines (mock - based on course structure)
    const upcomingReminders = incompleteCourseTopics.map((item) => ({
      type: 'unfinished',
      course: item.courseTitle,
      count: item.totalIncomplete,
      icon: '📚',
    }));

    // Add quiz attempts reminder
    if (quizResults.length > 0) {
      const lastQuizDate = new Date(
        Math.max(...quizResults.map((q) => new Date(q.createdAt)))
      );
      const daysSinceLastQuiz = Math.floor(
        (new Date() - lastQuizDate) / (1000 * 60 * 60 * 24)
      );
      if (daysSinceLastQuiz > 2) {
        upcomingReminders.unshift({
          type: 'quiz',
          message: `Haven't taken a quiz in ${daysSinceLastQuiz} days`,
          icon: '📝',
        });
      }
    }

    const lastQuiz = quizResults
      .slice()
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
    const lastQuizScore = lastQuiz ? lastQuiz.percentage : 0;

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
        `Revise ${weakTopics[0].topic}. Your average score is ${weakTopics[0].averageScore}%`
      );
    }
    if (coursesCompleted < coursesEnrolled) {
      recommendations.push(
        `Complete ${Math.max(
          0,
          coursesEnrolled - coursesCompleted
        )} more course(s) to earn bonus XP.`
      );
    }
    recommendations.push(
      `Complete ${Math.max(0, 6 - topicsCompleted)} more topics to reach Level ${
        level + 1
      }.`
    );

    res.status(200).json({
      coursesEnrolled,
      coursesCompleted,
      topicsCompleted,
      averageQuizScore,
      lastQuizScore,
      weakTopics,
      gamification: {
        xp: totalXP,
        level,
        streak,
        badges,
      },
      recommendations,
      upcomingReminders,
      courseProgress,
      quizTrend,
      topicPerformance,
      leaderboard: [
        { rank: 1, name: 'You', xp: totalXP },
        { rank: 2, name: 'Aditi', xp: totalXP - 120 },
        { rank: 3, name: 'Rahul', xp: totalXP - 240 },
      ],
    });
  } catch (error) {
    console.error('Dashboard Stats Error:', error.message, error.stack);
    res.status(500).json({
      message: error.message,
    });
  }
};