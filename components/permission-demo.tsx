'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  usePermissions, 
  usePermission, 
  useAppointmentAccess,
  useBillingAccess,
  usePatientAccess,
  useUserRole,
  useAdminRole,
  useDoctorRole,
  useSecretaryRole,
  useDoctorPermissions,
  useSecretaryPermissions
} from '@/hooks/use-permissions';
import { 
  PermissionGuard, 
  AppointmentAccessGuard,
  BillingAccessGuard,
  PatientAccessGuard 
} from '@/components/permission-guard';
import { PermissionDebug } from '@/components/permission-debug';

export function PermissionDemo() {
  const { permissions, hasPermission, hasAnyPermission, hasAllPermissions } = usePermissions();
  const { hasPermission: hasAppointmentAccess, isLoading: appointmentLoading } = useAppointmentAccess();
  const { hasPermission: hasBillingAccess, isLoading: billingLoading } = useBillingAccess();
  const { hasPermission: hasPatientAccess, isLoading: patientLoading } = usePatientAccess();
  
  // Role-based hooks
  const { role: userRole, isLoading: roleLoading } = useUserRole();
  const { hasRole: isAdmin, isLoading: adminLoading } = useAdminRole();
  const { hasRole: isDoctor, isLoading: doctorLoading } = useDoctorRole();
  const { hasRole: isSecretary, isLoading: secretaryLoading } = useSecretaryRole();
  const { hasAllDoctorPermissions, isLoading: doctorPermsLoading } = useDoctorPermissions();
  const { hasAllSecretaryPermissions, isLoading: secretaryPermsLoading } = useSecretaryPermissions();

  return (
    <div className="space-y-6 p-6">
      {/* Debug Component - Remove this after fixing permissions */}
      <PermissionDebug />

      <Card>
        <CardHeader>
          <CardTitle>Permission System Demo</CardTitle>
          <CardDescription>
            This component demonstrates different ways to use the permission system
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Current User Role */}
          <div>
            <h3 className="font-semibold mb-2">Your Current Role:</h3>
            <div className="flex items-center gap-2">
              {roleLoading ? (
                <Badge variant="outline">Loading...</Badge>
              ) : userRole ? (
                <Badge variant="default">
                  {userRole.name} (ID: {userRole.id})
                </Badge>
              ) : (
                <Badge variant="outline">No role assigned</Badge>
              )}
            </div>
          </div>

          {/* Role Checks */}
          <div>
            <h3 className="font-semibold mb-2">Role-Based Access:</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Admin Role</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Badge variant={isAdmin ? "default" : "outline"}>
                      {isAdmin ? "Yes" : "No"}
                    </Badge>
                    {adminLoading && <span className="text-sm text-muted-foreground">Loading...</span>}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Doctor Role</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Badge variant={isDoctor ? "default" : "outline"}>
                      {isDoctor ? "Yes" : "No"}
                    </Badge>
                    {doctorLoading && <span className="text-sm text-muted-foreground">Loading...</span>}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Secretary Role</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Badge variant={isSecretary ? "default" : "outline"}>
                      {isSecretary ? "Yes" : "No"}
                    </Badge>
                    {secretaryLoading && <span className="text-sm text-muted-foreground">Loading...</span>}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Role Permission Combinations */}
          <div>
            <h3 className="font-semibold mb-2">Role Permission Sets:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Doctor Permissions</CardTitle>
                  <CardDescription>
                    All 7 doctor permissions: appointments, consultation, messages, patients, tools, settings, profile
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Badge variant={hasAllDoctorPermissions ? "default" : "destructive"}>
                      {hasAllDoctorPermissions ? "Complete Set" : "Incomplete Set"}
                    </Badge>
                    {doctorPermsLoading && <span className="text-sm text-muted-foreground">Loading...</span>}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Secretary Permissions</CardTitle>
                  <CardDescription>
                    All 6 secretary permissions: appointments, billing, inventory, messages, patients, profile
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Badge variant={hasAllSecretaryPermissions ? "default" : "destructive"}>
                      {hasAllSecretaryPermissions ? "Complete Set" : "Incomplete Set"}
                    </Badge>
                    {secretaryPermsLoading && <span className="text-sm text-muted-foreground">Loading...</span>}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Current User Permissions */}
          <div>
            <h3 className="font-semibold mb-2">Your Current Permissions:</h3>
            <div className="flex flex-wrap gap-2">
              {permissions.map((permission) => (
                <Badge key={permission.id} variant="secondary">
                  {permission.name}
                </Badge>
              ))}
              {permissions.length === 0 && (
                <Badge variant="outline">No permissions found</Badge>
              )}
            </div>
          </div>

          {/* Permission Checks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Appointment Access</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Badge variant={hasAppointmentAccess ? "default" : "destructive"}>
                    {hasAppointmentAccess ? "Access Granted" : "Access Denied"}
                  </Badge>
                  {appointmentLoading && <span className="text-sm text-muted-foreground">Loading...</span>}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Billing Access</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Badge variant={hasBillingAccess ? "default" : "destructive"}>
                    {hasBillingAccess ? "Access Granted" : "Access Denied"}
                  </Badge>
                  {billingLoading && <span className="text-sm text-muted-foreground">Loading...</span>}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Patient Access</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Badge variant={hasPatientAccess ? "default" : "destructive"}>
                    {hasPatientAccess ? "Access Granted" : "Access Denied"}
                  </Badge>
                  {patientLoading && <span className="text-sm text-muted-foreground">Loading...</span>}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Multiple Permissions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Any of [appointments, billing]:</span>
                    <Badge variant={hasAnyPermission(['access_appointments', 'access_billing']) ? "default" : "destructive"}>
                      {hasAnyPermission(['access_appointments', 'access_billing']) ? "Yes" : "No"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">All of [appointments, billing]:</span>
                    <Badge variant={hasAllPermissions(['access_appointments', 'access_billing']) ? "default" : "destructive"}>
                      {hasAllPermissions(['access_appointments', 'access_billing']) ? "Yes" : "No"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Role-Based Content Display */}
          <div className="space-y-4">
            <h3 className="font-semibold">Role-Based Content Display:</h3>
            
            {/* Admin Content */}
            <PermissionGuard requiredPermissions="access_tools">
              <Card className="border-green-200 bg-green-50">
                <CardHeader>
                  <CardTitle className="text-sm text-green-800">Admin Panel</CardTitle>
                  <CardDescription className="text-green-600">
                    This content is only visible to administrators
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-green-700 mb-2">
                    As an admin, you have access to all system features including tools and advanced settings.
                  </p>
                  <Button size="sm" variant="outline" className="border-green-300 text-green-700">
                    Access Admin Tools
                  </Button>
                </CardContent>
              </Card>
            </PermissionGuard>

            {/* Doctor Content */}
            <PermissionGuard requiredPermissions="access_consultation">
              <Card className="border-blue-200 bg-blue-50">
                <CardHeader>
                  <CardTitle className="text-sm text-blue-800">Doctor Dashboard</CardTitle>
                  <CardDescription className="text-blue-600">
                    This content is only visible to doctors
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-blue-700 mb-2">
                    As a doctor, you can manage consultations, patient records, and medical tools.
                  </p>
                  <Button size="sm" variant="outline" className="border-blue-300 text-blue-700">
                    Start Consultation
                  </Button>
                </CardContent>
              </Card>
            </PermissionGuard>

            {/* Secretary Content */}
            <PermissionGuard requiredPermissions="access_billing">
              <Card className="border-purple-200 bg-purple-50">
                <CardHeader>
                  <CardTitle className="text-sm text-purple-800">Secretary Dashboard</CardTitle>
                  <CardDescription className="text-purple-600">
                    This content is only visible to secretaries
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-purple-700 mb-2">
                    As a secretary, you can manage appointments, billing, and inventory.
                  </p>
                  <Button size="sm" variant="outline" className="border-purple-300 text-purple-700">
                    Manage Billing
                  </Button>
                </CardContent>
              </Card>
            </PermissionGuard>
          </div>

          {/* Permission Guards Demo */}
          <div className="space-y-4">
            <h3 className="font-semibold">Permission Guards Demo:</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <AppointmentAccessGuard
                fallback={
                  <Card className="border-dashed">
                    <CardContent className="p-4 text-center text-muted-foreground">
                      <p>No appointment access</p>
                    </CardContent>
                  </Card>
                }
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Appointments Module</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-2">
                      You have access to appointments
                    </p>
                    <Button size="sm">View Appointments</Button>
                  </CardContent>
                </Card>
              </AppointmentAccessGuard>

              <BillingAccessGuard
                fallback={
                  <Card className="border-dashed">
                    <CardContent className="p-4 text-center text-muted-foreground">
                      <p>No billing access</p>
                    </CardContent>
                  </Card>
                }
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Billing Module</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-2">
                      You have access to billing
                    </p>
                    <Button size="sm">View Billing</Button>
                  </CardContent>
                </Card>
              </BillingAccessGuard>

              <PatientAccessGuard
                fallback={
                  <Card className="border-dashed">
                    <CardContent className="p-4 text-center text-muted-foreground">
                      <p>No patient access</p>
                    </CardContent>
                  </Card>
                }
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Patients Module</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-2">
                      You have access to patients
                    </p>
                    <Button size="sm">View Patients</Button>
                  </CardContent>
                </Card>
              </PatientAccessGuard>
            </div>

            {/* Custom Permission Guard */}
            <div className="mt-4">
              <h4 className="font-medium mb-2">Custom Permission Guard:</h4>
              <PermissionGuard 
                requiredPermissions={['access_appointments', 'access_billing']}
                requireAll={false}
                fallback={
                  <Card className="border-dashed">
                    <CardContent className="p-4 text-center text-muted-foreground">
                      <p>You need either appointment or billing access</p>
                    </CardContent>
                  </Card>
                }
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Advanced Module</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-2">
                      You have access to either appointments or billing
                    </p>
                    <Button size="sm">Access Advanced Features</Button>
                  </CardContent>
                </Card>
              </PermissionGuard>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
