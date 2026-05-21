const StatCard = ({ title, value, subtitle }) => {
  return (
    <div className="bg-zinc-900 border border-green-900/30 rounded-2xl p-6 shadow-lg">
      <p className="text-gray-400 text-sm">{title}</p>
      <h3 className="text-3xl font-bold text-green-400 mt-2">{value}</h3>
      {subtitle && <p className="text-xs text-gray-500 mt-2">{subtitle}</p>}
    </div>
  );
};

export default StatCard;