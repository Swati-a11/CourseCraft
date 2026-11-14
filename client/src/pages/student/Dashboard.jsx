import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Award, Flame, Sparkles } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

import DashboardLayout from '../../layouts/DashboardLayout';
import StatCard from '../../components/dashboard/StatCard';
import CourseCard from '../../components/dashboard/CourseCard';
import RobotLoader from '../../components/common/RobotLoader';
import { useDashboardData } from '../../context/DashboardDataContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const { isLight } = useTheme();
  const { stats, loading, error } = useDashboardData();
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    if (stats && Array.isArray(stats.courseProgress)) {
      setCourses(
        stats.courseProgress.map((cp, index) => ({
          id: cp.courseId || index,
          title: cp.title || `Course ${index + 1}`,
          description: 'Continue your learning journey.',
          topics: cp.totalTopics || 0,
          duration: 'Unknown',
          progress: cp.completion || 0,
          image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=80',
        }))
      );
    } else {
      setCourses([]);
    }
  }, [stats]);

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
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
        <motion.div variants={itemVariants} className="cc-dashboard-intro">
          <h1>Welcome back</h1>
          <p>Pick up a course or see how your study progress is adding up.</p>
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
              className="min-h-11 bg-green-500 hover:bg-green-400 px-5 py-2 rounded-xl font-semibold transition-colors cursor-pointer"
            >
              Browse Courses
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {courses.length === 0 ? (
              <div className={`col-span-full text-center py-12 transition-colors ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
                You are not enrolled in any courses yet.
              </div>
            ) : (
              courses.map((course) => (
                <motion.div key={course.id} whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
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