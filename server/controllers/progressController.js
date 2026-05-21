// server/controllers/progressController.js

import Progress from '../models/Progress.js';

// GET /api/progress
export const getUserProgress = async (req, res) => {
  try {
    // Find existing progress
    let progress = await Progress.findOne({ user: req.user._id });

    // If no document exists, create one
    if (!progress) {
      progress = await Progress.create({
        user: req.user._id,
        topicId: '',
        completedTopics: [],
        enrolledCourses: [],
        progressPercentage: 0,
        notesCompleted: false,
        videoCompleted: false,
        quizPassed: false,
        quizAttempted: false,
        score: 0,
        lastVisitedTopic: '',
      });
    }

    res.status(200).json(progress);
  } catch (error) {
    console.error('Get Progress Error:', error.message, error.stack);
    res.status(500).json({
      message: error.message,
    });
  }
};

// POST /api/progress
export const updateProgress = async (req, res) => {
  try {
    const {
      topicId = '',
      completedTopics = [],
      enrolledCourses = [],
      progressPercentage = 0,
      notesCompleted = false,
      videoCompleted = false,
      quizPassed = false,
      quizAttempted = false,
      score = 0,
      lastVisitedTopic = '',
    } = req.body;

    const update = {
      topicId,
      completedTopics,
      enrolledCourses,
      progressPercentage,
      notesCompleted,
      videoCompleted,
      quizPassed,
      quizAttempted,
      score,
      lastVisitedTopic,
    };

    const progress = await Progress.findOneAndUpdate(
      { user: req.user._id },
      { $set: update },
      {
        new: true,
        upsert: true,
      }
    );
    res.status(200).json(progress);
  } catch (error) {
    console.error('Update Progress Error:', error.message, error.stack);
    res.status(500).json({
      message: error.message,
    });
  }
};