import React from 'react';

const NotesView = ({ content }) => {
  if (!content) return null;

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 md:p-8">
      <div 
        className="prose prose-invert max-w-none text-zinc-300 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
};

export default NotesView;
