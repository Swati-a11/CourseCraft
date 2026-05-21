import express from "express";
import {
  getCourseProgress,
  updateTopicProgress,
  getAllCoursesProgress,
} from "../controllers/courseProgressController.js";

import { protect } from "../middleware/auth.js";
const router = express.Router();

router.get("/all", protect, getAllCoursesProgress);

router.get("/:courseId", protect, getCourseProgress);

router.post("/:courseId/topic", protect, updateTopicProgress);

export default router;