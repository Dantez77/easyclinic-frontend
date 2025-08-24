// Mock consultation data using unified structure - Updated for El Salvador
import { type Patient, type Consultation, type LabTest, type Document } from "../types"

// Mock patient data for consultation
export const patientData: Patient = {
  id: "1",
  patientId: "EXP-2024-001234",
  dui: "12345678-0",
  firstName: "María Elena",
  lastName: "González",
  dateOfBirth: "1985-03-15",
  age: 38,
  gender: "Femenino",
  phone: "7123-4567",
  email: "maria.gonzalez@email.com",
  address: "Calle Principal #123, Colonia Escalón",
  city: "San Salvador",
  province: "San Salvador",
  postalCode: "1101",
  bloodType: "O+",
  maritalStatus: "Casada",
  occupation: "Contadora",
  allergies: [
    { substance: "Penicilina", severity: "Severa", reaction: "Erupción cutánea", dateIdentified: "2010-05-15" },
    { substance: "Mariscos", severity: "Moderada", reaction: "Hinchazón", dateIdentified: "2015-08-20" },
  ],
  chronicConditions: [
    { condition: "Hipertensión", diagnosisDate: "2020-03-10", status: "Controlada", notes: "Medicación diaria" },
    { condition: "Migraña", diagnosisDate: "2018-07-22", status: "Activa", notes: "Episodios ocasionales" },
  ],
  currentMedications: [
    {
      medication: "Losartán 50mg",
      dosage: "1 tableta",
      frequency: "Cada 24 horas",
      startDate: "2020-03-10",
      prescribedBy: "Dr. Juan Pérez",
      indication: "Hipertensión",
      status: "Activo",
    },
    {
      medication: "Sumatriptán 50mg",
      dosage: "1 tableta",
      frequency: "Según necesidad",
      startDate: "2018-07-22",
      prescribedBy: "Dr. Ana López",
      indication: "Migraña",
      status: "Activo",
    },
  ],
  emergencyContact: {
    name: "Carlos González",
    relationship: "Esposo",
    phone: "7123-4568",
    email: "carlos.gonzalez@email.com",
  },
  insurance: {
    provider: "ISSS",
    policyNumber: "ISSS-123456789",
    groupNumber: "GRP-001",
    effectiveDate: "2020-01-01",
    expirationDate: "2024-12-31",
  },
  status: "Activo",
  lastVisit: "2024-11-15",
  createdAt: "2020-01-01",
  updatedAt: "2024-11-15",
}

export const commonComplaints = [
  "Dolor de cabeza",
  "Fiebre",
  "Dolor abdominal",
  "Fatiga",
  "Tos",
  "Dolor de garganta",
  "Dolor de espalda",
  "Náuseas",
  "Vómitos",
  "Diarrea",
  "Estreñimiento",
  "Dolor en las articulaciones",
  "Dificultad para respirar",
  "Dolor en el pecho",
  "Mareos",
  "Insomnio",
  "Ansiedad",
  "Depresión",
]

export const commonSymptoms = [
  "Dolor",
  "Fiebre",
  "Fatiga",
  "Náuseas",
  "Vómitos",
  "Diarrea",
  "Estreñimiento",
  "Tos",
  "Dolor de garganta",
  "Dificultad para respirar",
  "Dolor en el pecho",
  "Mareos",
  "Insomnio",
  "Pérdida de apetito",
  "Pérdida de peso",
  "Hinchazón",
  "Erupción cutánea",
  "Picazón",
]

export const medications = [
  "Acetaminofén",
  "Ibuprofeno",
  "Aspirina",
  "Losartán",
  "Metformina",
  "Omeprazol",
  "Loratadina",
  "Cetirizina",
  "Amoxicilina",
  "Azitromicina",
  "Sumatriptán",
  "Paracetamol",
  "Diclofenaco",
  "Naproxeno",
  "Lansoprazol",
]

export const labTests = [
  "Hemograma completo",
  "Química sanguínea",
  "Glucosa en ayunas",
  "Hemoglobina A1c",
  "Perfil lipídico",
  "Función renal",
  "Función hepática",
  "Análisis de orina",
  "Cultivo de garganta",
  "Cultivo de orina",
  "Radiografía de tórax",
  "Electrocardiograma",
  "Ecocardiograma",
  "Tomografía computarizada",
  "Resonancia magnética",
]

export const medicalHistory = [
  {
    id: "1",
    title: "Hipertensión diagnosticada",
    doctor: "Dr. Juan Pérez",
    date: "2020-03-10",
    status: "Controlada",
    description: "Diagnóstico de hipertensión arterial. Iniciado tratamiento con Losartán 50mg.",
  },
  {
    id: "2",
    title: "Migraña diagnosticada",
    doctor: "Dr. Ana López",
    date: "2018-07-22",
    status: "Activa",
    description: "Diagnóstico de migraña. Prescrito Sumatriptán para episodios agudos.",
  },
  {
    id: "3",
    title: "Chequeo anual",
    doctor: "Dr. Juan Pérez",
    date: "2023-12-15",
    status: "Completado",
    description: "Chequeo anual de rutina. Todos los parámetros dentro de rangos normales.",
  },
]

export const documents = [
  {
    id: "1",
    name: "Receta_Medicamentos.pdf",
    size: "156 KB",
    uploadedAt: "2024-01-15",
  },
  {
    id: "2",
    name: "Resultados_Laboratorio.pdf",
    size: "2.1 MB",
    uploadedAt: "2024-01-10",
  },
  {
    id: "3",
    name: "Historial_Medico.pdf",
    size: "890 KB",
    uploadedAt: "2024-01-05",
  },
]

export type { Patient, Consultation, LabTest, Document }
