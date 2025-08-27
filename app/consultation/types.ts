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

// New interfaces for antecedentes and AI functionality
export interface MedicalAntecedents {
  personalHistory: string[]
  familyHistory: string[]
  surgicalHistory: string[]
  obstetricHistory?: string
  lifestyleFactors: {
    smoking: "none" | "former" | "current"
    alcohol: "none" | "occasional" | "moderate" | "heavy"
    diet: string
    exercise: string
    occupation: string
    other: string
  }
  socialHistory: string
}

export interface AIDiagnosis {
  suggestedDiagnoses: SuggestedDiagnosis[]
  recommendedSteps: string[]
  confidence: number
  reasoning: string
  disclaimer: string
  generatedAt: string
}

export interface SuggestedDiagnosis {
  condition: string
  probability: number
  reasoning: string
  icd10Code?: string
}

export interface FinalDiagnosis {
  primaryDiagnosis: string
  secondaryDiagnoses: string[]
  differentialDiagnoses: string[]
  icd10Codes: string[]
  clinicalImpression: string
  treatmentPlan: string
  followUpPlan: string
  notes: string
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
  // New fields for antecedentes and AI functionality
  medicalAntecedents: MedicalAntecedents
  finalDiagnosis: FinalDiagnosis
  aiDiagnosis?: AIDiagnosis
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

// AI Consultation Data Structure (matching the JSON sample format)
export interface AIConsultationInput {
  id_paciente: string
  datos_demograficos: {
    edad: number
    sexo: string
  }
  motivo_consulta: string
  sintomas: string[]
  signos_vitales: {
    temperatura_c: number
    presion_arterial: string
    frecuencia_cardiaca_lpm: number
    frecuencia_respiratoria_rpm: number
  }
  resultados_laboratorio?: Record<string, any>
  imagen?: Record<string, string>
  antecedentes_medicos: string[]
  antecedentes_familiares: string[]
  estilo_vida: {
    tabaquismo: string
    alcohol: string
    dieta: string
  }
  medicamentos: string[]
}

export interface AIConsultationOutput {
  id_paciente: string
  prediagnosticos_sugeridos: {
    condicion: string
    probabilidad: number
    razonamiento: string
  }[]
  pasos_recomendados: string[]
  aviso: string
}
