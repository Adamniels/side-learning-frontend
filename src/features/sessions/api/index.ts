import { apiClient } from '@/lib/apiClient';
import {
  SessionDesignEnqueueResponse,
  SessionDesignJobDto,
  SessionDto,
} from '../types';

export const sessionsApi = {
  getAll: async (): Promise<SessionDto[]> => {
    return apiClient<SessionDto[]>('/users/me/sessions', {
      method: 'GET',
    });
  },

  createSessionDesignJob: async (): Promise<SessionDesignEnqueueResponse> => {
    return apiClient<SessionDesignEnqueueResponse>('/users/me/session-design/jobs', {
      method: 'POST',
      body: JSON.stringify({}),
    });
  },

  getSessionDesignJob: async (jobId: string): Promise<SessionDesignJobDto> => {
    return apiClient<SessionDesignJobDto>(`/users/me/session-design/jobs/${jobId}`, {
      method: 'GET',
    });
  },
};
