import { Link } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import PageLoader from '../../components/common/PageLoader';
import { useDashboardData } from '../../context/DashboardDataContext';

export default function Reminders() {
  const { stats, loading, error, refreshStats } = useDashboardData();
  if (loading) return <DashboardLayout><PageLoader text="Loading your learning reminders…" /></DashboardLayout>;
  const course = stats?.courseProgress?.find(item => (item.completion || 0) < 100);
  const weak = stats?.weakTopics?.filter(topic => topic.averageScore < 70) || [];
  return <DashboardLayout><div className="mx-auto max-w-4xl space-y-6"><header><span className="cc-eyebrow">Keep your momentum</span><h1 className="mt-2 text-4xl">Learning reminders</h1><p className="mt-3 text-[var(--cc-muted)]">Suggestions based on your current learning activity.</p></header>{error ? <p role="alert" className="text-[var(--cc-error)]">{error} <button className="underline" onClick={refreshStats}>Try again</button></p> : <div className="space-y-4">{course && <div className="rounded-2xl border border-[var(--cc-line)] bg-[var(--cc-surface)] p-6"><h2 className="text-xl font-semibold">Continue your course</h2><p className="mt-2 text-[var(--cc-muted)]">{course.title} · {Math.round(course.completion || 0)}% complete</p><Link to={`/course/${course.courseId}${Number.isInteger(course.nextTopicIndex) ? `?topic=${course.nextTopicIndex}` : ''}`} className="mt-3 inline-flex min-h-11 items-center font-semibold text-[var(--cc-course-link)] underline">Open course</Link></div>}{weak.length > 0 && <div className="rounded-2xl border border-[var(--cc-line)] bg-[var(--cc-surface)] p-6"><h2 className="text-xl font-semibold">Review a quiz topic</h2><p className="mt-2 text-[var(--cc-muted)]">{weak[0].topic} · average score {weak[0].averageScore}%</p><Link to="/weak-topics" className="mt-3 inline-flex min-h-11 items-center font-semibold text-[var(--cc-course-link)] underline">See topics to review</Link></div>}{!course && !weak.length && <p className="rounded-2xl border border-[var(--cc-line)] bg-[var(--cc-surface)] p-6 text-[var(--cc-muted)]">No reminders right now. <Link to="/browse-courses" className="text-[var(--cc-course-link)] underline">Explore a course</Link> to start learning.</p>}</div>}</div></DashboardLayout>;
}
