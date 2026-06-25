import { useState } from 'react';
import api from '../../services/api';
import DashboardLayout from '../../layouts/DashboardLayout';
import { toast } from 'react-toastify';
import { Play, ListVideo, Video, BookOpen, AlertCircle } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const YoutubeNotes = () => {
  const { isLight } = useTheme();

  // ===============================
  // YOUTUBE & PLAYLIST STATES
  // ===============================
  const [url, setUrl] = useState('');
  const [mode, setMode] = useState('single'); // 'single' | 'playlist'
  const [loading, setLoading] = useState(false);
  const [playlistLoading, setPlaylistLoading] = useState(false);
  const [playlistVideos, setPlaylistVideos] = useState([]);
  const [summary, setSummary] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');
  const [statusText, setStatusText] = useState('');
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [activeVideoId, setActiveVideoId] = useState(null);
  const [response, setResponse] = useState(null);

  // ===============================
  // PDF STATES
  // ===============================
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfSummary, setPdfSummary] = useState('');

  // ===============================
  // GENERATE NOTES (SINGLE VIDEO)
  // ===============================
  const handleGenerate = async () => {
    if (!url) {
      alert('Please enter a YouTube URL');
      return;
    }

    let statusTimer;
    try {
      setLoading(true);
      setSummary('');
      setResponse(null);
      setSelectedVideo(null);
      setStatusText('Fetching transcript...');

      statusTimer = setTimeout(() => {
        setStatusText('Generating notes...');
      }, 3000);

      const res = await api.post('/youtube/generate-notes', {
        videoUrl: url,
      });

      clearTimeout(statusTimer);
      setStatusText('Notes generated');
      setResponse(res.data);
      if (res.data.isFallback) {
        setSummary('');
      } else {
        setSummary(res.data.summary);
      }
      setPdfUrl(res.data.pdfUrl);
      
      let extractedId = null;
      const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
      if (match && match[1]) {
        extractedId = match[1];
      }
      if (extractedId) {
        setActiveVideoId(extractedId);
      }

      toast.success("Notes generated successfully!");
    } catch (error) {
      if (statusTimer) clearTimeout(statusTimer);
      console.error(error);
      setStatusText('Generation failed');
      toast.error(error.response?.data?.message || 'Failed to generate notes');
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // FETCH PLAYLIST VIDEOS
  // ===============================
  const handleFetchPlaylist = async () => {
    if (!url) {
      alert('Please enter a YouTube Playlist URL or ID');
      return;
    }

    try {
      setPlaylistLoading(true);
      setPlaylistVideos([]);
      setSummary('');
      setResponse(null);
      setSelectedVideo(null);
      setActiveVideoId(null);
      setStatusText('Loading playlist...');

      const res = await api.post('/youtube/playlist', {
        playlistUrl: url,
      });

      setPlaylistVideos(res.data.videos || []);
      setStatusText(`Loaded ${res.data.videos?.length || 0} videos`);
      toast.success("Playlist loaded successfully!");
    } catch (error) {
      console.error(error);
      setStatusText('Failed to load playlist');
      toast.error(error.response?.data?.message || 'Failed to load playlist');
    } finally {
      setPlaylistLoading(false);
    }
  };

  // ===============================
  // GENERATE FOR PLAYLIST VIDEO
  // ===============================
  const handleGenerateForVideo = async (video) => {
    let statusTimer;
    try {
      setLoading(true);
      setSummary('');
      setResponse(null);
      setSelectedVideo(video.videoId);
      setStatusText(`Fetching transcript for "${video.title.slice(0, 30)}..."`);

      statusTimer = setTimeout(() => {
        setStatusText('Generating notes...');
      }, 3000);

      const res = await api.post('/youtube/generate-notes', {
        videoUrl: `https://www.youtube.com/watch?v=${video.videoId}`,
        title: video.title,
        description: video.description
      });

      clearTimeout(statusTimer);
      setStatusText('Notes generated');
      setResponse(res.data);
      if (res.data.isFallback) {
        setSummary('');
      } else {
        setSummary(res.data.summary);
      }
      setPdfUrl(res.data.pdfUrl);
      toast.success("Notes generated successfully!");
    } catch (error) {
      if (statusTimer) clearTimeout(statusTimer);
      console.error(error);
      setStatusText('Generation failed');
      toast.error(error.response?.data?.message || 'Failed to generate notes');
    } finally {
      setLoading(false);
    }
  };

  const handleVideoSelect = (video) => {
    setActiveVideoId(video.videoId);
    setStatusText(`Now Playing: ${video.title}`);
    if (!loading) {
      handleGenerateForVideo(video);
    }
  };

  // ===============================
  // GENERATE PDF NOTES
  // ===============================
  const handleGeneratePdf = async () => {
    if (!pdfFile) {
      alert('Please select a PDF file first.');
      return;
    }

    try {
      setPdfLoading(true);

      const formData = new FormData();
      formData.append('pdf', pdfFile);

      const res = await api.post('/pdf/summarize', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setPdfSummary(res.data.summary);
      toast.success("PDF Notes generated successfully!");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to generate PDF notes');
    } finally {
      setPdfLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto py-6 px-4 sm:px-6">
        <h1 className={`text-3xl sm:text-4xl font-bold mb-6 sm:mb-8 flex items-center gap-3 transition-colors ${
          isLight ? 'text-slate-900' : 'text-white'
        }`}>
          <BookOpen className={isLight ? 'text-green-600' : 'text-green-400'} size={36} />
          AI Learning Tools
        </h1>

        {/* MODE SELECTOR */}
        <div className={`flex p-1.5 rounded-2xl border mb-6 max-w-sm transition-colors ${
          isLight ? 'bg-slate-200/60 border-slate-300/80' : 'bg-zinc-950 border-white/10'
        }`}>
          <button
            onClick={() => {
              setMode('single');
              setUrl('');
              setPlaylistVideos([]);
              setSummary('');
            }}
            className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
              mode === 'single'
                ? 'bg-green-500 text-black'
                : (isLight ? 'text-slate-600 hover:text-slate-900' : 'text-gray-400 hover:text-white')
            }`}
          >
            <Video size={16} />
            Single Video
          </button>
          <button
            onClick={() => {
              setMode('playlist');
              setUrl('');
              setPlaylistVideos([]);
              setSummary('');
            }}
            className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
              mode === 'playlist'
                ? 'bg-green-500 text-black'
                : (isLight ? 'text-slate-600 hover:text-slate-900' : 'text-gray-400 hover:text-white')
            }`}
          >
            <ListVideo size={16} />
            Playlist Mode
          </button>
        </div>

        {/* INPUT PANEL */}
        <div className={`border rounded-3xl p-6 shadow-2xl transition-colors ${
          isLight ? 'bg-white border-slate-200' : 'bg-zinc-900 border-green-500/20'
        }`}>
          <h2 className={`text-xl sm:text-2xl font-bold mb-4 flex items-center gap-2 transition-colors ${
            isLight ? 'text-green-600' : 'text-green-400'
          }`}>
            {mode === 'single' ? 'YouTube Video Notes' : 'YouTube Playlist Explorer'}
          </h2>

          <input
            type="text"
            placeholder={mode === 'single' ? 'Paste YouTube link (e.g. https://www.youtube.com/watch?v=...)' : 'Paste YouTube playlist link or ID...'}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className={`w-full p-4 rounded-2xl border outline-none transition-all ${
              isLight
                ? 'bg-slate-50 text-slate-900 border-slate-200 focus:border-green-500'
                : 'bg-zinc-800 text-white border-white/5 focus:border-green-500/50'
            }`}
          />

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-5">
            {mode === 'single' ? (
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="w-full sm:w-auto px-6 py-3.5 bg-green-500 hover:bg-green-400 text-black rounded-2xl font-bold transition-all disabled:bg-zinc-700 disabled:text-gray-400"
              >
                {loading ? 'Generating...' : 'Generate Notes'}
              </button>
            ) : (
              <button
                onClick={handleFetchPlaylist}
                disabled={playlistLoading}
                className="w-full sm:w-auto px-6 py-3.5 bg-green-500 hover:bg-green-400 text-black rounded-2xl font-bold transition-all disabled:bg-zinc-700 disabled:text-gray-400"
              >
                {playlistLoading ? 'Loading Playlist...' : 'Load Playlist'}
              </button>
            )}

            {statusText && (
              <span className={`text-sm font-semibold flex items-center gap-2 mt-1 sm:mt-0 ${
                isLight ? 'text-slate-500' : 'text-gray-400'
              }`}>
                <span className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse"></span>
                Status: <span className="text-green-500">{statusText}</span>
              </span>
            )}
          </div>
        </div>

        {/* PLAYLIST VIDEOS LIST */}
        {mode === 'playlist' && playlistVideos.length > 0 && (
          <div className="mt-8">
            {activeVideoId ? (
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Left Column - Active Video & Notes */}
                <div className="flex-1 space-y-6">
                  {/* Video Player */}
                  <div className={`border rounded-3xl p-4 shadow-2xl transition-colors ${
                    isLight ? 'bg-white border-slate-200' : 'bg-zinc-900 border-green-500/20'
                  }`}>
                    <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-inner bg-black">
                      <iframe
                        src={`https://www.youtube.com/embed/${activeVideoId}?autoplay=1`}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        className="w-full h-full"
                      ></iframe>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <h3 className={`font-bold truncate text-base sm:text-lg transition-colors ${
                        isLight ? 'text-slate-900' : 'text-white'
                      }`}>
                        {playlistVideos.find(v => v.videoId === activeVideoId)?.title || "Active Video Lecture"}
                      </h3>
                      <span className="text-xs px-2.5 py-1 bg-green-500/20 text-green-400 font-semibold rounded-full uppercase tracking-wider animate-pulse">
                        Active Learning
                      </span>
                    </div>
                  </div>

                  {/* AI Generated Notes for Active Video */}
                  {(summary || (response && response.isFallback)) && (
                    <div className={`p-6 sm:p-8 rounded-3xl border shadow-2xl animate-fade-in transition-colors ${
                      isLight ? 'bg-white border-slate-200' : 'bg-zinc-900 border-white/5'
                    }`}>
                      <h2 className={`text-2xl font-bold mb-4 flex items-center gap-2 border-b pb-3 transition-colors ${
                        isLight ? 'text-green-600 border-slate-200' : 'text-green-400 border-white/10'
                      }`}>
                        📝 Generated Lecture Notes
                      </h2>
                      {summary ? (
                        <pre className={`whitespace-pre-wrap font-sans text-sm sm:text-base leading-relaxed transition-colors ${
                          isLight ? 'text-slate-700' : 'text-gray-300'
                        }`}>
                          {summary}
                        </pre>
                      ) : (
                        response && response.isFallback && (
                          <div>
                            <p className="text-sm text-gray-400">{response.data.summary || response.data.message}</p>
                            <div className="flex flex-wrap gap-2 mt-3">
                              {response.data.topics.map(topic => (
                                <span key={topic} className="px-3 py-1 rounded-full bg-green-500/10 
                                  text-green-400 border border-green-500/20 text-sm capitalize">
                                  {topic}
                                </span>
                              ))}
                            </div>
                          </div>
                        )
                      )}
                      {pdfUrl && (
                        <a
                          href={pdfUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-6 inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-black px-6 py-3 rounded-2xl font-bold transition-all"
                        >
                          Download PDF
                        </a>
                      )}
                    </div>
                  )}
                </div>

                {/* Right Column - Scrollable Playlist sidebar */}
                <div className="w-full lg:w-80 flex-shrink-0">
                  <div className={`border rounded-3xl p-4 max-h-[750px] overflow-y-auto space-y-4 pr-1 transition-colors ${
                    isLight ? 'bg-slate-100/50 border-slate-200' : 'bg-zinc-950/60 border-white/10'
                  }`}>
                    <h3 className={`text-base font-bold flex items-center gap-2 pb-2 border-b transition-colors ${
                      isLight ? 'text-slate-900 border-slate-200' : 'text-white border-white/5'
                    }`}>
                      <ListVideo className={isLight ? 'text-green-600' : 'text-green-400'} size={18} />
                      Playlist ({playlistVideos.length})
                    </h3>
                    <div className="space-y-3">
                      {playlistVideos.map((video, idx) => (
                        <div
                          key={idx}
                          onClick={() => !loading && handleVideoSelect(video)}
                          className={`group flex gap-3 border rounded-xl overflow-hidden cursor-pointer p-2 transition-all hover:scale-[1.01] hover:border-green-500/30 ${
                            activeVideoId === video.videoId
                              ? 'border-green-500 bg-green-500/5 shadow-md shadow-green-500/5'
                              : (isLight ? 'bg-white border-slate-200/80 hover:bg-slate-50' : 'bg-zinc-900 border-white/5')
                          }`}
                        >
                          <div className="w-20 h-14 bg-zinc-800 rounded overflow-hidden flex-shrink-0 relative">
                            {video.thumbnails?.default ? (
                              <img
                                src={video.thumbnails.default}
                                alt={video.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-500">
                                No Preview
                              </div>
                            )}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                              <Play className="text-green-400 fill-green-400" size={14} />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className={`font-semibold line-clamp-2 text-[11px] leading-tight group-hover:text-green-500 transition-colors ${
                              activeVideoId === video.videoId
                                ? (isLight ? 'text-green-600' : 'text-green-400')
                                : (isLight ? 'text-slate-800' : 'text-white')
                            }`}>
                              {video.title}
                            </h4>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Grid Layout when no video is selected */
              <div className={`border rounded-3xl p-6 transition-colors ${
                isLight ? 'bg-slate-100/50 border-slate-200' : 'bg-zinc-950/60 border-white/10'
              }`}>
                <h3 className={`text-xl font-bold mb-5 flex items-center gap-2 transition-colors ${
                  isLight ? 'text-slate-900' : 'text-white'
                }`}>
                  <ListVideo className={isLight ? 'text-green-600' : 'text-green-400'} />
                  Playlist Videos ({playlistVideos.length})
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[600px] overflow-y-auto pr-1">
                  {playlistVideos.map((video, idx) => (
                    <div
                      key={idx}
                      onClick={() => !loading && handleVideoSelect(video)}
                      className={`group border rounded-2xl overflow-hidden cursor-pointer transition-all hover:scale-[1.02] hover:border-green-500/40 hover:shadow-lg hover:shadow-green-500/5 ${
                        activeVideoId === video.videoId
                          ? 'border-green-500 shadow-lg shadow-green-500/10'
                          : (isLight ? 'bg-white border-slate-200' : 'bg-zinc-900 border-white/5')
                      }`}
                    >
                      <div className="aspect-video w-full bg-zinc-800 relative">
                        {video.thumbnails?.medium ? (
                          <img
                            src={video.thumbnails.medium}
                            alt={video.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-500">
                             No Thumbnail
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                          <Play className="text-green-400 fill-green-400 scale-125" size={24} />
                        </div>
                      </div>
                      <div className="p-4">
                        <h4 className={`font-semibold line-clamp-2 text-sm transition-colors group-hover:text-green-600 ${
                          isLight ? 'text-slate-800' : 'text-white'
                        }`}>
                          {video.title}
                        </h4>
                        <p className={`text-xs mt-2 line-clamp-2 transition-colors ${
                          isLight ? 'text-slate-500' : 'text-gray-400'
                        }`}>
                          {video.description || 'No description available.'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* SINGLE VIDEO PLAYER & NOTES OUTPUT */}
        {mode === 'single' && activeVideoId && (
          <div className="mt-8 space-y-6">
            {/* Embedded player */}
            <div className={`border rounded-3xl p-4 shadow-2xl transition-colors ${
              isLight ? 'bg-white border-slate-200' : 'bg-zinc-900 border-green-500/20'
            }`}>
              <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-inner bg-black">
                <iframe
                  src={`https://www.youtube.com/embed/${activeVideoId}`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              </div>
            </div>

            {/* Generated Notes */}
            {(summary || (response && response.isFallback)) && (
              <div className={`p-6 sm:p-8 rounded-3xl border shadow-2xl animate-fade-in transition-colors ${
                isLight ? 'bg-white border-slate-200' : 'bg-zinc-900 border-white/5'
              }`}>
                <h2 className={`text-2xl font-bold mb-4 flex items-center gap-2 border-b pb-3 transition-colors ${
                  isLight ? 'text-green-600 border-slate-200' : 'text-green-400 border-white/10'
                }`}>
                  📝 Generated Lecture Notes
                </h2>
                {summary ? (
                  <pre className={`whitespace-pre-wrap font-sans text-sm sm:text-base leading-relaxed transition-colors ${
                    isLight ? 'text-slate-700' : 'text-gray-300'
                  }`}>
                    {summary}
                  </pre>
                ) : (
                  response && response.isFallback && (
                    <div>
                      <p className="text-sm text-gray-400">{response.data.summary || response.data.message}</p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {response.data.topics.map(topic => (
                          <span key={topic} className="px-3 py-1 rounded-full bg-green-500/10 
                            text-green-400 border border-green-500/20 text-sm capitalize">
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                  )
                )}

                {pdfUrl && (
                  <a
                    href={pdfUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-6 inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-black px-6 py-3 rounded-2xl font-bold transition-all"
                  >
                    Download PDF
                  </a>
                )}
              </div>
            )}
          </div>
        )}

        {/* PDF SECTION */}
        <div className={`mt-10 border rounded-3xl p-6 shadow-2xl transition-colors ${
          isLight ? 'bg-white border-slate-200' : 'bg-zinc-900 border-white/5'
        }`}>
          <h2 className={`text-xl sm:text-2xl font-bold mb-4 flex items-center gap-2 transition-colors ${
            isLight ? 'text-blue-600' : 'text-blue-400'
          }`}>
            AI PDF Summarizer
          </h2>

          <div className={`p-8 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all ${
            isLight ? 'border-slate-300 hover:border-blue-500 bg-slate-50' : 'border-zinc-700 hover:border-blue-500/50 bg-zinc-950/40'
          }`}>
            <input
              type="file"
              accept="application/pdf"
              id="pdf-upload"
              onChange={(e) => setPdfFile(e.target.files[0])}
              className="hidden"
            />
            <label htmlFor="pdf-upload" className="cursor-pointer text-center flex flex-col items-center gap-3">
              <span className={`px-4 py-2 rounded-xl font-medium border transition-colors ${
                isLight ? 'bg-slate-100 text-slate-800 border-slate-200 group-hover:bg-slate-200' : 'bg-zinc-800 text-white border-white/5 group-hover:bg-zinc-700'
              }`}>
                Choose PDF File
              </span>
              <span className={`text-sm transition-colors ${
                isLight ? 'text-slate-500' : 'text-gray-400'
              }`}>
                {pdfFile ? `Selected: ${pdfFile.name}` : 'Support PDF formats up to 10MB'}
              </span>
            </label>
          </div>

          <button
            onClick={handleGeneratePdf}
            disabled={pdfLoading || !pdfFile}
            className="mt-5 w-full sm:w-auto px-6 py-3.5 bg-blue-500 hover:bg-blue-400 text-white rounded-2xl font-bold transition-all disabled:bg-zinc-700 disabled:text-gray-400"
          >
            {pdfLoading ? 'Processing...' : 'Summarize PDF'}
          </button>
        </div>

        {/* PDF OUTPUT */}
        {pdfSummary && (
          <div className={`mt-8 p-6 sm:p-8 rounded-3xl border shadow-2xl transition-colors ${
            isLight ? 'bg-white border-slate-200' : 'bg-zinc-900 border-white/5'
          }`}>
            <h2 className={`text-2xl font-bold mb-4 border-b pb-3 transition-colors ${
              isLight ? 'text-blue-600 border-slate-200' : 'text-blue-400 border-white/10'
            }`}>
              PDF Summary Details
            </h2>
            <pre className={`whitespace-pre-wrap font-sans text-sm sm:text-base leading-relaxed transition-colors ${
              isLight ? 'text-slate-700' : 'text-gray-300'
            }`}>
              {pdfSummary}
            </pre>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default YoutubeNotes;