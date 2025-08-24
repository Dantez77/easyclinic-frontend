// Local types file for appointments module

export interface Appointment {
  id: string
  patientId: string
  patientName: string
  patientPhone: string
  patientEmail: string
  doctor: string
  date: string
  time: string
  duration: number
  type: string
  status: "pending" | "confirmed" | "cancelled" | "completed"
  notes: string
  patientHistory: string[]
  createdAt: string
  updatedAt: string
}

export interface Patient {
  id: string
  patientId: string
  firstName: string
  lastName: string
  phone: string
  email: string
  dui: string
}

export interface AppointmentFormData {
  patientId: string
  patientName: string
  patientPhone: string
  patientEmail: string
  doctor: string
  date: string
  time: string
  type: string
  notes: string
}

// Constants
export const APPOINTMENT_TYPES = [
  "Consultation",
  "Follow-up",
  "Procedure",
  "Emergency",
  "Screening",
  "Vaccination",
  "Lab Work",
  "Imaging",
]

export const TIME_SLOTS = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00", "17:30",
]
