import React, { useState } from 'react';

const QuizEngine = ({ topic, onSubmit, onCancel }) => {
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState(new Array(topic.quiz.length).fill(null));

  if (!topic || !topic.quiz || topic.quiz.length === 0) {
    return <div className="text-zinc-400">No quiz available for this topic.</div>;
  }

  const question = topic.quiz[currentQuestionIdx];

  const handleOptionSelect = (option) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIdx] = option;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIdx < topic.quiz.length - 1) {
      setCurrentQuestionIdx(currentQuestionIdx + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIdx > 0) {
      setCurrentQuestionIdx(currentQuestionIdx - 1);
    }
  };

  const handleSubmit = () => {
    onSubmit(selectedAnswers);
  };

  const isLastQuestion = currentQuestionIdx === topic.quiz.length - 1;
  const progress = ((currentQuestionIdx + 1) / topic.quiz.length) * 100;

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-bold text-white">Topic Quiz</h3>
        <button onClick={onCancel} className="text-zinc-500 hover:text-white transition">Cancel</button>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-xs text-zinc-400 mb-2">
          <span>Question {currentQuestionIdx + 1} of {topic.quiz.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
          <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      {/* Question */}
      <div className="mb-8">
        <h4 className="text-2xl font-medium text-white mb-6 leading-tight">{question.question}</h4>
        <div className="space-y-3">
          {question.options.map((option, idx) => {
            const isSelected = selectedAnswers[currentQuestionIdx] === option;
            return (
              <button
                key={idx}
                onClick={() => handleOptionSelect(option)}
                className={`w-full text-left p-4 rounded-xl border transition-all duration-200 ${
                  isSelected 
                    ? 'bg-blue-500/10 border-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.2)]' 
                    : 'bg-zinc-800/50 border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:border-zinc-600'
                }`}
              >
                <div className="flex items-center">
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-4 ${isSelected ? 'border-blue-500' : 'border-zinc-600'}`}>
                    {isSelected && <div className="w-2.5 h-2.5 bg-blue-500 rounded-full"></div>}
                  </div>
                  <span className="text-lg">{option}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between pt-6 border-t border-zinc-800">
        <button
          onClick={handlePrev}
          disabled={currentQuestionIdx === 0}
          className="px-6 py-2.5 rounded-xl font-medium text-zinc-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition"
        >
          Previous
        </button>
        
        {isLastQuestion ? (
          <button
            onClick={handleSubmit}
            disabled={selectedAnswers[currentQuestionIdx] === null}
            className="px-8 py-2.5 bg-gradient-to-r from-azure-500 to-azure-600 hover:from-azure-400 hover:to-sky-400 text-[var(--cc-action-ink)] rounded-xl font-bold transition disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(83,166,245,0.3)]"
          >
            Submit Quiz
          </button>
        ) : (
          <button
            onClick={handleNext}
            disabled={selectedAnswers[currentQuestionIdx] === null}
            className="px-8 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(37,99,235,0.3)]"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizEngine;
