import API from './api';

export const statsService = {
  getAdminStats: async () => {
    const response = await API.get('/stats/admin');
    return response.data;
  },

  getUserStats: async () => {
    const response = await API.get('/stats/user');
    return response.data;
  },
};
