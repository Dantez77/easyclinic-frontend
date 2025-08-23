import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { patientData } from "../mocks/consultation-data"

export interface VitalSigns {
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
}

export const useConsultation = () => {
  const searchParams = useSearchParams()
  const patientName = searchParams.get("patient") || "Unknown Patient"
  const appointmentId = searchParams.get("appointmentId")

  const [formData, setFormData] = useState<ConsultationForm>({
    chiefComplaint: "",
    symptoms: [],
    symptomsNotes: "",
    vitalSigns: {
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
    prescriptions: [{ medication: "", dosage: "", frequency: "", duration: "", instructions: "" }],
    selectedTests: [],
    labNotes: "",
    labPriority: "normal",
    lifestyleRecommendations: "",
    returnToWorkNote: "",
    followUpDate: "",
    doctorNotes: "",
    internalNote: false,
  })

  // Update patient data based on the patient name from URL
  useEffect(() => {
    if (patientName && patientName !== "Unknown Patient") {
      patientData.fullName = patientName
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
      prescriptions: [...prev.prescriptions, { medication: "", dosage: "", frequency: "", duration: "", instructions: "" }]
    }))
  }

  const removePrescription = (index: number) => {
    setFormData(prev => ({
      ...prev,
      prescriptions: prev.prescriptions.filter((_, i) => i !== index)
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
    const weight = Number.parseFloat(formData.vitalSigns.weight)
    const height = Number.parseFloat(formData.vitalSigns.height) / 100 // Convert cm to m
    if (weight && height) {
      const bmi = (weight / (height * height)).toFixed(1)
      updateVitalSigns({ bmi })
    }
  }

  const saveConsultation = async () => {
    try {
      // Here you would typically save the consultation data to your backend
      console.log("Saving consultation:", formData)
      alert("Consultation saved successfully!")
      return true
    } catch (error) {
      console.error("Error saving consultation:", error)
      alert("Error saving consultation")
      return false
    }
  }

  const generatePDFReport = () => {
    // Generate PDF report logic
    console.log("Generating PDF report...")
    alert("PDF report generated successfully!")
  }

  const sendPrescription = () => {
    // Send prescription logic
    console.log("Sending prescription...")
    alert("Prescription sent successfully!")
  }

  return {
    patientName,
    appointmentId,
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
