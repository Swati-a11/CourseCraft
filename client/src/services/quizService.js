import api from './api';

export const submitQuizResult = async ({ courseId, topicId, topicTitle, answers, score, totalQuestions, percentage, passed }) => {
  const { data } = await api.post('quiz-results', {
    courseId,
    topicId,
    topicTitle,
    answers,
    score,
    totalQuestions,
    percentage,
    passed,
  });
  return data;
};
