import { useState, useEffect } from 'react';
import Sidebar from '../components/dashboard/Sidebar';
import Navbar from '../components/dashboard/Navbar';
import { useTheme } from '../context/ThemeContext';
import api from '../services/api';

const DashboardLayout = ({ children }) => {
  const { isLight } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchActiveUserData = async () => {
      const token = localStorage.getItem('token');
      // Guard Clause: Prevent request from firing until token is valid & context loaded
      if (!token || token === 'undefined') {
        return;
      }
      try {
        // Fetch active user/dashboard metrics
        await api.get('/dashboard/stats');
      } catch (error) {
        // Graceful Catch & Render Fallback: Log exact requested path but do NOT freeze UI
        if (error.response && (error.response.status === 404 || error.response.status === 401)) {
          console.error(`Layout API Fetch Error. Config URL: ${error.config?.url || 'unknown'}`);
        } else {
          console.error(`Layout API Fetch Error: ${error.message}`);
        }
      }
    };

    fetchActiveUserData();
  }, []);

  return (
    <div className={`min-h-screen flex transition-colors duration-300 ${
      isLight ? 'bg-slate-50 text-slate-900' : 'bg-black text-white'
    }`}>
      {/* Permanent Sidebar (manages both desktop sidebar and mobile horizontal bottom-bar layout details) */}
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      {/* Main Workspace Column - padded on bottom on mobile to prevent navbar overlapping */}
      <div className={`flex-1 flex flex-col transition-all duration-300 min-w-0 pb-16 md:pb-0 pl-0 ${
        isOpen ? 'md:pl-64' : 'md:pl-20'
      }`}>
        <Navbar />

        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;