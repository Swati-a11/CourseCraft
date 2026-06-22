import { YoutubeTranscript } from 'youtube-transcript';
import { GoogleGenAI } from '@google/genai';

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

    let baseText = transcriptionVar || descriptionVar || titleVar || "No text context available";

    // Apply safe slicing only after string confirmation
    const slicedText = typeof baseText === 'string' 
      ? baseText.split(' ').slice(0, 1200).join(' ') 
      : "Fallback content description stub";

    console.log('Transcript snippet (sliced):', slicedText ? slicedText.slice(0, 100) : 'EMPTY');

    // =========================
    // GEMINI AI Notes Generation
    // =========================
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const prompt = `
You are an AI YouTube video summarizer.

Analyze the following lecture transcript snippet and generate crisp, high-fidelity educational notes. Keep the response concise, focusing only on the absolute core concepts and key takeaways. The entire output must strictly be between 10 to 20 lines maximum.

Transcript Content:
${slicedText}
`;

    console.log('Backend: Gemini request started');
    const response = await Promise.race([
      ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: prompt,
      }),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Gemini API request timeout')), 15000))
    ]);
    console.log('Backend: Gemini request completed');

    const summary = response.text || '';

    console.log('Gemini response:', summary.slice(0, 100));

    console.log('Backend: Response sent');
    return res.status(200).json({
      success: true,
      summary: summary,
    });
  } catch (error) {
    console.error('Full error in generateYoutubeNotes:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal Server Error during notes generation',
    });
  }
};

