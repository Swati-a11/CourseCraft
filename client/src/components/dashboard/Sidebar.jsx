import { useState, useEffect } from 'react';
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
import { NavLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import { useTheme } from '../../context/ThemeContext';
import API from '../../services/api';

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

  useEffect(() => {
    // 1. Initial token check (parsing JWT expiration)
    const checkToken = () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          if (payload.exp && payload.exp * 1000 < Date.now()) {
            console.log("Token expired. Clearing credentials.");
            localStorage.clear();
            dispatch(logout());
            window.location.href = '/login';
          }
        } catch (e) {
          console.error("Invalid token format, clearing credentials.", e);
          localStorage.clear();
          dispatch(logout());
          window.location.href = '/login';
        }
      }
    };

    checkToken();

    // 2. Axios interceptor link for dynamic 401 errors
    const interceptor = API.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          console.log("Axios 401 error intercepted. Clearing credentials.");
          localStorage.clear();
          dispatch(logout());
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );

    return () => {
      API.interceptors.response.eject(interceptor);
    };
  }, [dispatch]);

  // Filter out Achievements for mobile view to prevent layout overflow
  const mobileMenuItems = menuItems.filter(
    (item) => item.name !== 'Achievements'
  );

  return (
    <>
      {/* 1. DESKTOP VIEW SIDEBAR (Hidden on mobile, permanent layout on desktop) */}
      <aside
        className={`hidden md:block md:flex md:flex-col transition-all duration-300 ease-in-out h-screen fixed left-0 top-0 border-r z-50 ${
          isOpen ? 'w-72' : 'w-20'
        } ${
          isLight
            ? 'bg-white text-slate-900 border-slate-200'
            : 'bg-black border-white/10 text-white'
        }`}
      >
        {/* Brand Header */}
        <div className={`flex items-center gap-3 p-4 border-b border-slate-100 dark:border-slate-800 transition-all duration-300 ${isOpen ? 'justify-start px-6' : 'justify-center'} h-20`}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
            aria-expanded={isOpen}
            className="relative flex items-center justify-center p-3 rounded-full transition-all duration-300 ease-out hover:rounded-xl hover:bg-slate-100/60 dark:hover:bg-slate-800/40 hover:border-slate-200/50 cursor-pointer"
          >
            <BookOpen size={24} className={isLight ? 'text-green-600' : 'text-green-400'} />
          </button>
          {isOpen && (
            <div className="flex flex-col items-start transition-opacity duration-300 animate-fadeIn">
              <span className={`text-lg font-bold tracking-tight ${isLight ? 'text-green-600' : 'text-green-400'} leading-none select-none`}>
                CourseCraft
              </span>
              <span className="text-[10px] tracking-wide text-slate-400 font-medium whitespace-nowrap mt-1">
                AI Learning Platform
              </span>
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
                          ? `${isLight ? 'bg-green-100 text-green-800' : 'bg-green-600 text-black'} font-semibold`
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

      {/* 2. MOBILE VIEW NAVIGATION (Horizontal bottom bar dock, hidden on desktop screens) */}
      <div
        className="fixed bottom-0 left-0 right-0 h-16 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex justify-around items-center z-50 px-4 shadow-[0_-4px_12px_rgba(0,0,0,0.05)] md:hidden"
      >
        {mobileMenuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `rounded-full p-2 transition-all duration-300 hover:rounded-xl hover:bg-slate-100 ${
                  isActive
                    ? 'text-green-600 dark:text-green-400 bg-slate-100 dark:bg-slate-800'
                    : 'text-slate-500 dark:text-gray-400'
                }`
              }
            >
              <Icon size={20} />
            </NavLink>
          );
        })}
        {/* Dedicated Mobile Logout button */}
        <button
          onClick={handleLogout}
          className="text-red-500 p-2 rounded-full hover:bg-red-50 transition-all duration-300"
        >
          <LogOut size={20} />
        </button>
      </div>
    </>
  );
};

export default Sidebar;