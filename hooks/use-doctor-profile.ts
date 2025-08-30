import { useState, useEffect, useCallback } from 'react';
import { doctorProfileApi, DoctorProfile } from '@/lib/api';
import { useAuthContext } from '@/lib/auth-context';

interface UseDoctorProfileReturn {
  doctorProfile: DoctorProfile | null;
  isLoading: boolean;
  error: string | null;
  refreshDoctorProfile: () => Promise<void>;
  updateDoctorProfile: (profileData: Partial<DoctorProfile>) => Promise<{ success: boolean; error?: string }>;
  isUpdating: boolean;
}

export function useDoctorProfile(): UseDoctorProfileReturn {
  const { user } = useAuthContext();
  const [doctorProfile, setDoctorProfile] = useState<DoctorProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDoctorProfile = useCallback(async () => {
    if (!user?.id) {
      setError('No user ID available');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await doctorProfileApi.getDoctorProfile(user.id);
      
      if (response.error) {
        throw new Error(response.error);
      }

      if (response.data) {
        setDoctorProfile(response.data);
      } else {
        throw new Error('Failed to fetch doctor profile data');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  const refreshDoctorProfile = useCallback(async () => {
    await fetchDoctorProfile();
  }, [fetchDoctorProfile]);

  const updateDoctorProfile = useCallback(async (profileData: Partial<DoctorProfile>) => {
    if (!user?.id) {
      return { success: false, error: 'No user ID available' };
    }

    setIsUpdating(true);
    setError(null);

    try {
      const response = await doctorProfileApi.updateDoctorProfile(user.id, profileData);
      
      if (response.error) {
        throw new Error(response.error);
      }

      if (response.data) {
        // Update local state with the updated profile
        setDoctorProfile(response.data);
        
        // If the response data is incomplete, refresh the full profile
        if (!response.data.name || !response.data.specialty) {
          console.log('Update response incomplete, refreshing full profile...')
          await fetchDoctorProfile();
        }
        
        return { success: true };
      } else {
        throw new Error('Failed to update doctor profile');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsUpdating(false);
    }
  }, [user?.id, fetchDoctorProfile]);

  useEffect(() => {
    fetchDoctorProfile();
  }, [fetchDoctorProfile]);

  return {
    doctorProfile,
    isLoading,
    error,
    refreshDoctorProfile,
    updateDoctorProfile,
    isUpdating,
  };
}
