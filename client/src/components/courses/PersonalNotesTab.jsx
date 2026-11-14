import { useState } from 'react';

const PersonalNotesTab = () => {
  const [notes, setNotes] = useState('');

  return (
    <div>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={10}
        placeholder="Write your personal notes here..."
        className="w-full bg-black border border-azure-900/30 rounded-xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-azure-500"
      />

      <button className="mt-4 bg-azure-600 hover:bg-azure-700 text-[var(--cc-action-ink)] px-5 py-2 rounded-xl font-semibold">
        Save Notes
      </button>
    </div>
  );
};

export default PersonalNotesTab;