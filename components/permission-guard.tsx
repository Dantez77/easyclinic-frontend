'use client';

import React from 'react';
import { usePermissions } from '@/lib/permissions-context';

interface PermissionGuardProps {
  children: React.ReactNode;
  requiredPermissions: string | string[];
  requireAll?: boolean;
  fallback?: React.ReactNode;
  showLoading?: boolean;
}

export function PermissionGuard({ 
  children, 
  requiredPermissions, 
  requireAll = false,
  fallback = null,
  showLoading = true 
}: PermissionGuardProps) {
  const { 
    hasPermission, 
    hasAnyPermission, 
    hasAllPermissions, 
    isLoading 
  } = usePermissions();

  // Don't show anything while loading if showLoading is false
  if (isLoading && !showLoading) {
    return null;
  }

  // Show loading state if enabled
  if (isLoading && showLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Check permissions based on requirements
  let hasAccess = false;
  
  if (Array.isArray(requiredPermissions)) {
    if (requireAll) {
      hasAccess = hasAllPermissions(requiredPermissions);
    } else {
      hasAccess = hasAnyPermission(requiredPermissions);
    }
  } else {
    hasAccess = hasPermission(requiredPermissions);
  }

  // Show children if user has access, otherwise show fallback
  if (hasAccess) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
}

// Convenience components for common permission checks
export function AppointmentAccessGuard({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  return (
    <PermissionGuard requiredPermissions="access_appointments" fallback={fallback}>
      {children}
    </PermissionGuard>
  );
}

export function BillingAccessGuard({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  return (
    <PermissionGuard requiredPermissions="access_billing" fallback={fallback}>
      {children}
    </PermissionGuard>
  );
}

export function ConsultationAccessGuard({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  return (
    <PermissionGuard requiredPermissions="access_consultation" fallback={fallback}>
      {children}
    </PermissionGuard>
  );
}

export function InventoryAccessGuard({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  return (
    <PermissionGuard requiredPermissions="access_inventory" fallback={fallback}>
      {children}
    </PermissionGuard>
  );
}

export function MessageAccessGuard({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  return (
    <PermissionGuard requiredPermissions="access_messages" fallback={fallback}>
      {children}
    </PermissionGuard>
  );
}

export function PatientAccessGuard({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  return (
    <PermissionGuard requiredPermissions="access_patients" fallback={fallback}>
      {children}
    </PermissionGuard>
  );
}

export function ToolsAccessGuard({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  return (
    <PermissionGuard requiredPermissions="access_tools" fallback={fallback}>
      {children}
    </PermissionGuard>
  );
}

export function SettingsAccessGuard({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  return (
    <PermissionGuard requiredPermissions="access_settings" fallback={fallback}>
      {children}
    </PermissionGuard>
  );
}

export function ProfileAccessGuard({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  return (
    <PermissionGuard requiredPermissions="access_profile" fallback={fallback}>
      {children}
    </PermissionGuard>
  );
}
