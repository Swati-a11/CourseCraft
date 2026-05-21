import { Bell, Search, UserCircle } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);

  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      const q = query.trim();
      navigate(`/browse-courses${q ? `?q=${encodeURIComponent(q)}` : ''}`);
    }
  };

  return (
    <header className="h-20 bg-zinc-950 border-b border-green-900/30 px-6 flex items-center justify-between">
      
      {/* Search */}
      <div className="relative w-96 max-w-full">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          type="text"
          placeholder="Search courses..."
          className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-green-900/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/50"
        />
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        
        {/* Notification */}
        <button className="relative p-2 rounded-full hover:bg-zinc-900 transition">
          <Bell className="text-gray-300" size={22} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-green-400 rounded-full" />
        </button>

        {/* User */}
        <div className="flex items-center gap-3 bg-zinc-900 px-3 py-2 rounded-xl">
          <UserCircle className="text-green-400" size={30} />
          
          <div>
            <p className="text-sm font-medium text-white">
              {user?.name || "Student"}
            </p>
            <p className="text-xs text-gray-400">Student</p>
          </div>
        </div>

      </div>
    </header>
  );
};

export default Navbar;