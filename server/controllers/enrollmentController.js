import Enrollment from "../models/Enrollment.js";
import Course from "../models/Course.js";
import CourseProgress from "../models/CourseProgress.js";

/* ---------------- ENROLL COURSE ---------------- */
export const enrollCourse = async (req, res) => {
  try {
    const userId = req.user._id;
    const { courseId } = req.body;

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "courseId required",
      });
    }

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const exists = await Enrollment.findOne({
      user: userId,
      course: courseId,
    });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Already enrolled",
      });
    }

    const enrollment = await Enrollment.create({
      user: userId,
      course: courseId,
    });

    return res.status(201).json({
      success: true,
      message: "Enrolled successfully",
      data: enrollment,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Enrollment failed",
    });
  }
};

/* ---------------- MY COURSES (FIXED) ---------------- */
export const getMyCourses = async (req, res) => {
  try {
    const userId = req.user._id;

    const enrollments = await Enrollment.find({ user: userId })
      .populate("course")
      .lean();

    const courseProgressRecords = await CourseProgress.find({ user: userId }).lean();

    const courses = enrollments
      .filter((e) => e.course)
      .map((e) => {
        const progressRecord = courseProgressRecords.find(
          (p) => p.course?.toString() === e.course._id.toString()
        );

        return {
          _id: e.course._id,

          // ✅ IMPORTANT: FLATTEN DATA
          title: e.course.title,
          description: e.course.description,
          category: e.course.category,
          level: e.course.level,
          thumbnail: e.course.thumbnail,
          topics: e.course.topics || [],

          progress: progressRecord ? progressRecord.totalProgress : 0,
          enrolledAt: e.createdAt,
        };
      });

    return res.status(200).json({
      success: true,
      data: courses,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch courses",
    });
  }
};

/* ---------------- UNENROLL COURSE ---------------- */
export const unenrollCourse = async (req, res) => {
  try {
    const userId = req.user._id;
    const { courseId } = req.params;

    const enrollment = await Enrollment.findOneAndDelete({
      user: userId,
      course: courseId,
    });

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: "Enrollment not found",
      });
    }

    // Also remove user from course enrolledStudents if needed
    const course = await Course.findById(courseId);
    if (course) {
      course.enrolledStudents = course.enrolledStudents.filter(
        (id) => id.toString() !== userId.toString()
      );
      await course.save();
    }

    return res.status(200).json({
      success: true,
      message: "Unenrolled successfully",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Failed to unenroll",
    });
  }
};