import express from "express";

import authMiddleware from "../middleware/auth.js";

import Progress from "../models/Progress.js";

const router = express.Router();

router.post("/", authMiddleware, async (req, res) => {
  try {
    const {
      courseId,
      topicId,
      notesCompleted,
      videoCompleted,
      quizCompleted,
      quizScore,
    } = req.body;

    let progress = await Progress.findOne({
      user: req.user._id,
      course: courseId,
      topicId,
    });

    if (!progress) {
      progress = new Progress({
        user: req.user._id,
        course: courseId,
        topicId,
      });
    }

    if (notesCompleted !== undefined)
      progress.notesCompleted = notesCompleted;

    if (videoCompleted !== undefined)
      progress.videoCompleted = videoCompleted;

    if (quizCompleted !== undefined)
      progress.quizCompleted = quizCompleted;

    if (quizScore !== undefined)
      progress.quizScore = quizScore;

    await progress.save();

    res.json(progress);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to save progress",
    });
  }
});

export default router;