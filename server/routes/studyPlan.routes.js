import express from "express";
import { generateStudyPlan } from "../controllers/studyPlan.controller.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = express.Router();

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