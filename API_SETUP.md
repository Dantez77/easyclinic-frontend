# EasyClinic API Setup

This document describes the API setup for the EasyClinic frontend application.

## Environment Configuration

Create a `.env.local` file in the root directory with the following content:

```bash
# EasyClinic API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## API Base URL

The default API base URL is `http://localhost:3001/api` if no environment variable is set.

## Authentication Endpoints

### Login
- **Endpoint**: `POST /auth/login`
- **Request Body**:
  ```json
  {
    "email": "admin@easyclinic.com",
    "password": "admin123"
  }
  ```
- **Response**:
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "9aefeadf-036d-4bfa-b51e-d810548748b9",
      "firstName": "Administrador",
      "lastName": "Sistema",
      "email": "admin@easyclinic.com",
      "phone": "123456789",
      "birthDate": "1990-01-01",
      "active": true,
      "roles": [
        {
          "id": 1,
          "name": "Administrador",
          "description": "Usuario con acceso completo al sistema",
          "active": true
        }
      ]
    }
  }
  ```

### Logout
- **Endpoint**: `POST /auth/logout`
- **Headers**: `Authorization: Bearer <token>`

### Get Current User
- **Endpoint**: `GET /auth/me`
- **Headers**: `Authorization: Bearer <token>`

## API Client Usage

### Basic Usage

```typescript
import { apiClient, authApi } from '@/lib/api';

// Login
const loginResult = await authApi.login({
  email: 'admin@easyclinic.com',
  password: 'admin123'
});

if (loginResult.data) {
  console.log('User:', loginResult.data.user);
  console.log('Token:', loginResult.data.token);
} else {
  console.error('Login failed:', loginResult.error);
}

// Make authenticated requests
const patients = await apiClient.get('/patients');
```

### Authentication Hook

```typescript
import { useAuthContext } from '@/lib/auth-context';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuthContext();

  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }

  return (
    <div>
      <p>Welcome, {user?.firstName}!</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Protected Routes

```typescript
import { ProtectedRoute } from '@/components/protected-route';

function App() {
  return (
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  );
}
```

## File Structure

```
lib/
├── api.ts              # API client and types
├── config.ts           # Configuration and endpoints
└── auth-context.tsx    # Authentication context

hooks/
└── use-auth.ts         # Authentication hook

components/
├── login-form.tsx      # Login form component
└── protected-route.tsx # Route protection component
```

## Features

- **Automatic Token Management**: Tokens are automatically stored in localStorage and included in requests
- **Type Safety**: Full TypeScript support with proper interfaces
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Loading States**: Built-in loading states for better UX
- **Route Protection**: Automatic redirection for unauthenticated users
- **Context Integration**: Authentication state available throughout the app

## Next Steps

1. **Backend Setup**: Ensure your backend API is running on `localhost:3001`
2. **CORS Configuration**: Configure CORS on your backend to allow requests from `localhost:3000`
3. **Additional Endpoints**: Add more API endpoints as needed for patients, appointments, etc.
4. **Error Handling**: Customize error handling based on your backend error format
5. **Refresh Tokens**: Implement refresh token logic if needed

## Testing

To test the API setup:

1. Start your backend server on port 3001
2. Start the Next.js development server: `npm run dev`
3. Navigate to `/login`
4. Use the test credentials:
   - Email: `admin@easyclinic.com`
   - Password: `admin123`

The application should successfully authenticate and redirect to the dashboard.
