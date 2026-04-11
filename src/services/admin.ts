import apiClient from './apiClient';

export const adminService = {
  getDashboard: async () => {
    const response = await apiClient.get('/admin/dashboard');
    return response.data;
  },

  getAllStudents: async () => {
    const response = await apiClient.get('/admin/students');
    return response.data;
  },

  getUsersByRole: async (role: string) => {
    const response = await apiClient.get(`/admin/users/${role}`);
    return response.data;
  },

  getStatistics: async () => {
    const response = await apiClient.get('/admin/statistics');
    return response.data;
  },
};
