import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import PageLoader from '../../components/common/PageLoader';
import api from '../../services/api';

export default function WeakTopics() {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  async function load() { setLoading(true); setError(''); try { const { data } = await api.get('/learning/progress'); setTopics((data.weakTopics || []).filter(topic => topic.status !== 'Mastered' && topic.averageScore < 70)); } catch { setError('Could not load topics to review.'); } finally { setLoading(false); } }
  useEffect(() => { load(); }, []);
  if (loading) return <DashboardLayout><PageLoader text="Finding topics to review…" /></DashboardLayout>;
  return <DashboardLayout><div className="mx-auto max-w-4xl space-y-6"><header><span className="cc-eyebrow">Keep learning</span><h1 className="mt-2 text-4xl">Topics to review</h1><p className="mt-3 text-[var(--cc-muted)]">Topics from your recent quizzes that scored below 70%.</p></header>{error ? <p role="alert" className="text-[var(--cc-error)]">{error} <button onClick={load} className="font-semibold underline">Try again</button></p> : topics.length ? <div className="grid gap-4">{topics.map(topic => <article key={topic._id} className="rounded-2xl border border-[var(--cc-line)] bg-[var(--cc-surface)] p-6"><h2 className="text-xl font-semibold">{topic.topicTitle}</h2><p className="mt-2 text-[var(--cc-muted)]">Most recent quiz: {Math.round(topic.averageScore)}%</p>{topic.aiFeedback && <p className="mt-2 text-sm text-[var(--cc-muted)]">{topic.aiFeedback}</p>}<Link to={`/course/${topic.course}?topic=${topic.topicId}`} className="mt-3 inline-flex min-h-11 items-center font-semibold text-[var(--cc-course-link)] underline">Review topic</Link></article>)}</div> : <p className="rounded-2xl border border-[var(--cc-line)] bg-[var(--cc-surface)] p-6 text-[var(--cc-muted)]">No topics need review yet. Complete a quiz to get personalized suggestions.</p>}</div></DashboardLayout>;
}
