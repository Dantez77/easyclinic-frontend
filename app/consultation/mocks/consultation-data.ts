// Mock patient data
export const patientData = {
  fullName: "John Smith",
  dateOfBirth: "03/15/1985",
  age: "38 years",
  gender: "Male",
  patientId: "EXP-2024-001234",
  bloodType: "O+",
  allergies: ["Penicillin", "Shellfish"],
  insurance: "Health Insurance - Basic Plan",
  emergencyContact: "Jane Smith (Wife) - (555) 123-4567",
}

export const commonComplaints = [
  "Headache",
  "Fever",
  "Abdominal pain",
  "Cough",
  "Sore throat",
  "Nausea",
  "Dizziness",
  "Fatigue",
  "Muscle pain",
  "Shortness of breath",
]

export const commonSymptoms = [
  "Fever",
  "Pain",
  "Nausea",
  "Vomiting",
  "Diarrhea",
  "Constipation",
  "Cough",
  "Shortness of breath",
  "Palpitations",
  "Dizziness",
  "Headache",
  "Fatigue",
]

export const medications = [
  "Acetaminophen 500mg",
  "Ibuprofen 400mg",
  "Amoxicillin 500mg",
  "Omeprazole 20mg",
  "Losartan 50mg",
  "Metformin 850mg",
]

export const labTests = [
  "Complete Blood Count",
  "Blood Chemistry",
  "Lipid Profile",
  "Urinalysis",
  "TSH",
  "Fasting Glucose",
  "Chest X-ray",
]

export const medicalHistory = [
  {
    id: "1",
    title: "Consultation - Headache",
    doctor: "Dr. Sarah Johnson",
    date: "11/15/2024",
    status: "Completed",
    description: "Diagnosis: Tension headache. Treatment with analgesics.",
    type: "consultation",
  },
  {
    id: "2",
    title: "Routine Examination",
    doctor: "Dr. Michael Chen",
    date: "10/02/2024",
    status: "Completed",
    description: "General checkup. All parameters normal.",
    type: "examination",
  },
]

export const documents = [
  {
    id: "1",
    name: "Lab_Results_Nov15_2024.pdf",
    size: "2.3 MB",
    uploadedAt: "2 days ago",
    type: "lab-results",
  },
]

export type PatientData = typeof patientData
export type MedicalHistoryItem = typeof medicalHistory[0]
export type Document = typeof documents[0]
