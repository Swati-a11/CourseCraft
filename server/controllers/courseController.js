import Course from '../models/Course.js';
import Counter from '../models/Counter.js';
import { generateCourseWithGemini } from '../services/geminiService.js';
import { searchYouTubeVideo } from "../services/youtubeServices.js";
export const generateCourse = async (req, res) => {
  try {
    const { topic } = req.body || {};

    // Validate topic
    if (!topic || !topic.toString().trim()) {
      return res.status(400).json({
        success: false,
        message: 'Topic is required',
      });
    }

    // Generate course using Gemini AI
    const generatedCourse = await generateCourseWithGemini(
      topic,
      'Beginner'
    );

    if (!generatedCourse || typeof generatedCourse !== 'object') {
      throw new Error('Invalid course data received from AI');
    }

    // Base course data
    const courseData = {
      title: generatedCourse.title,
      description: generatedCourse.description,
      category: generatedCourse.category || 'General',
      level: generatedCourse.level || 'Beginner',
      duration: generatedCourse.duration || '4 Weeks',
      thumbnail: generatedCourse.thumbnail || '',
      createdBy: req.user?._id,
      topics: Array.isArray(generatedCourse.topics)
        ? generatedCourse.topics
        : [],
      isPublished: true,
    };

    // Validate required fields
    if (
      !courseData.title ||
      !courseData.description ||
      !courseData.level ||
      !courseData.duration ||
      !Array.isArray(courseData.topics) ||
      courseData.topics.length === 0
    ) {
      throw new Error(
        'Generated course data is missing required fields'
      );
    }

    // Process topics dynamically with YouTube videos
    courseData.topics = await Promise.all(
      courseData.topics.map(async (topicItem) => {
        // Safe quiz generation
        const quiz = Array.isArray(topicItem.quiz)
          ? topicItem.quiz.slice(0, 50).map((quizItem) => {
              const options =
                Array.isArray(quizItem.options) &&
                quizItem.options.length === 4
                  ? quizItem.options
                  : ['A', 'B', 'C', 'D'];

              const answer = options.includes(quizItem.answer)
                ? quizItem.answer
                : options[0];

              return {
                question:
                  quizItem.question ||
                  'Review question - please reflect on the topic.',
                options,
                answer,
              };
            })
          : [];

        // Ensure minimum 10 quiz questions
        while (quiz.length < 10) {
          quiz.push({
            question:
              'Review question - please reflect on the topic.',
            options: ['A', 'B', 'C', 'D'],
            answer: 'A',
          });
        }

        // Fetch dynamic YouTube video
        const videoUrl = await searchYouTubeVideo(
          topicItem.title || topic
        );

        console.log(
          "Generated Video URL:",
          videoUrl,
          "for topic:",
          topicItem.title || 'Untitled Topic'
        );

        return {
          title: topicItem.title || 'Untitled Topic',
          notes: topicItem.notes || '',
          videoUrl,
          quiz,
        };
      })
    );

    console.log(
      'Final course topics with video URLs:',
      courseData.topics.map((t) => ({ title: t.title, videoUrl: t.videoUrl }))
    );

    // Generate auto increment shortId
    const counter = await Counter.findByIdAndUpdate(
      { _id: 'courseId' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    courseData.shortId = counter.seq;

    // Save course
    const savedCourse = await Course.create(courseData);

    console.log('Saved course topics in MongoDB:', savedCourse.topics);

    return res.status(201).json({
      success: true,
      message: 'Course generated successfully',
      data: {
        course: savedCourse,
        topics: savedCourse.topics,
      },
    });
  } catch (error) {
    console.error('Generate Course Error:', error);

    // Handle Gemini quota error
    if (
      error?.status === 429 ||
      error?.code === 429 ||
      error?.message?.includes('RESOURCE_EXHAUSTED') ||
      error?.message?.includes('quota exceeded')
    ) {
      return res.status(429).json({
        success: false,
        message:
          'AI quota exceeded. Please try again later.',
      });
    }

    return res.status(500).json({
      success: false,
      message:
        error.message || 'Course generation failed',
    });
  }
};