const NotesTab = ({ title, notes, completed, onComplete }) => {
  return (
    <div className="prose prose-invert max-w-none">
      <h2 className=" font-condiment text-2xl font-bold text-white mb-4">
        {title || 'Topic Notes'}
      </h2>

      {notes ? (
        <div 
          className="font-condiment text-gray-300 leading-8 mb-6 whitespace-pre-wrap"
          dangerouslySetInnerHTML={{ __html: notes }}
        />
      ) : (
        <p className="text-gray-400 italic mb-6">
          No notes available for this topic yet.
        </p>
      )}

      <div className="flex gap-4 mt-6">
        <button className="bg-zinc-800 hover:bg-zinc-700 text-white px-5 py-2 rounded-xl font-semibold transition">
          Download PDF
        </button>

        <button
          onClick={onComplete}
          disabled={completed}
          className={`px-5 py-2 rounded-xl font-semibold transition ${
            completed
              ? 'bg-green-500 text-black cursor-default'
              : 'bg-green-600 hover:bg-green-700 text-black'
          }`}
        >
          {completed ? 'Notes Completed ' : 'Mark Notes as Complete'}
        </button>
      </div>
    </div>
  );
};

export default NotesTab;