"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// Import custom hook
import { useConsultation } from "./hooks/use-consultation"

// Import components
import { ConsultationHeader } from "./components/consultation-header"
import { PatientSummarySidebar } from "./components/patient-summary-sidebar"
import { ChiefComplaintCard } from "./components/chief-complaint-card"
import { SymptomsCard } from "./components/symptoms-card"
import { VitalSignsCard } from "./components/vital-signs-card"
import { PrescriptionCard } from "./components/prescription-card"
import { MedicalOrdersCard } from "./components/medical-orders-card"
import { MedicalInstructionsCard } from "./components/medical-instructions-card"
import { MedicalHistoryCard } from "./components/medical-history-card"
import { DocumentsCard } from "./components/documents-card"
import { DoctorNotesCard } from "./components/doctor-notes-card"
import { ActionButtons } from "./components/action-buttons"

export default function PatientConsultationPage() {
  const {
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
  } = useConsultation()

  const handleBack = () => {
    window.history.back()
  }

  const handleSymptomToggle = (symptom: string) => {
    if (formData.symptoms.includes(symptom)) {
      removeSymptom(symptom)
    } else {
      addSymptom(symptom)
    }
  }

  const handleTestToggle = (test: string) => {
    if (formData.selectedTests.includes(test)) {
      removeTest(test)
    } else {
      addTest(test)
    }
  }

  const handleSaveConsultation = async () => {
    const success = await saveConsultation()
    if (success) {
      window.close()
    }
  }

  // Show loading state if patient data is not yet loaded
  if (!patientData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg text-muted-foreground">Loading patient data...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <ConsultationHeader onBack={handleBack} />

      <div className="flex flex-col lg:flex-row h-[calc(100vh-4rem)] bg-background">
        <PatientSummarySidebar patientData={patientData} />

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Content Tabs */}
          <div className="flex-1 p-6">
            <Tabs defaultValue="consultation" className="h-full">
              <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
                <TabsTrigger value="consultation" className="text-xs lg:text-sm">
                  Consultation
                </TabsTrigger>
                <TabsTrigger value="history" className="text-xs lg:text-sm">
                  History
                </TabsTrigger>
                <TabsTrigger value="documents" className="text-xs lg:text-sm">
                  Documents
                </TabsTrigger>
                <TabsTrigger value="notes" className="text-xs lg:text-sm">
                  Notes
                </TabsTrigger>
              </TabsList>

              <TabsContent value="consultation" className="mt-6 h-full">
                <ScrollArea className="h-full">
                  <div className="space-y-8 pb-8">
                    <ChiefComplaintCard
                      chiefComplaint={formData.chiefComplaint}
                      onChiefComplaintChange={(value) => updateFormData({ chiefComplaint: value })}
                    />

                    <SymptomsCard
                      selectedSymptoms={formData.symptoms}
                      symptomsNotes={formData.symptomsNotes}
                      onSymptomToggle={handleSymptomToggle}
                      onSymptomsNotesChange={(value) => updateFormData({ symptomsNotes: value })}
                    />

                    <VitalSignsCard
                      vitalSigns={formData.vitalSigns}
                      onVitalSignsChange={updateVitalSigns}
                      onCalculateBMI={calculateBMI}
                    />

                    {/* Clinical Diagnosis */}
                    <div className="border-main-200 dark:border-main-800 border rounded-lg p-6">
                      <h3 className="text-primary dark:text-main-400 font-semibold mb-4">Clinical Diagnosis</h3>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="diagnosis">Search Diagnosis (ICD-10)</Label>
                          <Input
                            id="diagnosis"
                            placeholder="Type to search diagnoses..."
                            className="border-main-200 dark:border-main-800"
                            value={formData.diagnosis}
                            onChange={(e) => updateFormData({ diagnosis: e.target.value })}
                          />
                        </div>
                        <div className="flex gap-2">
                          <Badge 
                            variant={formData.diagnosisStatus === "confirmed" ? "default" : "secondary"}
                            className="cursor-pointer"
                            onClick={() => updateFormData({ diagnosisStatus: "confirmed" })}
                          >
                            Confirmed
                          </Badge>
                          <Badge 
                            variant={formData.diagnosisStatus === "suspected" ? "default" : "secondary"}
                            className="cursor-pointer"
                            onClick={() => updateFormData({ diagnosisStatus: "suspected" })}
                          >
                            Suspected
                          </Badge>
                          <Badge 
                            variant={formData.diagnosisStatus === "ruled-out" ? "default" : "secondary"}
                            className="cursor-pointer"
                            onClick={() => updateFormData({ diagnosisStatus: "ruled-out" })}
                          >
                            Ruled Out
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <PrescriptionCard
                      prescriptions={formData.prescriptions}
                      onAddPrescription={addPrescription}
                      onRemovePrescription={removePrescription}
                      onUpdatePrescription={updatePrescription}
                    />

                    <MedicalOrdersCard
                      selectedTests={formData.selectedTests}
                      labNotes={formData.labNotes}
                      labPriority={formData.labPriority}
                      onTestToggle={handleTestToggle}
                      onLabNotesChange={(value) => updateFormData({ labNotes: value })}
                      onLabPriorityChange={(value) => updateFormData({ labPriority: value })}
                    />

                    <MedicalInstructionsCard
                      lifestyleRecommendations={formData.lifestyleRecommendations}
                      returnToWorkNote={formData.returnToWorkNote}
                      followUpDate={formData.followUpDate}
                      onLifestyleRecommendationsChange={(value) => updateFormData({ lifestyleRecommendations: value })}
                      onReturnToWorkNoteChange={(value) => updateFormData({ returnToWorkNote: value })}
                      onFollowUpDateChange={(value) => updateFormData({ followUpDate: value })}
                    />
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="history" className="mt-6">
                <MedicalHistoryCard patientData={patientData} />
              </TabsContent>

              <TabsContent value="documents" className="mt-6">
                <DocumentsCard patientData={patientData} />
              </TabsContent>

              <TabsContent value="notes" className="mt-6">
                <DoctorNotesCard
                  doctorNotes={formData.doctorNotes}
                  internalNote={formData.internalNote}
                  onDoctorNotesChange={(value) => updateFormData({ doctorNotes: value })}
                  onInternalNoteChange={(checked) => updateFormData({ internalNote: checked })}
                />
              </TabsContent>
            </Tabs>
          </div>

          <ActionButtons
            onGeneratePDF={generatePDFReport}
            onSendPrescription={sendPrescription}
            onSaveConsultation={handleSaveConsultation}
          />
        </div>
      </div>
    </>
  )
}
