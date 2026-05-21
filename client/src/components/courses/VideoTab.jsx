const VideoTab = ({ title, videoUrl, completed, onComplete }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-4">
        {title ? `${title} Video` : 'Topic Video'}
      </h2>

      {/* YouTube Video */}
      {videoUrl && (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) ? (
        <div className="w-full aspect-video rounded-2xl overflow-hidden bg-black mb-6">
          <iframe
            className="w-full h-full"
            src={videoUrl.replace('watch?v=', 'embed/')} // Ensure embed format
            title={title || "Topic Video"}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
      ) : (
        <div className="w-full aspect-video rounded-2xl overflow-hidden bg-zinc-800 mb-6 flex flex-col items-center justify-center border border-zinc-700">
          <span className="text-4xl mb-4">🎥</span>
          <p className="text-gray-400 italic">No valid YouTube video available for this topic.</p>
        </div>
      )}

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-400 mb-2">
          <span>Watch Progress</span>
          <span>{completed ? '100%' : '0%'}</span>
        </div>

        <div className="w-full bg-zinc-800 rounded-full h-2">
          <div
            className="bg-green-500 h-2 rounded-full transition-all duration-500"
            style={{ width: completed ? '100%' : '0%' }}
          />
        </div>
      </div>

      {/* Complete Button */}
      <button
        onClick={onComplete}
        disabled={completed}
        className={`px-5 py-2 rounded-xl font-semibold transition ${
          completed
            ? 'bg-green-500 text-black cursor-default'
            : 'bg-green-600 hover:bg-green-700 text-black'
        }`}
      >
        {completed ? 'Video Completed ✅' : 'Mark Video as Complete'}
      </button>
    </div>
  );
};

export default VideoTab;