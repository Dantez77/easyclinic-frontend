'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthContext } from '@/lib/auth-context';
import { usePermissions } from '@/lib/permissions-context';
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

// Route permission mapping
const ROUTE_PERMISSIONS: Record<string, string> = {
  '/appointments': 'access_appointments',
  '/patients': 'access_patients',
  '/billing': 'access_billing',
  '/inventory': 'access_inventory',
  '/activity-logs': 'access_activity_logs',
  '/consultation': 'access_consultation',
  '/settings': 'access_settings',
  '/profile': 'access_profile',
  '/messages': 'access_messages',
  '/tools': 'access_tools'
};

interface RouteGuardProps {
  children: React.ReactNode;
}

export function RouteGuard({ children }: RouteGuardProps) {
  const { isAuthenticated, isLoading: authLoading } = useAuthContext();
  const { hasPermission, isLoading: permissionsLoading } = usePermissions();
  const router = useRouter();
  const pathname = usePathname();

  const isLoading = authLoading || permissionsLoading;

  useEffect(() => {
    // Don't redirect while loading
    if (isLoading) return;

    console.log('Route guard check:', { pathname, isAuthenticated, isLoading });

    // Check if the current route requires authentication
    const isPublicRoute = PUBLIC_ROUTES.includes(pathname);
    const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname.startsWith(route));
    
    if (!isAuthenticated && isProtectedRoute) {
      // Redirect to login if not authenticated and trying to access protected route
      console.log('Redirecting to login - not authenticated');
      router.push('/login');
    } else if (isAuthenticated && pathname === '/login') {
      // Redirect authenticated users away from login page
      console.log('Redirecting to home - already authenticated');
      router.push('/');
    } else if (!isAuthenticated && pathname === '/') {
      // Allow unauthenticated users to see the landing page
      // This is intentional - the landing page is public
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  useEffect(() => {
    // Check permissions for protected routes
    if (isAuthenticated && !isLoading) {
      const currentRoute = PROTECTED_ROUTES.find(route => pathname.startsWith(route));
      
      if (currentRoute) {
        const requiredPermission = ROUTE_PERMISSIONS[currentRoute];
        
        if (requiredPermission && !hasPermission(requiredPermission)) {
          // Only redirect if we're sure the user doesn't have permission
          // Wait a bit more to ensure permissions are fully loaded
          const timeoutId = setTimeout(() => {
            if (!hasPermission(requiredPermission)) {
              console.log(`Permission check failed for ${requiredPermission}, redirecting to unauthorized`);
              router.push('/unauthorized');
            }
          }, 1000); // Wait 1 second for permissions to load
          
          return () => clearTimeout(timeoutId);
        }
      }
    }
  }, [isAuthenticated, isLoading, pathname, hasPermission, router]);

  // Show loading state while checking authentication or permissions
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Don't render protected content if not authenticated and trying to access protected routes
  if (!isAuthenticated && PROTECTED_ROUTES.some(route => pathname.startsWith(route))) {
    return null;
  }

  // Check if user has permission for the current route
  const currentRoute = PROTECTED_ROUTES.find(route => pathname.startsWith(route));
  if (currentRoute && isAuthenticated) {
    const requiredPermission = ROUTE_PERMISSIONS[currentRoute];
    
    if (requiredPermission && !hasPermission(requiredPermission)) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Acceso Denegado</h1>
            <p className="text-gray-600 mb-4">
              No tienes los permisos necesarios para acceder a esta página.
            </p>
            <button
              onClick={() => router.push('/')}
              className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
            >
              Volver al Inicio
            </button>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
}
