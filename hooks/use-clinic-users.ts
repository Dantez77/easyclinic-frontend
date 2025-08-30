import { useState, useEffect, useCallback } from 'react';
import { clinicApi, ClinicUsersResponse } from '@/lib/api';
import { useAuthContext } from '@/lib/auth-context';

interface UseClinicUsersReturn {
  clinicUsers: ClinicUsersResponse | null;
  isLoading: boolean;
  error: string | null;
  refreshClinicUsers: () => Promise<void>;
}

export function useClinicUsers(): UseClinicUsersReturn {
  const { user } = useAuthContext();
  const [clinicUsers, setClinicUsers] = useState<ClinicUsersResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchClinicUsers = useCallback(async () => {
    if (!user?.clinic_id) {
      setError('No clinic ID available');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await clinicApi.getClinicUsers(user.clinic_id);
      
      if (response.error) {
        throw new Error(response.error);
      }

      if (response.data) {
        setClinicUsers(response.data);
      } else {
        throw new Error('Failed to fetch clinic users data');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [user?.clinic_id]);

  const refreshClinicUsers = useCallback(async () => {
    await fetchClinicUsers();
  }, [fetchClinicUsers]);

  useEffect(() => {
    fetchClinicUsers();
  }, [fetchClinicUsers]);

  return {
    clinicUsers,
    isLoading,
    error,
    refreshClinicUsers,
  };
}
