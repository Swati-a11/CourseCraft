const WeakTopicCard = ({ topic, averageScore, difficulty, recommendation, course }) => {
  const difficultyStyles = {
    Weak: 'bg-red-500/10 text-red-300 border-red-500/30',
    Moderate: 'bg-yellow-500/10 text-yellow-300 border-yellow-500/30',
    Strong: 'bg-sky-500/10 text-sky-300 border-sky-500/30',
  };

  return (
    <div
      className={`border rounded-3xl p-5 shadow-xl backdrop-blur-xl bg-white/5 border-white/10 ${
        difficultyStyles[difficulty] || difficultyStyles.Moderate
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm text-gray-400">{course || 'Course Topic'}</p>
          <h3 className="text-xl font-semibold text-white">{topic}</h3>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-[0.15em]">
          {difficulty}
        </span>
      </div>

      <div className="flex items-center justify-between gap-4 mb-4">
        <div>
          <p className="text-gray-400 text-sm">Avg. Score</p>
          <p className="text-3xl font-bold text-white">{averageScore}%</p>
        </div>
        <div className="px-3 py-2 rounded-2xl bg-zinc-950/70 text-gray-300 text-sm">
          {recommendation}
        </div>
      </div>

      <div className="h-2 bg-white/10 rounded-full overflow-hidden mt-3">
        <div
          className={`h-full rounded-full ${
            difficulty === 'Weak'
              ? 'bg-red-500'
              : difficulty === 'Moderate'
              ? 'bg-yellow-400'
              : 'bg-sky-400'
          }`}
          style={{ width: `${Math.max(10, averageScore)}%` }}
        />
      </div>
    </div>
  );
};

export default WeakTopicCard;
