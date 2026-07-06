import API from './api';

export const attendanceService = {
  markAttendance: async (data) => {
    const response = await API.post('/attendance', data);
    return response.data;
  },

  getAllAttendance: async (params = {}) => {
    const response = await API.get('/attendance', { params });
    return response.data;
  },

  getAttendanceStats: async () => {
    const response = await API.get('/attendance/stats');
    return response.data;
  },

  updateAttendance: async (id, data) => {
    const response = await API.put(`/attendance/${id}`, data);
    return response.data;
  },
};
