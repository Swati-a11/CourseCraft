import { useState } from 'react';
import axios from 'axios';
import DashboardLayout from '../../layouts/DashboardLayout';

const YoutubeNotes = () => {

  // ===============================
  // YOUTUBE STATES
  // ===============================
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');

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

    try {

      setLoading(true);

      const res = await axios.post(
        'http://localhost:5000/api/youtube/generate-notes',
        {
          videoUrl: url,
        }
      );

      setSummary(res.data.summary);
      setPdfUrl(res.data.pdfUrl);

    } catch (error) {

      console.error(error);

      const errorMessage =
        error.response?.data?.message ||
        'Failed to generate YouTube notes';

      alert(errorMessage);

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

      // IMPORTANT
      formData.append('pdf', pdfFile);

      const res = await axios.post(
        'http://localhost:5000/api/pdf/generate-notes',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setPdfSummary(res.data.summary);

    } catch (error) {

      console.error(error);

      const errorMessage =
        error.response?.data?.message ||
        'Failed to generate PDF notes';

      alert(errorMessage);

    } finally {
      setPdfLoading(false);
    }
  };

  // ===============================
  // STYLED CONTENT RENDERER
  // ===============================
  const renderStyledContent = (content) => {

    return content.split('\n').map((line, index) => {

      // ===============================
      // HEADINGS
      // ===============================
      if (
        line.includes('Summary') ||
        line.includes('Key Points') ||
        line.includes('Important Topics') ||
        line.includes('Exam Notes') ||
        line.includes('Main Topics')
      ) {
        return (
          <h3
            key={index}
            className="text-2xl font-bold text-cyan-400 mt-8 mb-4"
          >
            {line}
          </h3>
        );
      }

      // ===============================
      // BULLET POINTS
      // ===============================
      if (
        line.trim().startsWith('-') ||
        line.trim().startsWith('•') ||
        /^\d+\./.test(line.trim())
      ) {
        return (
          <div
            key={index}
            className="ml-4 mb-3 border-l-2 border-blue-500/30 pl-4 text-gray-300"
          >
            {line}
          </div>
        );
      }

      // ===============================
      // EMPTY LINE
      // ===============================
      if (line.trim() === '') {
        return <div key={index} className="h-2"></div>;
      }

      // ===============================
      // NORMAL TEXT
      // ===============================
      return (
        <p
          key={index}
          className="text-gray-300 leading-8"
        >
          {line}
        </p>
      );
    });
  };

  return (
    <DashboardLayout>

      <div className="max-w-5xl mx-auto py-6">

        {/* ===============================
            PAGE TITLE
        =============================== */}
        <h1 className="text-4xl font-bold text-white mb-8">
          AI Learning Tools
        </h1>

        {/* ===============================
            YOUTUBE NOTES SECTION
        =============================== */}
        <div className="bg-zinc-900 border border-green-500/20 rounded-3xl p-6 shadow-2xl">

          <h2 className="text-2xl font-bold text-green-400 mb-5">
            YouTube Video Notes
          </h2>

          <input
            type="text"
            placeholder="Paste YouTube video link..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full p-4 rounded-2xl bg-zinc-800 text-white border border-green-500/20 outline-none focus:border-green-400"
          />

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="mt-5 px-6 py-3 bg-green-500 hover:bg-green-400 transition rounded-2xl font-bold text-black"
          >
            {loading ? 'Generating Notes...' : 'Generate Notes'}
          </button>
        </div>

        {/* ===============================
            YOUTUBE OUTPUT
        =============================== */}
        {summary && (
          <div className="mt-8 bg-zinc-900 border border-green-500/20 rounded-3xl p-8 shadow-2xl">

            <h2 className="text-3xl font-bold text-green-400 mb-6">
              Generated Notes
            </h2>

            <div className="space-y-4">
              {renderStyledContent(summary)}
            </div>

            {pdfUrl && (
              <a
                href={pdfUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-block mt-8 px-6 py-3 bg-green-500 hover:bg-green-400 transition rounded-2xl font-bold text-black"
              >
                Download PDF
              </a>
            )}
          </div>
        )}

        {/* ===============================
            PDF SUMMARIZER SECTION
        =============================== */}
        <div className="mt-10 bg-zinc-900 border border-blue-500/20 rounded-3xl p-6 shadow-2xl">

          <h2 className="text-2xl font-bold text-blue-400 mb-5">
            AI PDF Summarizer
          </h2>

          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setPdfFile(e.target.files[0])}
            className="w-full p-4 rounded-2xl bg-zinc-800 text-white border border-blue-500/20 outline-none
            file:mr-4
            file:py-2
            file:px-4
            file:rounded-xl
            file:border-0
            file:text-sm
            file:font-semibold
            file:bg-blue-500
            file:text-black
            hover:file:bg-blue-400"
          />

          <button
            onClick={handleGeneratePdf}
            disabled={pdfLoading}
            className="mt-5 px-6 py-3 bg-blue-500 hover:bg-blue-400 transition rounded-2xl font-bold text-black"
          >
            {pdfLoading ? 'Summarizing PDF...' : 'Summarize PDF'}
          </button>
        </div>

        {/* ===============================
            PDF OUTPUT
        =============================== */}
        {pdfSummary && (
          <div className="mt-8 bg-zinc-900 border border-blue-500/20 rounded-3xl p-8 shadow-2xl">

            <h2 className="text-3xl font-bold text-blue-400 mb-6">
              PDF Summary & Notes
            </h2>

            <div className="space-y-4">
              {renderStyledContent(pdfSummary)}
            </div>
          </div>
        )}

      </div>

    </DashboardLayout>
  );
};

export default YoutubeNotes;