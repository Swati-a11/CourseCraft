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
  const location = useLocation();
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
            ? 'bg-white text-slate-800 border-r border-slate-100'
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

        {/* Navigation links with Resend-style morphing icon containers */}
        <nav className="flex-1 p-4 space-y-3 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={onClose}
                className="group flex items-center gap-4 py-2 transition-all duration-300"
              >
                {/* Resend-style morphing container */}
                <div
                  className={`p-2.5 transition-all duration-300 ease-out flex items-center justify-center ${
                    isActive
                      ? 'rounded-xl bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400 shadow-sm'
                      : 'rounded-full bg-slate-100/50 dark:bg-slate-800 text-slate-500 dark:text-gray-400 group-hover:rounded-xl group-hover:bg-green-50 dark:group-hover:bg-green-950/40'
                  }`}
                >
                  <Icon size={20} className="transition-transform duration-300 group-hover:scale-110" />
                </div>
                
                {/* Label link text with micro-interactions */}
                <span
                  className={`text-sm font-semibold transition-colors duration-200 ${
                    isActive
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-slate-600 dark:text-gray-400 group-hover:text-green-600 dark:group-hover:text-green-400'
                  }`}
                >
                  {item.name}
                </span>
              </NavLink>
            );
          })}
        </nav>

        {/* Logout Trigger button */}
        <div className={`p-4 border-t ${isLight ? 'border-slate-100' : 'border-green-900/30'}`}>
          <button
            onClick={handleLogout}
            className="group flex items-center gap-4 py-2 w-full transition-all duration-300"
          >
            <div
              className="p-2.5 rounded-full bg-slate-100/50 dark:bg-slate-800 text-red-500 dark:text-red-400 transition-all duration-300 ease-out group-hover:rounded-xl group-hover:bg-red-50 dark:group-hover:bg-red-950/20"
            >
              <LogOut size={20} className="transition-transform duration-300 group-hover:scale-110" />
            </div>
            <span
              className="text-sm font-semibold transition-colors duration-200 text-slate-600 dark:text-gray-400 group-hover:text-red-600 dark:group-hover:text-red-400"
            >
              Logout
            </span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;