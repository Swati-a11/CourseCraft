import express from 'express';
import Course from '../models/Course.js';
import { protect } from '../middleware/auth.js';
import { generateCourse } from '../controllers/courseController.js';
import mongoose from 'mongoose';
const router = express.Router();

/**
 * GET /api/courses
 * Get all courses with optional search, category, and level filters
 */
router.get('/', async (req, res) => {
  try {
    const { search = '', category, level } = req.query;

    const query = {};

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    if (category) {
      query.category = category;
    }

    if (level) {
      query.level = level;
    }

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
 * Get single course
 */
router.post('/generate', protect, generateCourse);
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

    res.json(course);
  } catch (error) {
    console.error('Get Course Error:', error);
    res.status(500).json({ message: error.message });
  }
});

/**
 * POST /api/courses
 * Create new course
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
 * POST /api/courses/:courseId/enroll
 * Enroll logged-in user
 */
router.post('/:courseId/enroll', protect, async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user._id;

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        message: 'Course not found',
      });
    }

    const alreadyEnrolled = course.enrolledStudents.some(
      (studentId) => studentId.toString() === userId.toString()
    );

    if (!alreadyEnrolled) {
      course.enrolledStudents.push(userId);
      await course.save();
    }

    res.json({
      message: 'Enrolled successfully',
      course,
    });
  } catch (error) {
    console.error('Enroll Error:', error);
    res.status(500).json({ message: error.message });
  }
});

/**
 * PUT /api/courses/:courseId/add-videos
 * Add YouTube videos to course topics
 */
router.put('/:courseId/add-videos', async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Map of common educational topic keywords to YouTube search patterns
    const youtubeUrls = {
      'javascript': 'https://www.youtube.com/embed/jS4aFq5-91M',
      'python': 'https://www.youtube.com/embed/kqtD5dpn3C0',
      'react': 'https://www.youtube.com/embed/Tn6-PIqc4UM',
      'web development': 'https://www.youtube.com/embed/kqtD5dpn3C0',
      'sql': 'https://www.youtube.com/embed/HXV3zeQKqGY',
      'html': 'https://www.youtube.com/embed/UB3IbeQ4ZiA',
      'css': 'https://www.youtube.com/embed/1Rs2ND1S-10',
      'nodejs': 'https://www.youtube.com/embed/TlB_eWDSMt4',
      'express': 'https://www.youtube.com/embed/L72fhGm1tfE',
      'mongodb': 'https://www.youtube.com/embed/ofme2o29ngU',
      'git': 'https://www.youtube.com/embed/RGOj5yH7evk',
      'api': 'https://www.youtube.com/embed/SLwpqD8n3d0',
      'rest': 'https://www.youtube.com/embed/SLwpqD8n3d0',
      'database': 'https://www.youtube.com/embed/4d5fhL7mZrg',
    };

    // Generate YouTube URLs for topics
    course.topics.forEach((topic) => {
      if (!topic.videoUrl) {
        const topicKeyword = topic.title.toLowerCase();
        let videoUrl = '';

        // Try to find matching YouTube URL
        for (const [keyword, url] of Object.entries(youtubeUrls)) {
          if (topicKeyword.includes(keyword)) {
            videoUrl = url;
            break;
          }
        }

        // If no match found, use a default video
        if (!videoUrl) {
          videoUrl = 'https://www.youtube.com/embed/kqtD5dpn3C0';
        }

        topic.videoUrl = videoUrl;
      }
    });

    await course.save();

    res.json({
      message: 'Videos added successfully',
      course,
    });
  } catch (error) {
    console.error('Add Videos Error:', error);
    res.status(500).json({ message: error.message });
  }
});

export default router;