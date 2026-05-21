// client/src/services/achievementService.js

import api from './api';

// Get all achievements/certificates for the logged-in user
export const getAchievements = (type = null) => {
  const params = {};
  if (type) {
    params.type = type;
  }
  return api.get('/achievements', { params });
};

// Get specific achievement by ID
export const getAchievementById = (achievementId) => {
  return api.get(`/achievements/${achievementId}`);
};

// Get certificate for a specific course
export const getCourseCertificate = (courseId) => {
  return api.get(`/achievements/course/${courseId}`);
};

// Get achievement statistics
export const getAchievementStats = () => {
  return api.get('/achievements/stats/user');
};

// Get certificates only
export const getCertificates = () => {
  return api.get('/achievements', { params: { type: 'certificate' } });
};

// Get badges only
export const getBadges = () => {
  return api.get('/achievements', { params: { type: 'badge' } });
};

// Create an achievement (admin only)
export const createAchievement = (achievementData) => {
  return api.post('/achievements', achievementData);
};

// Delete an achievement (admin only)
export const deleteAchievement = (achievementId) => {
  return api.delete(`/achievements/${achievementId}`);
};

// Download certificate
export const downloadCertificate = (certificateUrl) => {
  // This would typically use a third-party service or generate PDF
  return api.get(certificateUrl);
};
