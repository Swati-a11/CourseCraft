import React, { useState, useEffect } from 'react';
import { Save, CheckCircle2, Loader2, BookOpen } from 'lucide-react';
import api from '../../services/api';

const PersonalNotes = ({ courseId, initialNotes = '' }) => {
  const [notes, setNotes] = useState(initialNotes);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState('idle'); // 'idle' | 'saving' | 'saved' | 'error'

  useEffect(() => {
    setNotes(initialNotes);
  }, [initialNotes]);

  // Optional Auto-Save (debounced)
  useEffect(() => {
    if (notes === initialNotes || saveStatus === 'saving') return;

    const timeoutId = setTimeout(() => {
      saveNotes();
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [notes]);

  const saveNotes = async () => {
    if (notes === initialNotes) return;
    
    setIsSaving(true);
    setSaveStatus('saving');
    try {
      await api.put(`/learning/course/${courseId}/notes`, { notes });
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
      console.error("Failed to save notes", error);
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-zinc-900/50 rounded-2xl border border-green-500/20 p-5 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-white flex items-center gap-2">
          <BookOpen className="text-green-400" size={20} />
          Personal Course Notes
        </h3>
        
        <div>
          {saveStatus === 'saving' && (
            <span className="flex items-center gap-2 text-sm text-gray-400">
              <Loader2 size={14} className="animate-spin" /> Saving...
            </span>
          )}
          {saveStatus === 'saved' && (
            <span className="flex items-center gap-2 text-sm text-green-400">
              <CheckCircle2 size={14} /> Saved
            </span>
          )}
          {saveStatus === 'error' && (
            <span className="text-sm text-red-400">Failed to save</span>
          )}
          {saveStatus === 'idle' && notes !== initialNotes && (
            <button 
              onClick={saveNotes}
              disabled={isSaving}
              className="flex items-center gap-2 text-sm bg-green-600/20 text-green-400 px-3 py-1.5 rounded-lg hover:bg-green-600/30 transition-colors"
            >
              <Save size={14} /> Save Now
            </button>
          )}
        </div>
      </div>
      
      <p className="text-sm text-gray-400 mb-4">
        Jot down important concepts, timestamps, or your own summaries. These notes are private and saved securely.
      </p>

      <textarea
        className="flex-1 w-full bg-black/40 border border-green-500/10 rounded-xl p-4 text-gray-200 placeholder:text-gray-600 focus:outline-none focus:border-green-500/40 focus:ring-1 focus:ring-green-500/40 resize-none transition-all"
        placeholder="Type your notes here..."
        value={notes}
        onChange={(e) => {
          setNotes(e.target.value);
          if (saveStatus === 'saved') setSaveStatus('idle');
        }}
      />
    </div>
  );
};

export default PersonalNotes;
