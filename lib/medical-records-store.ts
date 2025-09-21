import { create } from 'zustand'
import { 
  medicalRecordsAPI, 
  MedicalRecord,
  Diagnosis,
  Allergy,
  Medication,
  Lab,
  Observation,
  AddDiagnosisRequest,
  AddAllergyRequest,
  AddMedicationRequest,
  AddLabRequest,
  AddObservationRequest,
  GetMedicalRecordOptions
} from './medical-records-api'

interface MedicalRecordsState {
  // Data
  currentRecord: MedicalRecord | null
  currentPatientId: string | null
  
  // UI State
  loading: boolean
  error: string | null
  
  // Modal/Dialog State
  modals: {
    addDiagnosis: boolean
    addAllergy: boolean
    addMedication: boolean
    addLab: boolean
    addObservation: boolean
    viewDiagnosis: boolean
    viewAllergy: boolean
    viewMedication: boolean
    viewLab: boolean
    viewObservation: boolean
  }
  
  // Selected items for viewing/editing
  selectedDiagnosis: Diagnosis | null
  selectedAllergy: Allergy | null
  selectedMedication: Medication | null
  selectedLab: Lab | null
  selectedObservation: Observation | null
  
  // Actions
  fetchMedicalRecord: (patientId: string, options?: GetMedicalRecordOptions) => Promise<void>
  addDiagnosis: (patientId: string, diagnosis: AddDiagnosisRequest) => Promise<void>
  addAllergy: (patientId: string, allergy: AddAllergyRequest) => Promise<void>
  addMedication: (patientId: string, medication: AddMedicationRequest) => Promise<void>
  addLab: (patientId: string, lab: AddLabRequest) => Promise<void>
  addObservation: (patientId: string, observation: AddObservationRequest) => Promise<void>
  
  // Modal actions
  openModal: (modal: keyof MedicalRecordsState['modals']) => void
  closeModal: (modal: keyof MedicalRecordsState['modals']) => void
  closeAllModals: () => void
  
  // Selection actions
  selectDiagnosis: (diagnosis: Diagnosis | null) => void
  selectAllergy: (allergy: Allergy | null) => void
  selectMedication: (medication: Medication | null) => void
  selectLab: (lab: Lab | null) => void
  selectObservation: (observation: Observation | null) => void
  
  // Utility actions
  clearError: () => void
  reset: () => void
}

const initialModalsState = {
  addDiagnosis: false,
  addAllergy: false,
  addMedication: false,
  addLab: false,
  addObservation: false,
  viewDiagnosis: false,
  viewAllergy: false,
  viewMedication: false,
  viewLab: false,
  viewObservation: false,
}

export const useMedicalRecordsStore = create<MedicalRecordsState>((set, get) => ({
  // Initial state
  currentRecord: null,
  currentPatientId: null,
  loading: false,
  error: null,
  modals: initialModalsState,
  selectedDiagnosis: null,
  selectedAllergy: null,
  selectedMedication: null,
  selectedLab: null,
  selectedObservation: null,

  // Fetch medical record
  fetchMedicalRecord: async (patientId: string, options?: GetMedicalRecordOptions) => {
    set({ loading: true, error: null, currentPatientId: patientId })
    try {
      const record = await medicalRecordsAPI.getMedicalRecord(patientId, options)
      set({ 
        currentRecord: record, 
        loading: false 
      })
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch medical record',
        loading: false 
      })
    }
  },

  // Add diagnosis
  addDiagnosis: async (patientId: string, diagnosis: AddDiagnosisRequest) => {
    set({ loading: true, error: null })
    try {
      await medicalRecordsAPI.addDiagnosis(patientId, diagnosis)
      // Refresh the medical record
      await get().fetchMedicalRecord(patientId, { include: ['all'] })
      set({ loading: false })
      get().closeModal('addDiagnosis')
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to add diagnosis',
        loading: false 
      })
    }
  },

  // Add allergy
  addAllergy: async (patientId: string, allergy: AddAllergyRequest) => {
    set({ loading: true, error: null })
    try {
      await medicalRecordsAPI.addAllergy(patientId, allergy)
      // Refresh the medical record
      await get().fetchMedicalRecord(patientId, { include: ['all'] })
      set({ loading: false })
      get().closeModal('addAllergy')
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to add allergy',
        loading: false 
      })
    }
  },

  // Add medication
  addMedication: async (patientId: string, medication: AddMedicationRequest) => {
    set({ loading: true, error: null })
    try {
      await medicalRecordsAPI.addMedication(patientId, medication)
      // Refresh the medical record
      await get().fetchMedicalRecord(patientId, { include: ['all'] })
      set({ loading: false })
      get().closeModal('addMedication')
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to add medication',
        loading: false 
      })
    }
  },

  // Add lab test
  addLab: async (patientId: string, lab: AddLabRequest) => {
    set({ loading: true, error: null })
    try {
      await medicalRecordsAPI.addLab(patientId, lab)
      // Refresh the medical record
      await get().fetchMedicalRecord(patientId, { include: ['all'] })
      set({ loading: false })
      get().closeModal('addLab')
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to add lab test',
        loading: false 
      })
    }
  },

  // Add observation
  addObservation: async (patientId: string, observation: AddObservationRequest) => {
    set({ loading: true, error: null })
    try {
      await medicalRecordsAPI.addObservation(patientId, observation)
      // Refresh the medical record
      await get().fetchMedicalRecord(patientId, { include: ['all'] })
      set({ loading: false })
      get().closeModal('addObservation')
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to add observation',
        loading: false 
      })
    }
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

  // Selection actions
  selectDiagnosis: (diagnosis) => {
    set({ selectedDiagnosis: diagnosis })
  },

  selectAllergy: (allergy) => {
    set({ selectedAllergy: allergy })
  },

  selectMedication: (medication) => {
    set({ selectedMedication: medication })
  },

  selectLab: (lab) => {
    set({ selectedLab: lab })
  },

  selectObservation: (observation) => {
    set({ selectedObservation: observation })
  },

  // Utility actions
  clearError: () => {
    set({ error: null })
  },

  reset: () => {
    set({
      currentRecord: null,
      currentPatientId: null,
      loading: false,
      error: null,
      modals: initialModalsState,
      selectedDiagnosis: null,
      selectedAllergy: null,
      selectedMedication: null,
      selectedLab: null,
      selectedObservation: null,
    })
  },
}))
