import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bell, Mail, BookOpen, Award, CheckCircle } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

import DashboardLayout from '../../layouts/DashboardLayout';
import StatCard from '../../components/dashboard/StatCard';
import CourseCard from '../../components/dashboard/CourseCard';
import RobotLoader from '../../components/common/RobotLoader';
import { getDashboardStats, subscribeNotifications } from '../../services/dashboardService';

const Dashboard = () => {
  const navigate = useNavigate();
  const { isLight } = useTheme();

  const [stats, setStats] = useState({
    coursesEnrolled: 0,
    topicsCompleted: 0,
    streak: 0,
    xp: 0,
  });

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [email, setEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);
  const [subscribeSuccess, setSubscribeSuccess] = useState('');
  const [subscribeError, setSubscribeError] = useState('');

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

        // Generate notifications list dynamically
        const list = [];
        if (data.courseProgress && Array.isArray(data.courseProgress)) {
          data.courseProgress.forEach((cp) => {
            if (cp.completion > 0) {
              list.push({
                id: `progress-${cp.courseId}`,
                type: 'progress',
                text: `Course "${cp.title}" completed by ${cp.completion}%`,
                time: 'Recently updated',
              });
            }
            if (cp.completion < 100) {
              list.push({
                id: `quiz-${cp.courseId}`,
                type: 'quiz',
                text: `New Quiz available for enrolled course "${cp.title}"`,
                time: 'Active',
              });
            }
          });
        }

        if (data.gamification?.lastStreakReminderSent) {
          const sentDate = new Date(data.gamification.lastStreakReminderSent).toLocaleString();
          list.push({
            id: 'streak-reminder',
            type: 'streak',
            text: `Gmail Alert Timeline: Keep your active learning streak of ${data.gamification.streak || 0} days alive! Continuity reminder sent to your inbox.`,
            time: sentDate,
          });
        }

        setNotifications(list);
      } catch (err) {
        console.error(err);
        setError('Unable to load dashboard stats. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    setSubscribing(true);
    setSubscribeSuccess('');
    setSubscribeError('');
    try {
      await subscribeNotifications(email);
      setSubscribeSuccess('Successfully subscribed!');
      setEmail('');
    } catch (err) {
      console.error(err);
      setSubscribeError(err.response?.data?.message || 'Subscription failed. Please try again.');
    } finally {
      setSubscribing(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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
      <motion.div variants={containerVariants} initial="hidden" animate="visible">
        {/* Header Section */}
        <motion.div variants={itemVariants} className="mb-8 flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className={`font-merriweather text-6xl sm:text-7xl transition-colors ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Welcome Back
            </h1>
            <p className="font-condiment text-3xl text-green-600 mt-2">
              Continue your AI-powered learning journey.
            </p>
          </div>

          {/* Dynamic Notifications Center */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className={`relative p-3 rounded-2xl border transition-all duration-300 ${
                isLight
                  ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100/80 shadow-sm'
                  : 'bg-zinc-900 border-white/5 text-gray-300 hover:bg-zinc-800 shadow-lg'
              }`}
            >
              <Bell className={isLight ? 'text-slate-700' : 'text-gray-300'} size={24} />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-[10px] text-black font-bold border-2 border-slate-50 dark:border-black">
                  {notifications.length}
                </span>
              )}
            </button>

            {/* Dropdown Modal/Overlay */}
            {showNotifications && (
              <div
                className={`absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl border shadow-2xl z-50 overflow-hidden transition-all duration-300 ${
                  isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-zinc-950 border-white/10 text-white'
                }`}
              >
                {/* Header */}
                <div className={`p-4 border-b flex items-center justify-between ${isLight ? 'border-slate-100' : 'border-white/5'}`}>
                  <h3 className="font-semibold text-sm">Notifications</h3>
                  {notifications.length > 0 && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-500/10 text-green-500">
                      {notifications.length} Active
                    </span>
                  )}
                </div>

                {/* Notification Items */}
                <div className="max-h-60 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center text-xs text-slate-400">No new notifications</div>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={`p-4 border-b flex items-start gap-3 transition-colors ${
                          isLight ? 'border-slate-50 hover:bg-slate-50' : 'border-white/5 hover:bg-zinc-900'
                        }`}
                      >
                        <div
                          className={`p-2 rounded-lg mt-0.5 ${
                            notif.type === 'streak'
                              ? 'bg-amber-500/10 text-amber-500'
                              : notif.type === 'quiz'
                              ? 'bg-blue-500/10 text-blue-500'
                              : 'bg-green-500/10 text-green-500'
                          }`}
                        >
                          {notif.type === 'streak' ? (
                            <Mail size={16} />
                          ) : notif.type === 'quiz' ? (
                            <Award size={16} />
                          ) : (
                            <BookOpen size={16} />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className={`text-xs font-medium leading-relaxed ${isLight ? 'text-slate-800' : 'text-gray-200'}`}>
                            {notif.text}
                          </p>
                          <span className={`text-[10px] block mt-1 ${isLight ? 'text-slate-400' : 'text-gray-500'}`}>
                            {notif.time}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Subscription Form */}
                <div className={`p-4 border-t ${isLight ? 'border-slate-100 bg-slate-50/50' : 'border-white/5 bg-zinc-900/30'} rounded-b-2xl`}>
                  <h4 className={`text-xs font-semibold uppercase tracking-wider mb-1 ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
                    Streak Continuity Alert
                  </h4>
                  <p className={`text-[11px] mb-3 leading-relaxed ${isLight ? 'text-slate-600' : 'text-gray-400'}`}>
                    Subscribe your email for daily alerts to protect your streak.
                  </p>

                  {subscribeSuccess ? (
                    <div className="text-xs text-green-500 flex items-center gap-1 font-semibold py-1">
                      <CheckCircle size={14} className="shrink-0" />
                      {subscribeSuccess}
                    </div>
                  ) : (
                    <form onSubmit={handleSubscribe} className="flex gap-2">
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        className={`flex-1 text-xs px-3 py-2 rounded-lg border focus:outline-none transition ${
                          isLight
                            ? 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-green-500'
                            : 'bg-zinc-900 border-white/10 text-white placeholder-gray-500 focus:border-green-500'
                        }`}
                      />
                      <button
                        type="submit"
                        disabled={subscribing}
                        className="bg-green-500 hover:bg-green-400 text-black text-xs font-semibold px-3 py-2 rounded-lg transition-all duration-300 hover:scale-105 active:scale-95 shrink-0"
                      >
                        {subscribing ? '...' : 'Subscribe'}
                      </button>
                    </form>
                  )}
                  {subscribeError && <p className="text-xs text-red-500 mt-1.5 font-semibold">{subscribeError}</p>}
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Error */}
        {error && (
          <motion.div
            variants={itemVariants}
            className={`mb-6 rounded-2xl border p-4 text-sm transition-colors ${
              isLight ? 'bg-red-50 border-red-200 text-red-800' : 'bg-red-500/10 border border-red-500/20 text-red-200'
            }`}
          >
            {error}
          </motion.div>
        )}

        {/* Stats */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
          <StatCard title="Courses Enrolled" value={loading ? '...' : stats.coursesEnrolled} subtitle={`${stats.coursesEnrolled} total courses`} />
          <StatCard title="Topics Completed" value={loading ? '...' : stats.topicsCompleted} subtitle="Across all courses" />
          <StatCard title="Current Streak" value={loading ? '...' : `${stats.streak} Days`} subtitle="Keep it going" />
          <StatCard title="XP Earned" value={loading ? '...' : stats.xp} subtitle="Progress points earned" />
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