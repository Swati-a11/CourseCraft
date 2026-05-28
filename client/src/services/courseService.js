import api from './api';

// ======================
// COURSES
// ======================

// Get all courses
export const getAllCourses = (params = {}) => {
  return api.get('/courses', { params });
};

// Get single course
export const getCourseById = (courseId) => {
  return api.get(`/courses/${courseId}`);
};

// Create course manually
export const createCourse = (courseData) => {
  return api.post('/courses', courseData);
};

// Update course
export const updateCourse = (courseId, courseData) => {
  return api.put(`/courses/${courseId}`, courseData);
};

// Delete course
export const deleteCourse = (courseId) => {
  return api.delete(`/courses/${courseId}`);
};

// Search courses
export const searchCourses = (searchTerm, filters = {}) => {
  return api.get('/courses', {
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
  return api.get(`/courses/${courseId}/quiz`, { params });
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
  return api.post('/enrollments/enroll', { courseId });
};