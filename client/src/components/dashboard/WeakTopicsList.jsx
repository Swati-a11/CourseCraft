import React from 'react';
import { AlertCircle, Target, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const WeakTopicsList = ({ weakTopics }) => {
  const navigate = useNavigate();

  if (!weakTopics || weakTopics.length === 0) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center">
        <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Target className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">You're doing great!</h3>
        <p className="text-zinc-400">No weak topics identified yet. Keep up the good work!</p>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
      <div className="flex items-center mb-6">
        <AlertCircle className="w-6 h-6 text-orange-500 mr-3" />
        <h2 className="text-xl font-bold text-white">Areas for Improvement</h2>
      </div>

      <div className="space-y-4">
        {weakTopics.map((topic) => (
          <div key={topic._id} className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-5 relative overflow-hidden">
            {/* Status indicator line */}
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${topic.status === 'Needs Review' ? 'bg-red-500' : topic.status === 'Improving' ? 'bg-orange-500' : 'bg-green-500'}`}></div>
            
            <div className="flex justify-between items-start mb-3 pl-2">
              <div>
                <h4 className="font-bold text-white text-lg">{topic.topicTitle}</h4>
                <div className="flex items-center mt-1">
                  <span className="text-xs font-semibold px-2 py-1 bg-zinc-700 text-zinc-300 rounded-md mr-2">
                    Score: {Math.round(topic.averageScore)}%
                  </span>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-md ${
                    topic.status === 'Needs Review' ? 'bg-red-500/20 text-red-400' : 
                    topic.status === 'Improving' ? 'bg-orange-500/20 text-orange-400' : 
                    'bg-green-500/20 text-green-400'
                  }`}>
                    {topic.status}
                  </span>
                </div>
              </div>
              <button 
                onClick={() => navigate(`/course/${topic.course}`)}
                className="text-zinc-400 hover:text-white bg-zinc-800 p-2 rounded-lg transition"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {topic.aiFeedback && (
              <div className="pl-2 mt-4 pt-4 border-t border-zinc-700">
                <p className="text-sm text-zinc-400 leading-relaxed italic">
                  "{topic.aiFeedback}"
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeakTopicsList;
