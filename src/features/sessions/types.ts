export type SessionStatus =
  | 'Draft'
  | 'Ready'
  | 'InProgress'
  | 'Completed'
  | 'Archived';

export interface SessionDto {
  id: string;
  title: string;
  summary: string;
  status: SessionStatus;
  estimatedDurationInMinutes: number | null;
  createdAtUtc: string;
  updatedAtUtc: string;
  startedAtUtc: string | null;
  completedAtUtc: string | null;
}
