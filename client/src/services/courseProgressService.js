import api from './api';

// ======================
// COURSE PROGRESS
// ======================

// Get progress for a specific course
export const getCourseProgress = (courseId) => {
  return api.get(`/course-progress/${courseId}`);
};

// Get all courses progress
export const getAllCoursesProgress = () => {
  return api.get('/course-progress/all');
};

// Update topic progress
export const updateTopicProgress = (courseId, topicData) => {
  return api.post(`/course-progress/${courseId}/topic`, topicData);
};

// Update overall course progress
export const updateCourseProgress = (courseId, progressData) => {
  return api.put(`/course-progress/${courseId}`, progressData);
};

// ======================
// UTILITY (OK AS IS)
// ======================

export const calculateCompletionPercentage = (progress) => {
  if (!progress || !progress.completedTopics) return 0;

  const totalTopics = progress.completedTopics.length;
  if (totalTopics === 0) return 0;

  const completedCount = progress.completedTopics.filter(
    (tp) => tp.notesCompleted && tp.videoCompleted && tp.quizPassed
  ).length;

  return Math.round((completedCount / totalTopics) * 100);
};