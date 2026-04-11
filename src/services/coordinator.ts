import apiClient from './apiClient';

export const coordinatorService = {
  getDashboard: async () => {
    const response = await apiClient.get('/coordinator/dashboard');
    return response.data;
  },

  getDepartmentStudents: async () => {
    const response = await apiClient.get('/coordinator/department-students');
    return response.data;
  },

  evaluateStudent: async (studentId: string, evaluationData: any) => {
    const response = await apiClient.post(`/coordinator/student/${studentId}/evaluate`, evaluationData);
    return response.data;
  },
};
