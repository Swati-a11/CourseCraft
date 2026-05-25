import express from 'express';
import Course from '../models/Course.js';
import { searchYouTubeVideo } from '../services/youtubeServices.js';
import authMiddleware from '../middleware/auth.js';
import { generateCourse } from '../controllers/courseController.js';
import mongoose from 'mongoose';

const router = express.Router();

/**
 * GET /api/courses
 */
router.get('/', async (req, res) => {
  try {
    const { search = '', category, level } = req.query;

    const query = {};

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    if (category) query.category = category;
    if (level) query.level = level;

    const courses = await Course.find(query).sort({ createdAt: -1 });

    res.json({
      courses,
      pagination: {
        total: courses.length,
        page: 1,
        limit: 10,
        pages: courses.length > 0 ? 1 : 0,
      },
    });
  } catch (error) {
    console.error('Get Courses Error:', error);
    res.status(500).json({ message: error.message });
  }
});

/**
 * GET /api/courses/:courseId
 */
router.get('/:courseId', async (req, res) => {
  try {
    const { courseId } = req.params;
    let course;

    if (mongoose.Types.ObjectId.isValid(courseId)) {
      course = await Course.findById(courseId);
    } else if (!isNaN(courseId)) {
      course = await Course.findOne({ shortId: Number(courseId) });
    }

    if (!course) {
      return res.status(404).json({
        message: 'Course not found',
      });
    }

    let updated = false;

    course.topics = await Promise.all(
      (course.topics || []).map(async (topic) => {
        const invalidVideos = ['RSSU6ML4rsU'];

        const currentVideo = topic?.videoUrl || '';

        const hasValidEmbed =
          typeof currentVideo === 'string' &&
          currentVideo.includes('youtube.com/embed/');

        const isBrokenVideo = invalidVideos.some((id) =>
          currentVideo.includes(id)
        );

        if (!hasValidEmbed || isBrokenVideo) {
          const fallbackTitle =
            topic?.title || course.title || 'tutorial';

          topic.videoUrl = await searchYouTubeVideo(fallbackTitle);

          updated = true;
        }

        return topic;
      })
    );

    if (updated) {
      await course.save();
    }

    res.json(course);
  } catch (error) {
    console.error('Get Course Error:', error);
    res.status(500).json({ message: error.message });
  }
});

/**
 * POST /api/courses/generate
 */
router.post('/api/generate', authMiddleware, generateCourse);

/**
 * POST /api/courses
 */
router.post('/', async (req, res) => {
  try {
    const course = await Course.create(req.body);
    res.status(201).json(course);
  } catch (error) {
    console.error('Create Course Error:', error);
    res.status(500).json({ message: error.message });
  }
});

/**
 * PUT refresh video
 */
router.put('/api/:courseId/topics/:topicIndex/refresh-video', async (req, res) => {
  try {
    const { courseId, topicIndex } = req.params;

    const course = await Course.findById(courseId);
    if (!course)
      return res.status(404).json({ message: 'Course not found' });

    const idx = Number(topicIndex) - 1;

    if (idx < 0 || idx >= course.topics.length) {
      return res.status(400).json({ message: 'Invalid topic index' });
    }

    const topic = course.topics[idx];

    const videoUrl = await searchYouTubeVideo(
      topic.title || course.title
    );

    topic.videoUrl = videoUrl;

    await course.save();

    res.json({
      success: true,
      videoUrl,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

/**
 * ENROLL COURSE (FIXED)
 */
router.post('/api/:courseId/enroll', authMiddleware, async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user._id;

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        message: 'Course not found',
      });
    }

    if (!course.enrolledStudents.includes(userId)) {
      course.enrolledStudents.push(userId);
      await course.save();
    }

    res.json({
      success: true,
      message: 'Enrolled successfully',
      course,
    });
  } catch (error) {
    console.error('Enroll Error:', error);
    res.status(500).json({ message: error.message });
  }
});

/**
 * ADD VIDEOS
 */
router.put('/api/:courseId/add-videos', async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        message: 'Course not found',
      });
    }

    const youtubeUrls = {
      javascript: 'https://www.youtube.com/embed/jS4aFq5-91M',
      python: 'https://www.youtube.com/embed/kqtD5dpn3C0',
      react: 'https://www.youtube.com/embed/Tn6-PIqc4UM',
      nodejs: 'https://www.youtube.com/embed/TlB_eWDSMt4',
      html: 'https://www.youtube.com/embed/UB3IbeQ4ZiA',
      css: 'https://www.youtube.com/embed/1Rs2ND1S-10',
      mongodb: 'https://www.youtube.com/embed/ofme2o29ngU',
    };

    course.topics.forEach((topic) => {
      if (!topic.videoUrl) {
        const key = topic.title.toLowerCase();

        let video = '';

        for (const [k, url] of Object.entries(youtubeUrls)) {
          if (key.includes(k)) {
            video = url;
            break;
          }
        }

        topic.videoUrl =
          video ||
          'https://www.youtube.com/embed/kqtD5dpn3C0';
      }
    });

    await course.save();

    res.json({
      success: true,
      message: 'Videos added successfully',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

export default router;