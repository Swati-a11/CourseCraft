import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

export const generateStudyPlan = async (req, res) => {
  console.log('📦 STUDY PLAN GENERATION INCOMING BODY:', JSON.stringify(req.body, null, 2));
  console.log('👤 AUTHENTICATED USER CONTEXT:', req.user);
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
7. Use emojis to improve readability.
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

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    let studyPlan = response.text?.trim();

    if (!studyPlan && response?.response) {
      const output = await response.response;
      if (typeof output?.text === 'function') {
        studyPlan = await output.text();
      } else if (typeof output?.text === 'string') {
        studyPlan = output.text;
      }
    }

    if (!studyPlan || studyPlan.trim() === '') {
      throw new Error('Gemini returned an empty study plan');
    }

    try {
      res.status(200).json({
        success: true,
        studyPlan,
      });
    } catch (dbError) {
      console.error('❌ MONGOOSE STUDY PLAN VALIDATION/SAVE CRASH:', dbError.message);
      console.error('Full Database Error Object:', dbError);
      return res.status(500).json({ error: "Database mapping constraint failed.", details: dbError.message });
    }
  } catch (error) {
    console.error('AI ERROR:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to generate AI study plan',
      error: error.message,
    });
  }
};