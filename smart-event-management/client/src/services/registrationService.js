import API from './api';

export const registrationService = {
  createRegistration: async (data) => {
    const response = await API.post('/registrations', data);
    return response.data;
  },

  getAllRegistrations: async (params = {}) => {
    const response = await API.get('/registrations', { params });
    return response.data;
  },

  checkRegistration: async (eventId) => {
    const response = await API.get(`/registrations/check/${eventId}`);
    return response.data;
  },

  deleteRegistration: async (id) => {
    const response = await API.delete(`/registrations/${id}`);
    return response.data;
  },
};
