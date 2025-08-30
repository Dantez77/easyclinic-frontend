import { useState, useEffect, useCallback } from 'react';
import { clinicApi, ClinicWithUsers } from '@/lib/api';
import { useAuthContext } from '@/lib/auth-context';

interface UseClinicReturn {
  clinic: ClinicWithUsers | null;
  isLoading: boolean;
  error: string | null;
  refreshClinic: () => Promise<void>;
}

export function useClinic(): UseClinicReturn {
  const { user } = useAuthContext();
  const [clinic, setClinic] = useState<ClinicWithUsers | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchClinic = useCallback(async () => {
    if (!user?.clinic_id) {
      setError('No clinic ID available');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await clinicApi.getClinic(user.clinic_id);
      
      if (response.error) {
        throw new Error(response.error);
      }

      if (response.data) {
        setClinic(response.data);
      } else {
        throw new Error('Failed to fetch clinic data');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [user?.clinic_id]);

  const refreshClinic = useCallback(async () => {
    await fetchClinic();
  }, [fetchClinic]);

  useEffect(() => {
    fetchClinic();
  }, [fetchClinic]);

  return {
    clinic,
    isLoading,
    error,
    refreshClinic,
  };
}
