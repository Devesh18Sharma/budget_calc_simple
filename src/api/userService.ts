import api from './config';

export interface UserLoginData {
  email: string;
  password: string;
}

export interface UserRegisterData {
  name: string;
  email: string;
  password: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export const userService = {
  // Register a new user
  async register(userData: UserRegisterData): Promise<{ token: string; user: UserProfile }> {
    try {
      const response = await api.post('/auth/register', userData);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  // Login user
  async login(loginData: UserLoginData): Promise<{ token: string; user: UserProfile }> {
    try {
      const response = await api.post('/auth/login', loginData);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  // Logout user
  logout(): void {
    localStorage.removeItem('token');
  },

  // Get current user profile
  async getProfile(): Promise<UserProfile> {
    try {
      const response = await api.get('/auth/profile');
      return response.data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }
}; 