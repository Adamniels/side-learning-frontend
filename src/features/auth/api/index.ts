import { apiClient, setTokens, clearTokens } from '@/lib/apiClient';
import { AuthResponse, LoginRequest, RegisterRequest } from '../types';

export const authApi = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
      requireAuth: false,
    });
    setTokens(response.accessToken, response.refreshToken);
    return response;
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await apiClient<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
      requireAuth: false,
    });
    setTokens(response.accessToken, response.refreshToken);
    return response;
  },

  logout: async (): Promise<void> => {
    const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refreshToken') : null;
    if (refreshToken) {
      try {
        await apiClient('/auth/revoke', {
          method: 'POST',
          body: JSON.stringify({ refreshToken }),
          requireAuth: false,
        });
      } catch (e) {
        console.error('Logout revoke failed', e);
      }
    }
    clearTokens();
  },
};
