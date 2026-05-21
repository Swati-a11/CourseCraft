import { GoogleGenerativeAI } from "@google/generative-ai";

// Check API key before initializing Gemini
if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is missing in your .env file");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateStudyPlanAI = async ({
  goal,
  level,
  duration,
  hoursPerDay,
}) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const prompt = `
You are an expert learning planner AI.

Create a structured study plan.

USER INPUT:
- Goal: ${goal}
- Level: ${level}
- Duration: ${duration} days
- Hours per day: ${hoursPerDay}

RULES:
- Return ONLY valid JSON
- No markdown, no explanation

OUTPUT FORMAT:
[
  {
    "day": 1,
    "topic": "string",
    "tasks": ["task1", "task2"],
    "resources": ["links"]
  }
]

Generate exactly ${duration} days.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();

    if (!text || text.trim() === "") {
      throw new Error("Gemini returned an empty response");
    }

    // Remove markdown code blocks if Gemini adds them
    const cleaned = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    // Parse JSON safely
    const parsed = JSON.parse(cleaned);

    // Validate response format
    if (!Array.isArray(parsed)) {
      throw new Error("Gemini response is not a valid array");
    }

    return parsed;
  } catch (error) {
    console.error("AI ERROR:", error.message);
    throw new Error(error.message || "Failed to generate AI study plan");
  }
};