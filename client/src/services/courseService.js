// client/src/services/courseService.js

import api from './api';

// Get all courses
export const getAllCourses = (params = {}) => {
  return api.get('/courses', { params });
};

// Get single course
export const getCourseById = (courseId) => {
  return api.get(`/courses/${courseId}`);
};

// Get quizzes by difficulty
export const getQuizzesByDifficulty = (courseId, params = {}) => {
  return api.get(`/courses/${courseId}/quiz`, { params });
};

// Enroll in a course
export const enrollInCourse = (courseId) => {
  return api.post('/enrollments/enroll', { courseId });
};

// Create course manually
export const createCourse = (courseData) => {
  return api.post('/courses', courseData);
};

// Generate AI course
export const generateCourse = (topic) => {
  const token = localStorage.getItem('token');

  return api.post(
    '/courses/generate',
    { topic },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
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