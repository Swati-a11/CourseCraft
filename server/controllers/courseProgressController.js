import mongoose from "mongoose";
import CourseProgress from "../models/CourseProgress.js";
import Course from "../models/Course.js";
import Achievement from "../models/Achievement.js";

/**
 * Helper function to validate/resolve courseId (ObjectId or slug)
 */
const resolveCourseId = async (courseId) => {
  // Check if it's a valid MongoDB ObjectId
  if (mongoose.Types.ObjectId.isValid(courseId)) {
    return new mongoose.Types.ObjectId(courseId);
  }

  // Otherwise, try to find course by title or shortId
  const query = [{ title: courseId }];
  
  if (!isNaN(courseId)) {
    query.push({ shortId: Number(courseId) });
  }

  const course = await Course.findOne({
    $or: query,
  });

  if (course) {
    return course._id;
  }

  // If still not found, return null so we don't cause a Mongoose CastError
  return null;
};

/**
 * GET single course progress
 */
export const getCourseProgress = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user._id;

    // Validate and resolve courseId
    const resolvedCourseId = await resolveCourseId(courseId);

    const progress = await CourseProgress.findOne({
      user: userId,
      course: resolvedCourseId,
    }).populate("course", "title");

    if (!progress) {
      return res.status(200).json({
        totalProgress: 0,
        completedTopics: [],
        isCompleted: false,
      });
    }

    res.json(progress);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * UPDATE TOPIC PROGRESS (MAIN FUNCTION)
 */
export const updateTopicProgress = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user._id;

    // Validate and resolve courseId
    const resolvedCourseId = await resolveCourseId(courseId);

    const {
      topicIndex,
      notesCompleted,
      videoCompleted,
      quizPassed,
      quizScore,
    } = req.body;

    if (topicIndex === undefined) {
      return res.status(400).json({ message: "topicIndex is required" });
    }

    let progress = await CourseProgress.findOne({
      user: userId,
      course: resolvedCourseId,
    });

    // create if not exists — handle possible race that creates duplicate key
    if (!progress) {
      progress = new CourseProgress({
        user: userId,
        course: resolvedCourseId,
        completedTopics: [],
      });

      try {
        await progress.save();
      } catch (saveErr) {
        // If another request created the same progress concurrently, refetch it
        if (saveErr && saveErr.code === 11000) {
          progress = await CourseProgress.findOne({
            user: userId,
            course: resolvedCourseId,
          });
        } else {
          throw saveErr;
        }
      }
    }

    let topic = progress.completedTopics.find(
      (t) => t.topicIndex === topicIndex
    );

    if (!topic) {
      topic = {
        topicIndex,
        notesCompleted: false,
        videoCompleted: false,
        quizAttempted: false,
        quizPassed: false,
        quizScore: 0,
        completedAt: null,
      };
      progress.completedTopics.push(topic);
      topic = progress.completedTopics[progress.completedTopics.length - 1];
    }

    if (notesCompleted !== undefined)
      topic.notesCompleted = notesCompleted;

    if (videoCompleted !== undefined)
      topic.videoCompleted = videoCompleted;

    if (quizPassed !== undefined) {
      topic.quizPassed = quizPassed;
      topic.quizAttempted = true;
    }

    if (quizScore !== undefined) {
      topic.quizScore = quizScore;
      topic.quizAttempted = true;
    }

    if (
      topic.quizPassed &&
      !topic.completedAt
    ) {
      topic.completedAt = new Date();
    }

    // calculate progress
    const course = await Course.findById(resolvedCourseId);
    const totalTopics = course.topics.length || 1;

    const completedCount = progress.completedTopics.filter(
      (t) => t.quizPassed
    ).length;

    progress.totalProgress = Math.round(
      (completedCount / totalTopics) * 100
    );

    progress.lastAccessedAt = new Date();

    // completion check
    if (progress.totalProgress === 100 && !progress.isCompleted) {
      progress.isCompleted = true;
      progress.completedAt = new Date();

      await generateCertificate(userId, resolvedCourseId, course.title);
    }

    await progress.save();

    res.json(progress);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * GET ALL COURSES PROGRESS
 */
export const getAllCoursesProgress = async (req, res) => {
  try {
    const userId = req.user._id;

    const progress = await CourseProgress.find({ user: userId }).populate(
      "course",
      "title description thumbnail level"
    );

    res.json(progress);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * CERTIFICATE GENERATOR
 */
const generateCertificate = async (userId, courseId, title) => {
  try {
    const cert = new Achievement({
      user: userId,
      course: courseId,
      type: "certificate",
      title: `${title} - Certificate`,
      description: `Completed ${title}`,
      certificateUrl: `https://certificates.app/${Date.now()}`,
      issueDate: new Date(),
    });

    await cert.save();
  } catch (err) {
    console.log("Certificate error:", err.message);
  }
};
