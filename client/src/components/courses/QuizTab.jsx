import { useState } from 'react';

const QuizTab = ({ topicId, topicTitle, questions = [], onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [finished, setFinished] = useState(false);
  const [quizPassed, setQuizPassed] = useState(false);

  if (!questions || questions.length === 0) {
    return (
      <div className="text-center py-10 text-gray-400">
        No quiz questions available for this topic.
      </div>
    );
  }

  const question = questions[currentIndex];
  const totalQuestions = questions.length;

  const handleSubmit = () => {
    if (!selected) return;

    const correct = selected === question.answer;
    const nextScore = score + (correct ? 1 : 0);
    const nextAnswers = [
      ...answers,
      {
        question: question.question || question.text, // Handle DB "question" field vs old "text"
        selectedAnswer: selected,
        correctAnswer: question.answer,
        isCorrect: correct,
      },
    ];

    setScore(nextScore);
    setAnswers(nextAnswers);
    setSubmitted(true);

    if (currentIndex === totalQuestions - 1) {
      const percentage = Math.round((nextScore / totalQuestions) * 100);
      const passed = percentage >= 60;
      setQuizPassed(passed);
      setFinished(true);
      onComplete({
        topicId,
        topicTitle: topicTitle || `Topic ${topicId}`,
        answers: nextAnswers,
        score: nextScore,
        totalQuestions,
        percentage,
        passed,
      });
    }
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelected('');
      setSubmitted(false);
    }
  };

  const currentProgress = Math.round(((currentIndex + (submitted ? 1 : 0)) / totalQuestions) * 100);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Quiz</h2>
          <p className="text-sm text-gray-400 mt-1">
            Question {currentIndex + 1} of {totalQuestions}
          </p>
        </div>
        <div className="text-sm text-gray-400">Progress: {currentProgress}%</div>
      </div>

      <div className="mb-6 rounded-2xl bg-zinc-900 p-5 border border-white/10">
        <p className="text-gray-300 text-lg">{question.question || question.text}</p>
      </div>

      <div className="grid gap-3 mb-6">
        {question.options?.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setSelected(option)}
            className={`w-full text-left px-4 py-4 rounded-2xl border transition ${
              selected === option
                ? 'bg-azure-600 text-[var(--cc-action-ink)] border-azure-500'
                : 'bg-zinc-800 text-white border-zinc-700'
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      {!finished ? (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            onClick={handleSubmit}
            disabled={submitted || !selected}
            className="bg-azure-600 hover:bg-azure-700 disabled:opacity-50 text-[var(--cc-action-ink)] px-6 py-3 rounded-xl font-semibold transition"
          >
            {currentIndex === totalQuestions - 1 ? 'Finish Quiz' : 'Submit Answer'}
          </button>

          {submitted && currentIndex < totalQuestions - 1 && (
            <button
              onClick={handleNext}
              className="border border-azure-500 text-azure-300 hover:bg-azure-500/10 px-6 py-3 rounded-xl font-semibold transition"
            >
              Next Question
            </button>
          )}
        </div>
      ) : (
        <div className="rounded-2xl border border-white/10 bg-zinc-900 p-6">
          <p className="text-lg text-gray-400 mb-3">Quiz complete.</p>
          <p className="text-3xl font-semibold text-white">Score: {score}/{totalQuestions}</p>
          <p className="text-xl mt-2 text-azure-400">{quizPassed ? 'Quiz Passed' : 'Quiz Needs Revision'}</p>
          <p className="text-sm text-gray-400 mt-1">
            Your final score is {Math.round((score / totalQuestions) * 100)}%.
          </p>
        </div>
      )}
    </div>
  );
};

export default QuizTab;
