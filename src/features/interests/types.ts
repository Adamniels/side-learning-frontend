export interface UserInterestDto {
  label: string;
  weight: number;
  context: string;
}

export interface UpsertUserInterestRequest {
  label: string;
  weight: number;
  context?: string;
}
