// Mock patient data
export const mockPatients = [
  {
    id: "EXP-2024-001234",
    firstName: "María Elena",
    lastName: "González",
    cedula: "001-1234567-8",
    dateOfBirth: "1985-03-15",
    age: 38,
    gender: "Femenino",
    phone: "809-555-0123",
    email: "maria.gonzalez@email.com",
    address: "Calle Principal #123, Los Alcarrizos",
    city: "Santo Domingo",
    province: "Distrito Nacional",
    bloodType: "O+",
    allergies: ["Penicilina", "Mariscos"],
    insuranceProvider: "ARS Humano",
    emergencyContact: "Carlos González - 809-555-0124",
    lastVisit: "2024-11-15",
    status: "Activo",
  },
  {
    id: "EXP-2024-001235",
    firstName: "Juan Carlos",
    lastName: "Rodríguez",
    cedula: "001-2345678-9",
    dateOfBirth: "1978-07-22",
    age: 45,
    gender: "Masculino",
    phone: "809-555-0125",
    email: "juan.rodriguez@email.com",
    address: "Av. 27 de Febrero #456, Gazcue",
    city: "Santo Domingo",
    province: "Distrito Nacional",
    bloodType: "A+",
    allergies: ["Aspirina"],
    insuranceProvider: "SeNaSa",
    emergencyContact: "Ana Rodríguez - 809-555-0126",
    lastVisit: "2024-11-10",
    status: "Activo",
  },
  {
    id: "EXP-2024-001236",
    firstName: "Carmen Rosa",
    lastName: "Martínez",
    cedula: "001-3456789-0",
    dateOfBirth: "1992-12-08",
    age: 31,
    gender: "Femenino",
    phone: "809-555-0127",
    email: "carmen.martinez@email.com",
    address: "Calle Duarte #789, Santiago",
    city: "Santiago",
    province: "Santiago",
    bloodType: "B+",
    allergies: [],
    insuranceProvider: "ARS Palic",
    emergencyContact: "Pedro Martínez - 809-555-0128",
    lastVisit: "2024-10-28",
    status: "Inactivo",
  },
  {
    id: "EXP-2024-001237",
    firstName: "Roberto",
    lastName: "Fernández",
    cedula: "001-4567890-1",
    dateOfBirth: "1965-05-14",
    age: 58,
    gender: "Masculino",
    phone: "809-555-0129",
    email: "roberto.fernandez@email.com",
    address: "Calle Mella #321, La Vega",
    city: "La Vega",
    province: "La Vega",
    bloodType: "AB+",
    allergies: ["Penicilina", "Látex"],
    insuranceProvider: "ARS Universal",
    emergencyContact: "María Fernández - 809-555-0130",
    lastVisit: "2024-11-12",
    status: "Activo",
  },
]

// Mock medical history data
export const mockMedicalHistory: Record<string, {
  consultations: Array<{
    id: string
    date: string
    doctor: string
    reason: string
    diagnosis: string
    treatment: string
    notes: string
    status: string
  }>
  procedures: Array<{
    id: string
    date: string
    procedure: string
    doctor: string
    results: string
    notes: string
    status: string
  }>
  labTests: Array<{
    id: string
    date: string
    test: string
    results: string
    doctor: string
    status: string
    values: Record<string, string>
  }>
  documents: Array<{
    id: string
    date: string
    name: string
    type: string
    size: string
    uploadedBy: string
  }>
  appointments: Array<{
    id: string
    date: string
    time: string
    doctor: string
    reason: string
    status: string
  }>
}> = {
  "EXP-2024-001234": {
    consultations: [
      {
        id: "CONS-001",
        date: "2024-11-15",
        doctor: "Dr. Juan Pérez",
        reason: "Dolor de cabeza persistente",
        diagnosis: "Cefalea tensional",
        treatment: "Acetaminofén 500mg c/8h x 5 días",
        notes: "Paciente refiere mejoría con analgésicos. Recomendar descanso.",
        status: "Completada",
      },
      {
        id: "CONS-002",
        date: "2024-10-20",
        doctor: "Dr. Ana López",
        reason: "Chequeo de rutina",
        diagnosis: "Paciente sana",
        treatment: "Continuar con estilo de vida saludable",
        notes: "Todos los parámetros dentro de rangos normales.",
        status: "Completada",
      },
      {
        id: "CONS-003",
        date: "2024-09-15",
        doctor: "Dr. Juan Pérez",
        reason: "Seguimiento hipertensión",
        diagnosis: "Hipertensión controlada",
        treatment: "Losartán 50mg continuar",
        notes: "Presión arterial estable. Continuar medicación actual.",
        status: "Completada",
      },
    ],
    procedures: [
      {
        id: "PROC-001",
        date: "2024-10-25",
        procedure: "Electrocardiograma",
        doctor: "Dr. Carlos Martínez",
        results: "Ritmo sinusal normal",
        notes: "ECG sin alteraciones significativas",
        status: "Completado",
      },
    ],
    labTests: [
      {
        id: "LAB-001",
        date: "2024-11-10",
        test: "Hemograma completo",
        results: "Valores normales",
        doctor: "Dr. Ana López",
        status: "Completado",
        values: {
          Hemoglobina: "13.5 g/dL",
          Hematocrito: "40.2%",
          Leucocitos: "7,200/μL",
          Plaquetas: "280,000/μL",
        },
      },
      {
        id: "LAB-002",
        date: "2024-09-20",
        test: "Química sanguínea",
        results: "Glucosa ligeramente elevada",
        doctor: "Dr. Juan Pérez",
        status: "Completado",
        values: {
          Glucosa: "110 mg/dL",
          Creatinina: "0.9 mg/dL",
          Colesterol: "180 mg/dL",
          Triglicéridos: "150 mg/dL",
        },
      },
    ],
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
      {
        id: "DOC-003",
        date: "2024-09-20",
        name: "Resultados_Lab_20Sep2024.pdf",
        type: "Laboratorio",
        size: "890 KB",
        uploadedBy: "Dr. Ana López",
      },
    ],
    appointments: [
      {
        id: "APT-001",
        date: "2024-12-15",
        time: "10:00 AM",
        doctor: "Dr. Juan Pérez",
        reason: "Seguimiento cefalea",
        status: "Programada",
      },
      {
        id: "APT-002",
        date: "2024-11-15",
        time: "2:30 PM",
        doctor: "Dr. Juan Pérez",
        reason: "Dolor de cabeza",
        status: "Completada",
      },
    ],
  },
}

// Type definitions
export type Patient = (typeof mockPatients)[0]
export type MedicalHistory = (typeof mockMedicalHistory)[string]
