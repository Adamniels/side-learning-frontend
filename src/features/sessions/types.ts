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
