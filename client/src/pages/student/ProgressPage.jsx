import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Award, CheckCircle2, Target } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';
import DashboardLayout from '../../layouts/DashboardLayout';
import PageLoader from '../../components/common/PageLoader';
import StatCard from '../../components/dashboard/StatCard';
import { useDashboardData } from '../../context/DashboardDataContext';
import api from '../../services/api';

export default function ProgressPage() {
  const { stats, loading, error, refreshStats } = useDashboardData();
  const [weak, setWeak] = useState([]);
  const [reviewError, setReviewError] = useState('');
  async function loadReview() {
    setReviewError('');
    try { const { data } = await api.get('/learning/progress'); setWeak((data.weakTopics || []).filter(t => t.status !== 'Mastered' && t.averageScore < 70)); }
    catch { setReviewError('Could not load topics to review.'); }
  }
  useEffect(() => { loadReview(); }, []);
  if (loading) return <DashboardLayout><PageLoader text="Loading your progress…" /></DashboardLayout>;
  return <DashboardLayout><div className="mx-auto max-w-6xl space-y-8 py-4">
    <header><span className="cc-eyebrow">Your learning journey</span><h1 className="mt-3 text-4xl sm:text-5xl">Your progress</h1><p className="mt-3 max-w-2xl text-[var(--cc-muted)]">See what you’ve accomplished and choose what to work on next.</p></header>
    {error ? <div role="alert" className="rounded-xl border border-red-400/40 p-4 text-[var(--cc-error)]">{error} <button onClick={refreshStats} className="font-semibold underline">Try again</button></div> : <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Progress summary">
      <StatCard title="Courses enrolled" value={stats?.coursesEnrolled ?? 0} icon={BookOpen}/><StatCard title="Courses completed" value={stats?.coursesCompleted ?? 0} icon={Award}/><StatCard title="Lessons completed" value={stats?.topicsCompleted ?? 0} icon={CheckCircle2}/><StatCard title="Average quiz score" value={`${stats?.averageQuizScore ?? 0}%`} icon={Target}/>
    </section>}
    <section className="rounded-2xl border border-[var(--cc-line)] bg-[var(--cc-surface)] p-6"><div className="flex flex-wrap items-end justify-between gap-3"><div><span className="cc-eyebrow">Your next step</span><h2 className="mt-2 text-2xl font-semibold">Topics to review</h2></div><Link to="/weak-topics" className="font-semibold text-[var(--cc-course-link)] hover:underline">View all</Link></div>
      {reviewError ? <p role="alert" className="mt-4 text-[var(--cc-error)]">{reviewError} <button onClick={loadReview} className="font-semibold underline">Try again</button></p> : weak.length ? <div className="mt-5 grid gap-3 md:grid-cols-2">{weak.slice(0, 4).map(topic => <div key={topic._id} className="rounded-xl border border-[var(--cc-line)] p-4"><h3 className="font-semibold">{topic.topicTitle}</h3><p className="mt-1 text-sm text-[var(--cc-muted)]">Most recent quiz: {Math.round(topic.averageScore)}%</p><Link className="mt-3 inline-flex min-h-11 items-center font-semibold text-[var(--cc-course-link)] hover:underline" to={`/course/${topic.course}?topic=${topic.topicId}`}>Review topic →</Link></div>)}</div> : <p className="mt-4 text-[var(--cc-muted)]">No topics to review yet. Take a quiz to see suggestions here.</p>}
    </section>
    <section className="rounded-2xl border border-[var(--cc-line)] bg-[var(--cc-surface)] p-6"><h2 className="text-2xl font-semibold">Course progress</h2>{stats?.courseProgress?.length ? <div className="mt-5 space-y-5">{stats.courseProgress.map(course => <div key={course.courseId}><div className="mb-2 flex flex-wrap justify-between gap-2"><Link className="font-semibold text-[var(--cc-course-link)] hover:underline" to={`/course/${course.courseId}`}>{course.title}</Link><span className="text-sm text-[var(--cc-muted)]">{typeof course.completedTopics === 'number' && course.totalTopics > 0 && !(course.completion >= 100 && course.completedTopics < course.totalTopics) ? `${course.completedTopics} of ${course.totalTopics} lessons · ` : ''}{Math.round(course.completion || 0)}%</span></div><progress className="cc-progress" value={Math.max(0, Math.min(100, course.completion || 0))} max="100" aria-label={`${course.title} progress`} /></div>)}</div> : <p className="mt-4 text-[var(--cc-muted)]">Enroll in a course to start tracking your progress. <Link to="/browse-courses" className="text-[var(--cc-course-link)] underline">Browse courses</Link></p>}</section>
    <section className="rounded-2xl border border-[var(--cc-line)] bg-[var(--cc-surface)] p-6"><h2 className="text-2xl font-semibold">Quiz score history</h2>{stats?.quizTrend?.length ? <><p className="mt-2 text-sm text-[var(--cc-muted)]">Your quiz scores over time.</p><div className="mt-4 h-56" aria-hidden="true"><ResponsiveContainer width="100%" height="100%"><LineChart data={stats.quizTrend}><XAxis dataKey="date" hide /><YAxis domain={[0, 100]} width={32} tick={{ fill: 'var(--cc-muted)', fontSize: 12 }} /><Tooltip /><Line type="monotone" dataKey="score" stroke="#53a6f5" strokeWidth={3} dot={{ r: 3 }} isAnimationActive={false} /></LineChart></ResponsiveContainer></div><details className="mt-4 text-sm"><summary className="cursor-pointer font-semibold">View scores as a list</summary><ul className="mt-3 space-y-2 text-[var(--cc-muted)]">{stats.quizTrend.map((point, index) => <li key={`${point.date}-${index}`}>{point.date}: {point.score}%</li>)}</ul></details></> : <p className="mt-4 text-[var(--cc-muted)]">Complete a quiz to see your score history here.</p>}</section>
    <Link to="/reminders" className="inline-flex min-h-11 items-center font-semibold text-[var(--cc-course-link)] hover:underline">View learning reminders →</Link>
  </div></DashboardLayout>;
}
