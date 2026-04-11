import apiClient from './apiClient';

export const employerService = {
  getStudents: async () => {
    const response = await apiClient.get('/employer/students');
    return response.data;
  },

  getCompanyProfile: async () => {
    const response = await apiClient.get('/employer/company');
    return response.data;
  },

  getCompanyInternships: async () => {
    const response = await apiClient.get('/employer/internships');
    return response.data;
  },

  getInternshipApplicants: async (internshipId: string) => {
    const response = await apiClient.get(`/employer/internship/${internshipId}/applicants`);
    return response.data;
  },

  submitFeedback: async (internshipId: string, feedbackData: any) => {
    const response = await apiClient.post(`/employer/internship/${internshipId}/feedback`, feedbackData);
    return response.data;
  },

  evaluateStudent: async (studentId: string, evaluationData: any) => {
    const response = await apiClient.post(`/employer/student/${studentId}/evaluate`, evaluationData);
    return response.data;
  }
};
