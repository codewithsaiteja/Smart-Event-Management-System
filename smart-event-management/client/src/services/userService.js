import API from './api';

export const userService = {
  getAllUsers: async (params = {}) => {
    const response = await API.get('/users', { params });
    return response.data;
  },

  getUserById: async (id) => {
    const response = await API.get(`/users/${id}`);
    return response.data;
  },

  deleteUser: async (id) => {
    const response = await API.delete(`/users/${id}`);
    return response.data;
  },
};
