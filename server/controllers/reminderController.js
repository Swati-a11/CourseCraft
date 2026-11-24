import CourseProgress from '../models/CourseProgress.js';
import WeakTopic from '../models/WeakTopic.js';

export const getDailyReminder = async (req, res) => {
  try {
    const [course, weakTopic] = await Promise.all([
      CourseProgress.findOne({ user: req.user._id, isCompleted: false }).populate('course', 'title').sort({ lastAccessedAt: -1 }).lean(),
      WeakTopic.findOne({ user: req.user._id, status: { $ne: 'Mastered' }, averageScore: { $lt: 70 } }).sort({ averageScore: 1 }).lean(),
    ]);
    const reminders = [];
    if (course?.course) reminders.push({ type: 'course', title: 'Continue your course', message: course.course.title, courseId: course.course._id });
    if (weakTopic) reminders.push({ type: 'review', title: 'Review a quiz topic', message: weakTopic.topicTitle, courseId: weakTopic.course, topicIndex: weakTopic.topicId });
    res.json({ reminders });
  } catch {
    res.status(500).json({ message: 'Failed to fetch reminders.' });
  }
};
