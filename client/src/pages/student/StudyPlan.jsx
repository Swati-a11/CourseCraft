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

  async function loadPlans() {
    setListError('');
    try { const { data } = await api.get('/study-plan/saved'); setPlans(data.plans); }
    catch { setListError('Could not load saved plans.'); }
  }
  useEffect(() => { loadPlans(); }, []);

  async function saveDraft(value) {
    setBusy('save'); setError('');
    try {
      const { data } = await api.post('/study-plan/saved', value);
      setPlans(current => [data.plan, ...current]); setSelected(data.plan); setDraft(null);
    } catch { setError('Your plan was generated but could not be saved. Try saving it again.'); }
    finally { setBusy(''); }
  }
  async function handleGenerate(formData) {
    setBusy('generate'); setError('');
    try {
      const result = await generateStudyPlan(formData);
      if (!result?.success || !result.studyPlan) throw new Error('Invalid response');
      const value = { ...formData, content: result.studyPlan };
      setDraft(value); setSelected(null);
      await saveDraft(value);
    } catch { setError('Could not generate your plan. Your inputs are still here; please try again.'); }
    finally { setBusy(''); }
  }
  async function toggleDay(day, completed) {
    setError(''); setBusy('day');
    try {
      const { data } = await api.patch(`/study-plan/saved/${selected._id}/days/${day}`, { completed });
      setSelected(data.plan); setPlans(current => current.map(plan => plan._id === data.plan._id ? data.plan : plan));
    } catch { setError('Could not update this day. Please try again.'); }
    finally { setBusy(''); }
  }
  const visible = draft || selected;
  return <DashboardLayout><div className="mx-auto max-w-5xl space-y-6">
    <header><p className="cc-eyebrow">Plan your progress</p><h1 className="mt-2 text-3xl font-bold">AI Study Plan Generator</h1><p className="mt-2 text-[var(--cc-muted)]">Build a roadmap and return to it whenever you need.</p></header>
    <section className="rounded-2xl border border-[var(--cc-line)] bg-[var(--cc-surface)] p-6"><h2 className="mb-4 text-xl font-semibold">Create a plan</h2><StudyPlanForm onGenerate={handleGenerate} loading={!!busy} />
      {busy === 'generate' && <p role="status" className="mt-4 text-[var(--cc-muted)]">Creating your study plan…</p>}
      {error && <div role="alert" className="mt-4 rounded-xl border border-red-400/40 bg-red-500/10 p-4 text-[var(--cc-error)]">{error}{draft && <button type="button" onClick={() => saveDraft(draft)} disabled={!!busy} className="ml-3 font-bold underline">Retry saving</button>}</div>}
    </section>
    <section className="rounded-2xl border border-[var(--cc-line)] bg-[var(--cc-surface)] p-6"><h2 className="text-xl font-semibold">Saved plans</h2>{listError ? <p role="alert" className="mt-3 text-[var(--cc-error)]">{listError} <button type="button" onClick={loadPlans} className="font-semibold underline">Try again</button></p> : plans.length ? <div className="mt-4 flex flex-wrap gap-2">{plans.map(plan => <button key={plan._id} type="button" aria-pressed={selected?._id === plan._id} onClick={() => { setSelected(plan); setDraft(null); setError(''); }} className="min-h-11 rounded-xl border border-[var(--cc-line)] px-4 py-2 text-left text-sm font-semibold aria-pressed:bg-[var(--cc-raised)]">{plan.goal} · {plan.completedDays?.length || 0}/{plan.duration} days</button>)}</div> : <p className="mt-3 text-[var(--cc-muted)]">Your saved plans will appear here after you create one.</p>}</section>
    {visible && <section><StudyPlanResult plan={visible.content} />{selected && <div className="mt-4 rounded-2xl border border-[var(--cc-line)] bg-[var(--cc-surface)] p-6"><h2 className="text-xl font-semibold">Track your days</h2><p className="mt-1 text-sm text-[var(--cc-muted)]">{selected.completedDays?.length || 0} of {selected.duration} days complete</p><div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">{Array.from({ length: selected.duration }, (_, i) => i + 1).map(day => <label key={day} className="flex min-h-11 items-center gap-2 rounded-xl border border-[var(--cc-line)] p-3"><input type="checkbox" disabled={!!busy} checked={selected.completedDays?.includes(day) || false} onChange={event => toggleDay(day, event.target.checked)} /> Day {day}</label>)}</div></div>}</section>}
  </div></DashboardLayout>;
}
