"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Users } from "lucide-react"
import { usePatientEHR } from "../hooks/use-patient-ehr"
import { PatientHeader } from "../components/patient-header"
import { OverviewTab } from "../components/overview-tab"
import { MedicalTab } from "../components/medical-tab"
import { TestsTab } from "../components/tests-tab"
import { MedicationsTab } from "../components/medications-tab"
import { HistoryTab } from "../components/history-tab"
import { DocumentsTab } from "../components/documents-tab"

export default function PatientEHRPage({ params }: { params: { patientId: string } }) {
  const {
    activeTab,
    patientData,
    printRef,
    setActiveTab,
    handlePrint,
    handleExportPDF,
  } = usePatientEHR(params.patientId)

  return (
    <div className="min-h-screen bg-background">
      {/* Back Navigation */}
      <div className="bg-card border-b border-main-200 dark:border-main-800 p-4 lg:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button 
                onClick={() => (window.location.href = "/patients")} 
                variant="outline" 
                className="bg-transparent"
              >
                <Users className="w-4 h-4 mr-2" />
                Volver a Pacientes
              </Button>
            </div>
          </div>
        </div>
      </div>

      <PatientHeader
        patientName={`${patientData.firstName} ${patientData.lastName}`}
        patientId={patientData.id}
        onPrint={handlePrint}
        onExportPDF={handleExportPDF}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-4 lg:p-6" ref={printRef}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6 print:hidden">
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="medical">Médico</TabsTrigger>
            <TabsTrigger value="tests">Exámenes</TabsTrigger>
            <TabsTrigger value="medications">Medicamentos</TabsTrigger>
            <TabsTrigger value="history">Historial</TabsTrigger>
            <TabsTrigger value="documents">Documentos</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <OverviewTab patientData={patientData} />
          </TabsContent>

          {/* Medical Tab */}
          <TabsContent value="medical">
            <MedicalTab patientData={patientData} />
          </TabsContent>

          {/* Tests Tab */}
          <TabsContent value="tests">
            <TestsTab patientData={patientData} />
          </TabsContent>

          {/* Medications Tab */}
          <TabsContent value="medications">
            <MedicationsTab patientData={patientData} />
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history">
            <HistoryTab patientData={patientData} />
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents">
            <DocumentsTab patientData={patientData} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
