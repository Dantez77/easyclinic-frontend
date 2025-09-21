import { create } from 'zustand'
import { patientsAPI, Patient, CreatePatientRequest, GetPatientsOptions, PatientsResponse } from './patients-api'
import { medicalRecordsAPI, MedicalRecord, GetMedicalRecordOptions } from './medical-records-api'

interface PatientsState {
  // Patients Data
  patients: Patient[]
  currentPatient: Patient | null
  selectedPatients: string[]
  
  // Medical Records Data
  currentMedicalRecord: MedicalRecord | null
  
  // Pagination
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  
  // Filters and Search
  searchTerm: string
  statusFilter: string
  provinceFilter: string
  
  // UI State
  loading: boolean
  error: string | null
  
  // Modal/Dialog State
  modals: {
    createPatient: boolean
    editPatient: boolean
    viewPatient: boolean
    viewMedicalHistory: boolean
  }
  
  // Actions - Patients Management
  fetchPatients: (options?: GetPatientsOptions) => Promise<void>
  searchPatients: (query: string) => Promise<Patient[]>
  createPatient: (patient: CreatePatientRequest) => Promise<void>
  updatePatient: (id: string, patient: Partial<CreatePatientRequest>) => Promise<void>
  deletePatient: (id: string, reason?: string) => Promise<void>
  selectPatient: (patient: Patient | null) => void
  
  // Actions - Medical Records
  fetchMedicalRecord: (patientId: string, options?: GetMedicalRecordOptions) => Promise<void>
  clearMedicalRecord: () => void
  
  // Actions - Selection
  togglePatientSelection: (patientId: string) => void
  selectAllPatients: () => void
  clearSelection: () => void
  
  // Actions - Filters
  setSearchTerm: (term: string) => void
  setStatusFilter: (status: string) => void
  setProvinceFilter: (province: string) => void
  
  // Actions - Pagination
  setPage: (page: number) => void
  setLimit: (limit: number) => void
  
  // Actions - Modals
  openModal: (modal: keyof PatientsState['modals']) => void
  closeModal: (modal: keyof PatientsState['modals']) => void
  closeAllModals: () => void
  
  // Actions - Utility
  clearError: () => void
  reset: () => void
}

const initialModalsState = {
  createPatient: false,
  editPatient: false,
  viewPatient: false,
  viewMedicalHistory: false,
}

const initialPagination = {
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
}

export const usePatientsStore = create<PatientsState>((set, get) => ({
  // Initial state
  patients: [],
  currentPatient: null,
  selectedPatients: [],
  currentMedicalRecord: null,
  pagination: initialPagination,
  searchTerm: '',
  statusFilter: 'all',
  provinceFilter: 'all',
  loading: false,
  error: null,
  modals: initialModalsState,

  // Fetch patients
  fetchPatients: async (options?: GetPatientsOptions) => {
    set({ loading: true, error: null })
    try {
      const result = await patientsAPI.getPatients({
        page: get().pagination.page,
        limit: get().pagination.limit,
        search: get().searchTerm || undefined,
        status: get().statusFilter !== 'all' ? get().statusFilter : undefined,
        province: get().provinceFilter !== 'all' ? get().provinceFilter : undefined,
        ...options
      })
      
      set({ 
        patients: result.patients,
        pagination: result.pagination,
        loading: false 
      })
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch patients',
        loading: false 
      })
    }
  },

  // Search patients (for selectors)
  searchPatients: async (query: string) => {
    try {
      return await patientsAPI.searchPatients(query, 20)
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to search patients' })
      return []
    }
  },

  // Create patient
  createPatient: async (patient: CreatePatientRequest) => {
    set({ loading: true, error: null })
    try {
      await patientsAPI.createPatient(patient)
      await get().fetchPatients() // Refresh list
      set({ loading: false })
      get().closeModal('createPatient')
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to create patient',
        loading: false 
      })
    }
  },

  // Update patient
  updatePatient: async (id: string, patient: Partial<CreatePatientRequest>) => {
    set({ loading: true, error: null })
    try {
      await patientsAPI.updatePatient(id, patient)
      await get().fetchPatients() // Refresh list
      set({ loading: false })
      get().closeModal('editPatient')
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update patient',
        loading: false 
      })
    }
  },

  // Delete patient
  deletePatient: async (id: string, reason?: string) => {
    set({ loading: true, error: null })
    try {
      await patientsAPI.deletePatient(id, reason)
      await get().fetchPatients() // Refresh list
      set({ 
        selectedPatients: get().selectedPatients.filter(pId => pId !== id),
        loading: false 
      })
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to delete patient',
        loading: false 
      })
    }
  },

  // Select patient
  selectPatient: (patient: Patient | null) => {
    set({ currentPatient: patient })
  },

  // Fetch medical record
  fetchMedicalRecord: async (patientId: string, options?: GetMedicalRecordOptions) => {
    set({ loading: true, error: null })
    try {
      const record = await medicalRecordsAPI.getMedicalRecord(patientId, options)
      set({ 
        currentMedicalRecord: record,
        loading: false 
      })
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch medical record',
        loading: false 
      })
    }
  },

  // Clear medical record
  clearMedicalRecord: () => {
    set({ currentMedicalRecord: null })
  },

  // Selection actions
  togglePatientSelection: (patientId: string) => {
    set((state) => ({
      selectedPatients: state.selectedPatients.includes(patientId)
        ? state.selectedPatients.filter(id => id !== patientId)
        : [...state.selectedPatients, patientId]
    }))
  },

  selectAllPatients: () => {
    set((state) => ({
      selectedPatients: state.patients.map(p => p.id)
    }))
  },

  clearSelection: () => {
    set({ selectedPatients: [] })
  },

  // Filter actions
  setSearchTerm: (term: string) => {
    set({ searchTerm: term })
  },

  setStatusFilter: (status: string) => {
    set({ statusFilter: status })
  },

  setProvinceFilter: (province: string) => {
    set({ provinceFilter: province })
  },

  // Pagination actions
  setPage: (page: number) => {
    set((state) => ({
      pagination: { ...state.pagination, page }
    }))
  },

  setLimit: (limit: number) => {
    set((state) => ({
      pagination: { ...state.pagination, limit, page: 1 }
    }))
  },

  // Modal actions
  openModal: (modal) => {
    set((state) => ({
      modals: {
        ...state.modals,
        [modal]: true
      }
    }))
  },

  closeModal: (modal) => {
    set((state) => ({
      modals: {
        ...state.modals,
        [modal]: false
      }
    }))
  },

  closeAllModals: () => {
    set({ modals: initialModalsState })
  },

  // Utility actions
  clearError: () => {
    set({ error: null })
  },

  reset: () => {
    set({
      patients: [],
      currentPatient: null,
      selectedPatients: [],
      currentMedicalRecord: null,
      pagination: initialPagination,
      searchTerm: '',
      statusFilter: 'all',
      provinceFilter: 'all',
      loading: false,
      error: null,
      modals: initialModalsState,
    })
  },
}))
