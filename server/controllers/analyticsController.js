import WeakTopic from '../models/WeakTopic.js';

export const getWeakTopics = async (req, res) => {
  try {
    const weakTopics = await WeakTopic.find({ user: req.user._id, status: { $ne: 'Mastered' }, averageScore: { $lt: 70 } }).sort({ averageScore: 1 }).lean();
    res.json({ weakTopics });
  } catch {
    res.status(500).json({ message: 'Failed to fetch topics to review.' });
  }
};
