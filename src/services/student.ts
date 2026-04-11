import apiClient from './apiClient';

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

export const studentService = {
  getCurrentProfile: async (useCache = true) => {
    // Check if we have a cached profile and it's still valid
    if (useCache) {
      const cached = localStorage.getItem('cached_student_profile');
      const cacheTime = localStorage.getItem('profile_cache_time');
      
      if (cached && cacheTime) {
        const cacheAge = Date.now() - parseInt(cacheTime);
        if (cacheAge < CACHE_DURATION) {
          // Cache is still valid
          return JSON.parse(cached);
        }
      }
    }
    
    // Fetch fresh data from API
    const response = await apiClient.get('/students/profile/current');
    
    // Cache the response
    localStorage.setItem('cached_student_profile', JSON.stringify(response.data));
    localStorage.setItem('profile_cache_time', Date.now().toString());
    
    return response.data;
  },

  getStudentProfile: async (studentId: string) => {
    const response = await apiClient.get(`/students/${studentId}`);
    return response.data;
  },

  updateProfile: async (data: any) => {
    const response = await apiClient.put('/students/profile/update', data);
    
    // Invalidate cache after update
    localStorage.removeItem('cached_student_profile');
    localStorage.removeItem('profile_cache_time');
    
    return response.data;
  },

  applyForInternship: async (internshipId: string) => {
    const response = await apiClient.post(`/students/apply/${internshipId}`, {});
    return response.data;
  },

  getApplications: async () => {
    const response = await apiClient.get('/students/applications');
    return response.data;
  },

  // Clear cache manually if needed
  clearProfileCache: () => {
    localStorage.removeItem('cached_student_profile');
    localStorage.removeItem('profile_cache_time');
  }
};
