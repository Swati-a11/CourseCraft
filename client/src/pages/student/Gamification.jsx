import DashboardLayout from '../../layouts/DashboardLayout';

const Gamification = () => {
  const badges = [
    '🏅 First Step',
    '🧠 Quiz Master',
    '🔥 Consistency Champion',
    '🏆 Course Finisher',
  ];

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold text-white mb-6">
        Gamification Dashboard
      </h1>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-zinc-900 border border-green-900/30 rounded-2xl p-6">
          <h2 className="text-gray-400 mb-2">Current Streak</h2>
          <p className="text-4xl font-bold text-green-400">6 Days 🔥</p>
        </div>

        <div className="bg-zinc-900 border border-green-900/30 rounded-2xl p-6">
          <h2 className="text-gray-400 mb-2">Total Points</h2>
          <p className="text-4xl font-bold text-yellow-400">450 XP</p>
        </div>
      </div>

      {/* Badges */}
      <div className="bg-zinc-900 border border-green-900/30 rounded-2xl p-6">
        <h2 className="text-2xl font-bold text-white mb-4">
          Earned Badges
        </h2>

        <div className="grid sm:grid-cols-2 gap-4">
          {badges.map((badge, index) => (
            <div
              key={index}
              className="bg-black border border-green-900/20 rounded-xl p-4 text-green-400 font-semibold"
            >
              {badge}
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Gamification;