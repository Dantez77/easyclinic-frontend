import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { type ConsultationForm, type VitalSigns, type Prescription, type Patient, type MedicalAntecedents, type FinalDiagnosis, type AIDiagnosis, type AIConsultationInput, type AIConsultationOutput } from "../types"
import { findPatientByName } from "../utils/patient-utils"
import { useLanguage } from "@/lib/language-context"

export const useConsultation = () => {
  const { t } = useLanguage()
  const searchParams = useSearchParams()
  const patientName = searchParams.get("patient") || t('consultation.errors.patientNotFound')
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
    // New fields for antecedentes and AI functionality
    medicalAntecedents: {
      personalHistory: [],
      familyHistory: [],
      surgicalHistory: [],
      obstetricHistory: "",
      lifestyleFactors: {
        smoking: "none",
        alcohol: "none",
        diet: "",
        exercise: "",
        occupation: "",
        other: ""
      },
      socialHistory: ""
    },
    finalDiagnosis: {
      primaryDiagnosis: "",
      secondaryDiagnoses: [],
      differentialDiagnoses: [],
      icd10Codes: [],
      clinicalImpression: "",
      treatmentPlan: "",
      followUpPlan: "",
      notes: ""
    },
    aiDiagnosis: undefined
  })

  const [isGeneratingAI, setIsGeneratingAI] = useState(false)

  // Load patient data based on the patient name from URL
  useEffect(() => {
    if (patientName && patientName !== t('consultation.errors.patientNotFound')) {
      const patient = findPatientByName(patientName)
      if (patient) {
        setPatientData(patient)
        console.log("Patient loaded:", patient)
      } else {
        console.error("Patient not found:", patientName)
      }
    }
  }, [patientName, t])

  const updateFormData = (updates: Partial<ConsultationForm>) => {
    setFormData(prev => ({ ...prev, ...updates }))
  }

  const updateVitalSigns = (updates: Partial<VitalSigns>) => {
    setFormData(prev => ({
      ...prev,
      vitalSigns: { ...prev.vitalSigns, ...updates }
    }))
  }

  const updateMedicalAntecedents = (updates: Partial<MedicalAntecedents>) => {
    setFormData(prev => ({
      ...prev,
      medicalAntecedents: { ...prev.medicalAntecedents, ...updates }
    }))
  }

  const updateFinalDiagnosis = (updates: Partial<FinalDiagnosis>) => {
    setFormData(prev => ({
      ...prev,
      finalDiagnosis: { ...prev.finalDiagnosis, ...updates }
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

  // Transform consultation data to AI API format
  const transformToAIConsultationInput = (): AIConsultationInput => {
    if (!patientData) {
      throw new Error(t('consultation.errors.patientNotFound'))
    }

    return {
      id_paciente: patientData.patientId,
      datos_demograficos: {
        edad: patientData.age,
        sexo: patientData.gender.toLowerCase()
      },
      motivo_consulta: formData.chiefComplaint,
      sintomas: formData.symptoms,
      signos_vitales: {
        temperatura_c: parseFloat(formData.vitalSigns.temperature) || 0,
        presion_arterial: formData.vitalSigns.bloodPressure || "0/0",
        frecuencia_cardiaca_lpm: parseInt(formData.vitalSigns.heartRate) || 0,
        frecuencia_respiratoria_rpm: parseInt(formData.vitalSigns.respiratoryRate) || 0
      },
      antecedentes_medicos: formData.medicalAntecedents.personalHistory,
      antecedentes_familiares: formData.medicalAntecedents.familyHistory,
      estilo_vida: {
        tabaquismo: formData.medicalAntecedents.lifestyleFactors.smoking,
        alcohol: formData.medicalAntecedents.lifestyleFactors.alcohol,
        dieta: formData.medicalAntecedents.lifestyleFactors.diet
      },
      medicamentos: formData.prescriptions
        .filter(p => p.medication)
        .map(p => `${p.medication} ${p.dosage} ${p.frequency}`)
    }
  }

  // Generate AI diagnosis
  const generateAIDiagnosis = async (): Promise<void> => {
    if (!patientData) {
      alert(t('consultation.errors.patientNotFound'))
      return
    }

    setIsGeneratingAI(true)
    
    try {
      // Transform data to AI API format
      const aiInput = transformToAIConsultationInput()
      console.log("AI Consultation Input:", aiInput)

      // Simulate AI API call (replace with actual API endpoint)
      const response = await simulateAIApiCall(aiInput)
      
      // Transform AI response to our format
      const aiDiagnosis: AIDiagnosis = {
        suggestedDiagnoses: response.prediagnosticos_sugeridos.map(d => ({
          condition: d.condicion,
          probability: d.probabilidad,
          reasoning: d.razonamiento
        })),
        recommendedSteps: response.pasos_recomendados,
        confidence: 0.85, // This would come from the AI response
        reasoning: "AI analysis based on symptoms, vital signs, and medical history",
        disclaimer: response.aviso,
        generatedAt: new Date().toISOString()
      }

      setFormData(prev => ({
        ...prev,
        aiDiagnosis
      }))

      console.log("AI Diagnosis generated:", aiDiagnosis)
    } catch (error) {
      console.error("Error generating AI diagnosis:", error)
      alert(t('consultation.errors.aiGeneration'))
    } finally {
      setIsGeneratingAI(false)
    }
  }

  // Simulate AI API call (replace with actual implementation)
  const simulateAIApiCall = async (input: AIConsultationInput): Promise<AIConsultationOutput> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    // Return mock AI response based on the input
    return {
      id_paciente: input.id_paciente,
      prediagnosticos_sugeridos: [
        {
          condicion: "Diagnóstico preliminar basado en síntomas",
          probabilidad: 0.75,
          razonamiento: "Análisis basado en los síntomas reportados y signos vitales"
        }
      ],
      pasos_recomendados: [
        "Realizar exámenes adicionales según síntomas",
        "Considerar diagnóstico diferencial",
        "Monitorear evolución del paciente"
      ],
      aviso: "Esto es solo una sugerencia de prediagnóstico. Las decisiones finales de diagnóstico y tratamiento deben ser tomadas por un médico con licencia."
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
      alert(t('consultation.success.save'))
      return true
    } catch (error) {
      console.error("Error saving consultation:", error)
      alert(t('consultation.errors.save'))
      return false
    }
  }

  const generatePDFReport = async () => {
    try {
      // Simulate PDF generation
      await new Promise(resolve => setTimeout(resolve, 2000))
      alert(t('consultation.success.pdf'))
    } catch (error) {
      console.error("Error generating PDF:", error)
      alert(t('consultation.errors.pdf'))
    }
  }

  const sendPrescription = async () => {
    try {
      // Simulate sending prescription
      await new Promise(resolve => setTimeout(resolve, 1000))
      alert(t('consultation.success.prescription'))
    } catch (error) {
      console.error("Error sending prescription:", error)
      alert(t('consultation.errors.prescription'))
    }
  }

  return {
    patientData,
    formData,
    isGeneratingAI,
    updateFormData,
    updateVitalSigns,
    updateMedicalAntecedents,
    updateFinalDiagnosis,
    addSymptom,
    removeSymptom,
    addPrescription,
    removePrescription,
    updatePrescription,
    addTest,
    removeTest,
    calculateBMI,
    generateAIDiagnosis,
    saveConsultation,
    generatePDFReport,
    sendPrescription,
  }
}
