import api from './api';

export const enrollCourse = (courseId) => {
  return api.post('/api/enrollments/enroll', { courseId });
};

export const getMyCourses = () => {
  return api.get('/api/enrollments/my-courses');
};
