import Sidebar from '../components/dashboard/Sidebar';
import Navbar from '../components/dashboard/Navbar';
import { useTheme } from '../context/ThemeContext';

const DashboardLayout = ({ children }) => {
  const { isLight } = useTheme();

  return (
    <div className={`min-h-screen flex transition-colors duration-300 ${
      isLight ? 'bg-slate-50 text-slate-900' : 'bg-black text-white'
    }`}>
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Navbar />

        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;