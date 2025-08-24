import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { type ConsultationForm, type VitalSigns, type Prescription, type Patient } from "../types"
import { findPatientByName } from "../utils/patient-utils"

export const useConsultation = () => {
  const searchParams = useSearchParams()
  const patientName = searchParams.get("patient") || "Unknown Patient"
  const appointmentId = searchParams.get("appointmentId")

  const [patientData, setPatientData] = useState<Patient | null>(null)
  const [formData, setFormData] = useState<ConsultationForm>({
    chiefComplaint: "",
    symptoms: [],
    symptomsNotes: "",
    vitalSigns: {
      date: new Date().toISOString().split('T')[0],
      temperature: "",
      bloodPressure: "",
      heartRate: "",
      respiratoryRate: "",
      oxygenSaturation: "",
      weight: "",
      height: "",
      bmi: "",
    },
    diagnosis: "",
    diagnosisStatus: "suspected",
    prescriptions: [{ 
      medication: "", 
      dosage: "", 
      frequency: "", 
      duration: "", 
      instructions: "",
      prescribedBy: "Dr. Current Doctor",
      prescribedAt: new Date().toISOString(),
    }],
    selectedTests: [],
    labNotes: "",
    labPriority: "normal",
    lifestyleRecommendations: "",
    returnToWorkNote: "",
    followUpDate: "",
    doctorNotes: "",
    internalNote: false,
  })

  // Load patient data based on the patient name from URL
  useEffect(() => {
    if (patientName && patientName !== "Unknown Patient") {
      const patient = findPatientByName(patientName)
      if (patient) {
        setPatientData(patient)
        console.log("Patient loaded:", patient)
      } else {
        console.error("Patient not found:", patientName)
      }
    }
  }, [patientName])

  const updateFormData = (updates: Partial<ConsultationForm>) => {
    setFormData(prev => ({ ...prev, ...updates }))
  }

  const updateVitalSigns = (updates: Partial<VitalSigns>) => {
    setFormData(prev => ({
      ...prev,
      vitalSigns: { ...prev.vitalSigns, ...updates }
    }))
  }

  const addSymptom = (symptom: string) => {
    if (!formData.symptoms.includes(symptom)) {
      setFormData(prev => ({
        ...prev,
        symptoms: [...prev.symptoms, symptom]
      }))
    }
  }

  const removeSymptom = (symptom: string) => {
    setFormData(prev => ({
      ...prev,
      symptoms: prev.symptoms.filter(s => s !== symptom)
    }))
  }

  const addPrescription = () => {
    setFormData(prev => ({
      ...prev,
      prescriptions: [...prev.prescriptions, { 
        medication: "", 
        dosage: "", 
        frequency: "", 
        duration: "", 
        instructions: "",
        prescribedBy: "Dr. Current Doctor",
        prescribedAt: new Date().toISOString(),
      }]
    }))
  }

  const removePrescription = (index: number) => {
    setFormData(prev => ({
      ...prev,
      prescriptions: prev.prescriptions.filter((_, i) => index !== i)
    }))
  }

  const updatePrescription = (index: number, updates: Partial<Prescription>) => {
    setFormData(prev => ({
      ...prev,
      prescriptions: prev.prescriptions.map((prescription, i) => 
        i === index ? { ...prescription, ...updates } : prescription
      )
    }))
  }

  const addTest = (test: string) => {
    if (!formData.selectedTests.includes(test)) {
      setFormData(prev => ({
        ...prev,
        selectedTests: [...prev.selectedTests, test]
      }))
    }
  }

  const removeTest = (test: string) => {
    setFormData(prev => ({
      ...prev,
      selectedTests: prev.selectedTests.filter(t => t !== test)
    }))
  }

  const calculateBMI = () => {
    const weight = parseFloat(formData.vitalSigns.weight)
    const height = parseFloat(formData.vitalSigns.height) / 100 // Convert cm to meters
    
    if (weight > 0 && height > 0) {
      const bmi = weight / (height * height)
      updateVitalSigns({ bmi: bmi.toFixed(1) })
    } else {
      updateVitalSigns({ bmi: "" })
    }
  }

  const saveConsultation = async (): Promise<boolean> => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const consultationData = {
        patientId: patientData?.id,
        appointmentId,
        ...formData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      
      console.log("Saving consultation:", consultationData)
      alert("Consultation saved successfully!")
      return true
    } catch (error) {
      console.error("Error saving consultation:", error)
      alert("Error saving consultation. Please try again.")
      return false
    }
  }

  const generatePDFReport = async () => {
    try {
      // Simulate PDF generation
      await new Promise(resolve => setTimeout(resolve, 2000))
      alert("PDF report generated successfully!")
    } catch (error) {
      console.error("Error generating PDF:", error)
      alert("Error generating PDF report. Please try again.")
    }
  }

  const sendPrescription = async () => {
    try {
      // Simulate sending prescription
      await new Promise(resolve => setTimeout(resolve, 1000))
      alert("Prescription sent successfully!")
    } catch (error) {
      console.error("Error sending prescription:", error)
      alert("Error sending prescription. Please try again.")
    }
  }

  return {
    patientData,
    formData,
    updateFormData,
    updateVitalSigns,
    addSymptom,
    removeSymptom,
    addPrescription,
    removePrescription,
    updatePrescription,
    addTest,
    removeTest,
    calculateBMI,
    saveConsultation,
    generatePDFReport,
    sendPrescription,
  }
}
