'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthContext } from '@/lib/auth-context';
import { LoadingSpinner } from '@/components/loading-spinner';

// Routes that are accessible without authentication
const PUBLIC_ROUTES = ['/', '/login'];

// Routes that require authentication
const PROTECTED_ROUTES = [
  '/appointments',
  '/patients',
  '/billing',
  '/inventory',
  '/activity-logs',
  '/consultation',
  '/settings',
  '/profile',
  '/messages',
  '/tools'
];

interface RouteGuardProps {
  children: React.ReactNode;
}

export function RouteGuard({ children }: RouteGuardProps) {
  const { isAuthenticated, isLoading } = useAuthContext();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Don't redirect while loading
    if (isLoading) return;

    // Check if the current route requires authentication
    const isPublicRoute = PUBLIC_ROUTES.includes(pathname);
    const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname.startsWith(route));
    
    if (!isAuthenticated && isProtectedRoute) {
      // Redirect to login if not authenticated and trying to access protected route
      router.push('/login');
    } else if (isAuthenticated && pathname === '/login') {
      // Redirect authenticated users away from login page
      router.push('/');
    } else if (!isAuthenticated && pathname === '/') {
      // Allow unauthenticated users to see the landing page
      // This is intentional - the landing page is public
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  // Show loading state while checking authentication
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Don't render protected content if not authenticated and trying to access protected routes
  if (!isAuthenticated && PROTECTED_ROUTES.some(route => pathname.startsWith(route))) {
    return null;
  }

  return <>{children}</>;
}
