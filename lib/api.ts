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
  phone?: string; // Made optional
  birthDate?: string; // Made optional
  roles: number[];
  password: string;
}

export interface UpdateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthDate: string;
  active: boolean;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ChangePasswordResponse {
  message: string;
}

export interface UpdateUserResponse {
  message: string;
  user: User;
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
  phone?: string; // Made optional
  birthDate?: string; // Made optional
  active: boolean;
  clinic_id: number; // New field from backend
  roles: Role[];
  Clinic: Clinic; // New nested object from backend
}

export interface Role {
  id: number;
  name: string; // Changed from 'nombre' to 'name' for consistency
  description?: string; // Added description field from backend
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

export interface ClinicUsersResponse {
  clinic: {
    clinic_id: number;
    clinic_name: string;
  };
  users: ClinicUser[];
}

export interface ClinicUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthDate: string;
  active: boolean;
  roles: Role[];
}

export interface Clinic {
  clinic_id: number;
  clinic_name: string;
  phone?: string;
  address?: string;
  email?: string;
}

export interface ClinicWithUsers extends Clinic {
  users: Array<{
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    active: boolean;
  }>;
}

export interface DoctorProfile {
  id: string;
  name: string;
  specialty: string;
  avatar: {
    imageUrl: string;
    initials: string;
  };
  acceptingNewPatients: boolean;
  isBoardCertified: boolean;
  yearsInPractice: string;
  contact: {
    phone: string;
    email: string;
  };
  location: {
    address: string;
  };
  officeHours: string;
  bio: string;
  education: string[];
  specializations: string[];
  languages: string[];
  hospitalAffiliations: string[];
  gender: string;
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

    // Don't add Authorization header to login endpoint, but require it for register and other endpoints
    if (this.token && !endpoint.includes('/auth/login')) {
      headers.Authorization = `Bearer ${this.token}`;
      console.log('Adding Authorization header for endpoint:', endpoint);
      console.log('Token preview:', this.token.substring(0, 20) + '...');
    } else if (endpoint.includes('/auth/register') && !this.token) {
      // Register endpoint now requires authentication
      console.log('Register endpoint requires authentication but no token found');
      return { error: 'Authentication required for user registration' };
    } else if (!endpoint.includes('/auth/login')) {
      console.log('No Authorization header for endpoint:', endpoint, 'token:', this.token ? 'exists' : 'missing');
    }

    console.log('Making request to:', url);
    console.log('Request headers:', headers);
    console.log('Request method:', options.method || 'GET');
    if (options.body) {
      console.log('Request body:', options.body);
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok && response.status !== 304) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        
        // Provide specific error messages for common status codes
        switch (response.status) {
          case 400:
            errorMessage = 'Bad Request - Invalid data provided';
            break;
          case 401:
            errorMessage = 'Unauthorized - Please log in again';
            break;
          case 403:
            errorMessage = 'Forbidden - You do not have permission to perform this action';
            break;
          case 404:
            errorMessage = 'Not Found - The requested resource was not found';
            break;
          case 409:
            errorMessage = 'Conflict - The resource already exists or conflicts with current state';
            break;
          case 422:
            errorMessage = 'Unprocessable Entity - Validation failed';
            break;
          case 500:
            errorMessage = 'Internal Server Error - Please try again later';
            break;
          default:
            errorMessage = `HTTP error! status: ${response.status}`;
        }
        
        try {
          const errorData = await response.json();
          if (errorData.message) {
            errorMessage = errorData.message;
          } else if (errorData.error) {
            errorMessage = errorData.error;
          } else if (typeof errorData === 'string') {
            errorMessage = errorData;
          } else if (Object.keys(errorData).length > 0) {
            errorMessage = JSON.stringify(errorData);
          }
        } catch (parseError) {
          // If we can't parse the response as JSON, try to get text
          try {
            const errorText = await response.text();
            if (errorText && errorText.trim()) {
              errorMessage = errorText;
            }
          } catch (textError) {
            // If all else fails, use the status text
            errorMessage = response.statusText || errorMessage;
          }
        }
        
        throw new Error(errorMessage);
      }

      // Handle 304 Not Modified - return cached data or empty response
      if (response.status === 304) {
        // For 304, we need to handle this case specially
        // Return an empty response to trigger fallback to role-based permissions
        return { error: 'Cached response, using fallback permissions' };
      }

      // Handle empty responses (like 204 No Content)
      if (response.status === 204 || response.headers.get('content-length') === '0') {
        return { data: null as T };
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      console.error('API request error:', error);
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
    // Ensure we have a token for registration
    if (!this.token) {
      return { error: 'Authentication required for user registration. Please login first.' };
    }
    
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

  async getClinic(clinicId: number): Promise<ApiResponse<ClinicWithUsers>> {
    return this.request<ClinicWithUsers>(API_ENDPOINTS.clinic.get(clinicId));
  }

  async getClinicUsers(clinicId: number): Promise<ApiResponse<ClinicUsersResponse>> {
    return this.request<ClinicUsersResponse>(API_ENDPOINTS.clinic.getUsers(clinicId));
  }

  async getDoctorProfile(doctorId: string): Promise<ApiResponse<DoctorProfile>> {
    return this.request<DoctorProfile>(API_ENDPOINTS.doctorProfile.get(doctorId));
  }

  async updateDoctorProfile(doctorId: string, profileData: Partial<DoctorProfile>): Promise<ApiResponse<DoctorProfile>> {
    return this.request<DoctorProfile>(API_ENDPOINTS.doctorProfile.update(doctorId), {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  async updateUser(userId: string, userData: UpdateUserRequest): Promise<ApiResponse<UpdateUserResponse>> {
    // Refresh token from localStorage before making request
    this.refreshToken();
    
    console.log('updateUser called with:', { userId, userData });
    console.log('API endpoint:', API_ENDPOINTS.users.update(userId));
    console.log('Current token exists:', !!this.token);
    
    const response = await this.request<UpdateUserResponse>(API_ENDPOINTS.users.update(userId), {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
    
    console.log('updateUser response:', response);
    return response;
  }

  async changePassword(userId: string, passwordData: ChangePasswordRequest): Promise<ApiResponse<ChangePasswordResponse>> {
    // Refresh token from localStorage before making request
    this.refreshToken();
    
    const endpoint = API_ENDPOINTS.users.changePassword(userId);
    const fullUrl = `${this.baseURL}${endpoint}`;
    
    console.log('changePassword - User ID:', userId);
    console.log('changePassword - Full URL:', fullUrl);
    console.log('changePassword - Token exists:', !!this.token);
    
    const response = await this.request<ChangePasswordResponse>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(passwordData),
    });
    
    console.log('changePassword response:', response);
    return response;
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
  updateUser: (userId: string, userData: UpdateUserRequest) => apiClient.updateUser(userId, userData),
  changePassword: (userId: string, passwordData: ChangePasswordRequest) => apiClient.changePassword(userId, passwordData),
};

export const clinicApi = {
  getClinic: (clinicId: number) => apiClient.getClinic(clinicId),
  getClinicUsers: (clinicId: number) => apiClient.getClinicUsers(clinicId),
};

export const doctorProfileApi = {
  getDoctorProfile: (doctorId: string) => apiClient.getDoctorProfile(doctorId),
  updateDoctorProfile: (doctorId: string, profileData: Partial<DoctorProfile>) => apiClient.updateDoctorProfile(doctorId, profileData),
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
