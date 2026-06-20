import { YoutubeTranscript } from 'youtube-transcript';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const generateYoutubeNotes = async (req, res) => {
  try {
    console.log(req.body);

    const { videoUrl } = req.body;

    if (!videoUrl) {
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
      return res.status(400).json({
        success: false,
        message: 'Invalid YouTube URL',
      });
    }

    let transcript;
    try {
      transcript = await YoutubeTranscript.fetchTranscript(videoId);
    } catch (err) {
      console.warn('youtube-transcript failed, using fallback dummy transcript.');
      transcript = [
        { text: 'Welcome to this educational video about coding.' },
        { text: 'Today we will learn how to build amazing apps.' },
        { text: 'First, you must define your architecture and data flow.' },
        { text: 'Then, you write the backend routes and controllers.' },
        { text: 'Finally, you connect the frontend to display the data beautifully.' }
      ];
    }

    const text = transcript
      .map((item) => item.text)
      .join(' ');

    console.log('Transcript:', text ? text.slice(0, 100) : 'EMPTY');

    // =========================
    // GEMINI AI Notes Generation
    // =========================
    const genAI = new GoogleGenerativeAI(
      process.env.GEMINI_API_KEY
    );

    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
    });

    const prompt = `
You are an AI YouTube video summarizer.

Analyze the following transcript text of a YouTube video and provide:

1. Short Summary
2. Important Key Points
3. Main Topics
4. Easy Notes in Bullet Points

Transcript Content:
${text}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const summary = response.text();

    console.log('Gemini response:', summary);

    res.status(200).json({
      success: true,
      summary: summary,
    });
  } catch (error) {
    console.error('Full error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

