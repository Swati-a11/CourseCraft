import api from './api';

// ======================
// COURSES
// ======================

// Get all courses
export const getAllCourses = (params = {}) => {
  return api.get('/api/courses', { params });
};

// Get single course
export const getCourseById = (courseId) => {
  return api.get(`/api/courses/${courseId}`);
};

// Create course manually
export const createCourse = (courseData) => {
  return api.post('/api/courses', courseData);
};

// Update course
export const updateCourse = (courseId, courseData) => {
  return api.put(`/api/courses/${courseId}`, courseData);
};

// Delete course
export const deleteCourse = (courseId) => {
  return api.delete(`/api/courses/${courseId}`);
};

// Search courses
export const searchCourses = (searchTerm, filters = {}) => {
  return api.get('/api/courses', {
    params: {
      search: searchTerm,
      ...filters,
    },
  });
};

// ======================
// QUIZZES
// ======================

export const getQuizzesByDifficulty = (courseId, params = {}) => {
  return api.get(`/api/courses/${courseId}/quiz`, { params });
};

// ======================
// AI COURSE GENERATION
// ======================

export const generateCourse = (topic) => {
  return api.post(
    '/api/courses/generate',
    { topic }
  );
};

// ======================
// ENROLLMENT
// ======================

export const enrollInCourse = (courseId) => {
  return api.post('api/enrollments/enroll', { courseId });
};