import { useState, useRef } from "react"
import { mockPatientEHR, type PatientEHR } from "../mocks/patient-data"

export const usePatientEHR = (patientId: string) => {
  const [activeTab, setActiveTab] = useState("overview")
  const [patientData, setPatientData] = useState<PatientEHR>(mockPatientEHR)
  const printRef = useRef<HTMLDivElement>(null)

  const handlePrint = () => {
    window.print()
  }

  const handleExportPDF = () => {
    // In a real application, you would use a library like jsPDF or Puppeteer
    // For this demo, we'll simulate the PDF export
    alert("Exportando EHR a PDF... (Funcionalidad simulada)")
  }

  // In a real application, this would fetch patient data from the API
  const fetchPatientData = async (id: string) => {
    try {
      // Simulate API call
      // const response = await fetch(`/api/patients/${id}/ehr`)
      // const data = await response.json()
      // setPatientData(data)
      
      // For now, return mock data
      setPatientData(mockPatientEHR)
    } catch (error) {
      console.error("Error fetching patient data:", error)
    }
  }

  return {
    // State
    activeTab,
    patientData,
    printRef,
    
    // Actions
    setActiveTab,
    handlePrint,
    handleExportPDF,
    fetchPatientData,
  }
}
