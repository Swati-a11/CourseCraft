import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, BookOpen, Award, Flame, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

import DashboardLayout from '../../layouts/DashboardLayout';
import StatCard from '../../components/dashboard/StatCard';
import CourseCard from '../../components/dashboard/CourseCard';
import RobotLoader from '../../components/common/RobotLoader';
import { useDashboardData } from '../../context/DashboardDataContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const reducedMotion = useReducedMotion();
  const { isLight } = useTheme();
  const { stats, loading, error } = useDashboardData();
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    if (stats && Array.isArray(stats.courseProgress)) {
      setCourses(
        stats.courseProgress.filter((cp) => cp.courseId).map((cp) => ({
          id: cp.courseId,
          title: cp.title || 'Untitled course',
          description: cp.description || '',
          topics: cp.totalTopics || 0,
          duration: cp.duration || '',
          level: cp.level || '',
          progress: cp.completion || 0,
          image: cp.thumbnail || '',
          lastAccessedAt: cp.lastAccessedAt,
        }))
      );
    } else {
      setCourses([]);
    }
  }, [stats]);

  const nextCourse = courses
    .filter((course) => course.progress < 100)
    .sort((a, b) => new Date(b.lastAccessedAt || 0) - new Date(a.lastAccessedAt || 0))[0];

  const displayEnrolled = stats?.coursesEnrolled ?? 0;
  const displayCompleted = stats?.coursesCompleted ?? 0;
  const displayStreak = stats?.gamification?.streak ?? stats?.streak ?? 0;
  const displayXP = stats?.gamification?.xp ?? stats?.xp ?? 0;

  const dashboardMetrics = [
    {
      title: "Courses Enrolled",
      value: displayEnrolled,
      subtitle: `${displayEnrolled} total courses`,
      icon: BookOpen
    },
    {
      title: "COURSES COMPLETED",
      value: displayCompleted,
      subtitle: "Finished learning journeys",
      icon: Award
    },
    {
      title: "Current Streak",
      value: `${displayStreak} Days`,
      subtitle: "Keep it going",
      icon: Flame
    },
    {
      title: "XP Earned",
      value: displayXP,
      subtitle: "Progress points earned",
      icon: Sparkles
    }
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
        duration: 0.6,
        ease: "easeOut"
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  if (loading) {
    return (
      <DashboardLayout>
        <RobotLoader text="AI is analyzing your progress..." />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <motion.div variants={reducedMotion ? undefined : containerVariants} initial={reducedMotion ? false : 'hidden'} animate="visible" className="space-y-8">
        <motion.div variants={itemVariants} className="cc-dashboard-intro">
          <span className="cc-eyebrow">Your learning space</span>
          <h1>Welcome back</h1>
          <p>Pick up a course or see how your study progress is adding up.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            {nextCourse ? (
              <Link
                to={`/course/${nextCourse.id}`}
                className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-azure-600 px-5 py-2 font-semibold text-[var(--cc-action-ink)] transition-colors hover:bg-azure-700"
              >
                Continue {nextCourse.title}
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
            ) : (
              <Link
                to="/browse-courses"
                className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-azure-600 px-5 py-2 font-semibold text-[var(--cc-action-ink)] transition-colors hover:bg-azure-700"
              >
                Find a course
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
            )}
            <Link to="/study-plan" className="inline-flex min-h-11 items-center rounded-xl border border-[var(--cc-line)] px-5 py-2 font-semibold text-[var(--cc-ink)] transition-colors hover:bg-[var(--cc-raised)]">
              Create a study plan
            </Link>
          </div>
        </motion.div>

        {/* Error */}
        {error && (
          <motion.div
            variants={itemVariants}
            className={`rounded-2xl border p-4 text-sm transition-colors ${
              isLight ? 'bg-red-50 border-red-200 text-red-800' : 'bg-red-500/10 border border-red-500/20 text-red-200'
            }`}
          >
            {error}
          </motion.div>
        )}

        {/* Stats Grid */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {dashboardMetrics.map(({ title, icon, value, subtitle }) => (
            <StatCard key={title} title={title} icon={icon} value={value} subtitle={subtitle} />
          ))}
        </motion.div>

        {/* My Courses */}
        <motion.div variants={itemVariants}>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
            <h2 className={`text-2xl font-semibold tracking-tight transition-colors ${isLight ? 'text-slate-900' : 'text-white'}`}>
              My Courses
            </h2>

            <button
              onClick={() => navigate('/browse-courses')}
              className="min-h-11 bg-azure-500 hover:bg-azure-400 text-[var(--cc-action-ink)] px-5 py-2 rounded-xl font-semibold transition-colors cursor-pointer"
            >
              Browse Courses
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {courses.length === 0 ? (
              <div className="col-span-full rounded-2xl border border-[var(--cc-line)] bg-[var(--cc-surface)] px-6 py-10 text-center">
                <BookOpen className="mx-auto text-[var(--cc-accent)]" size={28} aria-hidden="true" />
                <h3 className="mt-3 text-lg font-semibold text-[var(--cc-ink)]">Your learning starts here</h3>
                <p className="mx-auto mt-2 max-w-md text-sm text-[var(--cc-muted)]">Browse the course catalog and enroll to keep your lessons and progress together.</p>
                <Link to="/browse-courses" className="mt-5 inline-flex min-h-11 items-center rounded-xl bg-azure-600 px-5 py-2 font-semibold text-[var(--cc-action-ink)] transition-colors hover:bg-azure-700">Browse courses</Link>
              </div>
            ) : (
              courses.map((course) => (
                <motion.div key={course.id} whileHover={reducedMotion ? undefined : { y: -5 }} transition={{ duration: 0.2 }}>
                  <CourseCard course={course} />
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
};

export default Dashboard;
