import { Bell, Search, UserCircle, Mail, BookOpen, Award, CheckCircle } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { getDashboardStats, subscribeNotifications } from '../../services/dashboardService';

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);

  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const { isLight } = useTheme();

  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [email, setEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);
  const [subscribeSuccess, setSubscribeSuccess] = useState('');
  const [subscribeError, setSubscribeError] = useState('');

  const fetchNotifications = async () => {
    try {
      const data = await getDashboardStats();
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
      console.error('Failed to fetch notifications:', err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleBellClick = () => {
    const nextState = !showNotifications;
    setShowNotifications(nextState);
    if (nextState) {
      fetchNotifications();
    }
  };

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
      fetchNotifications(); // Refresh notifications log
    } catch (err) {
      console.error(err);
      setSubscribeError(err.response?.data?.message || 'Subscription failed. Please try again.');
    } finally {
      setSubscribing(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      const q = query.trim();
      navigate(`/browse-courses${q ? `?q=${encodeURIComponent(q)}` : ''}`);
    }
  };

  return (
    <header className={`h-20 border-b transition-all duration-300 ${
      isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-zinc-950 border-green-900/30 text-white'
    } px-6 flex items-center justify-between`}>
      
      {/* Search space placeholder if needed, otherwise empty div to keep flex-between aligned */}
      <div></div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        
        {/* Notification */}
        <div className="relative">
          <button 
            onClick={handleBellClick}
            className={`relative p-2 rounded-full transition ${isLight ? 'hover:bg-slate-100' : 'hover:bg-zinc-900'}`}
          >
            <Bell className={isLight ? 'text-slate-700' : 'text-gray-300'} size={22} />
            {notifications.length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-green-400 rounded-full" />
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
                      <div className="flex-1 min-w-0">
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

        {/* User */}
        <div className={`flex items-center gap-3 px-3 py-2 rounded-xl border transition ${
          isLight ? 'bg-slate-50 border-slate-200' : 'bg-zinc-900 border-white/5'
        }`}>
          <UserCircle className={isLight ? 'text-green-600' : 'text-green-400'} size={30} />
          
          <div>
            <p className={`text-sm font-medium transition ${isLight ? 'text-slate-900' : 'text-white'}`}>
              {user?.name || "Student"}
            </p>
            <p className={`text-xs transition ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>Student</p>
          </div>
        </div>

      </div>
    </header>
  );
};

export default Navbar;