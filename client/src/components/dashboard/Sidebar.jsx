import {
  LayoutDashboard,
  BookOpen,
  Brain,
  BarChart3,
  Award,
  Settings,
  LogOut,
  Wand2,
  X,
} from 'lucide-react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
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

const Sidebar = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLight } = useTheme();

  const handleLogout = () => {
    dispatch(logout());
    window.location.href = '/';
  };

  return (
    <>
      {/* Mobile Drawer backdrop overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-all duration-300"
        />
      )}

      {/* Sidebar main body */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 flex flex-col transition-all duration-300 transform lg:translate-x-0 lg:static ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } ${
          isLight
            ? 'bg-white text-slate-900 border-r border-slate-200'
            : 'bg-zinc-950 border-r border-green-900/30 text-white'
        }`}
      >
        {/* Sidebar Header */}
        <div className={`p-6 border-b flex items-center justify-between ${
          isLight ? 'border-slate-100' : 'border-green-900/30'
        }`}>
          <div>
            <h1 className={`text-3xl font-condiment ${isLight ? 'text-green-600' : 'text-green-400'}`}>
              CourseCraft
            </h1>
            <p className={`text-sm font-cabin font-extrabold mt-1 ${
              isLight ? 'text-slate-500' : 'text-gray-400'
            }`}>
              AI Learning Platform
            </p>
          </div>
          {/* Close button for mobile drawer */}
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg lg:hidden transition ${
              isLight ? 'hover:bg-slate-100 text-slate-600' : 'hover:bg-zinc-900 text-gray-400'
            }`}
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? `${isLight ? 'bg-green-100 text-green-800' : 'bg-green-600 text-black'} font-condiment text-3xl`
                      : `${isLight ? 'text-slate-700 hover:bg-slate-100 hover:text-green-600' : 'text-gray-300 hover:bg-zinc-900 hover:text-green-400'}`
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {/* Resend-style squircle icon morphing wrapper */}
                    <div
                      className={`p-2 bg-transparent transition-all duration-300 ease-out hover:rounded-xl hover:bg-slate-100/50 dark:hover:bg-slate-800/50 ${
                        isActive ? 'rounded-xl' : 'rounded-full'
                      }`}
                    >
                      <Icon size={20} />
                    </div>
                    <span>{item.name}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Sidebar Footer / Logout */}
        <div className={`p-4 border-t ${isLight ? 'border-slate-100' : 'border-green-900/30'}`}>
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${
              isLight ? 'text-red-600 hover:bg-red-50' : 'text-red-400 hover:bg-red-500/10'
            }`}
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;