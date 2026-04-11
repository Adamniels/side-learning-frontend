import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ApiError } from '@/lib/apiClient';
import { sessionsApi } from '../api';
import type { SessionDesignJobStatus } from '../types';

export type SessionDesignFlowPhase = 'idle' | 'creating' | 'polling' | 'succeeded' | 'failed';

const pollDelayMs = (attempt: number) => Math.min(3000, 1000 + attempt * 500);

export function useSessionDesignJobFlow() {
  const router = useRouter();
  const [phase, setPhase] = useState<SessionDesignFlowPhase>('idle');
  const [pollStatus, setPollStatus] = useState<SessionDesignJobStatus | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [runningStartedAt, setRunningStartedAt] = useState<number | null>(null);
  const [nowTick, setNowTick] = useState(() => Date.now());

  const cancelledRef = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = useCallback(() => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    cancelledRef.current = false;
    return () => {
      cancelledRef.current = true;
      clearTimer();
    };
  }, [clearTimer]);

  useEffect(() => {
    if (phase !== 'polling' || pollStatus !== 'running' || runningStartedAt === null) {
      return;
    }
    const id = setInterval(() => setNowTick(Date.now()), 1000);
    return () => clearInterval(id);
  }, [phase, pollStatus, runningStartedAt]);

  const showLongWaitHint =
    runningStartedAt !== null && nowTick - runningStartedAt > 10_000;

  const reset = useCallback(() => {
    clearTimer();
    setPhase('idle');
    setPollStatus(null);
    setErrorMessage(null);
    setRunningStartedAt(null);
  }, [clearTimer]);

  const schedulePoll = useCallback(
    (jobId: string, attempt: number) => {
      const delay = pollDelayMs(attempt);
      timeoutRef.current = setTimeout(async () => {
        if (cancelledRef.current) return;
        try {
          const job = await sessionsApi.getSessionDesignJob(jobId);
          if (cancelledRef.current) return;

          setPollStatus(job.status);

          if (job.status === 'succeeded') {
            setPhase('succeeded');
            setRunningStartedAt(null);
            return;
          }

          if (job.status === 'failed') {
            setPhase('failed');
            setErrorMessage(
              job.error?.message?.trim() || 'We couldn’t finish designing your session.'
            );
            setRunningStartedAt(null);
            return;
          }

          if (job.status === 'running') {
            setRunningStartedAt((prev) => prev ?? Date.now());
          }

          schedulePoll(jobId, attempt + 1);
        } catch (e) {
          if (cancelledRef.current) return;
          if (e instanceof ApiError && e.statusCode === 401) {
            router.replace('/login');
            return;
          }
          setPhase('failed');
          setErrorMessage(
            e instanceof ApiError ? e.message : e instanceof Error ? e.message : 'Something went wrong.'
          );
          setRunningStartedAt(null);
        }
      }, delay);
    },
    [router]
  );

  const start = useCallback(async () => {
    clearTimer();
    setErrorMessage(null);
    setPollStatus(null);
    setRunningStartedAt(null);
    setPhase('creating');

    try {
      const { jobId } = await sessionsApi.createSessionDesignJob();
      if (cancelledRef.current) return;

      setPhase('polling');
      setPollStatus('queued');
      schedulePoll(jobId, 0);
    } catch (e) {
      if (cancelledRef.current) return;
      if (e instanceof ApiError && e.statusCode === 401) {
        router.replace('/login');
        return;
      }
      setPhase('failed');
      setErrorMessage(
        e instanceof ApiError ? e.message : e instanceof Error ? e.message : 'Could not start session design.'
      );
    }
  }, [clearTimer, schedulePoll, router]);

  const tryAgain = useCallback(() => {
    void start();
  }, [start]);

  return {
    phase,
    pollStatus,
    errorMessage,
    showLongWaitHint,
    start,
    reset,
    tryAgain,
  };
}
