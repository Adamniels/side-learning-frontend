import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ApiError } from '@/lib/apiClient';
import { SessionDetailDto } from '../types';
import { sessionsApi } from '../api';

export const useSessionDetail = (sessionId: string | undefined) => {
  const router = useRouter();
  const [session, setSession] = useState<SessionDetailDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchSession = useCallback(async () => {
    if (!sessionId) {
      setIsLoading(false);
      setSession(null);
      setError(new Error('Missing session'));
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const data = await sessionsApi.getById(sessionId);
      setSession(data);
    } catch (err) {
      if (err instanceof ApiError && err.statusCode === 401) {
        router.replace('/login');
        return;
      }
      setError(err instanceof Error ? err : new Error('Failed to load session'));
      setSession(null);
    } finally {
      setIsLoading(false);
    }
  }, [sessionId, router]);

  useEffect(() => {
    void fetchSession();
  }, [fetchSession]);

  return {
    session,
    isLoading,
    error,
    refreshSession: fetchSession,
  };
};
