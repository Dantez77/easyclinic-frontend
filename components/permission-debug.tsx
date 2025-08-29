'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { usePermissions } from '@/lib/permissions-context';
import { useAuthContext } from '@/lib/auth-context';

export function PermissionDebug() {
  const { permissions, isLoading, hasPermission } = usePermissions();
  const { user } = useAuthContext();

  return (
    <Card className="border-orange-200 bg-orange-50">
      <CardHeader>
        <CardTitle className="text-orange-800 text-sm">🔍 Permission Debug Info</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* User Info */}
        <div>
          <h4 className="font-medium text-orange-800 mb-2">User Information:</h4>
          <div className="text-sm space-y-1">
            <p><strong>ID:</strong> {user?.id || 'N/A'}</p>
            <p><strong>Name:</strong> {user?.firstName} {user?.lastName}</p>
            <p><strong>Email:</strong> {user?.email || 'N/A'}</p>
          </div>
        </div>

        {/* Roles Info */}
        <div>
          <h4 className="font-medium text-orange-800 mb-2">User Roles:</h4>
          {user?.roles && user.roles.length > 0 ? (
            <div className="space-y-1">
              {user.roles.map((role, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    ID: {role.id}
                  </Badge>
                  <span className="text-sm">{role.nombre}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-orange-600">No roles assigned</p>
          )}
        </div>

        {/* Permissions Info */}
        <div>
          <h4 className="font-medium text-orange-800 mb-2">Permissions Status:</h4>
          <div className="text-sm space-y-1">
            <p><strong>Loading:</strong> {isLoading ? 'Yes' : 'No'}</p>
            <p><strong>Total Permissions:</strong> {permissions.length}</p>
            <p><strong>Permissions Source:</strong> {permissions.length > 0 ? 'API/Backend' : 'Role-based (fallback)'}</p>
          </div>
        </div>

        {/* Individual Permissions */}
        {permissions.length > 0 && (
          <div>
            <h4 className="font-medium text-orange-800 mb-2">Individual Permissions:</h4>
            <div className="grid grid-cols-2 gap-2">
              {permissions.map((permission) => (
                <div key={permission.id} className="flex items-center gap-2">
                  <Badge 
                    variant={permission.active ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {permission.name}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    ID: {permission.id}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Permission Checks */}
        <div>
          <h4 className="font-medium text-orange-800 mb-2">Permission Checks:</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-2">
              <span>Appointments:</span>
              <Badge variant={hasPermission('access_appointments') ? "default" : "destructive"}>
                {hasPermission('access_appointments') ? "Yes" : "No"}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <span>Billing:</span>
              <Badge variant={hasPermission('access_billing') ? "default" : "destructive"}>
                {hasPermission('access_billing') ? "Yes" : "No"}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <span>Consultation:</span>
              <Badge variant={hasPermission('access_consultation') ? "default" : "destructive"}>
                {hasPermission('access_consultation') ? "Yes" : "No"}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <span>Inventory:</span>
              <Badge variant={hasPermission('access_inventory') ? "default" : "destructive"}>
                {hasPermission('access_inventory') ? "Yes" : "No"}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <span>Messages:</span>
              <Badge variant={hasPermission('access_messages') ? "default" : "destructive"}>
                {hasPermission('access_messages') ? "Yes" : "No"}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <span>Patients:</span>
              <Badge variant={hasPermission('access_patients') ? "default" : "destructive"}>
                {hasPermission('access_patients') ? "Yes" : "No"}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <span>Tools:</span>
              <Badge variant={hasPermission('access_tools') ? "default" : "destructive"}>
                {hasPermission('access_tools') ? "Yes" : "No"}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <span>Settings:</span>
              <Badge variant={hasPermission('access_settings') ? "default" : "destructive"}>
                {hasPermission('access_settings') ? "Yes" : "No"}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <span>Profile:</span>
              <Badge variant={hasPermission('access_profile') ? "default" : "destructive"}>
                {hasPermission('access_profile') ? "Yes" : "No"}
              </Badge>
            </div>
          </div>
        </div>

        {/* Raw Data */}
        <details className="text-xs">
          <summary className="cursor-pointer text-orange-700 font-medium">Raw Permission Data</summary>
          <pre className="mt-2 p-2 bg-orange-100 rounded text-xs overflow-auto">
            {JSON.stringify({ permissions, user: user?.roles }, null, 2)}
          </pre>
        </details>
      </CardContent>
    </Card>
  );
}
