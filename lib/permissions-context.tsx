'use client';

import React, { createContext, useContext, ReactNode, useState, useEffect, useCallback } from 'react';
import { useAuthContext } from './auth-context';
import { permissionsApi, Permission } from './api';

interface PermissionsContextType {
  permissions: Permission[];
  isLoading: boolean;
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  hasAllPermissions: (permissions: string[]) => boolean;
  hasRole: (roleId: number) => boolean;
  getUserRole: () => { id: number; name: string } | null;
  refreshPermissions: () => Promise<void>;
}

const PermissionsContext = createContext<PermissionsContextType | undefined>(undefined);

interface PermissionsProviderProps {
  children: ReactNode;
}

// Role-based permission mapping based on your backend
const ROLE_PERMISSIONS: Record<number, string[]> = {
  1: [ // Administrador - All 9 permissions
    'access_appointments',
    'access_billing', 
    'access_consultation',
    'access_inventory',
    'access_messages',
    'access_patients',
    'access_tools',
    'access_settings',
    'access_profile'
  ],
  2: [ // Doctor - 7 permissions
    'access_appointments',
    'access_consultation',
    'access_messages',
    'access_patients',
    'access_tools',
    'access_settings',
    'access_profile'
  ],
  3: [ // Secretary/Receptionist - 6 permissions
    'access_appointments',
    'access_billing',
    'access_inventory',
    'access_messages',
    'access_patients',
    'access_profile'
  ]
};

// Backend response structure
interface BackendPermissionsResponse {
  success: boolean;
  data: {
    user: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
    };
    roles: Array<{
      id: number;
      nombre: string;
      descripcion: string;
      activo: boolean;
    }>;
    permissions: Array<{
      id: number;
      name: string;
      description: string;
      active: boolean;
    }>;
    totalPermissions: number;
    totalRoles: number;
  };
}

export function PermissionsProvider({ children }: PermissionsProviderProps) {
  const { user, isAuthenticated } = useAuthContext();
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchPermissions = useCallback(async () => {
    if (!isAuthenticated || !user) {
      setPermissions([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await permissionsApi.getUserPermissions();
      
      // Check if we got a successful response with permissions
      if (response.data && Array.isArray(response.data)) {
        // Direct permissions array (fallback)
        setPermissions(response.data);
      } else if (response.data && typeof response.data === 'object' && 'permissions' in response.data) {
        // Backend response structure
        const backendResponse = response.data as BackendPermissionsResponse['data'];
        if (backendResponse.permissions && Array.isArray(backendResponse.permissions)) {
          setPermissions(backendResponse.permissions);
        } else {
          // Fallback to role-based permissions
          derivePermissionsFromRoles();
        }
      } else {
        // Fallback to role-based permissions
        derivePermissionsFromRoles();
      }
    } catch (error) {
      console.error('Error fetching permissions from API, falling back to role-based permissions:', error);
      // Fallback to role-based permissions when API fails
      derivePermissionsFromRoles();
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, user]);

  // Fallback function to derive permissions from user roles
  const derivePermissionsFromRoles = useCallback(() => {
    if (!user?.roles || user.roles.length === 0) {
      setPermissions([]);
      return;
    }

    const userRoleIds = user.roles.map(role => role.id);
    const allPermissions: Permission[] = [];

    // Collect all permissions from user's roles
    userRoleIds.forEach(roleId => {
      const rolePermissions = ROLE_PERMISSIONS[roleId] || [];
      rolePermissions.forEach((permissionName, index) => {
        // Create permission objects with mock IDs
        allPermissions.push({
          id: roleId * 100 + index, // Generate unique ID
          name: permissionName,
          description: `Permission for ${permissionName}`,
          active: true
        });
      });
    });

    // Remove duplicates based on permission name
    const uniquePermissions = allPermissions.filter((permission, index, self) => 
      index === self.findIndex(p => p.name === permission.name)
    );

    setPermissions(uniquePermissions);
  }, [user?.roles]);

  useEffect(() => {
    fetchPermissions();
  }, [fetchPermissions]);

  const hasPermission = useCallback((permission: string): boolean => {
    return permissions.some(p => p.name === permission && p.active);
  }, [permissions]);

  const hasAnyPermission = useCallback((permissionsList: string[]): boolean => {
    return permissionsList.some(permission => hasPermission(permission));
  }, [hasPermission]);

  const hasAllPermissions = useCallback((permissionsList: string[]): boolean => {
    return permissionsList.every(permission => hasPermission(permission));
  }, [hasPermission]);

  const hasRole = useCallback((roleId: number): boolean => {
    return user?.roles?.some(role => role.id === roleId) ?? false;
  }, [user?.roles]);

  const getUserRole = useCallback((): { id: number; name: string } | null => {
    if (!user?.roles || user.roles.length === 0) return null;
    return {
      id: user.roles[0].id,
      name: user.roles[0].name
    };
  }, [user?.roles]);

  const refreshPermissions = useCallback(async () => {
    await fetchPermissions();
  }, [fetchPermissions]);

  const value: PermissionsContextType = {
    permissions,
    isLoading,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    getUserRole,
    refreshPermissions,
  };

  return (
    <PermissionsContext.Provider value={value}>
      {children}
    </PermissionsContext.Provider>
  );
}

export function usePermissions() {
  const context = useContext(PermissionsContext);
  if (context === undefined) {
    throw new Error('usePermissions must be used within a PermissionsProvider');
  }
  return context;
}
