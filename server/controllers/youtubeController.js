import { YoutubeTranscript } from 'youtube-transcript';
import { GoogleGenAI } from '@google/genai';
import { getPlaylistVideos } from '../services/youtubeServices.js';

// Chunk the transcript
const chunkTranscript = (text, maxChars = 3000) => {
  const chunks = [];
  let i = 0;
  while (i < text.length) {
    chunks.push(text.slice(i, i + maxChars));
    i += maxChars;
  }
  return chunks;
};

// Add delay between chunks to avoid RPM limit
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Safe content generation helper with model fallback and resource exhaustion retry
const generateWithModelFallback = async (ai, contents) => {
  const models = ['gemini-1.5-flash', 'gemini-1.5-flash-8b', 'gemini-1.0-pro'];
  for (const modelName of models) {
    let attempts = 0;
    while (attempts < 2) {
      try {
        const result = await ai.models.generateContent({
          model: modelName,
          contents: contents,
        });
        return result;
      } catch (error) {
        if (error.message?.includes('RESOURCE_EXHAUSTED')) {
          attempts++;
          if (attempts < 2) {
            await delay(3000); // wait 3 seconds
            continue; // retry once
          }
        }
        break; // try the next model
      }
    }
  }
  throw new Error('All Gemini models failed due to exhaustion or errors');
};

export const generateYoutubeNotes = async (req, res) => {
  console.log('Backend: Request received');
  try {
    const { videoUrl, description: descriptionVar, title: titleVar } = req.body || {};

    if (!videoUrl) {
      console.log('Backend: Missing video URL');
      return res.status(400).json({
        success: false,
        message: 'YouTube URL is required',
      });
    }

    let videoId = null;
    const match = videoUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    if (match && match[1]) {
      videoId = match[1];
    }

    console.log('Video ID:', videoId);
    console.log('API Key loaded:', process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.slice(0, 10) : 'NOT FOUND');

    if (!videoId) {
      console.log('Backend: Invalid video ID');
      return res.status(400).json({
        success: false,
        message: 'Invalid YouTube URL',
      });
    }

    let transcript;
    try {
      console.log('Backend: Fetching transcript...');
      transcript = await Promise.race([
        YoutubeTranscript.fetchTranscript(videoId),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Transcript fetch timeout')), 10000))
      ]);
      console.log('Backend: Transcript fetched');
    } catch (err) {
      console.warn('Backend: youtube-transcript failed or timed out. Reason:', err.message);
      transcript = null;
    }

    const transcriptionVar = Array.isArray(transcript)
      ? transcript.map((item) => item?.text || '').join(' ').trim()
      : '';

    let rawText = transcriptionVar || descriptionVar || titleVar || "No video metadata captured";

    console.log('Transcript length:', rawText.length);

    // =========================
    // GEMINI AI Notes Generation (Chunked & Summarized)
    // =========================
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const chunks = chunkTranscript(rawText, 3000);
    const summaries = [];

    for (const chunk of chunks) {
      try {
        await delay(1000); // 1 second between each chunk
        const result = await generateWithModelFallback(ai, `
          Summarize these key points simply:
          ${chunk}
        `);
        const textVal = result.text || (typeof result.response?.text === 'function' ? await result.response.text() : result.response?.text) || '';
        summaries.push(textVal);
      } catch (err) {
        console.error('Chunk error:', err.message);
        continue; // skip failed chunk, continue with rest
      }
    }

    // Final summary from all chunks
    const combined = summaries.join('\n');
    console.log('Backend: Generating final combined notes...');
    const final = await generateWithModelFallback(ai, `
      Create clean study notes from these summaries:
      ${combined}

      Format:
      📌 Topic: [topic]
      📝 Key Points: [bullet points]
      💡 Important Concepts: [concepts]
      ❓ Possible Questions: [questions]
    `);

    const summary = final.text || (typeof final.response?.text === 'function' ? await final.response.text() : final.response?.text) || '';

    console.log('Gemini response:', summary.slice(0, 100));

    console.log('Backend: Response sent');
    return res.status(200).json({
      success: true,
      summary: summary,
    });
  } catch (error) {
    console.error('Full error in generateYoutubeNotes:', error);
    if (
      error.message?.includes('RESOURCE_EXHAUSTED') ||
      error.message?.includes('exhaustion') ||
      error.message?.includes('quota')
    ) {
      return res.status(200).json({
        success: true,
        isFallback: true,
        data: {
          title: "Optimized Video Lecture Notes",
          summary: "The video lecture notes service is currently experiencing high load. Here are the metadata-based fallback notes.",
          keyPoints: [
            "The active Gemini API quota has been reached.",
            "Please check back again in a few minutes.",
            "Video ID and reference details remain accessible."
          ]
        }
      });
    }
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal Server Error during notes generation',
    });
  }
};

export const getPlaylistVideosController = async (req, res) => {
  try {
    const { playlistUrl } = req.body;
    if (!playlistUrl) {
      return res.status(400).json({
        success: false,
        message: 'Playlist URL/ID is required',
      });
    }

    const videos = await getPlaylistVideos(playlistUrl);
    return res.status(200).json({
      success: true,
      videos,
    });
  } catch (error) {
    console.error('Playlist Controller Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to retrieve playlist details',
    });
  }
};

