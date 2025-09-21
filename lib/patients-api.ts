import { apiClient } from './api'

// Patient types matching backend structure
export interface Patient {
  id: string
  name: string // Backend uses 'name' not 'firstName'
  lastName: string
  email: string
  phone: string
  dui?: string
  nit?: string
  dateOfBirth?: string
  birthDate?: string // Backend also uses this field name
  gender: 'M' | 'F' | 'Other'
  bloodType?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-'
  civilStatus?: 'Single' | 'Married' | 'Divorced' | 'Widowed' | 'Other'
  profession?: string
  nationality?: string
  country?: string
  province?: string
  municipality?: string
  address?: string
  postalCode?: string
  status: 'active' | 'inactive'
  createdBy?: string
  updatedBy?: string
  notes?: string
  createdAt: string
  updatedAt: string
  // Related data from enhanced GET endpoint
  EmergencyContacts?: EmergencyContact[]
  Insurances?: Insurance[]
  Allergies?: AllergiesFromPatient[]
}

export interface AllergiesFromPatient {
  id: string
  patientId: string
  allergen: string
  allergenType: string
  severity: string
  reaction: string
  onsetDate?: string
  lastReactionDate?: string
  status: string
  notes?: string
  reportedBy: string
  createdAt: string
  updatedAt: string
}

export interface Insurance {
  id: string
  patientId: string
  policy: string
  groupNumber: string
  payerName: string
  memberId: string
  holderRelationship: string
  holderFullName: string
  createdAt: string
  updatedAt: string
}

export interface PatientAddress {
  id: string
  patientId: string
  addressType: string
  street: string
  city: string
  state: string
  zipCode: string
  country: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface EmergencyContact {
  id: string
  patientId: string
  name: string
  relationship: string
  phone: string
  email?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Insurance {
  id: string
  patientId: string
  provider: string
  policyNumber: string
  groupNumber?: string
  effectiveDate: string
  expirationDate?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CreatePatientRequest {
  name: string
  lastName: string
  email: string
  phone: string
  dui?: string
  nit?: string
  dateOfBirth: string
  gender: 'M' | 'F' | 'Other'
  bloodType?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-'
  civilStatus?: 'Single' | 'Married' | 'Divorced' | 'Widowed' | 'Other'
  profession?: string
  nationality?: string
  country?: string
  province?: string
  municipality?: string
  address?: string
}

export interface PatientRegistrationRequest {
  // Personal Information
  firstName: string
  lastName: string
  dui: string
  nit?: string
  dateOfBirth: string
  gender?: string
  bloodType?: string
  maritalStatus?: string
  occupation?: string
  // Contact Information
  phone: string
  email?: string
  address: string
  city: string
  province: string
  postalCode?: string
  // Emergency Contact
  emergencyName: string
  emergencyRelationship?: string
  emergencyPhone: string
  emergencyEmail?: string
  // Insurance Information
  insuranceProvider?: string
  policyNumber?: string
  groupNumber?: string
  // Medical Information
  allergies?: string[]
  chronicConditions?: string[]
  referredBy?: string
  notes?: string
}

export interface GetPatientsOptions {
  page?: number
  limit?: number
  search?: string
  status?: string
  province?: string
  sortBy?: string
  sortOrder?: 'ASC' | 'DESC'
}

export interface PatientsResponse {
  patients: Patient[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// API Service Class
export class PatientsAPI {
  private baseUrl = '/patient'

  // Get paginated patients list
  async getPatients(options?: GetPatientsOptions): Promise<PatientsResponse> {
    const params = new URLSearchParams()
    
    if (options?.page) params.append('page', options.page.toString())
    if (options?.limit) params.append('limit', options.limit.toString())
    if (options?.search) params.append('search', options.search)
    if (options?.status) params.append('status', options.status)
    if (options?.province) params.append('province', options.province)
    if (options?.sortBy) params.append('sortBy', options.sortBy)
    if (options?.sortOrder) params.append('sortOrder', options.sortOrder)

    const queryString = params.toString()
    const url = queryString ? `${this.baseUrl}?${queryString}` : this.baseUrl
    
    const response = await apiClient.get(url)
    
    if (response.error) {
      throw new Error(response.error)
    }
    
    // Backend returns { success: true, data: [...], count: number }
    // We need to map it to our expected format
    const backendData = response.data!
    return {
      patients: backendData.data || [],
      pagination: {
        page: options?.page || 1,
        limit: options?.limit || 10,
        total: backendData.count || 0,
        totalPages: Math.ceil((backendData.count || 0) / (options?.limit || 10))
      }
    }
  }

  // Get single patient by ID
  async getPatient(id: string): Promise<Patient> {
    const response = await apiClient.get(`${this.baseUrl}/${id}`)
    
    if (response.error) {
      throw new Error(response.error)
    }
    
    // Backend returns { success: true, data: patientObject }
    const backendResponse = response.data!
    const backendPatient = backendResponse.data || backendResponse
    
    // Map backend field names to frontend expected names
    return {
      ...backendPatient,
      dateOfBirth: backendPatient.birthDate || backendPatient.dateOfBirth // Handle both field names
    }
  }

  // Create new patient
  async createPatient(patient: CreatePatientRequest): Promise<Patient> {
    // Map frontend field names to backend expected names
    const backendPatient = {
      ...patient,
      birthDate: patient.dateOfBirth // Map dateOfBirth to birthDate for backend
    }
    delete backendPatient.dateOfBirth // Remove the frontend field name

    const response = await apiClient.post(this.baseUrl, backendPatient)
    
    if (response.error) {
      throw new Error(response.error)
    }
    
    // Map response back to frontend format
    const createdPatient = response.data!
    return {
      ...createdPatient,
      dateOfBirth: createdPatient.birthDate || createdPatient.dateOfBirth
    }
  }

  // Update patient
  async updatePatient(id: string, patient: Partial<CreatePatientRequest>): Promise<Patient> {
    // Map frontend field names to backend expected names
    const backendPatient = { ...patient }
    if (patient.dateOfBirth) {
      backendPatient.birthDate = patient.dateOfBirth
      delete backendPatient.dateOfBirth
    }

    const response = await apiClient.put(`${this.baseUrl}/${id}`, backendPatient)
    
    if (response.error) {
      throw new Error(response.error)
    }
    
    // Map response back to frontend format
    const updatedPatient = response.data!
    return {
      ...updatedPatient,
      dateOfBirth: updatedPatient.birthDate || updatedPatient.dateOfBirth
    }
  }

  // Delete patient (soft delete)
  async deletePatient(id: string, reason?: string): Promise<void> {
    const response = await apiClient.delete(`${this.baseUrl}/${id}`, reason ? { reason } : undefined)
    
    if (response.error) {
      throw new Error(response.error)
    }
  }

  // Get patient addresses
  async getPatientAddresses(patientId: string): Promise<PatientAddress[]> {
    const response = await apiClient.get(`${this.baseUrl}/${patientId}/addresses`)
    
    if (response.error) {
      throw new Error(response.error)
    }
    
    return response.data!
  }

  // Get patient emergency contacts
  async getEmergencyContacts(patientId: string): Promise<EmergencyContact[]> {
    const response = await apiClient.get(`${this.baseUrl}/${patientId}/emergency-contacts`)
    
    if (response.error) {
      throw new Error(response.error)
    }
    
    return response.data!
  }

  // Get patient insurance
  async getPatientInsurance(patientId: string): Promise<Insurance[]> {
    const response = await apiClient.get(`${this.baseUrl}/${patientId}/insurance`)
    
    if (response.error) {
      throw new Error(response.error)
    }
    
    return response.data!
  }

  // Search patients (for selectors and quick search)
  async searchPatients(query: string, limit: number = 10): Promise<Patient[]> {
    const response = await apiClient.get(`${this.baseUrl}?search=${encodeURIComponent(query)}&limit=${limit}`)
    
    if (response.error) {
      throw new Error(response.error)
    }
    
    // Backend returns { success: true, data: [...] }
    const backendData = response.data!
    return backendData.data || []
  }

  // Register new patient with complete information
  async registerPatient(registrationData: PatientRegistrationRequest): Promise<Patient> {
    const response = await apiClient.post(`${this.baseUrl}/register`, registrationData)
    
    if (response.error) {
      throw new Error(response.error)
    }
    
    return response.data!
  }
}

// Export singleton instance
export const patientsAPI = new PatientsAPI()
