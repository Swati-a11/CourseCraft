import { useEffect, useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import StudyPlanForm from '../../components/studyplan/StudyPlanForm';
import StudyPlanResult from '../../components/studyplan/StudyPlanResult';
import { generateStudyPlan } from '../../services/studyPlanServices';
import api from '../../services/api';

export default function StudyPlan() {
  const [plans, setPlans] = useState([]);
  const [selected, setSelected] = useState(null);
  const [draft, setDraft] = useState(null);
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');
  const [listError, setListError] = useState('');
  const [saveFailed, setSaveFailed] = useState(false);
  const [dayError, setDayError] = useState('');
  const [saveMessage, setSaveMessage] = useState('');

  async function loadPlans() {
    setListError('');
    try { const { data } = await api.get('/study-plan/saved'); setPlans(data.plans); setSelected(current => current || data.plans[0] || null); }
    catch { setListError('Could not load saved plans.'); }
  }
  useEffect(() => { loadPlans(); }, []);

  async function saveDraft(value) {
    setBusy('save'); setError(''); setSaveFailed(false); setSaveMessage('');
    try {
      const { data } = await api.post('/study-plan/saved', value);
      setPlans(current => [data.plan, ...current]); setSelected(data.plan); setDraft(null); setSaveMessage('Plan saved to your account.');
    } catch { setSaveFailed(true); setError('Your plan was generated but could not be saved. Try saving it again.'); }
    finally { setBusy(''); }
  }
  async function handleGenerate(formData) {
    setBusy('generate'); setError(''); setDayError(''); setSaveMessage(''); setSaveFailed(false);
    try {
      const result = await generateStudyPlan(formData);
      if (!result?.success || !result.studyPlan) throw new Error('Invalid response');
      const value = { ...formData, content: result.studyPlan };
      setDraft(value); setSelected(null);
      await saveDraft(value);
    } catch (err) { setError(`${err.response?.data?.message || 'Could not generate your plan. Please try again.'} Your inputs are still here.`); }
    finally { setBusy(''); }
  }
  async function toggleDay(day, completed) {
    setDayError(''); setBusy('day');
    try {
      const { data } = await api.patch(`/study-plan/saved/${selected._id}/days/${day}`, { completed });
      setSelected(data.plan); setPlans(current => current.map(plan => plan._id === data.plan._id ? data.plan : plan));
    } catch { setDayError('Could not save your progress. Please try checking this day again.'); }
    finally { setBusy(''); }
  }
  const visible = draft || selected;
  return <DashboardLayout><div className="mx-auto max-w-5xl space-y-6">
    <header><p className="cc-eyebrow">Plan your progress</p><h1 className="mt-2 text-3xl font-bold">AI Study Plan Generator</h1><p className="mt-2 text-[var(--cc-muted)]">Plans are saved to your account automatically. Open one below to track your days.</p></header>
    <section className="rounded-2xl border border-[var(--cc-line)] bg-[var(--cc-surface)] p-6"><h2 className="mb-4 text-xl font-semibold">Create a plan</h2><StudyPlanForm onGenerate={handleGenerate} loading={!!busy} />
      {busy === 'generate' && <p role="status" className="mt-4 text-[var(--cc-muted)]">Creating your study plan…</p>}
      {busy === 'save' && <p role="status" className="mt-4 text-[var(--cc-muted)]">Saving your plan…</p>}
      {saveMessage && <p role="status" className="mt-4 font-semibold text-[var(--cc-accent)]">{saveMessage}</p>}
      {error && <div role="alert" className="mt-4 rounded-xl border border-red-400/40 bg-red-500/10 p-4 text-[var(--cc-error)]">{error}{saveFailed && draft && <button type="button" onClick={() => saveDraft(draft)} disabled={!!busy} className="ml-3 font-bold underline">Retry saving</button>}</div>}
    </section>
    <section className="rounded-2xl border border-[var(--cc-line)] bg-[var(--cc-surface)] p-6"><h2 className="text-xl font-semibold">Saved plans</h2>{listError ? <p role="alert" className="mt-3 text-[var(--cc-error)]">{listError} <button type="button" onClick={loadPlans} className="font-semibold underline">Try again</button></p> : plans.length ? <><p className="mt-2 text-sm text-[var(--cc-muted)]">Select a plan to view it and update your progress.</p><div className="mt-4 flex flex-wrap gap-2">{plans.map(plan => <button key={plan._id} type="button" disabled={!!busy} aria-pressed={!draft && selected?._id === plan._id} onClick={() => { if (draft && !window.confirm('This generated plan has not been saved. Open another plan anyway?')) return; setSelected(plan); setDraft(null); setError(''); setDayError(''); setSaveMessage(''); }} className="min-h-11 rounded-xl border border-[var(--cc-line)] px-4 py-2 text-left text-sm font-semibold aria-pressed:bg-[var(--cc-raised)]">{plan.goal} · {plan.completedDays?.length || 0}/{plan.duration} days</button>)}</div></> : <p className="mt-3 text-[var(--cc-muted)]">Your saved plans will appear here after you create one.</p>}</section>
    {visible && <section>{selected && !draft && <div className="rounded-2xl border border-[var(--cc-line)] bg-[var(--cc-surface)] p-6"><h2 className="text-xl font-semibold">Track your days</h2><p className="mt-2 text-sm text-[var(--cc-muted)]">When you finish a day, check its box. Your progress is saved automatically.</p><p className="mt-2 text-sm font-semibold text-[var(--cc-ink)]" aria-live="polite">{selected.completedDays?.length || 0} of {selected.duration} days complete{busy === 'day' ? ' · Saving…' : ''}</p><progress className="cc-progress mt-3" value={selected.completedDays?.length || 0} max={selected.duration} aria-label="Study plan days completed" />{dayError && <p role="alert" className="mt-3 text-sm text-[var(--cc-error)]">{dayError}</p>}<div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">{Array.from({ length: selected.duration }, (_, i) => i + 1).map(day => { const completed = selected.completedDays?.includes(day) || false; return <label key={day} className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border p-3 ${completed ? 'border-[var(--cc-accent)] bg-[var(--cc-raised)]' : 'border-[var(--cc-line)]'}`}><input type="checkbox" className="size-5 shrink-0 accent-sky-500" disabled={!!busy} checked={completed} onChange={event => toggleDay(day, event.target.checked)} /><span><span className="block font-semibold">Day {day}</span><span className="block text-xs text-[var(--cc-muted)]">{completed ? 'Completed' : 'Mark complete'}</span></span></label>; })}</div></div>}<StudyPlanResult plan={visible.content} /></section>}
  </div></DashboardLayout>;
}
