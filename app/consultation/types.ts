// Local types file for consultation module

export interface Patient {
  id: string
  patientId: string
  dui: string
  firstName: string
  lastName: string
  dateOfBirth: string
  age: number
  gender: string
  phone: string
  email: string
  address: string
  city: string
  province: string
  postalCode: string
  bloodType: string
  maritalStatus: string
  occupation: string
  allergies: Allergy[]
  chronicConditions: ChronicCondition[]
  currentMedications: Medication[]
  emergencyContact: {
    name: string
    relationship: string
    phone: string
    email: string
  }
  insurance: {
    provider: string
    policyNumber: string
    groupNumber: string
    effectiveDate: string
    expirationDate: string
  }
  status: string
  lastVisit: string
  createdAt: string
  updatedAt: string
}

export interface Allergy {
  substance: string
  severity: string
  reaction: string
  dateIdentified: string
}

export interface ChronicCondition {
  condition: string
  diagnosisDate: string
  status: string
  notes: string
}

export interface Medication {
  medication: string
  dosage: string
  frequency: string
  startDate: string
  prescribedBy: string
  indication: string
  endDate?: string
  status: string
}

export interface VitalSigns {
  date: string
  temperature: string
  bloodPressure: string
  heartRate: string
  respiratoryRate: string
  oxygenSaturation: string
  weight: string
  height: string
  bmi: string
}

export interface Prescription {
  medication: string
  dosage: string
  frequency: string
  duration: string
  instructions: string
  prescribedBy: string
  prescribedAt: string
}

export interface Consultation {
  id: string
  date: string
  doctor: string
  specialty: string
  reason: string
  symptoms: string[]
  diagnosis: string
  treatment: string
  notes: string
  followUp?: string
  status: "Programada" | "En Proceso" | "Completada" | "Cancelada"
  prescriptions: Prescription[]
  labTests: LabTest[]
  vitalSigns: VitalSigns
}

export interface ConsultationForm {
  chiefComplaint: string
  symptoms: string[]
  symptomsNotes: string
  vitalSigns: VitalSigns
  diagnosis: string
  diagnosisStatus: "confirmed" | "suspected" | "ruled-out"
  prescriptions: Prescription[]
  selectedTests: string[]
  labNotes: string
  labPriority: "normal" | "urgent"
  lifestyleRecommendations: string
  returnToWorkNote: string
  followUpDate: string
  doctorNotes: string
  internalNote: boolean
}

export interface LabTest {
  id: string
  date: string
  test: string
  orderedBy: string
  results: string
  status: string
  values: Record<string, {
    value: string
    unit: string
    reference: string
    status: string
  }>
}

export interface Document {
  id: string
  date: string
  name: string
  type: string
  size: string
  uploadedBy: string
  url?: string
}
