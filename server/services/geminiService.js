import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

// Load environment variables
dotenv.config();

if (!process.env.GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY is missing in .env file');
}

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const generateCourseWithGemini = async (
  topic,
  level = 'Beginner'
) => {
  const prompt = `
Generate a complete course in valid JSON only.

Topic: ${topic}
Level: ${level}

Required JSON structure:
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
      "videoUrl": "",
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

Requirements:
- Generate exactly 8 topics.
- Each topic must have:
  - unique title
  - detailed notes
  - UNIQUE YouTube embed videoUrl
  - 10 quiz questions

IMPORTANT VIDEO RULES:
- Every topic MUST have a DIFFERENT videoUrl.
- NEVER repeat the same videoUrl.
- Use ONLY valid YouTube EMBED URLs.
- Correct format:
  "https://www.youtube.com/embed/VIDEO_ID"

QUIZ RULES:
- Each topic must contain exactly 10 quiz questions.
- Each question must have exactly 4 options.
- The answer must exactly match one option.

IMPORTANT:
- Return ONLY valid JSON.
- Do NOT use markdown.
- Do NOT use code fences.
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    let text = response.text?.trim() || '';

    // Clean markdown formatting if Gemini adds it
    text = text.replace(/^```json\s*/i, '');
    text = text.replace(/^```\s*/i, '');
    text = text.replace(/```$/i, '').trim();

    const parsed = JSON.parse(text);

    if (!parsed || typeof parsed !== 'object') {
      throw new Error('Invalid AI response format');
    }

    // Extra safety check for duplicate video URLs
    const usedUrls = new Set();

    parsed.topics = parsed.topics.map((topic, index) => {
      if (
        !topic.videoUrl ||
        usedUrls.has(topic.videoUrl)
      ) {
        topic.videoUrl =
          `https://www.youtube.com/embed/dQw4w9WgXcQ?topic=${index}`;
      }

      usedUrls.add(topic.videoUrl);

      return topic;
    });

    return parsed;
  } catch (error) {
    console.error('Generate Course Error:', error);

    if (
      error?.status === 429 ||
      error?.code === 429 ||
      error?.message?.includes('RESOURCE_EXHAUSTED') ||
      error?.message?.includes('quota exceeded')
    ) {
      const quotaError = new Error(
        'AI quota exceeded. Please try again later.'
      );

      quotaError.code = 429;

      throw quotaError;
    }

    throw error;
  }
};