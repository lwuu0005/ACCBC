import { defineStore } from 'pinia';
import { authAPI } from '../services/api';

interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
  profile: {
    firstName?: string;
    lastName?: string;
    phone?: string;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: localStorage.getItem('token'),
    isLoading: false,
    error: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token && !!state.user,
    isAdmin: (state) => state.user?.role === 'admin',
    fullName: (state) => {
      if (!state.user?.profile) return '';
      const { firstName, lastName } = state.user.profile;
      return `${firstName || ''} ${lastName || ''}`.trim() || state.user.username;
    },
  },

  actions: {
    // Set error message
    setError(error: string | null) {
      this.error = error;
    },

    // Set loading state
    setLoading(loading: boolean) {
      this.isLoading = loading;
    },

    // Login user
    async login(credentials: { email: string; password: string }) {
      try {
        this.setLoading(true);
        this.setError(null);

        const response = await authAPI.login(credentials);
        
        if (response.success) {
          this.user = response.data.user;
          this.token = response.data.token;
          
          // Store in localStorage
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('user', JSON.stringify(response.data.user));
          
          return { success: true, message: response.message };
        } else {
          this.setError(response.message);
          return { success: false, message: response.message };
        }
      } catch (error: any) {
        const errorMessage = error.response?.data?.message || 'Login failed';
        this.setError(errorMessage);
        return { success: false, message: errorMessage };
      } finally {
        this.setLoading(false);
      }
    },

    // Register user
    async register(userData: {
      username: string;
      email: string;
      password: string;
    }) {
      try {
        this.setLoading(true);
        this.setError(null);

        const response = await authAPI.register(userData);
        
        if (response.success) {
          this.user = response.data.user;
          this.token = response.data.token;
          
          // Store in localStorage
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('user', JSON.stringify(response.data.user));
          
          return { success: true, message: response.message };
        } else {
          this.setError(response.message);
          return { success: false, message: response.message };
        }
      } catch (error: any) {
        const errorMessage = error.response?.data?.message || 'Registration failed';
        this.setError(errorMessage);
        return { success: false, message: errorMessage };
      } finally {
        this.setLoading(false);
      }
    },

    // Logout user
    async logout() {
      try {
        await authAPI.logout();
      } catch (error) {
        console.error('Logout error:', error);
      } finally {
        // Clear state and localStorage
        this.user = null;
        this.token = null;
        this.error = null;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    },

    // Initialize auth state from localStorage
    initializeAuth() {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      
      if (token && userStr) {
        try {
          this.token = token;
          this.user = JSON.parse(userStr);
        } catch (error) {
          console.error('Error parsing user data:', error);
          this.logout();
        }
      }
    },

    // Update user profile
    async updateProfile(profileData: {
      firstName?: string;
      lastName?: string;
      phone?: string;
    }) {
      try {
        this.setLoading(true);
        this.setError(null);

        const response = await authAPI.updateProfile(profileData);
        
        if (response.success) {
          this.user = response.data.user;
          localStorage.setItem('user', JSON.stringify(response.data.user));
          return { success: true, message: response.message };
        } else {
          this.setError(response.message);
          return { success: false, message: response.message };
        }
      } catch (error: any) {
        const errorMessage = error.response?.data?.message || 'Profile update failed';
        this.setError(errorMessage);
        return { success: false, message: errorMessage };
      } finally {
        this.setLoading(false);
      }
    },
  },
});
