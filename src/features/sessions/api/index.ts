import { apiClient } from '@/lib/apiClient';
import {
  SessionDesignEnqueueResponse,
  SessionDesignJobDto,
  SessionDetailDto,
  SessionDto,
} from '../types';

export const sessionsApi = {
  getAll: async (): Promise<SessionDto[]> => {
    return apiClient<SessionDto[]>('/users/me/sessions', {
      method: 'GET',
    });
  },

  getById: async (sessionId: string): Promise<SessionDetailDto> => {
    return apiClient<SessionDetailDto>(`/users/me/sessions/${sessionId}`, {
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
