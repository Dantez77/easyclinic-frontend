import { mockPatients } from "../../patients/mocks/patients-data"
import { type Patient } from "../types"

export const findPatientByName = (fullName: string): Patient | null => {
  const patient = mockPatients.find(p => 
    `${p.firstName} ${p.lastName}` === fullName
  )
  return patient || null
}

export const findPatientById = (id: string): Patient | null => {
  const patient = mockPatients.find(p => p.id === id)
  return patient || null
}

export const findPatientByPatientId = (patientId: string): Patient | null => {
  const patient = mockPatients.find(p => p.patientId === patientId)
  return patient || null
}
