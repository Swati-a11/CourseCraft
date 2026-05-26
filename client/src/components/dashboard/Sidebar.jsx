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
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    window.location.href = '/';
  };
  return (
    <aside className="w-72 bg-zinc-950 border-r border-green-900/30 flex flex-col">
      <div className="p-6 border-b border-green-900/30">
        <h1 className="text-3xl font-bold text-green-400">CourseCraft</h1>
        <p className="text-sm text-gray-400 mt-1">AI Learning Platform</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-green-600 text-black font-semibold'
                    : 'text-gray-300 hover:bg-zinc-900 hover:text-green-400'
                }`
              }
            >
              <Icon size={20} />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t border-green-900/30">
        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition">
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;