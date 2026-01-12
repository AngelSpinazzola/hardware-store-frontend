import api from './api';
import type {
  LoginCredentials,
  RegisterData,
  UpdateProfileData,
  AuthResponse,
  User
} from '@/types';

export const authService = {
  register: async (userData: RegisterData): Promise<AuthResponse> => {
    const response = await api.post<{ user: User, token: string, message: string }>('/auth/register', userData);

    // Guardar usuario en localStorage (token viene en httpOnly cookie)
    if (response.data && response.data.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }

    return {
      user: response.data.user,
      token: response.data.token
    };
  },

  googleLogin: async (idToken: string): Promise<AuthResponse> => {
    const response = await api.post<{ user: User, token: string, message: string }>('/auth/google', { idToken });

    // Guardar usuario en localStorage (token viene en httpOnly cookie)
    if (response.data && response.data.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }

    return {
      user: response.data.user,
      token: response.data.token
    };
  },

  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<{ user: User, token: string, message: string }>('/auth/login', credentials);

    // Guardar usuario en localStorage (token viene en httpOnly cookie)
    if (response.data && response.data.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }

    return {
      user: response.data.user,
      token: response.data.token
    };
  },

  logout: async (): Promise<void> => {
    try {
      // Llamar al endpoint de logout para eliminar cookie httpOnly del servidor
      await api.post('/auth/logout');
    } catch (error) {
      // Continuar con logout local aunque falle el servidor
      // Silenciar error - el logout local se ejecutará de todas formas
    }

    // Limpiar datos locales (el token se elimina en el servidor)
    localStorage.removeItem('user');
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await api.get<User>('/auth/me');
    return response.data;
  },

  updateProfile: async (userData: UpdateProfileData): Promise<User> => {
    const response = await api.put<User>('/auth/profile', userData);
    if (response.data) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('user');
  },

  getStoredUser: (): User | null => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  forgotPassword: async (email: string): Promise<{ message: string }> => {
    const response = await api.post<{ message: string }>('/auth/forgot-password', { email });
    return response.data;
  },

  resetPassword: async (token: string, newPassword: string): Promise<{ message: string }> => {
    const response = await api.post<{ message: string }>('/auth/reset-password', { 
      token, 
      newPassword 
    });
    return response.data;
  }
};