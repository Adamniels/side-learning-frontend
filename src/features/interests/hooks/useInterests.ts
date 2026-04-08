import { useState, useCallback } from 'react';
import { interestsApi } from '../api';
import { UserInterestDto, UpsertUserInterestRequest } from '../types';

export const useInterests = () => {
  const [interests, setInterests] = useState<UserInterestDto[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInterests = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await interestsApi.getAll();
      setInterests(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch interests');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addInterest = useCallback(async (data: UpsertUserInterestRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      const newInterest = await interestsApi.create(data);
      setInterests((prev) => [...prev, newInterest]);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to add interest');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateInterest = useCallback(async (label: string, data: UpsertUserInterestRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedInterest = await interestsApi.update(label, data);
      setInterests((prev) => prev.map((item) => (item.label === label ? updatedInterest : item)));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update interest');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const removeInterest = useCallback(async (label: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await interestsApi.remove(label);
      setInterests((prev) => prev.filter((item) => item.label !== label));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to remove interest');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    interests,
    isLoading,
    error,
    fetchInterests,
    addInterest,
    updateInterest,
    removeInterest,
  };
};
