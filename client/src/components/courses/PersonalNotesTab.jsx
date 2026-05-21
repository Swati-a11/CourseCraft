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
        className="w-full bg-black border border-green-900/30 rounded-xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
      />

      <button className="mt-4 bg-green-600 hover:bg-green-700 text-black px-5 py-2 rounded-xl font-semibold">
        Save Notes
      </button>
    </div>
  );
};

export default PersonalNotesTab;