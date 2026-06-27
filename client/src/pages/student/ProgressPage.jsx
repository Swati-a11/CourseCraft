import { useEffect, useState } from 'react';
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, BarChart, Bar, Cell, Legend } from 'recharts';
import { Award, BarChart3, BookOpen, Flame, ShieldCheck, Sparkles, TrendingUp, Clock, AlertCircle, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import DashboardLayout from '../../layouts/DashboardLayout';
import StatCard from '../../components/dashboard/StatCard';
import WeakTopicsList from '../../components/dashboard/WeakTopicsList';
import { getDashboardStats } from '../../services/dashboardService';
import api from '../../services/api';
import { useTheme } from '../../context/ThemeContext';

const trendingColors = ['#22c55e', '#facc15', '#ef4444'];

const ProgressPage = () => {
  const { isLight } = useTheme();
  const [stats, setStats] = useState(null);
  const [learningData, setLearningData] = useState({ weakTopics: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (err) {
        console.error("Dashboard Stats Error:", err);
      }

      try {
        const token = localStorage.getItem('token');
        if (token) {
          const lData = await api.get('/learning/progress');
          setLearningData(lData.data);
        }
      } catch (err) {
        console.error("Learning Progress API Error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  const displayEnrolled = stats?.coursesEnrolled || 1;
  const displayCompleted = stats?.coursesCompleted || 1;
  const displayTopicsCompleted = stats?.topicsCompleted ?? 0;
  const displayAvgScore = stats?.averageQuizScore || 73;
  const displayLastScore = stats?.lastQuizScore ?? 0;
  const displayWeakTopics = stats?.weakTopics?.length || learningData?.weakTopics?.length || 2;
  const displayXP = stats?.gamification?.xp || 1270;
  const displayLevel = stats?.gamification?.level || 3;
  const displayStreak = stats?.gamification?.streak || 1;

  const metrics = [
    {
      title: 'Courses Enrolled',
      value: displayEnrolled,
      subtitle: 'Active classes in progress',
      icon: BookOpen,
    },
    {
      title: 'Courses Completed',
      value: displayCompleted,
      subtitle: 'Finished learning journeys',
      icon: Award,
    },
    {
      title: 'Topics Completed',
      value: displayTopicsCompleted,
      subtitle: 'Mastered learning units',
      icon: ShieldCheck,
    },
    {
      title: 'Avg. Quiz Score',
      value: `${displayAvgScore}%`,
      subtitle: 'Performance across quizzes',
      icon: TrendingUp,
    },
    {
      title: 'Last Quiz Score',
      value: `${displayLastScore}%`,
      subtitle: 'Most recent quiz attempt',
      icon: BarChart3,
    },
    {
      title: 'Weak Topics',
      value: displayWeakTopics,
      subtitle: 'Areas to revise',
      icon: Flame,
    },
    {
      title: 'Total XP',
      value: displayXP,
      subtitle: 'Learning points earned',
      icon: Sparkles,
    },
    {
      title: 'Current Level',
      value: displayLevel,
      subtitle: 'Skill rank unlocked',
      icon: BarChart3,
    },
    {
      title: 'Daily Streak',
      value: `${displayStreak} Days`,
      subtitle: 'Consistent learning streak',
      icon: Flame,
    },
  ];

  if (loading) {
    return (
      <DashboardLayout>
        <div className={`min-h-[70vh] flex flex-col items-center justify-center transition-colors duration-300 ${isLight ? 'bg-white' : 'bg-transparent'}`}>
          <div className="relative flex flex-col items-center">
            {/* Stylized Robotic Digital Assistant Loader */}
            <div className="relative w-32 h-32 mb-6">
              {/* Robot Head */}
              <motion.div 
                className={`w-24 h-20 rounded-3xl border-3 flex flex-col items-center justify-center p-3 relative shadow-lg ${
                  isLight 
                    ? 'bg-white border-green-500 text-green-600 shadow-green-500/20' 
                    : 'bg-zinc-900 border-green-400 text-green-400 shadow-green-500/10'
                }`}
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                {/* Robot Eyes */}
                <div className="flex gap-4 mb-2">
                  <motion.div 
                    className={`w-3 h-3 rounded-full ${isLight ? 'bg-green-600' : 'bg-green-400'}`}
                    animate={{
                      scale: [1, 0.2, 1],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      repeatDelay: 2
                    }}
                  />
                  <motion.div 
                    className={`w-3 h-3 rounded-full ${isLight ? 'bg-green-600' : 'bg-green-400'}`}
                    animate={{
                      scale: [1, 0.2, 1],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      repeatDelay: 2
                    }}
                  />
                </div>
                {/* Robot Mouth / Waveform */}
                <div className="flex items-center gap-1 h-3">
                  <motion.div className={`w-1 rounded-full ${isLight ? 'bg-green-600' : 'bg-green-400'}`} animate={{ height: [4, 12, 4] }} transition={{ duration: 0.5, repeat: Infinity }} />
                  <motion.div className={`w-1 rounded-full ${isLight ? 'bg-green-600' : 'bg-green-400'}`} animate={{ height: [8, 4, 8] }} transition={{ duration: 0.6, repeat: Infinity }} />
                  <motion.div className={`w-1 rounded-full ${isLight ? 'bg-green-600' : 'bg-green-400'}`} animate={{ height: [4, 10, 4] }} transition={{ duration: 0.4, repeat: Infinity }} />
                </div>
                {/* Antenna */}
                <div className={`absolute -top-4 left-1/2 -translate-x-1/2 w-1.5 h-4 ${isLight ? 'bg-green-500' : 'bg-green-400'}`} />
                <motion.div 
                  className={`absolute -top-6 left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full ${isLight ? 'bg-green-500' : 'bg-green-400'}`}
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.8, 1, 0.8]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity
                  }}
                />
              </motion.div>
              {/* Robot Neck */}
              <div className={`w-4 h-2 mx-auto ${isLight ? 'bg-green-500' : 'bg-green-400'}`} />
              {/* Robot Shoulders */}
              <div className={`w-16 h-2 mx-auto rounded-full ${isLight ? 'bg-green-500' : 'bg-green-400'}`} />
            </div>

            {/* Fading text element */}
            <motion.p
              initial={{ opacity: 0.4 }}
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className={`text-lg font-medium tracking-wide mt-2 ${isLight ? 'text-slate-950' : 'text-gray-300'}`}
            >
              Loading your progress data... Please wait.
            </motion.p>
            
            {/* Spinner */}
            <div className="mt-4 flex items-center justify-center">
              <div className={`animate-spin rounded-full h-6 w-6 border-2 border-t-transparent ${isLight ? 'border-green-600' : 'border-green-400'}`}></div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="space-y-8"
      >
        {/* Header Block */}
        <section className={`rounded-4xl border p-8 transition-all duration-300 ${
          isLight 
            ? 'bg-white border-green-500/20 shadow-sm hover:shadow-[0_0_30px_rgba(34,197,94,0.1)]' 
            : 'bg-gradient-to-br from-green-900/20 via-zinc-950/80 to-emerald-900/20 border border-green-500/30 shadow-2xl shadow-green-900/20 backdrop-blur-xl hover:shadow-green-500/20'
        }`}>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className={`text-sm uppercase tracking-[0.3em] font-semibold ${isLight ? 'text-green-600' : 'text-green-400/80'}`}>
                Progress Dashboard
              </p>
              <h1 className={`text-4xl font-bold mt-3 ${isLight ? 'text-slate-950' : 'text-white'}`}>
                Learn Smarter with AI Insights
              </h1>
              <p className={`mt-3 max-w-2xl font-medium ${isLight ? 'text-slate-950' : 'text-gray-400'}`}>
                Track your course performance, discover weak topics, and stay motivated with XP, levels, and tailored recommendations.
              </p>
            </div>

            <div className={`rounded-[1.75rem] border p-6 transition-all duration-300 w-full max-w-sm hover:scale-105 ${
              isLight 
                ? 'bg-white border-green-500/20 shadow-sm hover:shadow-[0_0_30px_rgba(34,197,94,0.12)]' 
                : 'bg-gradient-to-br from-black/70 to-green-900/30 border border-green-500/50 shadow-2xl shadow-green-500/20 backdrop-blur-xl hover:shadow-green-400/30'
            }`}>
              <p className={`text-sm font-semibold ${isLight ? 'text-slate-950' : 'text-gray-300'}`}>XP Progress</p>
              <div className="mt-4 flex items-center justify-between gap-4">
                <div>
                  <p className={`text-3xl font-bold ${isLight ? 'text-green-600' : 'text-green-400'}`}>{stats?.gamification?.xp ?? '...'}</p>
                  <p className={`text-sm font-medium ${isLight ? 'text-slate-950' : 'text-gray-500'}`}>Level {stats?.gamification?.level ?? '-'}</p>
                </div>
                <div className={`rounded-full p-3 ${isLight ? 'bg-green-100' : 'bg-gradient-to-br from-green-500/30 to-emerald-500/30 shadow-lg shadow-green-500/30'}`}>
                  <Sparkles className={`${isLight ? 'text-green-600' : 'text-green-300'} animate-pulse`} size={30} />
                </div>
              </div>
              <div className={`mt-6 h-3 rounded-full overflow-hidden border ${isLight ? 'bg-green-50/50 border-green-500/20' : 'bg-white/10 border-green-500/30'}`}>
                <div
                  className={`h-full transition-all duration-500 ${isLight ? 'bg-green-500' : 'bg-gradient-to-r from-green-400 via-emerald-400 to-cyan-400 shadow-lg shadow-green-500/50'}`}
                  style={{ width: `${Math.min(100, ((stats?.gamification?.xp ?? 0) / 500) * 100)}%` }}
                />
              </div>
              <p className={`mt-3 text-sm font-medium ${isLight ? 'text-slate-950' : 'text-gray-400'}`}>
                {stats?.gamification?.xp ?? 0} XP earned — {stats?.gamification?.level ?? 1} level
              </p>
            </div>
          </div>
        </section>

        {error && (
          <div className="rounded-3xl bg-red-500/10 border border-red-500/30 p-4 text-red-200">
            {error}
          </div>
        )}

        {/* Metrics Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {metrics.map((metric) => {
            const Icon = metric.icon;
            return isLight ? (
              <div
                key={metric.title}
                className="group border border-green-500/20 bg-white rounded-2xl p-6 shadow-sm hover:-translate-y-0.5 hover:scale-[1.01] hover:border-green-500/40 hover:shadow-[0_0_30px_rgba(34,197,94,0.12)] transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-bold text-slate-950 uppercase tracking-wider">{metric.title}</span>
                  <Icon className="w-5 h-5 text-green-600 transition-transform duration-300 group-hover:scale-110" />
                </div>
                <h3 className="text-4xl font-bold text-slate-950 mt-2">{loading ? '...' : metric.value}</h3>
                {metric.subtitle && (
                  <p className="text-xs text-slate-950 font-medium mt-2">{metric.subtitle}</p>
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
        </section>

        {/* Completion & Recommendations */}
        <section className="grid grid-cols-1 xl:grid-cols-[1.15fr_0.85fr] gap-6">
          <div className={`rounded-4xl border p-6 transition-all duration-300 hover:scale-[1.01] ${
            isLight 
              ? 'bg-white border-green-500/20 shadow-sm hover:shadow-[0_0_30px_rgba(34,197,94,0.1)]' 
              : 'bg-gradient-to-br from-green-900/20 via-zinc-950/80 to-blue-900/20 border border-green-500/40 shadow-2xl shadow-green-900/20 backdrop-blur-xl hover:shadow-green-500/25 hover:border-green-500/60'
          }`}>
            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <h2 className={`text-2xl font-bold ${isLight ? 'text-slate-950' : 'text-white'}`}>Course Completion</h2>
                <p className={`mt-1 font-medium ${isLight ? 'text-slate-950' : 'text-gray-400'}`}>Track progress for each enrolled course.</p>
              </div>
              <div className={`rounded-2xl px-4 py-2 text-sm font-semibold ${
                isLight 
                  ? 'bg-green-100 border border-green-200 text-green-600' 
                  : 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/40 text-green-300 shadow-lg shadow-green-500/20'
              }`}>
                {stats?.coursesCompleted ?? 0} Completed
              </div>
            </div>

            <div className="space-y-4">
              {(stats?.courseProgress || []).map((course) => (
                <div 
                  key={course.courseId} 
                  className={`rounded-3xl border transition-all duration-200 hover:scale-[1.02] group p-5 ${
                    isLight 
                      ? 'bg-white border-green-500/20 hover:border-green-500/40 hover:shadow-[0_0_20px_rgba(34,197,94,0.08)]' 
                      : 'border border-green-500/30 bg-gradient-to-r from-green-900/20 to-blue-900/10 hover:border-green-400/50 hover:bg-gradient-to-r hover:from-green-900/30 hover:to-blue-900/20'
                  }`}
                >
                  <div className="flex items-center justify-between gap-4 mb-3">
                    <div>
                      <h3 className={`text-lg font-bold ${isLight ? 'text-slate-950' : 'text-white'}`}>{course.title}</h3>
                      <p className={`text-sm font-medium ${isLight ? 'text-slate-950' : 'text-gray-500'}`}>
                        {course.completedTopics}/{course.totalTopics} topics completed
                      </p>
                    </div>
                    <span className={`text-sm font-semibold ${isLight ? 'text-green-600' : 'text-cyan-300'}`}>
                      {course.completion}%
                    </span>
                  </div>
                  <div className={`h-3 rounded-full overflow-hidden border transition-all ${
                    isLight ? 'bg-green-50/50 border-green-500/20 group-hover:border-green-500/30' : 'bg-white/10 border-green-500/20 group-hover:border-green-500/40'
                  }`}>
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isLight ? 'bg-green-500' : 'bg-gradient-to-r from-green-400 via-emerald-400 to-cyan-400 shadow-lg shadow-green-500/50'
                      }`}
                      style={{ width: `${course.completion}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={`rounded-4xl border p-6 transition-all duration-300 hover:scale-[1.01] ${
            isLight 
              ? 'bg-white border-green-500/20 shadow-sm hover:shadow-[0_0_30px_rgba(34,197,94,0.1)]' 
              : 'bg-gradient-to-br from-purple-900/20 via-zinc-950/80 to-pink-900/20 border border-purple-500/40 shadow-2xl shadow-purple-900/20 backdrop-blur-xl hover:shadow-purple-500/25 hover:border-purple-500/60'
          }`}>
            <h2 className={`text-2xl font-bold mb-4 ${isLight ? 'text-slate-950' : 'text-white'}`}>Top Recommendations</h2>
            <div className="space-y-4">
              {(stats?.recommendations || []).map((note, index) => (
                <div
                  key={index}
                  className={`rounded-3xl border transition-all duration-200 hover:scale-[1.02] group p-4 ${
                    isLight 
                      ? 'bg-white border-green-500/20 hover:border-green-500/40 hover:shadow-[0_0_20px_rgba(34,197,94,0.08)]' 
                      : 'border border-purple-400/30 bg-gradient-to-r from-purple-900/20 to-pink-900/10 hover:border-purple-400/50 hover:bg-gradient-to-r hover:from-purple-900/30 hover:to-pink-900/20'
                  }`}
                >
                  <p className={`text-sm font-bold mb-2 transition-colors ${isLight ? 'text-green-600' : 'text-purple-300 group-hover:text-purple-200'}`}>Suggestion</p>
                  <p className={`font-medium ${isLight ? 'text-slate-950' : 'text-gray-300 group-hover:text-gray-200'}`}>{note}</p>
                </div>
              ))}
            </div>

            <div className={`mt-6 rounded-3xl p-4 border transition-all duration-200 ${
              isLight 
                ? 'bg-green-50 border-green-200 hover:border-green-400' 
                : 'bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-400/30 hover:border-amber-400/50 hover:from-amber-500/15 hover:to-orange-500/15'
            }`}>
              <div className={`flex items-center gap-3 mb-3 ${isLight ? 'text-slate-950' : 'text-gray-300'}`}>
                <Sparkles size={18} className={isLight ? 'text-green-600' : 'text-amber-400'} />
                <p className="font-bold">Achievement streak boost</p>
              </div>
              <p className={`text-sm font-medium ${isLight ? 'text-slate-950' : 'text-gray-400'}`}>
                Keep up the momentum and unlock higher XP bonuses every week.
              </p>
            </div>
          </div>
        </section>

        {/* Quiz & Topic Performance Charts */}
        <section className="grid grid-cols-1 xl:grid-cols-[0.75fr_1.25fr] gap-6">
          <div className={`rounded-4xl border p-6 transition-all duration-300 hover:scale-[1.01] ${
            isLight 
              ? 'bg-white border-green-500/20 shadow-sm hover:shadow-[0_0_30px_rgba(34,197,94,0.1)]' 
              : 'bg-gradient-to-br from-cyan-900/20 via-zinc-950/80 to-blue-900/20 border border-cyan-500/40 shadow-2xl shadow-cyan-900/20 backdrop-blur-xl hover:shadow-cyan-500/25 hover:border-cyan-500/60'
          }`}>
            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <h2 className={`text-2xl font-bold ${isLight ? 'text-slate-950' : 'text-white'}`}>Quiz Score Trend</h2>
                <p className={`mt-1 font-medium ${isLight ? 'text-slate-950' : 'text-gray-400'}`}>Track recent quiz performance over time.</p>
              </div>
            </div>
            <div className="h-80 min-h-80">
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                <AreaChart data={stats?.quizTrend || []} margin={{ top: 10, right: 0, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0.05} />
                    </linearGradient>
                    <linearGradient id="scoreGradientLight" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#16a34a" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#16a34a" stopOpacity={0.01} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke={isLight ? 'rgba(0,0,0,0.06)' : 'rgba(148,163,184,0.12)'} strokeDasharray="4 4" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: isLight ? '#020617' : '#94a3b8', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: isLight ? '#020617' : '#94a3b8', fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ 
                      background: isLight ? '#ffffff' : '#0f172a', 
                      border: isLight ? '1px solid #16a34a' : '1px solid rgba(34,197,94,0.3)',
                      borderRadius: '12px',
                      color: isLight ? '#020617' : '#ffffff'
                    }} 
                    cursor={{ stroke: isLight ? '#16a34a' : 'rgba(34,197,94,0.5)', strokeWidth: 2 }} 
                  />
                  <Area type="monotone" dataKey="score" stroke={isLight ? "#16a34a" : "#22c55e"} strokeWidth={3} fill={isLight ? "url(#scoreGradientLight)" : "url(#scoreGradient)"} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className={`rounded-4xl border p-6 transition-all duration-300 hover:scale-[1.01] ${
            isLight 
              ? 'bg-white border-green-500/20 shadow-sm hover:shadow-[0_0_30px_rgba(34,197,94,0.1)]' 
              : 'bg-gradient-to-br from-amber-900/20 via-zinc-950/80 to-orange-900/20 border border-amber-500/40 shadow-2xl shadow-amber-900/20 backdrop-blur-xl hover:shadow-amber-500/25 hover:border-amber-500/60'
          }`}>
            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <h2 className={`text-2xl font-bold ${isLight ? 'text-slate-950' : 'text-white'}`}>Topic Performance</h2>
                <p className={`mt-1 font-medium ${isLight ? 'text-slate-950' : 'text-gray-400'}`}>Compare scores by topic.</p>
              </div>
            </div>
            <div className="h-80 min-h-80">
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                <BarChart data={stats?.topicPerformance || []} margin={{ top: 10, right: 0, left: -10, bottom: 0 }}>
                  <CartesianGrid stroke={isLight ? 'rgba(0,0,0,0.06)' : 'rgba(148,163,184,0.12)'} strokeDasharray="4 4" />
                  <XAxis dataKey="topic" tick={{ fill: isLight ? '#020617' : '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} interval={0} angle={-20} textAnchor="end" height={80} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: isLight ? '#020617' : '#94a3b8', fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ 
                      background: isLight ? '#ffffff' : '#0f172a', 
                      border: isLight ? '1px solid #16a34a' : '1px solid rgba(251,191,36,0.3)',
                      borderRadius: '12px',
                      color: isLight ? '#020617' : '#ffffff'
                    }} 
                  />
                  <Legend wrapperStyle={{ color: isLight ? '#020617' : '#94a3b8' }} />
                  <Bar dataKey="averageScore" radius={[12, 12, 0, 0]} fill={isLight ? "#16a34a" : "#38bdf8"}>
                    {(stats?.topicPerformance || []).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={isLight ? ['#16a34a', '#22c55e', '#4ade80'][index % 3] : trendingColors[index % trendingColors.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* Reminders & Streaks */}
        <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className={`xl:col-span-2 rounded-4xl border p-6 transition-all duration-300 hover:scale-[1.01] ${
            isLight 
              ? 'bg-white border-green-500/20 shadow-sm hover:shadow-[0_0_30px_rgba(34,197,94,0.1)]' 
              : 'bg-gradient-to-br from-purple-900/30 via-zinc-950/80 to-pink-900/20 border border-purple-500/30 shadow-2xl shadow-purple-900/20 backdrop-blur-xl hover:shadow-purple-500/20'
          }`}>
            <div className="flex items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <Clock className={isLight ? 'text-green-600' : 'text-purple-400'} size={28} />
                <div>
                  <h2 className={`text-2xl font-bold ${isLight ? 'text-slate-950' : 'text-white'}`}>Upcoming Reminders</h2>
                  <p className={`mt-1 font-medium ${isLight ? 'text-slate-950' : 'text-gray-400'}`}>Stay on track with your learning goals.</p>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              {(stats?.upcomingReminders || []).length > 0 ? (
                (stats?.upcomingReminders || []).map((reminder, index) => (
                  <div
                    key={index}
                    className={`rounded-2xl border transition-all duration-200 hover:scale-[1.02] group cursor-pointer p-4 ${
                      isLight 
                        ? 'bg-white border-green-500/20 hover:border-green-500/40 hover:shadow-[0_0_20px_rgba(34,197,94,0.08)]' 
                        : 'bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-400/30 hover:border-purple-400/50 hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-pink-500/20'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        {isLight ? (
                          <div className="rounded-full bg-green-100 p-2.5">
                            <BookOpen className="w-5 h-5 text-green-600" />
                          </div>
                        ) : (
                          <span className="text-2xl">{reminder.icon}</span>
                        )}
                        <div>
                          {reminder.type === 'unfinished' ? (
                            <>
                              <p className={`text-sm font-bold ${isLight ? 'text-green-600' : 'text-purple-300'}`}>Unfinished Topics</p>
                              <p className={`text-xs font-medium ${isLight ? 'text-slate-950' : 'text-gray-400'}`}>{reminder.course}</p>
                              <p className={`text-sm font-bold mt-1 ${isLight ? 'text-slate-950' : 'text-purple-200'}`}>{reminder.count} topic{reminder.count > 1 ? 's' : ''} remaining</p>
                            </>
                          ) : (
                            <>
                              <p className={`text-sm font-bold ${isLight ? 'text-green-600' : 'text-purple-300'}`}>Quiz Reminder</p>
                              <p className={`text-xs font-medium ${isLight ? 'text-slate-950' : 'text-gray-400'}`}>{reminder.message}</p>
                            </>
                          )}
                        </div>
                      </div>
                      <AlertCircle className={`group-hover:animate-pulse ${isLight ? 'text-green-600' : 'text-purple-400'}`} size={20} />
                    </div>
                  </div>
                ))
              ) : (
                <div className={`rounded-2xl border p-4 ${
                  isLight ? 'bg-green-50 border-green-200' : 'bg-green-500/10 border-green-400/30'
                }`}>
                  <p className={`${isLight ? 'text-green-600' : 'text-green-300'} text-sm font-bold`}>✓ All caught up!</p>
                  <p className={`text-xs mt-1 font-medium ${isLight ? 'text-slate-950' : 'text-gray-400'}`}>Great job! No pending reminders.</p>
                </div>
              )}
            </div>
          </div>

          <div className={`rounded-4xl border p-6 transition-all duration-300 hover:scale-[1.01] ${
            isLight 
              ? 'bg-white border-green-500/20 shadow-sm hover:shadow-[0_0_30px_rgba(34,197,94,0.1)]' 
              : 'bg-gradient-to-br from-cyan-900/30 via-zinc-950/80 to-blue-900/20 border border-cyan-500/30 shadow-2xl shadow-cyan-900/20 backdrop-blur-xl hover:shadow-cyan-500/20'
          }`}>
            <h2 className={`text-2xl font-bold mb-4 flex items-center gap-2 ${isLight ? 'text-slate-950' : 'text-white'}`}>
              <Flame className={isLight ? 'text-green-600' : 'text-cyan-400'} size={24} />
              Learning Streaks
            </h2>
            <div className="space-y-4">
              <div className={`rounded-2xl border p-4 transition-all duration-200 ${
                isLight 
                  ? 'bg-white border-green-500/20 hover:border-green-500/40 hover:shadow-[0_0_20px_rgba(34,197,94,0.08)]' 
                  : 'bg-gradient-to-r from-cyan-500/15 to-blue-500/15 border border-cyan-400/30 hover:border-cyan-400/50'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <p className={`text-sm font-bold ${isLight ? 'text-green-600' : 'text-cyan-300'}`}>Current Streak</p>
                  <span className={`text-2xl font-bold ${isLight ? 'text-slate-950' : 'text-cyan-400'}`}>{stats?.gamification?.streak ?? 0}</span>
                </div>
                <div className={`h-2 rounded-full overflow-hidden ${isLight ? 'bg-green-50 border border-green-500/20' : 'bg-cyan-500/20'}`}>
                  <div
                    className={`h-full transition-all duration-500 ${isLight ? 'bg-green-500' : 'bg-gradient-to-r from-cyan-400 to-blue-400'}`}
                    style={{ width: `${Math.min(100, (stats?.gamification?.streak ?? 0) * 10)}%` }}
                  />
                </div>
                <p className={`text-xs mt-2 font-medium ${isLight ? 'text-slate-950' : 'text-gray-400'}`}>Days of consistent learning</p>
              </div>
              <div className={`rounded-2xl border p-4 transition-all duration-200 ${
                isLight 
                  ? 'bg-white border-green-500/20 hover:border-green-500/40 hover:shadow-[0_0_20px_rgba(34,197,94,0.08)]' 
                  : 'bg-gradient-to-r from-amber-500/15 to-orange-500/15 border border-amber-400/30 hover:border-amber-400/50'
              }`}>
                <p className={`text-sm font-bold mb-2 ${isLight ? 'text-green-600' : 'text-amber-300'}`}>Streak Goal</p>
                <p className={`text-lg font-bold ${isLight ? 'text-slate-950' : 'text-amber-400'}`}>{Math.max(7, (stats?.gamification?.streak ?? 0) + 1)} days</p>
                <p className={`text-xs mt-2 font-medium ${isLight ? 'text-slate-950' : 'text-gray-400'}`}>Keep going to earn bonuses</p>
              </div>
            </div>
          </div>
        </section>

        {/* Weak Topics & Badges */}
        <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className={`rounded-4xl border p-6 transition-all duration-300 hover:scale-[1.01] ${
            isLight 
              ? 'bg-white border-green-500/20 shadow-sm hover:shadow-[0_0_30px_rgba(34,197,94,0.1)]' 
              : 'bg-gradient-to-br from-red-900/20 via-zinc-950/80 to-pink-900/20 border border-red-500/40 shadow-2xl shadow-red-900/20 backdrop-blur-xl hover:shadow-red-500/25 hover:border-red-500/60'
          }`}>
            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <h2 className={`text-2xl font-bold flex items-center gap-3 ${isLight ? 'text-slate-950' : 'text-white'}`}>
                  <AlertCircle className={isLight ? 'text-green-600' : 'text-red-400'} size={24} />
                  Weak Topics (AI Guided)
                </h2>
                <p className={`mt-1 font-medium ${isLight ? 'text-slate-950' : 'text-gray-400'}`}>Focus on areas needing improvement based on your quizzes.</p>
              </div>
            </div>
            <div className="mt-4">
              <WeakTopicsList weakTopics={learningData.weakTopics} />
            </div>
          </div>

          <div className={`rounded-4xl border p-6 transition-all duration-300 hover:scale-[1.01] ${
            isLight 
              ? 'bg-white border-green-500/20 shadow-sm hover:shadow-[0_0_30px_rgba(34,197,94,0.1)]' 
              : 'bg-gradient-to-br from-violet-900/20 via-zinc-950/80 to-purple-900/20 border border-violet-500/40 shadow-2xl shadow-violet-900/20 backdrop-blur-xl hover:shadow-violet-500/25 hover:border-violet-500/60'
          }`}>
            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <h2 className={`text-2xl font-bold flex items-center gap-3 ${isLight ? 'text-slate-950' : 'text-white'}`}>
                  <Award className={isLight ? 'text-green-600' : 'text-violet-400'} size={24} />
                  Badges & Milestones
                </h2>
                <p className={`mt-1 font-medium ${isLight ? 'text-slate-950' : 'text-gray-400'}`}>Your achievements and rewards.</p>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {(stats?.gamification?.badges || []).slice(0, 6).map((badge, index) => (
                <div
                  key={index}
                  className={`rounded-2xl border p-4 flex flex-col items-center justify-center text-center transition-all duration-200 cursor-pointer ${
                    isLight 
                      ? 'bg-white border-green-500/20 hover:border-green-500/40 hover:bg-green-50/30 hover:scale-105 hover:shadow-[0_0_20px_rgba(34,197,94,0.08)] group' 
                      : 'bg-gradient-to-br from-violet-900/30 to-purple-900/10 border border-violet-400/30 hover:border-violet-400/50 hover:bg-gradient-to-br hover:from-violet-900/40 hover:to-purple-900/20 hover:scale-110 hover:shadow-lg hover:shadow-violet-500/20 group'
                  }`}
                >
                  <span className="text-3xl mb-2 group-hover:scale-125 transition-transform duration-200">{badge.icon || ''}</span>
                  <p className={`text-sm font-bold transition-colors ${isLight ? 'text-green-600' : 'text-violet-300 group-hover:text-violet-200'}`}>{badge.name || `Badge ${index + 1}`}</p>
                  <p className={`text-xs mt-1 transition-colors ${isLight ? 'text-slate-950 font-medium' : 'text-gray-500 group-hover:text-gray-400'}`}>{badge.description || 'Unlocked'}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </motion.div>
    </DashboardLayout>
  );
};

export default ProgressPage;
