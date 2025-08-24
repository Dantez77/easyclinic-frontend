// Local types file for patients module
// Re-exports from main types to resolve import issues
// Updated for El Salvador localization

export interface Patient {
  // Core identification
  id: string
  patientId: string // External patient ID (e.g., EXP-2024-001234)
  dui: string // DUI (Documento Único de Identidad) - El Salvador national ID
  nit?: string // NIT (Número de Identificación Tributaria) - for fiscal documents
  
  // Personal information
  firstName: string
  lastName: string
  dateOfBirth: string
  age: number
  gender: "Masculino" | "Femenino" | "Otro"
  bloodType: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-"
  maritalStatus: "Soltero/a" | "Casado/a" | "Divorciado/a" | "Viudo/a" | "Unión Libre"
  occupation: string
  
  // Contact information
  phone: string
  email: string
  address: string
  city: string
  province: string
  postalCode?: string // Optional in El Salvador
  
  // Emergency contact
  emergencyContact: {
    name: string
    relationship: string
    phone: string
    email: string
  }
  
  // Insurance information
  insurance: {
    provider: string
    policyNumber: string
    groupNumber: string
    effectiveDate: string
    expirationDate: string
  }
  
  // Medical information
  allergies: Allergy[]
  chronicConditions: ChronicCondition[]
  currentMedications: Medication[]
  
  // Status and tracking
  status: "Activo" | "Inactivo" | "Suspendido"
  lastVisit: string
  createdAt: string
  updatedAt: string
}

export interface Allergy {
  substance: string
  severity: "Leve" | "Moderada" | "Severa"
  reaction: string
  dateIdentified: string
}

export interface ChronicCondition {
  condition: string
  diagnosisDate: string
  status: "Activa" | "Controlada" | "Remitida"
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
  status: "Activo" | "Suspendido" | "Completado"
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

export interface Prescription {
  medication: string
  dosage: string
  frequency: string
  duration: string
  instructions: string
  prescribedBy: string
  prescribedAt: string
}

export interface LabTest {
  id: string
  date: string
  test: string
  orderedBy: string
  results: string
  status: "Ordenado" | "En Proceso" | "Completado" | "Cancelado"
  values: Record<string, {
    value: string
    unit: string
    reference: string
    status: "Normal" | "Elevado" | "Bajo" | "Límite"
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

// Patient Registration Form Interface
export interface PatientRegistrationForm {
  // Personal Information
  firstName: string
  lastName: string
  dui: string
  nit: string
  gender: string
  bloodType: string
  maritalStatus: string
  occupation: string

  // Contact Information
  phone: string
  email: string
  address: string
  city: string
  province: string
  postalCode: string

  // Emergency Contact
  emergencyName: string
  emergencyRelationship: string
  emergencyPhone: string
  emergencyEmail: string

  // Insurance Information
  insuranceProvider: string
  policyNumber: string
  groupNumber: string

  // Additional Information
  allergies: string[]
  chronicConditions: string[]
  referredBy: string
  notes: string
}

// Constants - Updated for El Salvador
export const PROVINCES = [
  "Ahuachapán",
  "Cabañas", 
  "Chalatenango",
  "Cuscatlán",
  "La Libertad",
  "La Paz",
  "La Unión",
  "Morazán",
  "San Miguel",
  "San Salvador",
  "San Vicente",
  "Santa Ana",
  "Sonsonate",
  "Usulután",
]

export const BLOOD_TYPES = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]

export const INSURANCE_PROVIDERS = [
  "ISSS", // Instituto Salvadoreño del Seguro Social
  "FOSALUD", // Fondo Solidario para la Salud
  "SeNaSa", // Seguro Nacional de Salud
  "ARS Humano",
  "ARS Palic", 
  "ARS Universal",
  "ARS Futuro",
  "ARS Monumental",
  "ARS CMD",
  "ARS Renacer",
  "ARS Simag",
  "ARS Yuna",
  "Sin seguro",
]

export const COMMON_ALLERGIES = [
  "Penicilina",
  "Aspirina",
  "Mariscos",
  "Nueces",
  "Látex",
  "Polen",
  "Polvo",
  "Huevos",
  "Leche",
  "Soja",
  "Sulfas",
  "Ibuprofeno",
]

export const COMMON_CONDITIONS = [
  "Hipertensión",
  "Diabetes",
  "Asma",
  "Artritis",
  "Migraña",
  "Depresión",
  "Ansiedad",
  "Colesterol Alto",
  "Enfermedad Cardíaca",
  "Osteoporosis",
  "Gastritis",
  "Úlcera Péptica",
]
