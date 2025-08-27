import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { authApi, User, LoginRequest } from '@/lib/api';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });
  
  const router = useRouter();

  // Check if user is already authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await authApi.getCurrentUser();
        if (response.data) {
          setAuthState({
            user: response.data,
            isLoading: false,
            isAuthenticated: true,
          });
        } else {
          setAuthState({
            user: null,
            isLoading: false,
            isAuthenticated: false,
          });
        }
      } catch (error) {
        setAuthState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
        });
      }
    };

    checkAuth();
  }, []);

  const login = useCallback(async (credentials: LoginRequest) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const response = await authApi.login(credentials);
      
      if (response.error) {
        throw new Error(response.error);
      }

      if (response.data) {
        setAuthState({
          user: response.data.user,
          isLoading: false,
          isAuthenticated: true,
        });
        
        // Redirect to dashboard after successful login
        router.push('/');
        return { success: true };
      }
      
      throw new Error('Login failed');
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Login failed',
      };
    }
  }, [router]);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
      
      // Redirect to login page
      router.push('/login');
    }
  }, [router]);

  const updateUser = useCallback((userData: Partial<User>) => {
    if (authState.user) {
      setAuthState(prev => ({
        ...prev,
        user: { ...prev.user!, ...userData },
      }));
    }
  }, [authState.user]);

  return {
    ...authState,
    login,
    logout,
    updateUser,
  };
}
