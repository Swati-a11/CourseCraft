import React from 'react';

const VideoPlayer = ({ url }) => {
  if (!url) return null;

  // Extract YouTube video ID
  const getYoutubeId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoId = getYoutubeId(url);

  if (!videoId) {
    return <div className="p-4 bg-zinc-900 rounded-2xl border border-zinc-800 text-center text-zinc-500">Invalid Video URL</div>;
  }

  return (
    <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl border border-zinc-800" style={{ paddingTop: '56.25%' }}>
      <iframe
        className="absolute top-0 left-0 w-full h-full"
        src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default VideoPlayer;
