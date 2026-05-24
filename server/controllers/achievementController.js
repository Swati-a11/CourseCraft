import Achievement from "../models/Achievement.js";
import CourseProgress from "../models/CourseProgress.js";

// Create Achievement (usually called internally or via admin, but can be a route)
export const createAchievement = async (req, res) => {
  try {
    const { courseId, type, title, description, certificateUrl } = req.body;
    const userId = req.user._id;

    const achievement = await Achievement.create({
      user: userId,
      course: courseId,
      type: type || 'certificate',
      title,
      description,
      certificateUrl
    });

    res.status(201).json({ success: true, data: achievement });
  } catch (error) {
    console.error("Create Achievement Error:", error);
    res.status(500).json({ success: false, message: "Failed to create achievement" });
  }
};

// Get Achievements for User
export const getAchievements = async (req, res) => {
  try {
    const userId = req.user._id;

    // --- AUTO-BACKFILL MISSING CERTIFICATES ---
    // If user already had 100% progress before certificates were added, this guarantees they get them!
    const completedProgresses = await CourseProgress.find({ user: userId, totalProgress: 100 }).populate('course');
    for (const prog of completedProgresses) {
      if (!prog.course) continue;
      const existingCert = await Achievement.findOne({ user: userId, course: prog.course._id, type: 'certificate' });
      if (!existingCert) {
        await Achievement.create({
          user: userId,
          course: prog.course._id,
          type: 'certificate',
          title: `Completed ${prog.course.title}`,
          description: `Successfully completed all modules and quizzes with >= 70% score in ${prog.course.title}.`
        });
      }
    }
    // ------------------------------------------

    const { type } = req.query;

    const filter = { user: userId };
    if (type) {
      filter.type = type;
    }

    const achievements = await Achievement.find(filter).populate("course").sort({ earnedAt: -1 });

    res.status(200).json({ success: true, data: achievements });
  } catch (error) {
    console.error("Get Achievements Error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch achievements" });
  }
};

// Get Achievement Stats for User
export const getAchievementStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const totalCertificates = await Achievement.countDocuments({ user: userId, type: 'certificate' });
    const totalBadges = await Achievement.countDocuments({ user: userId, type: 'badge' });
    
    // Quick estimation for completed courses from certificates
    const completedCourses = totalCertificates; 

    res.status(200).json({
      success: true,
      data: {
        totalCertificates,
        totalBadges,
        completedCourses
      }
    });
  } catch (error) {
    console.error("Get Achievement Stats Error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch achievement stats" });
  }
};