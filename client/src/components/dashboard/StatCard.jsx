import { useTheme } from '../../context/ThemeContext';

const StatCard = ({ title, value, subtitle }) => {
  const { isLight } = useTheme();
  return (
    <div className={`border rounded-2xl p-6 shadow-lg transition-all duration-300 ${
      isLight ? 'bg-white border-slate-200' : 'bg-zinc-900 border-green-900/30'
    }`}>
      <p className={`text-sm transition-colors ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>{title}</p>
      <h3 className={`text-3xl font-bold mt-2 transition-colors ${isLight ? 'text-slate-900' : 'text-green-400'}`}>{value}</h3>
      {subtitle && <p className={`text-xs mt-2 transition-colors ${isLight ? 'text-slate-400' : 'text-gray-500'}`}>{subtitle}</p>}
    </div>
  );
};

export default StatCard;