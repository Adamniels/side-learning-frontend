import { apiClient } from '@/lib/apiClient';
import { UserInterestDto, UpsertUserInterestRequest } from '../types';

export const interestsApi = {
  getAll: async (): Promise<UserInterestDto[]> => {
    return apiClient<UserInterestDto[]>('/users/me/interests', {
      method: 'GET',
    });
  },

  create: async (data: UpsertUserInterestRequest): Promise<UserInterestDto> => {
    return apiClient<UserInterestDto>('/users/me/interests', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (label: string, data: UpsertUserInterestRequest): Promise<UserInterestDto> => {
    const encodedLabel = encodeURIComponent(label);
    return apiClient<UserInterestDto>(`/users/me/interests/${encodedLabel}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  remove: async (label: string): Promise<void> => {
    const encodedLabel = encodeURIComponent(label);
    return apiClient<void>(`/users/me/interests/${encodedLabel}`, {
      method: 'DELETE',
    });
  },
};
