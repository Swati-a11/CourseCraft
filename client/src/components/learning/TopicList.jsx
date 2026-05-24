import React from 'react';
import { CheckCircle, PlayCircle, Lock } from 'lucide-react';

const TopicList = ({ topics, progress, activeIndex, onSelect }) => {
  if (!topics) return null;

  return (
    <div className="flex flex-col py-4">
      {topics.map((topic, index) => {
        const topicProgress = progress?.completedTopics?.find(t => t.topicIndex === index);
        const isCompleted = topicProgress?.quizPassed;
        const isActive = index === activeIndex;
        // Basic locking: Can only access if it's the first topic OR the previous topic is completed
        // Wait, for simplicity, let's just leave it unlocked or locked based on index
        const prevCompleted = index === 0 || progress?.completedTopics?.find(t => t.topicIndex === index - 1)?.quizPassed;
        const isLocked = !prevCompleted && index !== 0;

        return (
          <button
            key={index}
            onClick={() => !isLocked && onSelect(index)}
            disabled={isLocked}
            className={`
              relative flex items-center p-4 text-left border-l-4 transition-all duration-300
              ${isActive ? 'bg-zinc-800/50 border-green-500' : 'border-transparent hover:bg-zinc-800/30'}
              ${isLocked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            <div className="mr-4 flex-shrink-0">
              {isCompleted ? (
                <CheckCircle className="w-6 h-6 text-green-500" />
              ) : isLocked ? (
                <Lock className="w-6 h-6 text-zinc-600" />
              ) : (
                <PlayCircle className={`w-6 h-6 ${isActive ? 'text-green-400' : 'text-zinc-400'}`} />
              )}
            </div>
            
            <div className="flex-1 overflow-hidden">
              <p className={`text-xs font-semibold uppercase tracking-wider mb-1 ${isActive ? 'text-green-400' : 'text-zinc-500'}`}>
                Topic {index + 1}
              </p>
              <h4 className={`text-sm font-medium truncate ${isActive ? 'text-white' : 'text-zinc-300'}`}>
                {topic.title}
              </h4>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default TopicList;
