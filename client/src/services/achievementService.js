import api from './api';

// Get all achievements/certificates
export const getAchievements = (type = null) => {
  const params = {};
  if (type) params.type = type;

  return api.get('/achievements', { params });
};

// Get specific achievement
export const getAchievementById = (id) => {
  return api.get(`/achievements/${id}`);
};

// Course certificate
export const getCourseCertificate = (courseId) => {
  return api.get(`/achievements/course/${courseId}`);
};

// Stats
export const getAchievementStats = () => {
  return api.get('/achievements/stats/user');
};

// Certificates only
export const getCertificates = () => {
  return api.get('/achievements', {
    params: { type: 'certificate' }
  });
};

// Badges only
export const getBadges = () => {
  return api.get('/achievements', {
    params: { type: 'badge' }
  });
};

// Create (admin)
export const createAchievement = (data) => {
  return api.post('/api/achievements', data);
};

// Delete
export const deleteAchievement = (id) => {
  return api.delete(`/api/achievements/${id}`);
};