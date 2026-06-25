import {
  LayoutDashboard,
  BookOpen,
  Brain,
  BarChart3,
  Award,
  Settings,
  LogOut,
  Wand2,
} from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import { useTheme } from '../../context/ThemeContext';

const menuItems = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { name: 'My Courses', icon: BookOpen, path: '/my-courses' },
  { name: 'AI Study Plan', icon: Brain, path: '/study-plan' },
  { name: 'Progress', icon: BarChart3, path: '/progress' },
  { name: 'Achievements', icon: Award, path: '/achievements' },
  { name: 'AI Tools', icon: Wand2, path: '/youtube-notes' },
  { name: 'Settings', icon: Settings, path: '/settings' },
];

const Sidebar = () => {
  const dispatch = useDispatch();
  const { isLight } = useTheme();

  const handleLogout = () => {
    dispatch(logout());
    window.location.href = '/';
  };

  return (
    <aside
      className={`group/sidebar w-20 hover:w-64 transition-all duration-300 ease-in-out z-50 h-screen fixed left-0 top-0 flex flex-col ${
        isLight
          ? 'bg-white text-slate-900 border-r border-slate-200'
          : 'bg-zinc-950 border-r border-green-900/30 text-white'
      }`}
    >
      {/* Brand Header */}
      <div className={`p-6 border-b ${isLight ? 'border-slate-100' : 'border-green-900/30'} h-20 flex items-center overflow-hidden`}>
        <div className="opacity-0 pointer-events-none group-hover/sidebar:opacity-100 group-hover/sidebar:pointer-events-auto transition-opacity duration-300 whitespace-nowrap">
          <h1 className={`text-3xl font-condiment ${isLight ? 'text-green-600' : 'text-green-400'}`}>
            CourseCraft
          </h1>
          <p className={`text-sm font-cabin font-extrabold mt-1 ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
            AI Learning Platform
          </p>
        </div>
      </div>

      {/* Navigation Loop with Morphing Icons */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? `${isLight ? 'bg-green-100 text-green-800' : 'bg-green-600 text-black'} font-condiment text-3xl`
                    : `${isLight ? 'text-slate-700 hover:bg-slate-100 hover:text-green-600' : 'text-gray-300 hover:bg-zinc-900 hover:text-green-400'}`
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {/* Resend-Style Micro-Interaction Icon Engine */}
                  <div
                    className={`relative flex items-center justify-center p-3 transition-all duration-300 ease-out group-hover:rounded-xl group-hover:bg-slate-100/60 dark:group-hover:bg-slate-800/40 group-hover:border-slate-200/50 dark:group-hover:border-slate-700/30 group-hover:shadow-[0_4px_12px_rgba(0,0,0,0.03)] ${
                      isActive
                        ? 'rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm'
                        : 'rounded-full bg-transparent border border-transparent'
                    }`}
                  >
                    <Icon
                      size={20}
                      className="transition-transform duration-300 ease-out group-hover:scale-110 group-hover:rotate-3 group-active:scale-95"
                    />
                  </div>
                  {/* Cursive Text label with transition fade constraints */}
                  <span className="opacity-0 pointer-events-none group-hover/sidebar:opacity-100 group-hover/sidebar:pointer-events-auto transition-opacity duration-300 whitespace-nowrap">
                    {item.name}
                  </span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Logout Trigger footer */}
      <div className={`p-4 border-t ${isLight ? 'border-slate-100' : 'border-green-900/30'}`}>
        <button
          onClick={handleLogout}
          className={`group w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${
            isLight ? 'text-red-600 hover:bg-red-50' : 'text-red-400 hover:bg-red-500/10'
          }`}
        >
          <div
            className="relative flex items-center justify-center p-3 rounded-full bg-transparent border border-transparent transition-all duration-300 ease-out group-hover:rounded-xl group-hover:bg-slate-100/60 dark:group-hover:bg-slate-800/40 group-hover:border-slate-200/50 dark:group-hover:border-slate-700/30 group-hover:shadow-[0_4px_12px_rgba(0,0,0,0.03)]"
          >
            <LogOut
              size={20}
              className="transition-transform duration-300 ease-out group-hover:scale-110 group-hover:rotate-3 group-active:scale-95"
            />
          </div>
          <span className="opacity-0 pointer-events-none group-hover/sidebar:opacity-100 group-hover/sidebar:pointer-events-auto transition-opacity duration-300 whitespace-nowrap">
            Logout
          </span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;