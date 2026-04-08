import { useState, useCallback, useEffect } from 'react';
import { SessionDto } from '../types';
import { sessionsApi } from '../api';

export const useSessions = () => {
  const [sessions, setSessions] = useState<SessionDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchSessions = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await sessionsApi.getAll();
      setSessions(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch sessions'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  return {
    sessions,
    isLoading,
    error,
    refreshSessions: fetchSessions,
  };
};
