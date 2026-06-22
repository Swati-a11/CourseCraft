import express from "express";
import authMiddleware from "../middleware/auth.js";
import {
  createAchievement,
  getAchievements,
  getAchievementStats
} from "../controllers/achievementController.js";

const router = express.Router();

router.get("/stats/user", authMiddleware, getAchievementStats);
router.post("/", authMiddleware, createAchievement);
router.get("/", authMiddleware, getAchievements);

export default router;