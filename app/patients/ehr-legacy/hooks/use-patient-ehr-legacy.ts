"use client"

import { useState, useRef } from 'react'
import { mockPatientEHR } from '../mocks/patient-data'
import type { PatientEHR } from '../mocks/patient-data'

export function usePatientEHRLegacy(patientId: string) {
  const [activeTab, setActiveTab] = useState("overview")
  const [loading] = useState(false)
  const [error] = useState<string | null>(null)
  const printRef = useRef<HTMLDivElement>(null)

  // Always return mock data for legacy version
  const patientData: PatientEHR = {
    ...mockPatientEHR,
    id: patientId, // Use the actual patient ID from URL
  }

  const handlePrint = () => {
    if (printRef.current) {
      const printWindow = window.open('', '_blank')
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Expediente Médico - ${patientData.firstName} ${patientData.lastName}</title>
              <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .print-header { text-align: center; margin-bottom: 30px; }
                .patient-info { background: #f5f5f5; padding: 15px; margin-bottom: 20px; }
                .section { margin-bottom: 20px; }
                .section-title { font-size: 18px; font-weight: bold; margin-bottom: 10px; border-bottom: 1px solid #ccc; }
                table { width: 100%; border-collapse: collapse; margin-bottom: 15px; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #f2f2f2; }
              </style>
            </head>
            <body>
              <div class="print-header">
                <h1>EXPEDIENTE MÉDICO ELECTRÓNICO (LEGACY)</h1>
                <h2>Intergastro - Clínica Especializada</h2>
              </div>
              ${printRef.current.innerHTML}
            </body>
          </html>
        `)
        printWindow.document.close()
        printWindow.print()
      }
    }
  }

  const handleExportPDF = () => {
    // Simple PDF export simulation for legacy
    alert('Funcionalidad de exportar PDF - Versión Legacy\nEsta es la versión de referencia con datos de prueba.')
  }

  return {
    activeTab,
    patientData,
    medicalRecord: null, // Legacy version doesn't have medical records
    loading,
    error,
    printRef,
    
    // Actions
    setActiveTab,
    handlePrint,
    handleExportPDF,
  }
}
