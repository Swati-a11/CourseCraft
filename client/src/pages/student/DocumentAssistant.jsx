import { useEffect, useState } from 'react';
import { BookOpenText, FileUp, MessageCircle, Trash2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import DashboardLayout from '../../layouts/DashboardLayout';
import API from '../../services/api';

export default function DocumentAssistant() {
  const [documents, setDocuments] = useState([]);
  const [selected, setSelected] = useState('');
  const [file, setFile] = useState(null);
  const [question, setQuestion] = useState('');
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    API.get('/documents').then(({ data }) => setDocuments(data.documents)).catch(() => setError('Could not load documents. Please refresh the page.'));
  }, []);

  const upload = async (event) => {
    event.preventDefault();
    if (!file) return;
    setBusy('upload'); setError('');
    try {
      const data = new FormData(); data.append('document', file);
      const response = await API.post('/documents', data);
      setDocuments(current => [response.data.document, ...current]);
      setSelected(response.data.document._id); setResult(null); setFile(null); event.target.reset();
    } catch (err) { setError(err.response?.data?.message || 'Could not upload the document.'); }
    finally { setBusy(''); }
  };
  const ask = async (event) => {
    event.preventDefault(); setBusy('ask'); setError(''); setResult(null);
    try { const { data } = await API.post(`/documents/${selected}/ask`, { question }); setResult(data); }
    catch (err) { setError(err.response?.data?.message || 'Could not answer your question.'); }
    finally { setBusy(''); }
  };
  const remove = async () => {
    if (!window.confirm('Delete this document and its saved text?')) return;
    setBusy('delete'); setError('');
    try { await API.delete(`/documents/${selected}`); setDocuments(current => current.filter(doc => doc._id !== selected)); setSelected(''); setResult(null); }
    catch (err) { setError(err.response?.data?.message || 'Could not delete the document.'); }
    finally { setBusy(''); }
  };

  return <DashboardLayout><div className="mx-auto max-w-6xl space-y-8 py-4 sm:py-8">
    <header className="max-w-3xl"><p className="mb-3 text-xs font-bold uppercase tracking-[.18em] text-[var(--cc-accent)]">Your learning library</p><h1 className="text-4xl tracking-tight sm:text-5xl">Ask your documents</h1><p className="mt-4 text-base leading-7 text-[var(--cc-muted)]">Bring your study materials together. Ask a question and explore the passages behind each answer.</p><p className="mt-2 text-sm text-[var(--cc-muted)]">Extracted document text is saved in your account. Relevant passages and your question are sent to Google Gemini to generate an answer.</p></header>
    {error && <p role="alert" className="rounded-xl border border-red-400/40 bg-red-500/10 p-4 text-[var(--cc-error)]">{error}</p>}
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
      <section className="cc-document-card"><div className="flex items-center gap-3"><span className="cc-document-icon"><FileUp size={21}/></span><div><h2 className="text-xl font-semibold">Your documents</h2><p className="text-sm text-[var(--cc-muted)]">Upload a text-based PDF up to 5 MB.</p></div></div>
        <form onSubmit={upload} className="mt-6 space-y-4"><label htmlFor="document-upload" className="block text-sm font-semibold">Choose a PDF</label><input id="document-upload" type="file" accept="application/pdf,.pdf" onChange={e => setFile(e.target.files?.[0] || null)} className="block w-full text-sm text-[var(--cc-muted)] file:mr-3 file:rounded-lg file:border-0 file:bg-[var(--cc-raised)] file:px-4 file:py-3 file:font-semibold file:text-[var(--cc-ink)]"/><button disabled={!file || !!busy} className="cc-document-button w-full">{busy === 'upload' ? 'Uploading…' : 'Add to library'}</button></form>
        <div className="mt-8 border-t border-[var(--cc-line)] pt-6"><label htmlFor="document-select" className="block text-sm font-semibold">Select a document</label><select id="document-select" value={selected} onChange={e => { setSelected(e.target.value); setResult(null); }} className="cc-document-input mt-2"><option value="">Choose a document</option>{documents.map(doc => <option key={doc._id} value={doc._id}>{doc.name}</option>)}</select>{selected && <button onClick={remove} disabled={!!busy} className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[var(--cc-error)]"><Trash2 size={16}/> Delete document</button>}{!documents.length && <p className="mt-4 text-sm text-[var(--cc-muted)]">Your library is empty. Add a PDF to get started.</p>}</div>
      </section>
      <section className="cc-document-card"><div className="flex items-center gap-3"><span className="cc-document-icon"><MessageCircle size={21}/></span><div><h2 className="text-xl font-semibold">Ask a question</h2><p className="text-sm text-[var(--cc-muted)]">Answers are grounded in your selected document.</p></div></div><form onSubmit={ask} className="mt-6 space-y-4"><label htmlFor="document-question" className="block text-sm font-semibold">What would you like to understand?</label><textarea id="document-question" value={question} onChange={e => setQuestion(e.target.value)} placeholder="For example: What are the main concepts?" maxLength={1000} minLength={3} required rows={4} className="cc-document-input resize-y"/><button disabled={!selected || !!busy} className="cc-document-button">{busy === 'ask' ? 'Finding an answer…' : 'Ask document'}</button></form>
        {result ? <div aria-live="polite" className="mt-8 border-t border-[var(--cc-line)] pt-6"><h3 className="mb-3 text-lg font-semibold">Answer</h3><div className="cc-document-answer text-[var(--cc-ink)]"><ReactMarkdown>{result.answer}</ReactMarkdown></div>{result.sources?.length > 0 && <div className="mt-6 space-y-3"><h3 className="text-sm font-semibold">Source passages</h3>{result.sources.map(source => <details key={source.number} className="rounded-xl border border-[var(--cc-line)] bg-[var(--cc-raised)] p-4"><summary className="cursor-pointer text-sm font-semibold">Passage {source.number}</summary><p className="mt-3 text-sm leading-6 text-[var(--cc-muted)]">{source.excerpt}</p></details>)}</div>}</div> : <div className="mt-8 rounded-2xl border border-dashed border-[var(--cc-line)] p-6 text-center text-sm text-[var(--cc-muted)]"><BookOpenText className="mx-auto mb-3 text-[var(--cc-accent)]" size={24}/>{selected ? 'Your answer and source passages will appear here.' : 'Select a document to start exploring.'}</div>}
      </section>
    </div>
  </div></DashboardLayout>;
}
