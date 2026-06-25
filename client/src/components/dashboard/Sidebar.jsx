import { useState } from 'react';
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

const Sidebar = ({ isOpen, setIsOpen }) => {
  const dispatch = useDispatch();
  const { isLight } = useTheme();

  const handleLogout = () => {
    dispatch(logout());
    window.location.href = '/';
  };

  return (
    <>
      {/* 1. DESKTOP VIEW SIDEBAR (Hidden on mobile, permanent layout on desktop) */}
      <aside
        className={`hidden md:flex transition-all duration-300 ease-in-out h-screen fixed left-0 top-0 border-r z-50 ${
          isOpen ? 'w-64' : 'w-20'
        } ${
          isLight
            ? 'bg-white text-slate-900 border-slate-200'
            : 'bg-zinc-950 border-green-900/30 text-white'
        } flex-col`}
      >
        {/* Brand Header */}
        <div className={`p-4 border-b ${isLight ? 'border-slate-100' : 'border-green-900/30'} h-20 flex items-center justify-center`}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="relative flex items-center justify-center p-3 rounded-full transition-all duration-300 ease-out hover:rounded-xl hover:bg-slate-100/60 dark:hover:bg-slate-800/40 hover:border-slate-200/50 cursor-pointer"
          >
            <BookOpen size={24} className={isLight ? 'text-green-600' : 'text-green-400'} />
          </button>
          {isOpen && (
            <div className="ml-3 transition-opacity duration-300 overflow-hidden">
              <h1 className={`text-3xl font-condiment ${isLight ? 'text-green-600' : 'text-green-400'} whitespace-nowrap`}>
                CourseCraft
              </h1>
              <p className={`text-xs font-cabin font-extrabold mt-0.5 ${isLight ? 'text-slate-500' : 'text-gray-400'} whitespace-nowrap`}>
                AI Learning Platform
              </p>
            </div>
          )}
        </div>

        {/* Conditional Rendering for Navigation and Logout */}
        {isOpen && (
          <>
            {/* Navigation Links */}
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
                        {/* Resend-style squircle icon morphing wrapper */}
                        <div
                          className={`p-2 bg-transparent transition-all duration-300 ease-out hover:rounded-xl hover:bg-slate-100/50 dark:hover:bg-slate-800/50 ${
                            isActive ? 'rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm' : 'rounded-full'
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
          </>
        )}
      </aside>

      {/* 2. MOBILE VIEW NAVIGATION (Horizontal bottom bar, hidden on desktop screens) */}
      <div
        className={`fixed bottom-0 left-0 right-0 h-16 border-t flex justify-around items-center z-50 px-2 md:hidden transition-colors ${
          isLight ? 'bg-white border-slate-200' : 'bg-zinc-900 border-green-900/30 text-white'
        }`}
      >
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `p-1 transition-all duration-300 ${
                  isActive
                    ? (isLight ? 'text-green-600' : 'text-green-400')
                    : (isLight ? 'text-slate-500 hover:text-slate-800' : 'text-gray-400 hover:text-white')
                }`
              }
            >
              {({ isActive }) => (
                <div
                  className={`p-2 transition-all duration-300 ease-out hover:rounded-xl hover:bg-slate-100/50 dark:hover:bg-slate-800/50 ${
                    isActive ? 'rounded-xl bg-slate-100/50 dark:bg-slate-800/50' : 'rounded-full'
                  }`}
                >
                  <Icon size={20} />
                </div>
              )}
            </NavLink>
          );
        })}
        {/* Dedicated exposed Logout button option for Mobile Bottom Bar */}
        <button
          onClick={handleLogout}
          className="p-1 transition-all duration-300 text-red-500 hover:text-red-600"
        >
          <div className="p-2 transition-all duration-300 ease-out hover:rounded-xl hover:bg-red-50 dark:hover:bg-red-950/20 rounded-full">
            <LogOut size={20} />
          </div>
        </button>
      </div>
    </>
  );
};

export default Sidebar;