import express from "express";
import { getMyCourses, enrollCourse, unenrollCourse } from "../controllers/enrollmentController.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// ❌ REMOVE /api
router.get("/my-courses", authMiddleware, getMyCourses);

router.post("/", authMiddleware, enrollCourse);
router.delete("/:courseId", authMiddleware, unenrollCourse);

export default router;