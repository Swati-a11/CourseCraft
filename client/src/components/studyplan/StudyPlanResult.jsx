// src/components/studyplan/StudyPlanResult.jsx
import { useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import toast from "react-hot-toast";

const stripStudyPlanEmojis = (text) => text
  .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
  .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1 ($2)")
  .replace(/[\p{Extended_Pictographic}\uFE0F\u200D]/gu, "")
  .replace(/(^|\s)[#>*_~`]+(?=\s|$)/gm, "$1")
  .replace(/[ \t]{2,}/g, " ")
  .replace(/[ \t]+$/gm, "");

const StudyPlanResult = ({ plan }) => {
  const contentRef = useRef(null);
  const cleanPlan = typeof plan === "string"
    ? stripStudyPlanEmojis(plan)
    : plan;

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
            el.style.color = "#203247";
            el.style.backgroundColor =
              el.tagName === "CODE" ? "#27272a" : "transparent";
            el.style.borderColor = "#173a60"; // azure-900
          });

          // Headings
          root.querySelectorAll("h1").forEach((el) => {
            el.style.color = "#174878";
          });

          root.querySelectorAll("h2").forEach((el) => {
            el.style.color = "#205b88";
          });

          root.querySelectorAll("h3").forEach((el) => {
            el.style.color = "#205b88";
          });

          // Links
          root.querySelectorAll("a").forEach((el) => {
            el.style.color = "#075985";
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
            el.style.borderLeft = "4px solid #438fdd";
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
    <div className="cc-study-plan mt-8 rounded-2xl border p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="text-3xl font-bold text-[var(--cc-study-heading)]">
          Your Personalized Study Plan
        </h2>

          <button
          onClick={downloadPDF}
          className="relative z-10 min-h-11 rounded-lg bg-azure-600 px-4 py-2 font-medium text-[var(--cc-action-ink)] transition hover:bg-azure-700"
        >
           Download PDF
        </button>
      </div>

      {/* Content to Export */}
      <div ref={contentRef} data-pdf-content className="cc-study-plan-content">
        <div className="max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ children }) => (
                <h1 className="mt-8 mb-4 border-b border-[var(--cc-study-border)] pb-2 text-2xl font-bold text-[var(--cc-study-heading)]">
                  {children}
                </h1>
              ),

              h2: ({ children }) => (
                <h2 className="mt-6 mb-3 text-xl font-semibold text-[var(--cc-study-heading)]">
                  {children}
                </h2>
              ),

              h3: ({ children }) => (
                <h3 className="mt-4 mb-2 text-lg font-semibold text-[var(--cc-study-subheading)]">
                  {children}
                </h3>
              ),

              p: ({ children }) => (
                <p className="mb-4 leading-7 text-[var(--cc-study-body)]">
                  {children}
                </p>
              ),

              ul: ({ children }) => (
                <ul className="mb-4 list-disc space-y-1 pl-6 text-[var(--cc-study-body)]">
                  {children}
                </ul>
              ),

              ol: ({ children }) => (
                <ol className="mb-4 list-decimal space-y-1 pl-6 text-[var(--cc-study-body)]">
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
                      className="text-[var(--cc-study-link)] underline hover:opacity-80"
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
                      <code className="text-[var(--cc-study-subheading)]">
                        {children}
                      </code>
                    </pre>
                  );
                }

                return (
                  <code className="rounded bg-zinc-800 px-1 py-0.5 text-[var(--cc-study-subheading)]">
                    {children}
                  </code>
                );
              },

              blockquote: ({ children }) => (
                <blockquote className="my-4 border-l-4 border-[var(--cc-study-border)] pl-4 italic text-[var(--cc-study-body)]">
                  {children}
                </blockquote>
              ),
            }}
          >
            {cleanPlan}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default StudyPlanResult;
