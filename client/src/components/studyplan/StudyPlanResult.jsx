// src/components/studyplan/StudyPlanResult.jsx
import { useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import toast from "react-hot-toast";

const StudyPlanResult = ({ plan }) => {
  const contentRef = useRef(null);

  if (!plan) return null;

  const downloadPDF = async () => {
    const element = contentRef.current;

    if (!element) {
      toast.error("Study plan content not found.");
      return;
    }

    try {
      toast.loading("Generating PDF...", { id: "pdf" });

      // Clone DOM and replace unsupported Tailwind OKLCH colors
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#09090b",
        scrollY: -window.scrollY,

        onclone: (clonedDoc) => {
          const root = clonedDoc.querySelector("[data-pdf-content]");

          if (!root) return;

          // Force all text colors to standard hex colors
          root.querySelectorAll("*").forEach((el) => {
            el.style.color = "#d1d5db"; // gray-300
            el.style.backgroundColor =
              el.tagName === "CODE" ? "#27272a" : "transparent";
            el.style.borderColor = "#14532d"; // green-900
          });

          // Headings
          root.querySelectorAll("h1").forEach((el) => {
            el.style.color = "#4ade80"; // green-400
          });

          root.querySelectorAll("h2").forEach((el) => {
            el.style.color = "#86efac"; // green-300
          });

          root.querySelectorAll("h3").forEach((el) => {
            el.style.color = "#bbf7d0"; // green-200
          });

          // Links
          root.querySelectorAll("a").forEach((el) => {
            el.style.color = "#60a5fa"; // blue-400
            el.style.textDecoration = "underline";
          });

          // Code blocks
          root.querySelectorAll("pre").forEach((el) => {
            el.style.backgroundColor = "#18181b";
            el.style.border = "1px solid #3f3f46";
            el.style.padding = "16px";
            el.style.borderRadius = "12px";
          });

          // Blockquotes
          root.querySelectorAll("blockquote").forEach((el) => {
            el.style.borderLeft = "4px solid #22c55e";
            el.style.paddingLeft = "16px";
            el.style.fontStyle = "italic";
            el.style.color = "#9ca3af";
          });
        },
      });

      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a4");

      const pageWidth = 210;
      const pageHeight = 297;

      const imgWidth = pageWidth;
      const imgHeight =
        (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      // First page
      pdf.addImage(
        imgData,
        "PNG",
        0,
        position,
        imgWidth,
        imgHeight
      );

      heightLeft -= pageHeight;

      // Additional pages
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(
          imgData,
          "PNG",
          0,
          position,
          imgWidth,
          imgHeight
        );
        heightLeft -= pageHeight;
      }

      pdf.save("AI-Study-Plan.pdf");

      toast.success("PDF downloaded successfully!", {
        id: "pdf",
      });
    } catch (error) {
      console.error("PDF generation failed:", error);
      toast.error("Failed to generate PDF.", {
        id: "pdf",
      });
    }
  };

  return (
    <div className="bg-zinc-950 border border-green-900/30 rounded-2xl p-6 mt-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="text-3xl font-bold text-green-400">
          Your Personalized Study Plan
        </h2>

        <button
          onClick={downloadPDF}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition"
        >
           Download PDF
        </button>
      </div>

      {/* Content to Export */}
      <div ref={contentRef} data-pdf-content>
        <div className="prose prose-invert max-w-none prose-headings:text-green-400 prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ children }) => (
                <h1 className="text-2xl font-bold text-green-400 mt-8 mb-4 border-b border-green-800 pb-2">
                  {children}
                </h1>
              ),

              h2: ({ children }) => (
                <h2 className="text-xl font-semibold text-green-300 mt-6 mb-3">
                  {children}
                </h2>
              ),

              h3: ({ children }) => (
                <h3 className="text-lg font-semibold text-green-200 mt-4 mb-2">
                  {children}
                </h3>
              ),

              p: ({ children }) => (
                <p className="text-gray-300 leading-7 mb-4">
                  {children}
                </p>
              ),

              ul: ({ children }) => (
                <ul className="list-disc pl-6 text-gray-300 mb-4 space-y-1">
                  {children}
                </ul>
              ),

              ol: ({ children }) => (
                <ol className="list-decimal pl-6 text-gray-300 mb-4 space-y-1">
                  {children}
                </ol>
              ),

              li: ({ children }) => <li>{children}</li>,

              a: ({ href, children }) => {
                const isYouTube =
                  href?.includes("youtube.com") ||
                  href?.includes("youtu.be");

                if (isYouTube) {
                  return (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3 py-2 mt-2 mb-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition"
                    >
                      ▶ Watch on YouTube
                    </a>
                  );
                }

                return (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 underline"
                  >
                    {children}
                  </a>
                );
              },

              code: ({ children, className }) => {
                const isBlock = className?.includes("language-");

                if (isBlock) {
                  return (
                    <pre className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 overflow-x-auto mb-4">
                      <code className="text-green-300">
                        {children}
                      </code>
                    </pre>
                  );
                }

                return (
                  <code className="bg-zinc-800 text-green-300 px-1 py-0.5 rounded">
                    {children}
                  </code>
                );
              },

              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-green-500 pl-4 italic text-gray-400 my-4">
                  {children}
                </blockquote>
              ),
            }}
          >
            {plan}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default StudyPlanResult;