import express from "express";
import { generateStudyPlan } from "../controllers/studyPlan.controller.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import auth from "../middleware/auth.js";
import StudyPlan from "../models/StudyPlan.js";

const router = express.Router();

router.get("/saved", auth, async (req, res) => {
  try { res.json({ plans: await StudyPlan.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(50).lean() }); }
  catch { res.status(500).json({ message: "Could not load saved plans." }); }
});

router.post("/saved", auth, async (req, res) => {
  try {
    const { goal, level, duration, hoursPerDay, content } = req.body;
    if (typeof goal !== 'string' || !goal.trim() || goal.length > 300 || !['Beginner','Intermediate','Advanced'].includes(level) || !Number.isInteger(Number(duration)) || Number(duration) < 1 || Number(duration) > 90 || !Number.isFinite(Number(hoursPerDay)) || Number(hoursPerDay) < 1 || Number(hoursPerDay) > 24 || typeof content !== 'string' || !content.trim() || content.length > 200000) return res.status(400).json({ message: 'Please check the plan details.' });
    const plan = await StudyPlan.create({ user: req.user._id, goal: goal.trim(), level, duration: Number(duration), hoursPerDay: Number(hoursPerDay), content });
    res.status(201).json({ plan });
  } catch { res.status(500).json({ message: 'Could not save your plan.' }); }
});

router.patch("/saved/:id/days/:day", auth, async (req, res) => {
  try {
    const day = Number(req.params.day);
    if (!Number.isInteger(day) || typeof req.body.completed !== 'boolean') return res.status(400).json({ message: 'Invalid day.' });
    const plan = await StudyPlan.findOne({ _id: req.params.id, user: req.user._id });
    if (!plan) return res.status(404).json({ message: 'Plan not found.' });
    if (day < 1 || day > plan.duration) return res.status(400).json({ message: 'Invalid day.' });
    const update = req.body.completed ? { $addToSet: { completedDays: day } } : { $pull: { completedDays: day } };
    const updated = await StudyPlan.findOneAndUpdate({ _id: plan._id, user: req.user._id }, update, { new: true });
    res.json({ plan: updated });
  } catch { res.status(500).json({ message: 'Could not update your progress.' }); }
});

// Existing route
router.post("/generate", generateStudyPlan);

// Test AI route
router.get("/test-ai", async (req, res) => {
  try {
    // Initialize Gemini here, after env variables are loaded
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const result = await model.generateContent(
      "Create a 7-day MERN Stack study plan for a beginner."
    );

    const text = result.response.text();

    res.status(200).json({
      success: true,
      studyPlan: text,
    });
  } catch (error) {
    console.error("Gemini Test Error:", error);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;