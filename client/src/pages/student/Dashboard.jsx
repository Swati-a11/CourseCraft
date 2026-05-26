import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

import DashboardLayout from '../../layouts/DashboardLayout';
import StatCard from '../../components/dashboard/StatCard';
import CourseCard from '../../components/dashboard/CourseCard';
import { getDashboardStats } from '../../services/dashboardService';

const fallbackCourses = [
  {
    id: 1,
    title: 'MERN Stack Development',
    description: 'Master MongoDB, Express, React and Node.js.',
    topics: 24,
    duration: '8 Weeks',
    progress: 65,
    image:
      'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 2,
    title: 'AI & Machine Learning',
    description: 'Build intelligent applications with Python.',
    topics: 18,
    duration: '6 Weeks',
    progress: 30,
    image:
      'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 3,
    title: 'React Advanced',
    description: 'Learn Redux, optimization, and architecture.',
    topics: 20,
    duration: '5 Weeks',
    progress: 80,
    image:
      'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=1200&q=80',
  },
];

const Dashboard = () => {
  const navigate = useNavigate(); // ✅ Hook must be inside component

  const [stats, setStats] = useState({
    coursesEnrolled: 0,
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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex-1 flex flex-col items-center justify-center min-h-[70vh]">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(34,197,94,0.5)]"></div>
          <p className="mt-6 text-green-400 font-semibold animate-pulse text-lg tracking-wider">Loading Dashboard...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-8">
          <h1 className="text-4xl font-bold text-white">Welcome Back</h1>
          <p className="text-gray-400 mt-2">
            Continue your AI-powered learning journey.
          </p>
        </motion.div>

        {/* Error */}
        {error && (
          <motion.div variants={itemVariants} className="mb-6 rounded-2xl bg-red-500/10 border border-red-500/20 p-4 text-red-200">
            {error}
          </motion.div>
        )}

        {/* Stats */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
          <StatCard
            title="Courses Enrolled"
            value={loading ? '...' : stats.coursesEnrolled}
            subtitle={`${stats.coursesEnrolled} total courses`}
          />
          <StatCard
            title="Topics Completed"
            value={loading ? '...' : stats.topicsCompleted}
            subtitle="Across all courses"
          />
          <StatCard
            title="Current Streak"
            value={loading ? '...' : `${stats.streak} Days`}
            subtitle="Keep it going"
          />
          <StatCard
            title="XP Earned"
            value={loading ? '...' : stats.xp}
            subtitle="Progress points earned"
          />
        </motion.div>

        {/* My Courses */}
        <motion.div variants={itemVariants}>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
            <h2 className="text-2xl font-semibold text-white">My Courses</h2>

            <button
              onClick={() => navigate('/browse-courses')}
              className="bg-green-500 hover:bg-green-400 text-black px-5 py-2 rounded-xl font-semibold shadow-lg shadow-green-500/20 transition-all duration-300 hover:scale-105"
            >
              Browse Courses
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {courses.map((course) => (
              <motion.div key={course.id} whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
                <CourseCard course={course} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
};

export default Dashboard;