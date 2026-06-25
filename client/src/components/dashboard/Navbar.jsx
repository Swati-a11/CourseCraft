import { Bell, Search, UserCircle } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);

  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const { isLight } = useTheme();

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
        <button className={`relative p-2 rounded-full transition ${isLight ? 'hover:bg-slate-100' : 'hover:bg-zinc-900'}`}>
          <Bell className={isLight ? 'text-slate-700' : 'text-gray-300'} size={22} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-green-400 rounded-full" />
        </button>

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