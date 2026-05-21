import QuizResult from '../models/QuizResult.js';
import Progress from '../models/Progress.js';
import TopicProgress from '../models/TopicProgress.js';
// GET QUIZ RESULTS
export const getQuizResults = async (req, res) => {
  try {
    const quizResults = await QuizResult.find({ user: req.user._id }).sort({ createdAt: -1 });

    res.status(200).json(quizResults);
  } catch (error) {
    console.error('Get Quiz Results Error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

// SAVE QUIZ RESULT
export const saveQuizResult = async (req, res) => {
  try {
    const {
      courseId,
      topicId = '',
      topicTitle,
      answers,
      score,
      totalQuestions,
      percentage,
      passed = false,
    } = req.body;

    if (!topicId || !topicTitle || totalQuestions == null || percentage == null) {
      return res.status(400).json({
        message: 'Missing required quiz result fields',
      });
    }

    const quizResult = await QuizResult.create({
      user: req.user._id,
      course: courseId || null,
      topicId,
      topicTitle,
      score,
      totalQuestions,
      percentage,
      answers,
    });

   const progress = await TopicProgress.findOneAndUpdate(
  {
    user: req.user._id,
    topicId: String(topicId),
  },
  {
    $set: {
      topicTitle,
      quizAttempted: true,
      quizPassed: passed,
      score: percentage,
      lastUpdated: new Date(),
    },
  },
  {
    new: true,
    upsert: true,
  }
);

    res.status(201).json({
      quizResult,
      progress,
    });
  } catch (error) {
    console.error('Save Quiz Result Error:', error.message);
    res.status(500).json({ message: error.message });
  }
};