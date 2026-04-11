import apiClient from './apiClient';

export const companyService = {
  getAll: async () => {
    const response = await apiClient.get('/companies');
    return response.data;
  },

  getById: async (companyId: string) => {
    const response = await apiClient.get(`/companies/${companyId}`);
    return response.data;
  },

  create: async (data: any) => {
    const response = await apiClient.post('/companies', data);
    return response.data;
  },

  update: async (companyId: string, data: any) => {
    const response = await apiClient.put(`/companies/${companyId}`, data);
    return response.data;
  },
};
