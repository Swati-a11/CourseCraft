import Course from '../models/Course.js';
import CourseProgress from '../models/CourseProgress.js';
import User from '../models/User.js';
import WeakTopic from '../models/WeakTopic.js';
import QuizResult from '../models/QuizResult.js';
import Achievement from '../models/Achievement.js';

// GET /api/learning/course/:courseId
export const getLearningCourseData = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user._id;

    const course = await Course.findById(courseId).select('title topics');
    if (!course) return res.status(404).json({ message: 'Course not found' });

    let progress = await CourseProgress.findOne({ user: userId, course: courseId });
    if (!progress) {
      progress = await CourseProgress.create({
        user: userId,
        course: courseId,
        completedTopics: [],
        totalProgress: 0
      });
    }

    res.json({ course, progress });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/learning/course/:courseId/topic/:topicIndex
export const getTopicData = async (req, res) => {
  try {
    const { courseId, topicIndex } = req.params;
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const topic = course.topics[topicIndex];
    if (!topic) return res.status(404).json({ message: 'Topic not found' });

    res.json({ topic });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/learning/quiz/submit
export const submitQuiz = async (req, res) => {
  try {
    const { courseId, topicIndex, answers } = req.body;
    const userId = req.user._id;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const topic = course.topics[topicIndex];
    if (!topic) return res.status(404).json({ message: 'Topic not found' });

    let correctCount = 0;
    const totalQuestions = topic.quiz.length;

    // Validate answers (simple matching for now, assuming array of selected options)
    topic.quiz.forEach((q, idx) => {
      if (answers[idx] === q.answer) {
        correctCount++;
      }
    });

    const scorePercentage = (correctCount / totalQuestions) * 100;
    const passed = scorePercentage >= 70;

    // Create QuizResult so dashboard charts populate correctly
    const formattedAnswers = topic.quiz.map((q, idx) => ({
      question: q.question,
      selectedAnswer: answers[idx] || '',
      correctAnswer: q.answer,
      isCorrect: answers[idx] === q.answer
    }));

    await QuizResult.create({
      user: userId,
      course: courseId,
      topicId: Number(topicIndex),
      topicTitle: topic.title,
      score: correctCount,
      totalQuestions: totalQuestions,
      percentage: scorePercentage,
      answers: formattedAnswers
    });

    // 1. Update Progress
    let progress = await CourseProgress.findOne({ user: userId, course: courseId });
    if (!progress) {
       progress = new CourseProgress({ user: userId, course: courseId });
    }
    
    let topicProg = progress.completedTopics.find(t => t.topicIndex === Number(topicIndex));
    if (!topicProg) {
       topicProg = { topicIndex: Number(topicIndex) };
       progress.completedTopics.push(topicProg);
    }
    
    // Using simple array matching so need to find the correct index in array again to update
    const tpIndex = progress.completedTopics.findIndex(t => t.topicIndex === Number(topicIndex));
    progress.completedTopics[tpIndex].quizAttempted = true;
    progress.completedTopics[tpIndex].quizScore = scorePercentage;
    if (passed) {
      progress.completedTopics[tpIndex].quizPassed = true;
      progress.completedTopics[tpIndex].completedAt = new Date();
    }
    
    // Update total progress (simplified: based on passed quizzes out of total topics)
    const passedTopics = progress.completedTopics.filter(t => t.quizPassed).length;
    progress.totalProgress = Math.round((passedTopics / course.topics.length) * 100);
    
    let earnedCertificate = false;
    if (progress.totalProgress === 100 && !progress.isCompleted) {
      progress.isCompleted = true;
      
      const existingCert = await Achievement.findOne({ user: userId, course: courseId, type: 'certificate' });
      if (!existingCert) {
        await Achievement.create({
          user: userId,
          course: courseId,
          type: 'certificate',
          title: `Completed ${course.title}`,
          description: `Successfully completed all modules and quizzes with >= 70% score in ${course.title}.`
        });
        earnedCertificate = true;
      }
    } else if (progress.totalProgress === 100) {
      progress.isCompleted = true;
    }
    
    progress.lastAccessedAt = new Date();
    
    await progress.save();

    // 2. Gamification (Streak + XP)
    const user = await User.findById(userId);
    let xpGained = passed ? 10 : 2; // base XP for attempting
    user.xp = (user.xp || 0) + xpGained;

    // Simple Streak Logic
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (user.lastActivityDate) {
      const lastActivity = new Date(user.lastActivityDate);
      lastActivity.setHours(0, 0, 0, 0);
      const diffTime = Math.abs(today - lastActivity);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      
      if (diffDays === 1) {
        user.streak = (user.streak || 0) + 1;
      } else if (diffDays > 1) {
        user.streak = 1;
      }
    } else {
      user.streak = 1;
    }
    user.lastActivityDate = new Date();
    
    // Level up logic (every 100 XP = 1 Level)
    user.level = Math.floor(user.xp / 100) + 1;
    await user.save();

    // 3. Weak Topic Detection (AI stub)
    let weakTopicResponse = null;
    if (!passed) {
      // Mock AI Feedback (in reality, you'd call Gemini/OpenAI API here)
      const aiFeedback = `You scored ${scorePercentage}% on ${topic.title}. You seem to be struggling with some core concepts. We recommend re-reading the notes and watching the video again carefully.`;

      const weakTopic = await WeakTopic.findOneAndUpdate(
        { user: userId, course: courseId, topicId: topicIndex },
        { 
          topicTitle: topic.title, 
          averageScore: scorePercentage,
          aiFeedback: aiFeedback,
          status: 'Needs Review'
        },
        { upsert: true, new: true }
      );
      weakTopicResponse = weakTopic;
    } else {
      // If passed, maybe update status if it was previously a weak topic
      await WeakTopic.findOneAndUpdate(
        { user: userId, course: courseId, topicId: topicIndex },
        { status: 'Mastered', averageScore: scorePercentage }
      );
    }

    res.json({
      score: scorePercentage,
      passed,
      xpGained,
      newTotalXp: user.xp,
      newStreak: user.streak,
      newLevel: user.level,
      weakTopic: weakTopicResponse,
      totalProgress: progress.totalProgress
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/learning/progress
export const getProgressData = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const progresses = await CourseProgress.find({ user: userId }).populate('course', 'title');
    const weakTopics = await WeakTopic.find({ user: userId });

    res.json({ progresses, weakTopics });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/learning/quiz/adaptive-next
export const getNextAdaptiveQuestion = async (req, res) => {
  // Stub for adaptive quizzes.
  // In a real app, it would look at previous answer correctness and pick a 'Beginner', 'Intermediate', or 'Advanced' question.
  res.json({ message: "Adaptive quiz endpoint placeholder" });
};

// PUT /api/learning/course/:courseId/notes
export const savePersonalNotes = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { notes } = req.body;
    const userId = req.user._id;

    let progress = await CourseProgress.findOne({ user: userId, course: courseId });
    if (!progress) {
      progress = await CourseProgress.create({
        user: userId,
        course: courseId,
        personalNotes: notes
      });
    } else {
      progress.personalNotes = notes;
      await progress.save();
    }

    res.json({ success: true, personalNotes: progress.personalNotes });
  } catch (error) {
    console.error("Save Personal Notes Error:", error);
    res.status(500).json({ message: error.message });
  }
};
