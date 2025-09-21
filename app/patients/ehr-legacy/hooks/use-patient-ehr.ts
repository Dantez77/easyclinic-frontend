import { useState, useRef, useEffect } from "react"
import { mockPatientEHR, type PatientEHR } from "../mocks/patient-data"
import { patientsAPI } from "@/lib/patients-api"
import { medicalRecordsAPI, MedicalRecord } from "@/lib/medical-records-api"

export const usePatientEHR = (patientId: string) => {
  const [activeTab, setActiveTab] = useState("overview")
  const [patientData, setPatientData] = useState<PatientEHR>(mockPatientEHR)
  const [medicalRecord, setMedicalRecord] = useState<MedicalRecord | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const printRef = useRef<HTMLDivElement>(null)

  const handlePrint = () => {
    window.print()
  }

  const handleExportPDF = () => {
    // In a real application, you would use a library like jsPDF or Puppeteer
    // For this demo, we'll simulate the PDF export
    alert("Exportando EHR a PDF... (Funcionalidad simulada)")
  }

  // Fetch real patient data and medical records from the API
  const fetchPatientData = async (id: string) => {
    setLoading(true)
    setError(null)
    try {
      // Fetch both patient info and medical records in parallel
      const [patient, medicalRecordData] = await Promise.all([
        patientsAPI.getPatient(id),
        medicalRecordsAPI.getMedicalRecord(id, { include: ['all'] }).catch(() => null) // Don't fail if medical records don't exist
      ])
      
      // Convert backend patient data to EHR format for compatibility
      const ehrData: PatientEHR = {
        ...mockPatientEHR, // Keep structure for compatibility
        id: patient.id,
        firstName: patient.name, // Map backend 'name' to frontend 'firstName'
        lastName: patient.lastName,
        dui: patient.dui || '',
        dateOfBirth: patient.dateOfBirth || '',
        age: patient.dateOfBirth ? calculateAge(patient.dateOfBirth) : 0,
        gender: patient.gender === 'M' ? 'Masculino' : patient.gender === 'F' ? 'Femenino' : 'Otro',
        bloodType: patient.bloodType || '',
        maritalStatus: getCivilStatusLabel(patient.civilStatus),
        occupation: patient.profession || '',
        phone: patient.phone,
        email: patient.email,
        address: patient.address || '',
        province: patient.province || '',
        // Map medical records data - this will override the mock data with real data
        // Provide fallback data for sections not covered by the conditional mapping above
        allergies: medicalRecordData?.allergies?.map(allergy => ({
          substance: allergy.allergen,
          severity: getSeverityLabel(allergy.severity),
          reaction: allergy.reaction,
          dateIdentified: allergy.onsetDate || allergy.createdAt.split('T')[0]
        })) || [],
        currentMedications: medicalRecordData?.medications?.filter(med => med.status === 'active').map(med => ({
          medication: med.medicationName,
          dosage: med.dosage,
          frequency: med.frequency,
          startDate: med.startDate,
          prescribedBy: med.prescribedBy || 'No especificado',
          indication: med.indication || 'No especificada'
        })) || [],
        chronicConditions: medicalRecordData?.diagnoses?.filter(diag => diag.status === 'active').map(diag => ({
          condition: diag.diagnostic?.titleEs || 'Diagnóstico sin título',
          diagnosisDate: diag.diagnosisDate,
          status: diag.status === 'active' ? 'Activa' : 'Resuelta',
          notes: diag.notes || ''
        })) || [],
        labTests: medicalRecordData?.labs?.map(lab => ({
          id: lab.id,
          date: lab.orderedDate,
          test: lab.testName,
          orderedBy: lab.orderedBy || 'No especificado',
          results: lab.results || 'Pendiente',
          status: lab.status === 'completed' ? 'Completado' : 'Pendiente',
          values: lab.results ? { 
            Resultado: { 
              value: lab.results, 
              unit: lab.normalRange || '', 
              reference: lab.normalRange || '', 
              status: lab.abnormalFlag ? 'Anormal' : 'Normal' 
            } 
          } : {}
        })) || [],
        consultations: medicalRecordData?.observations?.filter(obs => obs.observationType === 'physical_exam').map(obs => ({
          id: obs.id,
          date: obs.observationDate.split('T')[0],
          doctor: obs.observedBy || 'No especificado',
          specialty: 'Medicina General',
          reason: obs.title,
          symptoms: [obs.description],
          diagnosis: obs.title,
          treatment: obs.notes || 'No especificado',
          notes: obs.notes || '',
          followUp: '',
          status: 'Completada'
        })) || [],
        procedures: [],
        imagingStudies: [],
        immunizations: [],
        documents: [],
        vitalSigns: medicalRecordData?.observations?.filter(obs => obs.observationType === 'vital_signs').map(obs => ({
          date: obs.observationDate.split('T')[0],
          [obs.title.toLowerCase()]: obs.value + (obs.unit ? ` ${obs.unit}` : '')
        })) || [],
        // Social and family history - keep mock data for now
        socialHistory: mockPatientEHR.socialHistory,
        familyHistory: mockPatientEHR.familyHistory,
        // Insurance - keep mock data for now (would come from billing module)
        insurance: mockPatientEHR.insurance,
        // Emergency contact - keep mock data for now  
        emergencyContact: mockPatientEHR.emergencyContact
      }
      
      setPatientData(ehrData)
      setMedicalRecord(medicalRecordData)
    } catch (error) {
      console.error("Error fetching patient data:", error)
      setError(error instanceof Error ? error.message : 'Error al cargar datos del paciente')
      // Fallback to mock data if API fails
      setPatientData(mockPatientEHR)
    } finally {
      setLoading(false)
    }
  }

  // Helper functions
  const calculateAge = (dateOfBirth: string) => {
    if (!dateOfBirth) return 0
    
    const today = new Date()
    const birth = new Date(dateOfBirth)
    
    // Check if date is valid
    if (isNaN(birth.getTime())) return 0
    
    const age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      return age - 1
    }
    return age
  }

  const getCivilStatusLabel = (status?: string) => {
    switch (status) {
      case 'Single': return 'Soltero/a'
      case 'Married': return 'Casado/a'
      case 'Divorced': return 'Divorciado/a'
      case 'Widowed': return 'Viudo/a'
      default: return 'No especificado'
    }
  }

  const getSeverityLabel = (severity: string) => {
    switch (severity) {
      case 'mild': return 'Leve'
      case 'moderate': return 'Moderada'
      case 'severe': return 'Severa'
      case 'life-threatening': return 'Mortal'
      default: return severity
    }
  }

  // Load patient data when patientId changes
  useEffect(() => {
    if (patientId) {
      fetchPatientData(patientId)
    }
  }, [patientId])

  return {
    // State
    activeTab,
    patientData,
    medicalRecord,
    loading,
    error,
    printRef,
    
    // Actions
    setActiveTab,
    handlePrint,
    handleExportPDF,
    fetchPatientData,
  }
}
