import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { searchYouTubeVideo } from './youtubeServices.js';

dotenv.config();

if (!process.env.GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY is missing in .env file');
}

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const safeParseJSON = (text) => {
  try {
    const cleaned = text
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();

    return JSON.parse(cleaned);
  } catch (err) {
    console.error('=================================');
    console.error('JSON PARSE FAILED');
    console.error(text);
    console.error('=================================');

    throw new Error('AI returned invalid JSON');
  }
};

export const generateCourseWithGemini = async (
  topic,
  level = 'Beginner'
) => {
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
- Each topic must have EXACTLY 10 quiz questions
- Every quiz question must have EXACTLY 4 options
- Every quiz question must have exactly 1 correct answer
- The answer must exactly match one option
- Notes should be detailed with 8-10 paragraphs
- No video URLs in output
- Return videoQuery instead
- Each videoQuery should be unique
- OUTPUT ONLY VALID JSON
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    let text = response.text?.trim() || '';

    console.log('=================================');
    console.log('RAW GEMINI RESPONSE');
    console.log('Length:', text.length);
    console.log(text);
    console.log('=================================');

    if (!text) {
      throw new Error('Empty response from Gemini');
    }

    text = text
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/```$/i, '')
      .trim();

    if (!text.startsWith('{')) {
      console.error('Non-JSON response:', text);
      throw new Error('Gemini did not return JSON');
    }

    const parsed = safeParseJSON(text);

    if (!parsed || !Array.isArray(parsed.topics)) {
      throw new Error('Invalid AI structure');
    }

    const enrichedTopics = await Promise.all(
      parsed.topics.map(async (topicItem) => {
        try {
          const videoQuery =
            topicItem.videoQuery ||
            topicItem.title ||
            `${topic} tutorial`;

          const query = `${topic} ${videoQuery} tutorial`;

          const videoUrl = await searchYouTubeVideo(query);

          return {
            ...topicItem,
            videoUrl,
          };
        } catch (err) {
          console.error(
            `YouTube search failed for ${topicItem.title}:`,
            err
          );

          return {
            ...topicItem,
            videoUrl: '',
          };
        }
      })
    );

    return {
      ...parsed,
      topics: enrichedTopics,
    };
  } catch (error) {
    console.error('Generate Course Error:', error);

    if (
      error?.status === 429 ||
      error?.message?.toLowerCase().includes('quota')
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

export const generateQuizFromText = async (textContext) => {
  const prompt = `
Generate exactly 5 multiple-choice questions based on the following text context.
Return ONLY a valid JSON array, with no Markdown wrapping, no explanation.

Format:
[
  {
    "question": "string",
    "options": ["option A", "option B", "option C", "option D"],
    "correctAnswerIndex": 0
  }
]

Context:
${textContext}
`;

  const models = ['gemini-1.5-flash', 'gemini-1.5-flash-8b'];
  for (const modelName of models) {
    let attempts = 0;
    while (attempts < 2) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        });

        let text = response.text?.trim() || '';
        if (!text) {
          throw new Error('Empty response from Gemini');
        }

        const cleaned = text
          .replace(/```json/g, '')
          .replace(/```/g, '')
          .trim();

        const parsed = JSON.parse(cleaned);
        if (!Array.isArray(parsed)) {
          throw new Error('Parsed response is not a JSON array');
        }

        return parsed;
      } catch (error) {
        if (error.message?.includes('RESOURCE_EXHAUSTED') || error.status === 429) {
          attempts++;
          if (attempts < 2) {
            console.warn(`⚠️ RESOURCE_EXHAUSTED on ${modelName} during quiz generation, waiting 3 seconds to retry...`);
            await new Promise((resolve) => setTimeout(resolve, 3000));
            continue;
          }
        }
        console.warn(`⚠️ Quiz Gen failed for model ${modelName}:`, error.message);
        break; // try the next model
      }
    }
  }
  throw new Error("All Gemini models failed to generate the quiz.");
};