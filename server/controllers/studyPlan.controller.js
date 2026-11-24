import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { classifyStudyPlanError, generateStudyPlanWithFallback } from '../services/studyPlanGeneration.js';

dotenv.config();

export const generateStudyPlan = async (req, res) => {
  try {
    const { goal, level, duration, hoursPerDay } = req.body;

    if (!goal || !level || !duration || !hoursPerDay) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required',
      });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        success: false,
        message: 'GEMINI_API_KEY is missing in .env file',
      });
    }

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const prompt = `
Create a highly structured and visually appealing study plan in clean Markdown format.

Student Details:
- Goal: ${goal}
- Level: ${level}
- Duration: ${duration} days
- Study Time Per Day: ${hoursPerDay} hours

Instructions:
1. Return the response in valid Markdown.
2. Start with a short motivational introduction.
3. For each day include:
   - # Day X: Title
   - Brief objective
   - Topics covered as bullet points
   - Practical exercises
   - At least one official documentation/resource link
   - At least one YouTube tutorial link
4. Use clickable Markdown links.
5. Recommend YouTube tutorials from these channels only:
   - Traversy Media
   - freeCodeCamp
   - The Net Ninja
   - Codevolution
   - Programming with Mosh
6. Include code examples when helpful.
7. Do not use emojis or decorative symbols anywhere in the study plan. Use clear headings and bullet points instead.
8. At the end, include:
   -  Final Project Suggestion
   -  Additional Resources
   -  Next Steps
9. Keep the content beginner-friendly and practical.
10. Make the study plan personalized to the user's goal and level.

Generate YouTube links in this format:
https://www.youtube.com/results?search_query=React useState Traversy Media

Generate the study plan now.
`;

    const studyPlan = await generateStudyPlanWithFallback(ai, prompt);
    return res.status(200).json({ success: true, studyPlan });

  } catch (error) {
    const kind = classifyStudyPlanError(error);
    console.error('Study plan generation failed:', kind);
    if (kind === 'unavailable' || kind === 'model') {
      return res.status(503).json({ success: false, message: 'The AI service is busy right now. Please try again in a moment.' });
    }
    if (kind === 'quota') {
      return res.status(429).json({ success: false, message: 'The AI service has reached a usage limit. Please try again later.' });
    }
    return res.status(500).json({ success: false, message: 'Could not generate your study plan. Please try again.' });
  }
};
