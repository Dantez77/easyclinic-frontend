import { apiClient } from './api'
import { config } from './config'

// Types for Medical Records
export interface MedicalRecord {
  patient: Patient
  addresses?: PatientAddress[]
  emergencyContacts?: EmergencyContact[]
  diagnoses?: Diagnosis[]
  allergies?: Allergy[]
  medications?: Medication[]
  labs?: Lab[]
  observations?: Observation[]
  summary?: MedicalRecordSummary
}

export interface Patient {
  id: string
  name: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
  gender: 'M' | 'F' | 'Other'
  bloodType?: string
  civilStatus?: string
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
}

export interface EmergencyContact {
  id: string
  patientId: string
  name: string
  relationship: string
  phone: string
  email?: string
  isActive: boolean
}

export interface Diagnosis {
  id: string
  patientId: string
  diagnosticId: string
  diagnosisDate: string
  onsetDate?: string
  resolutionDate?: string
  status: 'active' | 'remission' | 'resolved'
  severity?: 'mild' | 'moderate' | 'severe'
  certainty: 'confirmed' | 'suspected' | 'provisional'
  notes?: string
  diagnostic?: {
    id: string
    code: string
    titleEs: string
    titleEn: string
    codingSystem: string
  }
}

export interface Allergy {
  id: string
  patientId: string
  allergen: string
  allergenType: 'medication' | 'food' | 'environmental' | 'contact' | 'other'
  severity: 'mild' | 'moderate' | 'severe' | 'life-threatening'
  reaction: string
  onsetDate?: string
  lastReactionDate?: string
  status: 'active' | 'inactive' | 'resolved'
  notes?: string
  reportedBy?: string
  createdAt: string
  updatedAt: string
}

export interface Medication {
  id: string
  patientId: string
  medicationName: string
  genericName?: string
  dosage: string
  frequency: string
  route: 'oral' | 'intravenous' | 'intramuscular' | 'subcutaneous' | 'topical' | 'inhalation' | 'other'
  startDate: string
  endDate?: string
  status: 'active' | 'completed' | 'discontinued' | 'suspended'
  prescribedBy?: string
  indication?: string
  sideEffects?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface Lab {
  id: string
  patientId: string
  testName: string
  testCode?: string
  testCategory: 'blood' | 'urine' | 'stool' | 'imaging' | 'cardiac' | 'pulmonary' | 'other'
  orderedDate: string
  collectedDate?: string
  resultDate?: string
  status: 'ordered' | 'collected' | 'processing' | 'completed' | 'cancelled'
  results?: string
  normalRange?: string
  abnormalFlag: boolean
  orderedBy?: string
  laboratory?: string
  notes?: string
  followUpRequired: boolean
  createdAt: string
  updatedAt: string
}

export interface Observation {
  id: string
  patientId: string
  observationType: 'vital_signs' | 'physical_exam' | 'symptom' | 'behavior' | 'mental_status' | 'other'
  title: string
  description: string
  value?: string
  unit?: string
  normalRange?: string
  isAbnormal: boolean
  severity?: 'mild' | 'moderate' | 'severe' | 'critical'
  observationDate: string
  observedBy?: string
  context?: string
  status: 'active' | 'resolved' | 'monitoring' | 'archived'
  followUpRequired: boolean
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface MedicalRecordSummary {
  totalDiagnoses: number
  activeDiagnoses: number
  totalAllergies: number
  activeAllergies: number
  totalMedications: number
  activeMedications: number
  totalLabs: number
  pendingLabs: number
  totalObservations: number
  abnormalObservations: number
}

// Request types
export interface AddDiagnosisRequest {
  diagnosticId: string
  diagnosisDate: string
  onsetDate?: string
  resolutionDate?: string
  status?: 'active' | 'remission' | 'resolved'
  severity?: 'mild' | 'moderate' | 'severe'
  certainty?: 'confirmed' | 'suspected' | 'provisional'
  notes?: string
}

export interface AddAllergyRequest {
  allergen: string
  allergenType: 'medication' | 'food' | 'environmental' | 'contact' | 'other'
  severity: 'mild' | 'moderate' | 'severe' | 'life-threatening'
  reaction: string
  onsetDate?: string
  lastReactionDate?: string
  status?: 'active' | 'inactive' | 'resolved'
  notes?: string
  reportedBy?: string
}

export interface AddMedicationRequest {
  medicationName: string
  genericName?: string
  dosage: string
  frequency: string
  route: 'oral' | 'intravenous' | 'intramuscular' | 'subcutaneous' | 'topical' | 'inhalation' | 'other'
  startDate: string
  endDate?: string
  status?: 'active' | 'completed' | 'discontinued' | 'suspended'
  prescribedBy?: string
  indication?: string
  sideEffects?: string
  notes?: string
}

export interface AddLabRequest {
  testName: string
  testCode?: string
  testCategory: 'blood' | 'urine' | 'stool' | 'imaging' | 'cardiac' | 'pulmonary' | 'other'
  orderedDate: string
  collectedDate?: string
  resultDate?: string
  status?: 'ordered' | 'collected' | 'processing' | 'completed' | 'cancelled'
  results?: string
  normalRange?: string
  abnormalFlag?: boolean
  orderedBy?: string
  laboratory?: string
  notes?: string
  followUpRequired?: boolean
}

export interface AddObservationRequest {
  observationType: 'vital_signs' | 'physical_exam' | 'symptom' | 'behavior' | 'mental_status' | 'other'
  title: string
  description: string
  value?: string
  unit?: string
  normalRange?: string
  isAbnormal?: boolean
  severity?: 'mild' | 'moderate' | 'severe' | 'critical'
  observationDate: string
  observedBy?: string
  context?: string
  status?: 'active' | 'resolved' | 'monitoring' | 'archived'
  followUpRequired?: boolean
  notes?: string
}

export interface GetMedicalRecordOptions {
  include?: string[] // ['all', 'summary', 'diagnoses', 'allergies', 'medications', 'labs', 'observations', 'addresses', 'emergencyContacts']
  status?: string
  dateFrom?: string
  dateTo?: string
  limit?: number
  offset?: number
}

// API Service Class
export class MedicalRecordsAPI {
  private baseUrl = '/medical-record'

  // Get complete medical record
  async getMedicalRecord(patientId: string, options?: GetMedicalRecordOptions): Promise<MedicalRecord> {
    const params = new URLSearchParams()
    
    if (options?.include) {
      params.append('include', options.include.join(','))
    }
    if (options?.status) {
      params.append('status', options.status)
    }
    if (options?.dateFrom) {
      params.append('dateFrom', options.dateFrom)
    }
    if (options?.dateTo) {
      params.append('dateTo', options.dateTo)
    }
    if (options?.limit) {
      params.append('limit', options.limit.toString())
    }
    if (options?.offset) {
      params.append('offset', options.offset.toString())
    }

    const queryString = params.toString()
    const url = queryString ? `${this.baseUrl}/${patientId}?${queryString}` : `${this.baseUrl}/${patientId}`
    
    const response = await apiClient.get(url)
    
    if (response.error) {
      throw new Error(response.error)
    }
    
    return response.data!
  }

  // Add diagnosis
  async addDiagnosis(patientId: string, diagnosis: AddDiagnosisRequest): Promise<Diagnosis> {
    const response = await apiClient.post(`${this.baseUrl}/${patientId}/diagnosis`, diagnosis)
    
    if (response.error) {
      throw new Error(response.error)
    }
    
    return response.data!
  }

  // Add allergy
  async addAllergy(patientId: string, allergy: AddAllergyRequest): Promise<Allergy> {
    const response = await apiClient.post(`${this.baseUrl}/${patientId}/allergy`, allergy)
    
    if (response.error) {
      throw new Error(response.error)
    }
    
    return response.data!
  }

  // Add medication
  async addMedication(patientId: string, medication: AddMedicationRequest): Promise<Medication> {
    const response = await apiClient.post(`${this.baseUrl}/${patientId}/medication`, medication)
    
    if (response.error) {
      throw new Error(response.error)
    }
    
    return response.data!
  }

  // Add lab test
  async addLab(patientId: string, lab: AddLabRequest): Promise<Lab> {
    const response = await apiClient.post(`${this.baseUrl}/${patientId}/lab`, lab)
    
    if (response.error) {
      throw new Error(response.error)
    }
    
    return response.data!
  }

  // Add observation
  async addObservation(patientId: string, observation: AddObservationRequest): Promise<Observation> {
    const response = await apiClient.post(`${this.baseUrl}/${patientId}/observation`, observation)
    
    if (response.error) {
      throw new Error(response.error)
    }
    
    return response.data!
  }
}

// Export singleton instance
export const medicalRecordsAPI = new MedicalRecordsAPI()
