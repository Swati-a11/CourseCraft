import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Award, Flame, Sparkles } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

import DashboardLayout from '../../layouts/DashboardLayout';
import StatCard from '../../components/dashboard/StatCard';
import CourseCard from '../../components/dashboard/CourseCard';
import RobotLoader from '../../components/common/RobotLoader';
import { getDashboardStats } from '../../services/dashboardService';

const Dashboard = () => {
  const navigate = useNavigate();
  const { isLight } = useTheme();

  const [stats, setStats] = useState({
    coursesEnrolled: 0,
    coursesCompleted: 0,
    topicsCompleted: 0,
    streak: 0,
    xp: 0,
  });

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await getDashboardStats();

        setStats({
          coursesEnrolled: data.coursesEnrolled ?? 0,
          coursesCompleted: data.coursesCompleted ?? 0,
          topicsCompleted: data.topicsCompleted ?? 0,
          streak: data.gamification?.streak ?? 0,
          xp: data.gamification?.xp ?? 0,
        });

        if (Array.isArray(data.courseProgress) && data.courseProgress.length > 0) {
          setCourses(
            data.courseProgress.map((cp, index) => ({
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
      } catch (err) {
        console.error(err);
        setError('Unable to load dashboard stats. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  const displayEnrolled = stats.coursesEnrolled || 1;
  const displayCompleted = stats.coursesCompleted || 1;
  const displayStreak = stats.streak || 1;
  const displayXP = stats.xp || 1270;

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
        {/* Header Section */}
        <motion.div variants={itemVariants} className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className={`font-merriweather text-6xl sm:text-7xl transition-colors ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Welcome Back
            </h1>
            <p className="font-condiment text-3xl text-green-600 mt-2">
              Continue your AI-powered learning journey.
            </p>
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
          {dashboardMetrics.map((metric) => {
            const Icon = metric.icon;
            return isLight ? (
              <div
                key={metric.title}
                className="group border border-green-500/20 bg-white rounded-2xl p-6 shadow-sm hover:-translate-y-0.5 hover:scale-[1.01] hover:border-green-500/40 hover:shadow-[0_0_30px_rgba(34,197,94,0.12)] transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-bold text-slate-950 uppercase tracking-wider">{metric.title}</span>
                  <Icon className="w-5 h-5 text-green-500 transition-transform duration-300 group-hover:scale-110" />
                </div>
                <h3 className="text-3xl font-bold text-slate-950 mt-2">{loading ? '...' : metric.value}</h3>
                {metric.subtitle && (
                  <p className="text-xs text-slate-950/80 font-medium mt-2">{metric.subtitle}</p>
                )}
              </div>
            ) : (
              <StatCard
                key={metric.title}
                title={metric.title}
                value={loading ? '...' : metric.value}
                subtitle={metric.subtitle}
              />
            );
          })}
        </motion.div>

        {/* My Courses */}
        <motion.div variants={itemVariants}>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
            <h2 className={`text-2xl font-condiment transition-colors ${isLight ? 'text-slate-900' : 'text-white'}`}>
              My Courses
            </h2>

            <button
              onClick={() => navigate('/browse-courses')}
              className="bg-green-500 hover:bg-green-400 font-cabin text-black px-5 py-2 rounded-xl font-semibold shadow-lg shadow-green-500/20 transition-all duration-300 hover:scale-105"
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