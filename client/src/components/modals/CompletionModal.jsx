import { X, Star, BookOpen, Zap, Trophy } from 'lucide-react';

const CompletionModal = ({ isOpen, onClose, completionType, data, onStartRecommended }) => {
  if (!isOpen) return null;

  const recommendations = {
    topic: [
      { title: 'Practice with Exercises', desc: 'Solve related problems to master this topic', icon: Zap },
      { title: 'Take the Quiz', desc: 'Test your knowledge with our curated quiz', icon: Trophy },
      { title: 'Related Topics', desc: 'Explore connected concepts for deeper learning', icon: BookOpen },
    ],
    course: [
      { title: 'Related Course', desc: 'Expand your skills with the next level course', icon: Star },
      { title: 'Certifications', desc: 'Get certified in this field', icon: Trophy },
      { title: 'Project Challenge', desc: 'Apply what you learned in a real project', icon: Zap },
    ],
  };

  const items = recommendations[completionType] || recommendations.topic;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="rounded-4xl bg-gradient-to-br from-emerald-900/40 via-zinc-950/95 to-cyan-900/40 border border-emerald-500/40 p-8 shadow-2xl max-w-md w-full mx-4 max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-white">🎉 Awesome!</h2>
            <p className="text-gray-400 mt-2">
              {completionType === 'topic'
                ? 'You completed a topic successfully!'
                : 'You completed a course! 🏆'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition"
          >
            <X size={24} className="text-gray-400" />
          </button>
        </div>

        {/* Completion Info */}
        {data && (
          <div className="rounded-2xl bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/30 p-4 mb-6">
            <p className="text-sm text-gray-400">Completed</p>
            <p className="text-xl font-bold text-emerald-300 mt-1">{data.title || 'Learning Unit'}</p>
            {data.time && (
              <p className="text-xs text-gray-500 mt-2">⏱️ {data.time}</p>
            )}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="rounded-xl bg-white/5 border border-white/10 p-3 text-center">
            <p className="text-2xl font-bold text-green-400">+{completionType === 'topic' ? '50' : '500'}</p>
            <p className="text-xs text-gray-400 mt-1">XP Earned</p>
          </div>
          <div className="rounded-xl bg-white/5 border border-white/10 p-3 text-center">
            <p className="text-2xl font-bold text-yellow-400">+1</p>
            <p className="text-xs text-gray-400 mt-1">Badge</p>
          </div>
          <div className="rounded-xl bg-white/5 border border-white/10 p-3 text-center">
            <p className="text-2xl font-bold text-cyan-400">🔥</p>
            <p className="text-xs text-gray-400 mt-1">Streak</p>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent my-6"></div>

        {/* Next Steps */}
        <p className="text-sm font-semibold text-white mb-4">What's Next?</p>
        <div className="space-y-3 mb-6">
          {items.map((item, idx) => {
            const Icon = item.icon;
            return (
              <button
                key={idx}
                onClick={() => {
                  onStartRecommended?.(item.title);
                  onClose();
                }}
                className="w-full rounded-2xl bg-gradient-to-r from-white/5 to-white/0 border border-white/10 hover:border-emerald-500/50 hover:bg-gradient-to-r hover:from-emerald-500/10 hover:to-emerald-500/5 p-4 text-left transition-all hover:scale-105"
              >
                <div className="flex items-center gap-3">
                  <Icon className="text-emerald-400" size={20} />
                  <div>
                    <p className="font-semibold text-white">{item.title}</p>
                    <p className="text-xs text-gray-400">{item.desc}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* CTA */}
        <button
          onClick={onClose}
          className="w-full px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold hover:shadow-lg hover:shadow-emerald-500/50 transition-all"
        >
          Continue Learning
        </button>
      </div>
    </div>
  );
};

export default CompletionModal;
