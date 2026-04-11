import type { components } from '@/generated/api-types';

export type SessionDto = components['schemas']['SessionDto'];
export type SessionStatus = components['schemas']['SessionStatus'];

export const SESSION_STATUS_LABELS: Record<SessionStatus, string> = {
  1: 'Draft',
  2: 'Ready',
  3: 'InProgress',
  4: 'Completed',
  5: 'Archived',
};

export type SessionDesignJobStatus = 'queued' | 'running' | 'succeeded' | 'failed';

export interface SessionDesignEnqueueResponse {
  jobId: string;
  statusUrl: string;
}

export interface SessionDesignJobErrorDto {
  code?: string;
  message: string;
}

export interface SessionDesignJobDto {
  jobId: string;
  status: SessionDesignJobStatus;
  createdAtUtc?: string;
  startedAtUtc?: string | null;
  completedAtUtc?: string | null;
  createdSessionId?: string | null;
  sessionDesignResult?: unknown;
  error?: SessionDesignJobErrorDto | null;
}
