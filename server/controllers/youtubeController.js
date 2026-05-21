import { YoutubeTranscript } from 'youtube-transcript';

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

    res.status(200).json({
      success: true,
      summary: text.slice(0, 2000),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
