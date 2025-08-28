# Permission System Documentation

This document explains how to use the permission system in the EasyClinic frontend application.

## Overview

The permission system is designed to work seamlessly with your backend middleware (`requirePermission`, `requireAllPermissions`). It provides:

- **Route-level protection**: Automatically checks permissions when users navigate to protected routes
- **Component-level protection**: Wrap components with permission guards to show/hide content
- **Hook-based checks**: Use hooks to check permissions in your components
- **Role-based access**: Check user roles and role-specific permissions
- **Automatic UI updates**: Navigation items and UI elements automatically hide/show based on permissions

## Role-Based Permission System

Your application uses a role-based permission system with the following roles:

### **Administrador (ID: 1)**
- **All 9 permissions** are automatically assigned
- Full access to the entire system

### **Doctor (ID: 2)**
- `access_appointments` (ID: 1)
- `access_consultation` (ID: 3)
- `access_messages` (ID: 5)
- `access_patients` (ID: 6)
- `access_tools` (ID: 7)
- `access_settings` (ID: 8)
- `access_profile` (ID: 9)

### **Secretary/Receptionist (ID: 3)**
- `access_appointments` (ID: 1)
- `access_billing` (ID: 2)
- `access_inventory` (ID: 4)
- `access_messages` (ID: 5)
- `access_patients` (ID: 6)
- `access_profile` (ID: 9)

## Architecture

```
PermissionsProvider (Context)
├── RouteGuard (Route-level protection)
├── PermissionGuard (Component-level protection)
├── usePermissions (Hook for permission checks)
├── Role-based hooks (useAdminRole, useDoctorRole, etc.)
└── AppSidebar (Navigation filtering)
```

## Setup

The permission system is already set up in your application. The `PermissionsProvider` wraps your entire app in `app/layout.tsx`.

## Usage Examples

### 1. Route-Level Protection

Routes are automatically protected based on the `ROUTE_PERMISSIONS` mapping in `components/route-guard.tsx`:

```typescript
const ROUTE_PERMISSIONS: Record<string, string> = {
  '/appointments': 'access_appointments',
  '/patients': 'access_patients',
  '/billing': 'access_billing',
  '/inventory': 'access_inventory',
  // ... more routes
};
```

If a user tries to access `/appointments` without the `access_appointments` permission, they'll be redirected to the unauthorized page.

### 2. Role-Based Permission Checks

#### Check User's Role

```tsx
import { useUserRole, useAdminRole, useDoctorRole, useSecretaryRole } from '@/hooks/use-permissions';

function UserProfile() {
  const { role } = useUserRole();
  const { hasRole: isAdmin } = useAdminRole();
  const { hasRole: isDoctor } = useDoctorRole();
  const { hasRole: isSecretary } = useSecretaryRole();
  
  return (
    <div>
      {role && (
        <p>Current Role: {role.name} (ID: {role.id})</p>
      )}
      
      {isAdmin && <AdminPanel />}
      {isDoctor && <DoctorDashboard />}
      {isSecretary && <SecretaryDashboard />}
    </div>
  );
}
```

#### Check Role Permission Sets

```tsx
import { useDoctorPermissions, useSecretaryPermissions } from '@/hooks/use-permissions';

function RoleValidation() {
  const { hasAllDoctorPermissions } = useDoctorPermissions();
  const { hasAllSecretaryPermissions } = useSecretaryPermissions();
  
  return (
    <div>
      {hasAllDoctorPermissions && (
        <p>✅ User has complete doctor permission set (7 permissions)</p>
      )}
      
      {hasAllSecretaryPermissions && (
        <p>✅ User has complete secretary permission set (6 permissions)</p>
      )}
    </div>
  );
}
```

### 3. Component-Level Protection

#### Using PermissionGuard Component

```tsx
import { PermissionGuard } from '@/components/permission-guard';

function MyComponent() {
  return (
    <PermissionGuard requiredPermissions="access_appointments">
      <div>This content is only visible to users with appointment access</div>
    </PermissionGuard>
  );
}
```

#### Using Specific Permission Guards

```tsx
import { AppointmentAccessGuard } from '@/components/permission-guard';

function AppointmentsSection() {
  return (
    <AppointmentAccessGuard
      fallback={<div>You don't have access to appointments</div>}
    >
      <div>Appointments content here</div>
    </AppointmentAccessGuard>
  );
}
```

#### Multiple Permissions

```tsx
// Require ANY of the permissions
<PermissionGuard 
  requiredPermissions={['access_appointments', 'access_billing']}
  requireAll={false}
>
  <div>Content visible if user has either permission</div>
</PermissionGuard>

// Require ALL of the permissions
<PermissionGuard 
  requiredPermissions={['access_appointments', 'access_billing']}
  requireAll={true}
>
  <div>Content visible only if user has both permissions</div>
</PermissionGuard>
```

### 4. Hook-Based Permission Checks

#### Basic Permission Hook

```tsx
import { usePermission } from '@/hooks/use-permissions';

function MyComponent() {
  const { hasPermission, isLoading } = usePermission('access_appointments');
  
  if (isLoading) return <div>Loading...</div>;
  
  return (
    <div>
      {hasPermission ? (
        <button>Create Appointment</button>
      ) : (
        <p>You don't have permission to create appointments</p>
      )}
    </div>
  );
}
```

#### Specific Permission Hooks

```tsx
import { useAppointmentAccess, useBillingAccess } from '@/hooks/use-permissions';

function Dashboard() {
  const { hasPermission: hasAppointmentAccess } = useAppointmentAccess();
  const { hasPermission: hasBillingAccess } = useBillingAccess();
  
  return (
    <div>
      {hasAppointmentAccess && <AppointmentsWidget />}
      {hasBillingAccess && <BillingWidget />}
    </div>
  );
}
```

#### Role-Based Permission Hooks

```tsx
import { useAdminRole, useDoctorRole, useSecretaryRole } from '@/hooks/use-permissions';

function RoleBasedContent() {
  const { hasRole: isAdmin } = useAdminRole();
  const { hasRole: isDoctor } = useDoctorRole();
  const { hasRole: isSecretary } = useSecretaryRole();
  
  return (
    <div>
      {isAdmin && <AdminOnlyContent />}
      {isDoctor && <DoctorOnlyContent />}
      {isSecretary && <SecretaryOnlyContent />}
    </div>
  );
}
```

#### Multiple Permission Checks

```tsx
import { usePermissions } from '@/hooks/use-permissions';

function AdvancedComponent() {
  const { hasAnyPermission, hasAllPermissions } = usePermissions();
  
  const canAccessAdvanced = hasAnyPermission(['access_appointments', 'access_billing']);
  const canAccessAdmin = hasAllPermissions(['access_appointments', 'access_billing', 'access_admin']);
  
  return (
    <div>
      {canAccessAdvanced && <AdvancedFeatures />}
      {canAccessAdmin && <AdminPanel />}
    </div>
  );
}
```

### 5. Navigation Filtering

The sidebar automatically filters navigation items based on user permissions. Navigation items are defined with their required permissions:

```typescript
const authenticatedNavigationItems = [
  { key: "nav.home", icon: Heart, href: "/", permission: null },
  { key: "nav.appointments", icon: Calendar, href: "/appointments", permission: "access_appointments" },
  { key: "nav.billing", icon: Receipt, href: "/billing", permission: "access_billing" },
  // ... more items
];
```

Items with `permission: null` are always visible. Items with specific permissions are only shown if the user has access.

## Available Permissions

Based on your backend middleware, these permissions are available:

- `access_appointments` - Access to appointments module
- `access_billing` - Access to billing module
- `access_consultation` - Access to consultation module
- `access_inventory` - Access to inventory module
- `access_messages` - Access to messages module
- `access_patients` - Access to patients module
- `access_tools` - Access to tools module
- `access_settings` - Access to settings module
- `access_profile` - Access to profile module
- `access_activity_logs` - Access to activity logs

## Role-Based Hooks

### Basic Role Hooks
- `useUserRole()` - Get current user's role information
- `useRole(roleId)` - Check if user has a specific role
- `useAdminRole()` - Check if user is an administrator
- `useDoctorRole()` - Check if user is a doctor
- `useSecretaryRole()` - Check if user is a secretary

### Permission Hooks
- `useAppointmentAccess()` - Check appointment access permission
- `useBillingAccess()` - Check billing access permission
- `useConsultationAccess()` - Check consultation access permission
- `useInventoryAccess()` - Check inventory access permission
- `useMessageAccess()` - Check message access permission
- `usePatientAccess()` - Check patient access permission
- `useToolsAccess()` - Check tools access permission
- `useSettingsAccess()` - Check settings access permission
- `useProfileAccess()` - Check profile access permission

### Role Permission Set Hooks
- `useDoctorPermissions()` - Check if user has all doctor permissions
- `useSecretaryPermissions()` - Check if user has all secretary permissions

## Backend Integration

The frontend permission system works with your backend middleware:

```javascript
// Backend route protection
router.get('/appointments', requirePermission('access_appointments'), (req, res) => {
  // Route handler
});

// Frontend automatically checks the same permission
// and redirects unauthorized users
```

## Error Handling

### Unauthorized Access

When a user tries to access a route without permission:
1. They're redirected to `/unauthorized`
2. A user-friendly error message is shown
3. Options to go back or return to home are provided

### Loading States

Permission checks show loading states while:
- User authentication is being verified
- User permissions are being fetched
- Route permissions are being checked

## Best Practices

### 1. Use Role-Based Checks for Major Features

```tsx
// Good: Check role for major feature access
const { hasRole: isAdmin } = useAdminRole();
{isAdmin && <AdminPanel />}

// Good: Check specific permissions for granular access
const { hasPermission } = useAppointmentAccess();
{hasPermission && <CreateAppointmentButton />}
```

### 2. Use Permission Guards for UI Elements

```tsx
// Good: Wrap entire sections
<AppointmentAccessGuard>
  <AppointmentsSection />
</AppointmentAccessGuard>

// Good: Use hooks for conditional rendering
const { hasPermission } = useAppointmentAccess();
{hasPermission && <CreateAppointmentButton />}
```

### 3. Provide Fallback Content

```tsx
<PermissionGuard 
  requiredPermissions="access_appointments"
  fallback={<UpgradePrompt />}
>
  <AppointmentsContent />
</PermissionGuard>
```

### 4. Handle Loading States

```tsx
const { hasPermission, isLoading } = useAppointmentAccess();

if (isLoading) return <Skeleton />;
if (!hasPermission) return <AccessDenied />;

return <AppointmentsContent />;
```

### 5. Group Related Permissions

```tsx
// Check if user can access any patient-related features
const canAccessPatients = hasAnyPermission([
  'access_patients',
  'access_patient_records',
  'access_patient_billing'
]);
```

## Troubleshooting

### Common Issues

1. **Permissions not loading**: Check that `PermissionsProvider` wraps your app
2. **Route protection not working**: Verify `ROUTE_PERMISSIONS` mapping in route guard
3. **Sidebar items not filtering**: Ensure navigation items have correct permission properties
4. **Role checks not working**: Verify user has roles assigned in the backend

### Debug Mode

Add this to your component to debug permissions:

```tsx
import { usePermissions, useUserRole } from '@/hooks/use-permissions';

function DebugComponent() {
  const { permissions, hasPermission } = usePermissions();
  const { role } = useUserRole();
  
  console.log('User role:', role);
  console.log('User permissions:', permissions);
  console.log('Has appointment access:', hasPermission('access_appointments'));
  
  return <div>Check console for debug info</div>;
}
```

## API Endpoints

The permission system expects these backend endpoints:

- `GET /api/permissions/user` - Get current user's permissions
- `GET /api/permissions/check/:permission` - Check specific permission
- `POST /api/permissions/check-multiple` - Check multiple permissions

## Security Notes

- Frontend permission checks are for UX purposes only
- Always implement permission checks on the backend
- Never expose sensitive data based on frontend permission checks alone
- Use the backend middleware as the source of truth for permissions
- Role-based checks provide an additional layer of security

## Examples in Your Codebase

See `components/permission-demo.tsx` for a comprehensive example of all permission system features, including role-based functionality.

## Role-Based Content Examples

### Admin-Only Content
```tsx
<PermissionGuard requiredPermissions="access_tools">
  <AdminPanel />
</PermissionGuard>
```

### Doctor-Only Content
```tsx
<PermissionGuard requiredPermissions="access_consultation">
  <DoctorDashboard />
</PermissionGuard>
```

### Secretary-Only Content
```tsx
<PermissionGuard requiredPermissions="access_billing">
  <SecretaryDashboard />
</PermissionGuard>
```

### Cross-Role Content
```tsx
<PermissionGuard 
  requiredPermissions={['access_appointments', 'access_patients']}
  requireAll={false}
>
  <PatientManagement />
</PermissionGuard>
```
