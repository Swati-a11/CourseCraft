import express from "express";
import {
  getCourseProgress,
  updateTopicProgress,
  getAllCoursesProgress,
} from "../controllers/courseProgressController.js";

import authMiddleware from '../middleware/auth.js';
const router = express.Router();

router.get("/api/all", authMiddleware, getAllCoursesProgress);

router.get("/api/:courseId", authMiddleware, getCourseProgress);

router.post("/:courseId/topic", authMiddleware, updateTopicProgress);

export default router;