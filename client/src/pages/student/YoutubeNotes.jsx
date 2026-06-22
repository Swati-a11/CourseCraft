import { useState } from 'react';
import api from '../../services/api';
import DashboardLayout from '../../layouts/DashboardLayout';
import { toast } from 'react-toastify';

const YoutubeNotes = () => {
  // ===============================
  // YOUTUBE STATES
  // ===============================
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');
  const [statusText, setStatusText] = useState('');

  // ===============================
  // PDF STATES
  // ===============================
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfSummary, setPdfSummary] = useState('');

  // ===============================
  // GENERATE YOUTUBE NOTES
  // ===============================
  const handleGenerate = async () => {
    if (!url) {
      alert('Please enter a YouTube URL');
      return;
    }

    let statusTimer;
    try {
      console.log("Frontend: Generate Notes clicked");
      setLoading(true);
      setStatusText('Fetching transcript...');
      console.log('Frontend: Request started');

      statusTimer = setTimeout(() => {
        setStatusText('Generating notes...');
      }, 3000);

      const res = await api.post('/youtube/generate-notes', {
        videoUrl: url,
      });

      clearTimeout(statusTimer);
      console.log('Frontend: Response received', res.data);
      setStatusText('Notes generated');
      if (res.data.isFallback) {
        const { title, summary: fallbackSummary, keyPoints } = res.data.data || {};
        const formattedNotes = `${title}\n\n${fallbackSummary}\n\nKey Takeaways:\n${(keyPoints || []).map(point => `• ${point}`).join('\n')}`;
        setSummary(formattedNotes);
      } else {
        setSummary(res.data.summary);
      }
      setPdfUrl(res.data.pdfUrl);
      toast.success("Notes generated successfully!");
    } catch (error) {
      if (statusTimer) clearTimeout(statusTimer);
      console.error('Frontend: Error received', error);
      setStatusText('Generation failed');
      toast.error(error.response?.data?.message || 'Failed to generate notes');
    } finally {
      setLoading(false);
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

      const res = await api.post('/pdf/generate-notes', formData, {
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

  // ===============================
  // UI RENDER
  // ===============================
  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto py-6">

        <h1 className="text-4xl font-bold text-white mb-8">
          AI Learning Tools
        </h1>

        {/* YOUTUBE */}
        <div className="bg-zinc-900 border border-green-500/20 rounded-3xl p-6">
          <h2 className="text-2xl font-bold text-green-400 mb-5">
            YouTube Video Notes
          </h2>

          <input
            type="text"
            placeholder="Paste YouTube link..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full p-4 rounded-2xl bg-zinc-800 text-white"
          />

          <div className="flex items-center gap-4 mt-5">
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="px-6 py-3 bg-green-500 rounded-2xl font-bold text-black disabled:bg-zinc-700 disabled:text-gray-400"
            >
              {loading ? 'Generating...' : 'Generate Notes'}
            </button>
            {statusText && (
              <span className="text-sm font-semibold text-gray-400">
                Status: <span className="text-green-400">{statusText}</span>
              </span>
            )}
          </div>
        </div>

        {/* OUTPUT */}
        {summary && (
          <div className="mt-8 bg-zinc-900 p-8 rounded-3xl">
            <h2 className="text-green-400 text-2xl mb-4">Notes</h2>
            <pre className="text-gray-300 whitespace-pre-wrap">{summary}</pre>

            {pdfUrl && (
              <a
                href={pdfUrl}
                target="_blank"
                className="mt-5 inline-block bg-green-500 px-5 py-3 rounded-xl"
              >
                Download PDF
              </a>
            )}
          </div>
        )}

        {/* PDF UPLOAD */}
        <div className="mt-10 bg-zinc-900 p-6 rounded-3xl">
          <h2 className="text-blue-400 text-2xl mb-5">
            AI PDF Summarizer
          </h2>

          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setPdfFile(e.target.files[0])}
            className="w-full"
          />

          <button
            onClick={handleGeneratePdf}
            disabled={pdfLoading}
            className="mt-5 px-6 py-3 bg-blue-500 rounded-2xl font-bold"
          >
            {pdfLoading ? 'Processing...' : 'Summarize PDF'}
          </button>
        </div>

        {/* PDF OUTPUT */}
        {pdfSummary && (
          <div className="mt-8 bg-zinc-900 p-8 rounded-3xl">
            <h2 className="text-blue-400 text-2xl mb-4">
              PDF Summary
            </h2>
            <pre className="text-gray-300 whitespace-pre-wrap">{pdfSummary}</pre>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
};

export default YoutubeNotes;