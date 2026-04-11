import apiClient from './apiClient';

export const announcementService = {
  getAll: async () => {
    const response = await apiClient.get('/announcements');
    return response.data;
  },

  getById: async (announcementId: string) => {
    const response = await apiClient.get(`/announcements/${announcementId}`);
    return response.data;
  },

  create: async (data: any) => {
    const response = await apiClient.post('/announcements', data);
    return response.data;
  },

  update: async (announcementId: string, data: any) => {
    const response = await apiClient.put(`/announcements/${announcementId}`, data);
    return response.data;
  },

  delete: async (announcementId: string) => {
    const response = await apiClient.delete(`/announcements/${announcementId}`);
    return response.data;
  },
};
