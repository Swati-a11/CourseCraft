const DEFAULT_EMBED =
  "https://www.youtube.com/embed/ysEN5RaKOlE";

const getEmbedUrl = (videoUrl) => {
  if (!videoUrl || typeof videoUrl !== "string") {
    return DEFAULT_EMBED;
  }

  // Already embed URL
  if (
    videoUrl.includes("youtube.com/embed/") &&
    !videoUrl.includes("?search=")
  ) {
    return videoUrl;
  }

  // youtu.be short link
  if (videoUrl.includes("youtu.be/")) {
    const match = videoUrl.match(
      /youtu\.be\/([\w-]{11})/
    );

    return match
      ? `https://www.youtube.com/embed/${match[1]}`
      : DEFAULT_EMBED;
  }

  // watch?v=
  if (videoUrl.includes("watch?v=")) {
    const match = videoUrl.match(/[?&]v=([\w-]{11})/);

    return match
      ? `https://www.youtube.com/embed/${match[1]}`
      : DEFAULT_EMBED;
  }

  // invalid generated search embed
  if (videoUrl.includes("youtube.com/embed?search=")) {
    return DEFAULT_EMBED;
  }

  // Generic extractor
  const match = videoUrl.match(
    /(?:v=|\/watch\?v=|\/embed\/|\/v\/)([\w-]{11})/
  );

  return match
    ? `https://www.youtube.com/embed/${match[1]}`
    : DEFAULT_EMBED;
};

const VideoTab = ({
  title,
  videoUrl,
  completed,
  onComplete,
}) => {
  const embedUrl = getEmbedUrl(videoUrl);

  console.log("VideoTab Debug:", {
    title,
    sourceVideoUrl: videoUrl,
    embedUrl,
  });

  return (
    <div className="w-full">
      {/* Title */}
      <h2 className="text-2xl font-bold text-white mb-4">
        {title
          ? `${title} Video`
          : "Topic Video"}
      </h2>

      {/* Video Player */}
      <div
        className="w-full h-[400px] rounded-2xl overflow-hidden bg-black mb-6 border border-zinc-700 shadow-lg"
        style={{
          position: "relative",
          zIndex: 10,
        }}
      >
        <iframe
          width="100%"
          height="400"
          className="w-full h-full"
          src={embedUrl}
          title={title || "Topic Video"}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>

      {/* Debug URL */}
      <div className="mb-4 p-3 rounded-lg bg-zinc-900 border border-zinc-800">
        <p className="text-xs text-gray-400 break-all">
          <span className="font-semibold text-azure-400">
            Embed URL:
          </span>{" "}
          {embedUrl}
        </p>
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-400 mb-2">
          <span>Watch Progress</span>

          <span>
            {completed ? "100%" : "0%"}
          </span>
        </div>

        <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
          <div
            className="bg-azure-500 h-2 rounded-full transition-all duration-500"
            style={{
              width: completed ? "100%" : "0%",
            }}
          />
        </div>
      </div>

      {/* Complete Button */}
      <button
        onClick={onComplete}
        disabled={completed}
        className={`px-5 py-2 rounded-xl font-semibold transition-all duration-300 ${
          completed
            ? "bg-azure-500 text-[var(--cc-action-ink)] cursor-default"
            : "bg-azure-600 hover:bg-azure-700 text-[var(--cc-action-ink)]"
        }`}
      >
        {completed
          ? "Video completed"
          : "Mark Video as Complete"}
      </button>
    </div>
  );
};

export default VideoTab;