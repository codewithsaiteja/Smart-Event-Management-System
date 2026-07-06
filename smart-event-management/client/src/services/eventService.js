import API from './api';

export const eventService = {
  createEvent: async (formData) => {
    const response = await API.post('/events', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getAllEvents: async (params = {}) => {
    const response = await API.get('/events', { params });
    return response.data;
  },

  getEventById: async (id) => {
    const response = await API.get(`/events/${id}`);
    return response.data;
  },

  updateEvent: async (id, formData) => {
    const response = await API.put(`/events/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteEvent: async (id) => {
    const response = await API.delete(`/events/${id}`);
    return response.data;
  },
};
