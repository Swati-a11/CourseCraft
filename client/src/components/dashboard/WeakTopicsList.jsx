import React from 'react';
import { AlertCircle, Target, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

const WeakTopicsList = ({ weakTopics }) => {
  const navigate = useNavigate();
  const { isLight } = useTheme();

  if (!weakTopics || weakTopics.length === 0) {
    return (
      <div className={`border rounded-2xl p-8 text-center transition-colors duration-300 ${
        isLight ? 'bg-white border-azure-500/10' : 'bg-zinc-900 border-zinc-800'
      }`}>
        <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
          isLight ? 'bg-azure-100 text-azure-600' : 'bg-azure-500/10 text-azure-500'
        }`}>
          <Target className="w-8 h-8" />
        </div>
        <h3 className={`text-xl font-bold mb-2 ${isLight ? 'text-slate-950' : 'text-white'}`}>You're doing great!</h3>
        <p className={isLight ? 'text-slate-950 font-medium' : 'text-zinc-400'}>No weak topics identified yet! Take a quiz to analyze your performance.</p>
      </div>
    );
  }

  return (
    <div className={`border rounded-2xl p-6 transition-all duration-300 ${
      isLight ? 'bg-white border-azure-500/10' : 'bg-zinc-900 border-zinc-800'
    }`}>
      <div className="flex items-center mb-6">
        <AlertCircle className={`w-6 h-6 mr-3 ${isLight ? 'text-azure-600' : 'text-orange-500'}`} />
        <h2 className={`text-xl font-bold ${isLight ? 'text-slate-950' : 'text-white'}`}>Areas for Improvement</h2>
      </div>

      <div className="space-y-4">
        {weakTopics.map((topic) => {
          const score = Math.round(topic.averageScore);
          const isMastered = score >= 70;
          const statusText = isMastered ? 'Mastered' : 'Needs Review';

          return (
            <div 
              key={topic._id} 
              className={`border rounded-xl p-5 relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] ${
                isLight 
                  ? 'bg-white border-azure-500/10 hover:border-azure-500/30 hover:shadow-[0_0_20px_rgba(83,166,245,0.08)]'
                  : 'bg-zinc-800/50 border border-zinc-700'
              }`}
            >
              {/* Status indicator line */}
              <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                statusText === 'Needs Review' ? 'bg-red-500' : 'bg-azure-500'
              }`}></div>
              
              <div className="flex justify-between items-start mb-3 pl-2">
                <div>
                  <h4 className={`font-bold text-lg ${isLight ? 'text-slate-950' : 'text-white'}`}>
                    {topic.topicTitle}
                  </h4>
                  <div className="flex items-center mt-2 gap-2">
                    <span className={`text-xs font-bold px-2 py-1 rounded-md border ${
                      isLight 
                        ? 'bg-slate-100 border-slate-200 text-slate-950 font-bold' 
                        : 'bg-zinc-700 border-transparent text-zinc-300'
                    }`}>
                      Score: {score}%
                    </span>
                    <span className={`text-xs font-bold px-2 py-1 rounded-md border ${
                      isLight 
                        ? (statusText === 'Needs Review' 
                            ? 'bg-red-50 text-red-700 border-red-200 font-bold' 
                            : 'bg-azure-50 text-azure-700 border-azure-200 font-bold')
                        : (statusText === 'Needs Review' 
                            ? 'bg-red-500/20 text-red-400 border-transparent' 
                            : 'bg-azure-500/20 text-azure-400 border-transparent')
                    }`}>
                      {statusText}
                    </span>
                  </div>
                </div>
                <button 
                  onClick={() => navigate(`/course/${topic.course}`)}
                  className={`group p-2 rounded-lg transition-all ${
                    isLight 
                      ? 'text-azure-600 hover:text-azure-700 bg-azure-50 hover:bg-azure-100'
                      : 'text-zinc-400 hover:text-white bg-zinc-800'
                  }`}
                >
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {topic.aiFeedback && (
                <div className={`pl-2 mt-4 pt-4 border-t ${isLight ? 'border-azure-500/10' : 'border-zinc-700'}`}>
                  <p className={`text-sm leading-relaxed italic ${isLight ? 'text-slate-900/80 font-medium' : 'text-zinc-400'}`}>
                    "{topic.aiFeedback}"
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeakTopicsList;
