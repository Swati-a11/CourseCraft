import Enrollment from '../models/Enrollment.js';
import CourseProgress from '../models/CourseProgress.js';
import Course from '../models/Course.js';

// =====================
// ENROLL COURSE
// =====================
export const enrollCourse = async (req, res) => {
  try {
    const userId = req.user.id;
    const { courseId } = req.body;

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: 'Course ID is required',
      });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    const existing = await Enrollment.findOne({
      user: userId,
      course: courseId,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Already enrolled in this course',
      });
    }

    const enrollment = await Enrollment.create({
      user: userId,
      course: courseId,
    });

    res.status(201).json({
      success: true,
      message: 'Course enrolled successfully!',
      enrollment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================
// GET MY COURSES
// =====================
export const getMyCourses = async (req, res) => {
  try {
    const userId = req.user.id;

    const enrollments = await Enrollment.find({
      user: userId,
    }).populate('course');

    const data = await Promise.all(
      enrollments.map(async (enrollment) => {
        const progress = await CourseProgress.findOne({
          user: userId,
          course: enrollment.course._id,
        });

        return {
          course: enrollment.course,
          enrolledAt: enrollment.enrolledAt,
          progress: progress
            ? {
                totalProgress: progress.totalProgress,
                isCompleted: progress.isCompleted,
                completedTopics: progress.completedTopics,
              }
            : {
                totalProgress: 0,
                isCompleted: false,
                completedTopics: [],
              },
        };
      })
    );

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch enrolled courses',
      error: error.message,
    });
  }
};