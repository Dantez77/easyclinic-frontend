// Mock comprehensive patient data
export const mockPatientEHR = {
  // Basic Information
  id: "EXP-2024-001234",
  firstName: "María Elena",
  lastName: "González",
  cedula: "001-1234567-8",
  dateOfBirth: "1985-03-15",
  age: 38,
  gender: "Femenino",
  bloodType: "O+",
  maritalStatus: "Casada",
  occupation: "Contadora",

  // Contact Information
  phone: "503-7555-0123",
  email: "maria.gonzalez@email.com",
  address: "Calle Principal #123, Los Alcarrizos",
  city: "Santo Domingo",
  province: "Distrito Nacional",
  postalCode: "10101",

  // Emergency Contact
  emergencyContact: {
    name: "Carlos González",
    relationship: "Esposo",
    phone: "503-7555-0124",
    email: "carlos.gonzalez@email.com",
  },

  // Insurance Information
  insurance: {
    provider: "ARS Humano",
    policyNumber: "AH-123456789",
    groupNumber: "GRP-001",
    effectiveDate: "2020-01-01",
    expirationDate: "2024-12-31",
  },

  // Medical Information
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
    },
    {
      medication: "Sumatriptán 50mg",
      dosage: "1 tableta",
      frequency: "Según necesidad",
      startDate: "2018-07-22",
      prescribedBy: "Dr. Ana López",
      indication: "Migraña",
    },
  ],

  // Vital Signs History
  vitalSigns: [
    {
      date: "2024-11-15",
      temperature: "36.5°C",
      bloodPressure: "125/80",
      heartRate: "72 bpm",
      respiratoryRate: "16 rpm",
      oxygenSaturation: "98%",
      weight: "65 kg",
      height: "165 cm",
      bmi: "23.9",
    },
    {
      date: "2024-10-20",
      temperature: "36.8°C",
      bloodPressure: "120/78",
      heartRate: "68 bpm",
      respiratoryRate: "15 rpm",
      oxygenSaturation: "99%",
      weight: "64.5 kg",
      height: "165 cm",
      bmi: "23.7",
    },
    {
      date: "2024-09-15",
      temperature: "36.6°C",
      bloodPressure: "128/82",
      heartRate: "75 bpm",
      respiratoryRate: "16 rpm",
      oxygenSaturation: "98%",
      weight: "65.2 kg",
      height: "165 cm",
      bmi: "24.0",
    },
  ],

  // Medical History
  consultations: [
    {
      id: "CONS-001",
      date: "2024-11-15",
      doctor: "Dr. Juan Pérez",
      specialty: "Medicina General",
      reason: "Dolor de cabeza persistente",
      symptoms: ["Cefalea", "Fotofobia", "Náuseas"],
      diagnosis: "Cefalea tensional",
      treatment: "Acetaminofén 500mg c/8h x 5 días",
      notes: "Paciente refiere mejoría con analgésicos. Recomendar descanso y manejo del estrés.",
      followUp: "2024-12-15",
      status: "Completada",
    },
    {
      id: "CONS-002",
      date: "2024-10-20",
      doctor: "Dr. Ana López",
      specialty: "Medicina Interna",
      reason: "Chequeo de rutina",
      symptoms: [],
      diagnosis: "Paciente sana",
      treatment: "Continuar con estilo de vida saludable",
      notes: "Todos los parámetros dentro de rangos normales. Continuar medicación para hipertensión.",
      followUp: "2025-04-20",
      status: "Completada",
    },
  ],

  // Procedures
  procedures: [
    {
      id: "PROC-001",
      date: "2024-10-25",
      procedure: "Electrocardiograma",
      doctor: "Dr. Carlos Martínez",
      specialty: "Cardiología",
      indication: "Evaluación cardiovascular rutinaria",
      results: "Ritmo sinusal normal, sin alteraciones significativas",
      notes: "ECG dentro de parámetros normales para la edad",
      status: "Completado",
    },
  ],

  // Laboratory Tests
  labTests: [
    {
      id: "LAB-001",
      date: "2024-11-10",
      test: "Hemograma completo",
      orderedBy: "Dr. Ana López",
      results: "Valores normales",
      status: "Completado",
      values: {
        Hemoglobina: { value: "13.5", unit: "g/dL", reference: "12.0-15.5", status: "Normal" },
        Hematocrito: { value: "40.2", unit: "%", reference: "36-46", status: "Normal" },
        Leucocitos: { value: "7200", unit: "/μL", reference: "4500-11000", status: "Normal" },
        Plaquetas: { value: "280000", unit: "/μL", reference: "150000-450000", status: "Normal" },
      },
    },
    {
      id: "LAB-002",
      date: "2024-09-20",
      test: "Química sanguínea",
      orderedBy: "Dr. Juan Pérez",
      results: "Glucosa ligeramente elevada",
      status: "Completado",
      values: {
        Glucosa: { value: "110", unit: "mg/dL", reference: "70-100", status: "Elevado" },
        Creatinina: { value: "0.9", unit: "mg/dL", reference: "0.6-1.2", status: "Normal" },
        "Colesterol Total": { value: "180", unit: "mg/dL", reference: "<200", status: "Normal" },
        Triglicéridos: { value: "150", unit: "mg/dL", reference: "<150", status: "Límite" },
      },
    },
  ],

  // Imaging Studies
  imagingStudies: [
    {
      id: "IMG-001",
      date: "2024-08-15",
      study: "Radiografía de Tórax",
      indication: "Evaluación pulmonar rutinaria",
      radiologist: "Dr. Patricia Ruiz",
      findings: "Campos pulmonares libres, silueta cardíaca normal",
      impression: "Estudio normal",
      status: "Completado",
    },
  ],

  // Immunizations
  immunizations: [
    {
      vaccine: "COVID-19 (Pfizer)",
      date: "2024-01-15",
      dose: "Refuerzo",
      administeredBy: "Enfermera Carmen Díaz",
      lotNumber: "PF123456",
      site: "Brazo izquierdo",
    },
    {
      vaccine: "Influenza",
      date: "2023-10-20",
      dose: "Anual",
      administeredBy: "Enfermera María Santos",
      lotNumber: "FLU789012",
      site: "Brazo derecho",
    },
  ],

  // Documents
  documents: [
    {
      id: "DOC-001",
      date: "2024-11-15",
      name: "Receta_Cefalea_15Nov2024.pdf",
      type: "Receta",
      size: "245 KB",
      uploadedBy: "Dr. Juan Pérez",
    },
    {
      id: "DOC-002",
      date: "2024-10-25",
      name: "ECG_25Oct2024.pdf",
      type: "Estudio",
      size: "1.2 MB",
      uploadedBy: "Dr. Carlos Martínez",
    },
  ],

  // Social History
  socialHistory: {
    smoking: { status: "Nunca fumó", quitDate: null, packsPerDay: 0 },
    alcohol: { status: "Ocasional", frequency: "1-2 copas por semana" },
    drugs: { status: "Nunca", substances: [] },
    exercise: { frequency: "3 veces por semana", type: "Caminata y yoga" },
    diet: { type: "Balanceada", restrictions: "Ninguna" },
  },

  // Family History
  familyHistory: [
    { relation: "Madre", condition: "Diabetes Tipo 2", ageOfOnset: 55, status: "Viva" },
    { relation: "Padre", condition: "Hipertensión", ageOfOnset: 48, status: "Vivo" },
    { relation: "Abuela materna", condition: "Enfermedad cardíaca", ageOfOnset: 70, status: "Fallecida" },
  ],
}

// Type definitions
export type PatientEHR = typeof mockPatientEHR
export type VitalSigns = (typeof mockPatientEHR.vitalSigns)[0]
export type Consultation = (typeof mockPatientEHR.consultations)[0]
export type LabTest = (typeof mockPatientEHR.labTests)[0]
export type Medication = (typeof mockPatientEHR.currentMedications)[0]
export type Allergy = (typeof mockPatientEHR.allergies)[0]
export type ChronicCondition = (typeof mockPatientEHR.chronicConditions)[0]
export type Document = (typeof mockPatientEHR.documents)[0]
