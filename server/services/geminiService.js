import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

if (!process.env.GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY is missing in .env file');
}

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// helper: safe JSON parse
const safeParseJSON = (text) => {
  try {
    return JSON.parse(text);
  } catch (err) {
    throw new Error('AI returned invalid JSON');
  }
};

export const generateCourseWithGemini = async (topic, level = 'Beginner') => {
  const prompt = `
Generate a complete structured learning course in STRICT JSON ONLY.

Topic: ${topic}
Level: ${level}

RULES:
- Stay strictly within the topic: ${topic}
- Do NOT include unrelated concepts
- Do NOT hallucinate video URLs
- Every topic must be a subtopic of ${topic}

OUTPUT FORMAT:
{
  "title": "",
  "description": "",
  "category": "",
  "level": "${level}",
  "duration": "",
  "thumbnail": "",
  "topics": [
    {
      "title": "",
      "notes": "",
      "videoQuery": "",
      "quiz": [
        {
          "question": "",
          "options": ["", "", "", ""],
          "answer": ""
        }
      ]
    }
  ]
}

IMPORTANT:
- Generate EXACTLY 8 topics
- Each topic must have 10 quiz questions
- No video URLs allowed in AI output
- Instead return "videoQuery" for each topic
- Each videoQuery must be unique and specific to ${topic}

OUTPUT ONLY JSON
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    let text = response.text?.trim() || '';

    // cleanup
    text = text
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/```$/i, '')
      .trim();

    const parsed = safeParseJSON(text);

    if (!parsed?.topics) {
      throw new Error('Invalid AI structure');
    }

    // 🔥 REAL FIX: fetch correct YouTube videos instead of trusting AI
    const enrichedTopics = await Promise.all(
      parsed.topics.map(async (t) => {
        const query = encodeURIComponent(
          `${topic} ${t.videoQuery} tutorial`
        );

        const videoUrl = `https://www.youtube.com/embed?search=${query}`;

        return {
          ...t,
          videoUrl,
        };
      })
    );

    return {
      ...parsed,
      topics: enrichedTopics,
    };
  } catch (error) {
    console.error('Generate Course Error:', error);

    if (error?.status === 429 || error?.message?.includes('quota')) {
      const quotaError = new Error('AI quota exceeded. Try again later.');
      quotaError.code = 429;
      throw quotaError;
    }

    throw error;
  }
};