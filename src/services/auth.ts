import apiClient from './apiClient';

export const authService = {
  login: async (email: string, password: string, role: string) => {
    const response = await apiClient.post('/auth/login', { email, password, role });
    const { token, user_id, role: userRole } = response.data;
    
    // Store token and user info
    localStorage.setItem('token', token);
    localStorage.setItem('user_id', user_id);
    localStorage.setItem('user_role', userRole);
    
    // Clear cached profile data on login to ensure fresh data
    localStorage.removeItem('cached_student_profile');
    localStorage.removeItem('profile_cache_time');
    
    return response.data;
  },

  register: async (data: any) => {
    const response = await apiClient.post('/auth/register', data);
    const { token, user_id, role } = response.data;
    
    // Store token and user info
    if (token) {
      localStorage.setItem('token', token);
      localStorage.setItem('user_id', user_id);
      localStorage.setItem('user_role', role);
    }
    
    // Clear cached profile data on register
    localStorage.removeItem('cached_student_profile');
    localStorage.removeItem('profile_cache_time');
    
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_role');
    localStorage.removeItem('cached_student_profile');
    localStorage.removeItem('profile_cache_time');
  },

  getProfile: async () => {
    const response = await apiClient.get('/auth/profile');
    return response.data;
  },

  verifyToken: async () => {
    try {
      const response = await apiClient.post('/auth/verify-token', {});
      return response.data;
    } catch (error) {
      return null;
    }
  },
};
