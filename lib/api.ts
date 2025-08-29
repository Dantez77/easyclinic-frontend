import { config, API_ENDPOINTS } from './config';

// API Configuration
export const API_BASE_URL = config.api.baseUrl;

// API Response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthDate: string;
  roles: number[];
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthDate: string;
  active: boolean;
  roles: Role[];
}

export interface Role {
  id: number;
  nombre: string;
}

export interface Permission {
  id: number;
  name: string;
  description: string;
  active: boolean;
}

export interface RolePermission {
  id: number;
  roleId: number;
  permissionId: number;
}

// API Client class
class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    // Try to get token from localStorage on client side
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('easyclinic_token');
      console.log('API Client initialized, token from localStorage:', this.token ? 'exists' : 'missing');
    }
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('easyclinic_token', token);
    }
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('easyclinic_token');
    }
  }

  refreshToken() {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('easyclinic_token');
      console.log('Token refreshed from localStorage:', this.token ? 'exists' : 'missing');
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    // Only add timestamp to GET requests to prevent caching
    let url = `${this.baseURL}${endpoint}`;
    if (options.method === 'GET' || !options.method) {
      const timestamp = Date.now();
      url = `${url}${endpoint.includes('?') ? '&' : '?'}_t=${timestamp}`;
    }
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    // Note: Cache-busting headers removed due to CORS restrictions
    // Using timestamp query parameter instead for GET requests

    // Don't add Authorization header to login/register endpoints, but allow it for auth/me
    if (this.token && !endpoint.includes('/auth/login') && !endpoint.includes('/auth/register')) {
      headers.Authorization = `Bearer ${this.token}`;
      console.log('Adding Authorization header for endpoint:', endpoint);
    } else {
      console.log('No Authorization header for endpoint:', endpoint, 'token:', this.token ? 'exists' : 'missing');
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok && response.status !== 304) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      // Handle 304 Not Modified - return cached data or empty response
      if (response.status === 304) {
        // For 304, we need to handle this case specially
        // Return an empty response to trigger fallback to role-based permissions
        return { error: 'Cached response, using fallback permissions' };
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'An unknown error occurred',
      };
    }
  }

  // Auth endpoints
  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    const response = await this.request<LoginResponse>(API_ENDPOINTS.auth.login, {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (response.data?.token) {
      this.setToken(response.data.token);
    }

    return response;
  }

  async register(userData: RegisterRequest): Promise<ApiResponse<User>> {
    return this.request<User>(API_ENDPOINTS.auth.register, {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async logout(): Promise<void> {
    try {
      await this.request(API_ENDPOINTS.auth.logout, { method: 'POST' });
    } finally {
      this.clearToken();
    }
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    // Refresh token from localStorage before making request
    this.refreshToken();
    console.log('Getting current user, token:', this.token ? 'exists' : 'missing');
    return this.request<User>(API_ENDPOINTS.auth.me);
  }

  // Generic methods for other endpoints
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// Export singleton instance
export const apiClient = new ApiClient(API_BASE_URL);

// Export individual functions for convenience
export const authApi = {
  login: (credentials: LoginRequest) => apiClient.login(credentials),
  logout: () => apiClient.logout(),
  getCurrentUser: () => apiClient.getCurrentUser(),
  register: (userData: RegisterRequest) => apiClient.register(userData),
};

// Permissions API
export const permissionsApi = {
  getUserPermissions: async () => {
    try {
      const response = await apiClient.get<{
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
      }>('/permissions/user');
      
      // Return the data portion of the response
      if (response.data && response.data.success) {
        return { data: response.data };
      } else {
        return { data: null, error: 'Failed to fetch permissions' };
      }
    } catch (error) {
      return { data: null, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  },
  checkPermission: (permission: string) => apiClient.get<{ hasPermission: boolean }>(`/permissions/check/${permission}`),
  checkPermissions: (permissions: string[]) => apiClient.post<{ hasPermissions: boolean[] }>('/permissions/check-multiple', { permissions }),
};
