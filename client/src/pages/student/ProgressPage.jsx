import { useEffect, useState } from 'react';
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, BarChart, Bar, Cell, Legend } from 'recharts';
import { Award, BarChart3, BookOpen, Flame, ShieldCheck, Sparkles, TrendingUp, Clock, AlertCircle } from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';
import StatCard from '../../components/dashboard/StatCard';
import WeakTopicCard from '../../components/dashboard/WeakTopicCard';
import WeakTopicsList from '../../components/dashboard/WeakTopicsList';
import api from '../../services/api';
import { getDashboardStats } from '../../services/dashboardService';

const trendingColors = ['#22c55e', '#facc15', '#ef4444'];

const ProgressPage = () => {
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
        // We do NOT set error state here so the rest of the page can load if possible, 
        // or we handle it gracefully below.
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

  const metrics = [
    {
      title: 'Courses Enrolled',
      value: stats?.coursesEnrolled ?? 0,
      subtitle: 'Active classes in progress',
      icon: BookOpen,
    },
    {
      title: 'Courses Completed',
      value: stats?.coursesCompleted ?? 0,
      subtitle: 'Finished learning journeys',
      icon: Award,
    },
    {
      title: 'Topics Completed',
      value: stats?.topicsCompleted ?? 0,
      subtitle: 'Mastered learning units',
      icon: ShieldCheck,
    },
    {
      title: 'Avg. Quiz Score',
      value: `${stats?.averageQuizScore ?? 0}%`,
      subtitle: 'Performance across quizzes',
      icon: TrendingUp,
    },
    {
      title: 'Last Quiz Score',
      value: `${stats?.lastQuizScore ?? 0}%`,
      subtitle: 'Most recent quiz attempt',
      icon: BarChart3,
    },
    {
      title: 'Weak Topics',
      value: stats?.weakTopics?.length ?? 0,
      subtitle: 'Areas to revise',
      icon: Flame,
    },
    {
      title: 'Total XP',
      value: stats?.gamification?.xp ?? 0,
      subtitle: 'Learning points earned',
      icon: Sparkles,
    },
    {
      title: 'Current Level',
      value: stats?.gamification?.level ?? 1,
      subtitle: 'Skill rank unlocked',
      icon: BarChart3,
    },
    {
      title: 'Daily Streak',
      value: `${stats?.gamification?.streak ?? 0} Days`,
      subtitle: 'Consistent learning streak',
      icon: Flame,
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <section className="rounded-4xl bg-gradient-to-br from-green-900/20 via-zinc-950/80 to-emerald-900/20 border border-green-500/30 p-8 shadow-2xl shadow-green-900/20 backdrop-blur-xl hover:shadow-green-500/20 transition-all duration-300">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-green-400/80">
                Progress Dashboard
              </p>
              <h1 className="text-4xl font-bold text-white mt-3">
                Learn Smarter with AI Insights
              </h1>
              <p className="text-gray-400 mt-3 max-w-2xl">
                Track your course performance, discover weak topics, and stay motivated with XP, levels, and tailored recommendations.
              </p>
            </div>

            <div className="rounded-[1.75rem] bg-gradient-to-br from-black/70 to-green-900/30 border border-green-500/50 p-6 shadow-2xl shadow-green-500/20 backdrop-blur-xl w-full max-w-sm hover:scale-105 transition-transform duration-300 hover:shadow-green-400/30">
              <p className="text-sm text-gray-300">XP Progress</p>
              <div className="mt-4 flex items-center justify-between gap-4">
                <div>
                  <p className="text-3xl font-bold text-green-400">{stats?.gamification?.xp ?? '...'}</p>
                  <p className="text-sm text-gray-500">Level {stats?.gamification?.level ?? '-'}</p>
                </div>
                <div className="rounded-full bg-gradient-to-br from-green-500/30 to-emerald-500/30 p-3 shadow-lg shadow-green-500/30">
                  <Sparkles className="text-green-300 animate-pulse" size={30} />
                </div>
              </div>
              <div className="mt-6 h-3 rounded-full bg-white/10 overflow-hidden border border-green-500/30">
                <div
                  className="h-full bg-gradient-to-r from-green-400 via-emerald-400 to-cyan-400 transition-all duration-500 shadow-lg shadow-green-500/50"
                  style={{ width: `${Math.min(100, ((stats?.gamification?.xp ?? 0) / 500) * 100)}%` }}
                />
              </div>
              <p className="mt-3 text-sm text-gray-400">
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

        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {metrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <StatCard
                key={metric.title}
                title={metric.title}
                value={loading ? '...' : metric.value}
                subtitle={metric.subtitle}
              />
            );
          })}
        </section>

        <section className="grid grid-cols-1 xl:grid-cols-[1.15fr_0.85fr] gap-6">
          <div className="rounded-4xl bg-gradient-to-br from-green-900/20 via-zinc-950/80 to-blue-900/20 border border-green-500/40 p-6 shadow-2xl shadow-green-900/20 backdrop-blur-xl hover:shadow-green-500/25 hover:border-green-500/60 transition-all duration-300 hover:scale-[1.01]">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-semibold text-white">Course Completion</h2>
                <p className="text-gray-400 mt-1">Track progress for each enrolled course.</p>
              </div>
              <div className="rounded-2xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/40 px-4 py-2 text-sm font-semibold text-green-300 shadow-lg shadow-green-500/20">
                {stats?.coursesCompleted ?? 0} Completed
              </div>
            </div>

            <div className="space-y-4">
              {(stats?.courseProgress || []).map((course) => (
                <div key={course.courseId} className="rounded-3xl border border-green-500/30 bg-gradient-to-r from-green-900/20 to-blue-900/10 p-5 hover:border-green-400/50 hover:bg-gradient-to-r hover:from-green-900/30 hover:to-blue-900/20 transition-all duration-200 hover:scale-[1.02] group">
                  <div className="flex items-center justify-between gap-4 mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{course.title}</h3>
                      <p className="text-sm text-gray-500">
                        {course.completedTopics}/{course.totalTopics} topics completed
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-cyan-300">
                      {course.completion}%
                    </span>
                  </div>
                  <div className="h-3 rounded-full bg-white/10 overflow-hidden border border-green-500/20 group-hover:border-green-500/40 transition-all">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-green-400 via-emerald-400 to-cyan-400 shadow-lg shadow-green-500/50 transition-all duration-500"
                      style={{ width: `${course.completion}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-4xl bg-gradient-to-br from-purple-900/20 via-zinc-950/80 to-pink-900/20 border border-purple-500/40 p-6 shadow-2xl shadow-purple-900/20 backdrop-blur-xl hover:shadow-purple-500/25 hover:border-purple-500/60 transition-all duration-300 hover:scale-[1.01]">
            <h2 className="text-2xl font-semibold text-white mb-4">Top Recommendations</h2>
            <div className="space-y-4">
              {(stats?.recommendations || []).map((note, index) => (
                <div
                  key={index}
                  className="rounded-3xl border border-purple-400/30 bg-gradient-to-r from-purple-900/20 to-pink-900/10 p-4 hover:border-purple-400/50 hover:bg-gradient-to-r hover:from-purple-900/30 hover:to-pink-900/20 transition-all duration-200 hover:scale-[1.02] group"
                >
                  <p className="text-sm text-purple-300 font-semibold mb-2 group-hover:text-purple-200 transition-colors">Suggestion</p>
                  <p className="text-gray-300 group-hover:text-gray-200 transition-colors">{note}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-3xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 p-4 border border-amber-400/30 hover:border-amber-400/50 hover:from-amber-500/15 hover:to-orange-500/15 transition-all duration-200">
              <div className="flex items-center gap-3 text-gray-300 mb-3">
                <Sparkles size={18} className="text-amber-400" />
                <p className="font-semibold">Achievement streak boost</p>
              </div>
              <p className="text-sm text-gray-400">
                Keep up the momentum and unlock higher XP bonuses every week.
              </p>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 xl:grid-cols-[0.75fr_1.25fr] gap-6">
          <div className="rounded-4xl bg-gradient-to-br from-cyan-900/20 via-zinc-950/80 to-blue-900/20 border border-cyan-500/40 p-6 shadow-2xl shadow-cyan-900/20 backdrop-blur-xl hover:shadow-cyan-500/25 hover:border-cyan-500/60 transition-all duration-300 hover:scale-[1.01]">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-semibold text-white">Quiz Score Trend</h2>
                <p className="text-gray-400 mt-1">Track recent quiz performance over time.</p>
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
                  </defs>
                  <CartesianGrid stroke="rgba(148,163,184,0.12)" strokeDasharray="4 4" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(34,197,94,0.3)' }} cursor={{ stroke: 'rgba(34,197,94,0.5)', strokeWidth: 2 }} />
                  <Area type="monotone" dataKey="score" stroke="#22c55e" strokeWidth={3} fill="url(#scoreGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-4xl bg-gradient-to-br from-amber-900/20 via-zinc-950/80 to-orange-900/20 border border-amber-500/40 p-6 shadow-2xl shadow-amber-900/20 backdrop-blur-xl hover:shadow-amber-500/25 hover:border-amber-500/60 transition-all duration-300 hover:scale-[1.01]">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-semibold text-white">Topic Performance</h2>
                <p className="text-gray-400 mt-1">Compare scores by topic.</p>
              </div>
            </div>
            <div className="h-80 min-h-80">
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                <BarChart data={stats?.topicPerformance || []} margin={{ top: 10, right: 0, left: -10, bottom: 0 }}>
                  <CartesianGrid stroke="rgba(148,163,184,0.12)" strokeDasharray="4 4" />
                  <XAxis dataKey="topic" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} interval={0} angle={-20} textAnchor="end" height={80} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(251,191,36,0.3)' }} />
                  <Legend wrapperStyle={{ color: '#94a3b8' }} />
                  <Bar dataKey="averageScore" radius={[12, 12, 0, 0]} fill="#38bdf8">
                    {(stats?.topicPerformance || []).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={trendingColors[index % trendingColors.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 rounded-4xl bg-gradient-to-br from-purple-900/30 via-zinc-950/80 to-pink-900/20 border border-purple-500/30 p-6 shadow-2xl shadow-purple-900/20 backdrop-blur-xl hover:shadow-purple-500/20 transition-all duration-300 hover:scale-[1.01]">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <Clock className="text-purple-400" size={28} />
                <div>
                  <h2 className="text-2xl font-semibold text-white">Upcoming Reminders</h2>
                  <p className="text-gray-400 mt-1">Stay on track with your learning goals.</p>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              {(stats?.upcomingReminders || []).length > 0 ? (
                (stats?.upcomingReminders || []).map((reminder, index) => (
                  <div
                    key={index}
                    className="rounded-2xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-400/30 p-4 hover:border-purple-400/50 hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-pink-500/20 transition-all duration-200 hover:scale-[1.02] group cursor-pointer"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{reminder.icon}</span>
                        <div>
                          {reminder.type === 'unfinished' ? (
                            <>
                              <p className="text-sm font-semibold text-purple-300">Unfinished Topics</p>
                              <p className="text-xs text-gray-400">{reminder.course}</p>
                              <p className="text-sm text-purple-200 font-medium mt-1">{reminder.count} topic{reminder.count > 1 ? 's' : ''} remaining</p>
                            </>
                          ) : (
                            <>
                              <p className="text-sm font-semibold text-purple-300">Quiz Reminder</p>
                              <p className="text-xs text-gray-400">{reminder.message}</p>
                            </>
                          )}
                        </div>
                      </div>
                      <AlertCircle className="text-purple-400 group-hover:animate-pulse" size={20} />
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl bg-green-500/10 border border-green-400/30 p-4">
                  <p className="text-green-300 text-sm font-semibold">✓ All caught up!</p>
                  <p className="text-xs text-gray-400 mt-1">Great job! No pending reminders.</p>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-4xl bg-gradient-to-br from-cyan-900/30 via-zinc-950/80 to-blue-900/20 border border-cyan-500/30 p-6 shadow-2xl shadow-cyan-900/20 backdrop-blur-xl hover:shadow-cyan-500/20 transition-all duration-300 hover:scale-[1.01]">
            <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
              <Flame className="text-cyan-400" size={24} />
              Learning Streaks
            </h2>
            <div className="space-y-4">
              <div className="rounded-2xl bg-gradient-to-r from-cyan-500/15 to-blue-500/15 border border-cyan-400/30 p-4 hover:border-cyan-400/50 transition-all duration-200">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-cyan-300">Current Streak</p>
                  <span className="text-2xl font-bold text-cyan-400">{stats?.gamification?.streak ?? 0}</span>
                </div>
                <div className="h-2 rounded-full bg-cyan-500/20 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-400 to-blue-400 transition-all duration-500"
                    style={{ width: `${Math.min(100, (stats?.gamification?.streak ?? 0) * 10)}%` }}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-2">Days of consistent learning</p>
              </div>
              <div className="rounded-2xl bg-gradient-to-r from-amber-500/15 to-orange-500/15 border border-amber-400/30 p-4 hover:border-amber-400/50 transition-all duration-200">
                <p className="text-sm font-semibold text-amber-300 mb-2">Streak Goal</p>
                <p className="text-lg font-bold text-amber-400">{Math.max(7, (stats?.gamification?.streak ?? 0) + 1)} days</p>
                <p className="text-xs text-gray-400 mt-2">Keep going to earn bonuses</p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="rounded-4xl bg-gradient-to-br from-red-900/20 via-zinc-950/80 to-pink-900/20 border border-red-500/40 p-6 shadow-2xl shadow-red-900/20 backdrop-blur-xl hover:shadow-red-500/25 hover:border-red-500/60 transition-all duration-300 hover:scale-[1.01]">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-semibold text-white flex items-center gap-3">
                  <AlertCircle className="text-red-400" size={24} />
                  Weak Topics (AI Guided)
                </h2>
                <p className="text-gray-400 mt-1">Focus on areas needing improvement based on your quizzes.</p>
              </div>
            </div>
            <div className="mt-4">
              <WeakTopicsList weakTopics={learningData.weakTopics} />
            </div>
          </div>

          <div className="rounded-4xl bg-gradient-to-br from-violet-900/20 via-zinc-950/80 to-purple-900/20 border border-violet-500/40 p-6 shadow-2xl shadow-violet-900/20 backdrop-blur-xl hover:shadow-violet-500/25 hover:border-violet-500/60 transition-all duration-300 hover:scale-[1.01]">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-semibold text-white flex items-center gap-3">
                  <Award className="text-violet-400" size={24} />
                  Badges & Milestones
                </h2>
                <p className="text-gray-400 mt-1">Your achievements and rewards.</p>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {(stats?.gamification?.badges || []).slice(0, 6).map((badge, index) => (
                <div
                  key={index}
                  className="rounded-2xl bg-gradient-to-br from-violet-900/30 to-purple-900/10 border border-violet-400/30 p-4 flex flex-col items-center justify-center text-center hover:border-violet-400/50 hover:bg-gradient-to-br hover:from-violet-900/40 hover:to-purple-900/20 transition-all duration-200 hover:scale-110 hover:shadow-lg hover:shadow-violet-500/20 group cursor-pointer"
                >
                  <span className="text-3xl mb-2 group-hover:scale-125 transition-transform duration-200">{badge.icon || ''}</span>
                  <p className="text-sm font-semibold text-violet-300 group-hover:text-violet-200 transition-colors">{badge.name || `Badge ${index + 1}`}</p>
                  <p className="text-xs text-gray-500 mt-1 group-hover:text-gray-400 transition-colors">{badge.description || 'Unlocked'}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
};

export default ProgressPage;
