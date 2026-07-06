import API from './api';

export const authService = {
  register: async (data) => {
    const response = await API.post('/auth/register', data);
    return response.data;
  },

  login: async (data) => {
    const response = await API.post('/auth/login', data);
    return response.data;
  },

  logout: async () => {
    const response = await API.post('/auth/logout');
    return response.data;
  },

  getProfile: async () => {
    const response = await API.get('/auth/profile');
    return response.data;
  },

  updateProfile: async (formData) => {
    const response = await API.put('/auth/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};
