import React from 'react';
import { Award, Zap, AlertTriangle, CheckCircle, RefreshCcw, ArrowRight } from 'lucide-react';

const QuizResults = ({ results, onRetry, onNext }) => {
  if (!results) return null;

  const { score, passed, xpGained, newTotalXp, newStreak, weakTopic } = results;

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 max-w-3xl mx-auto shadow-2xl relative overflow-hidden">
      {/* Background glow based on pass/fail */}
      <div className={`absolute top-0 left-0 w-full h-32 blur-3xl opacity-20 pointer-events-none ${passed ? 'bg-green-500' : 'bg-red-500'}`}></div>

      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Status Icon */}
        <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 shadow-lg ${passed ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
          {passed ? <CheckCircle className="w-12 h-12" /> : <AlertTriangle className="w-12 h-12" />}
        </div>

        <h2 className="text-4xl font-extrabold text-white mb-2">
          {passed ? 'Quiz Passed!' : 'Needs Review'}
        </h2>
        <p className="text-zinc-400 text-lg mb-8">
          You scored <span className={`font-bold ${passed ? 'text-green-400' : 'text-red-400'}`}>{Math.round(score)}%</span>
        </p>

        {/* Gamification Stats */}
        <div className="grid grid-cols-2 gap-4 w-full mb-8">
          <div className="bg-zinc-800/50 rounded-2xl p-4 border border-zinc-700 flex flex-col items-center">
            <div className="flex items-center text-blue-400 mb-2">
              <Award className="w-5 h-5 mr-2" />
              <span className="font-semibold uppercase tracking-wider text-xs">XP Gained</span>
            </div>
            <div className="text-2xl font-bold text-white">+{xpGained}</div>
            <div className="text-xs text-zinc-500 mt-1">Total: {newTotalXp} XP</div>
          </div>

          <div className="bg-zinc-800/50 rounded-2xl p-4 border border-zinc-700 flex flex-col items-center">
            <div className="flex items-center text-orange-400 mb-2">
              <Zap className="w-5 h-5 mr-2" />
              <span className="font-semibold uppercase tracking-wider text-xs">Streak</span>
            </div>
            <div className="text-2xl font-bold text-white">{newStreak} Days</div>
            <div className="text-xs text-zinc-500 mt-1">Keep it up!</div>
          </div>
        </div>

        {/* Weak Topic AI Feedback */}
        {weakTopic && (
          <div className="w-full bg-red-950/30 border border-red-900/50 rounded-2xl p-6 text-left mb-8">
            <div className="flex items-center mb-3">
              <AlertTriangle className="w-5 h-5 text-red-400 mr-2" />
              <h4 className="text-red-400 font-bold">AI Learning Insight</h4>
            </div>
            <p className="text-zinc-300 text-sm leading-relaxed">
              {weakTopic.aiFeedback}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-4 w-full justify-center">
          {!passed && (
            <button
              onClick={onRetry}
              className="flex items-center px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl font-semibold transition border border-zinc-700"
            >
              <RefreshCcw className="w-5 h-5 mr-2" />
              Retry Quiz
            </button>
          )}
          {passed && (
            <button
              onClick={onNext}
              className="flex items-center px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-bold transition shadow-[0_0_20px_rgba(79,70,229,0.3)] transform hover:-translate-y-1"
            >
              Next Topic
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizResults;
