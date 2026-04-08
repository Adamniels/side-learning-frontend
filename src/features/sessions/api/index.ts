import { apiClient } from '@/lib/apiClient';
import { SessionDto } from '../types';

export const sessionsApi = {
  getAll: async (): Promise<SessionDto[]> => {
    return apiClient<SessionDto[]>('/users/me/sessions', {
      method: 'GET',
    });
  },
};
