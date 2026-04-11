import apiClient from './apiClient';

export const internshipService = {
  getAll: async () => {
    const response = await apiClient.get('/internships');
    return response.data;
  },

  getById: async (internshipId: string) => {
    const response = await apiClient.get(`/internships/${internshipId}`);
    return response.data;
  },

  create: async (data: any) => {
    const response = await apiClient.post('/internships', data);
    return response.data;
  },

  update: async (internshipId: string, data: any) => {
    const response = await apiClient.put(`/internships/${internshipId}`, data);
    return response.data;
  },

  delete: async (internshipId: string) => {
    const response = await apiClient.delete(`/internships/${internshipId}`);
    return response.data;
  },
};
