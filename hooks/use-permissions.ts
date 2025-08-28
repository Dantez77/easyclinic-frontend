import { usePermissions } from '@/lib/permissions-context';

// Re-export the permissions hook for convenience
export { usePermissions };

// Helper hook for specific permission checks
export function usePermission(permission: string) {
  const { hasPermission, isLoading } = usePermissions();
  return {
    hasPermission: hasPermission(permission),
    isLoading,
  };
}

// Helper hook for checking multiple permissions (any)
export function useAnyPermission(permissions: string[]) {
  const { hasAnyPermission, isLoading } = usePermissions();
  return {
    hasPermission: hasAnyPermission(permissions),
    isLoading,
  };
}

// Helper hook for checking multiple permissions (all)
export function useAllPermissions(permissions: string[]) {
  const { hasAllPermissions, isLoading } = usePermissions();
  return {
    hasPermission: hasAllPermissions(permissions),
    isLoading,
  };
}

// Role-based hooks
export function useRole(roleId: number) {
  const { hasRole, isLoading } = usePermissions();
  return {
    hasRole: hasRole(roleId),
    isLoading,
  };
}

export function useUserRole() {
  const { getUserRole, isLoading } = usePermissions();
  return {
    role: getUserRole(),
    isLoading,
  };
}

// Predefined permission checks for common app sections
export function useAppointmentAccess() {
  return usePermission('access_appointments');
}

export function useBillingAccess() {
  return usePermission('access_billing');
}

export function useConsultationAccess() {
  return usePermission('access_consultation');
}

export function useInventoryAccess() {
  return usePermission('access_inventory');
}

export function useMessageAccess() {
  return usePermission('access_messages');
}

export function usePatientAccess() {
  return usePermission('access_patients');
}

export function useToolsAccess() {
  return usePermission('access_tools');
}

export function useSettingsAccess() {
  return usePermission('access_settings');
}

export function useProfileAccess() {
  return usePermission('access_profile');
}

// Role-specific hooks
export function useAdminRole() {
  return useRole(1);
}

export function useDoctorRole() {
  return useRole(2);
}

export function useSecretaryRole() {
  return useRole(3);
}

// Role-based permission combinations
export function useDoctorPermissions() {
  const { hasAllPermissions, isLoading } = usePermissions();
  return {
    hasAllDoctorPermissions: hasAllPermissions([
      'access_appointments',
      'access_consultation',
      'access_messages',
      'access_patients',
      'access_tools',
      'access_settings',
      'access_profile'
    ]),
    isLoading,
  };
}

export function useSecretaryPermissions() {
  const { hasAllPermissions, isLoading } = usePermissions();
  return {
    hasAllSecretaryPermissions: hasAllPermissions([
      'access_appointments',
      'access_billing',
      'access_inventory',
      'access_messages',
      'access_patients',
      'access_profile'
    ]),
    isLoading,
  };
}
