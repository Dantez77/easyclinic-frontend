"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// Import custom hook
import { useConsultation } from "./hooks/use-consultation"
import { useLanguage } from "@/lib/language-context"

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
import { MedicalAntecedentsCard } from "./components/medical-antecedents-card"
import { FinalDiagnosisCard } from "./components/final-diagnosis-card"
import { AIDiagnosisCard } from "./components/ai-diagnosis-card"

export default function PatientConsultationPage() {
  const { t } = useLanguage()
  const {
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
          <p className="text-lg text-muted-foreground">{t('consultation.loading')}</p>
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
              <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
                <TabsTrigger value="consultation" className="text-xs lg:text-sm">
                  {t('consultation.tabs.consultation')}
                </TabsTrigger>
                <TabsTrigger value="antecedents" className="text-xs lg:text-sm">
                  {t('consultation.tabs.antecedents')}
                </TabsTrigger>
                <TabsTrigger value="diagnosis" className="text-xs lg:text-sm">
                  {t('consultation.tabs.diagnosis')}
                </TabsTrigger>
                <TabsTrigger value="history" className="text-xs lg:text-sm">
                  {t('consultation.tabs.history')}
                </TabsTrigger>
                <TabsTrigger value="documents" className="text-xs lg:text-sm">
                  {t('consultation.tabs.documents')}
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
                      <h3 className="text-primary dark:text-main-400 font-semibold mb-4">{t('consultation.clinicalDiagnosis.title')}</h3>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="diagnosis">{t('consultation.clinicalDiagnosis.search')}</Label>
                          <Input
                            id="diagnosis"
                            placeholder={t('consultation.clinicalDiagnosis.searchPlaceholder')}
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
                            {t('consultation.clinicalDiagnosis.confirmed')}
                          </Badge>
                          <Badge 
                            variant={formData.diagnosisStatus === "suspected" ? "default" : "secondary"}
                            className="cursor-pointer"
                            onClick={() => updateFormData({ diagnosisStatus: "suspected" })}
                          >
                            {t('consultation.clinicalDiagnosis.suspected')}
                          </Badge>
                          <Badge 
                            variant={formData.diagnosisStatus === "ruled-out" ? "default" : "secondary"}
                            className="cursor-pointer"
                            onClick={() => updateFormData({ diagnosisStatus: "ruled-out" })}
                          >
                            {t('consultation.clinicalDiagnosis.ruledOut')}
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

                    {/* AI Diagnosis Card */}
                    <AIDiagnosisCard
                      aiDiagnosis={formData.aiDiagnosis}
                      isLoading={isGeneratingAI}
                      onGenerateAIDiagnosis={generateAIDiagnosis}
                    />
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="antecedents" className="mt-6">
                <ScrollArea className="h-full">
                  <div className="space-y-8 pb-8">
                    <MedicalAntecedentsCard
                      antecedents={formData.medicalAntecedents}
                      onAntecedentsChange={updateMedicalAntecedents}
                    />
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="diagnosis" className="mt-6">
                <ScrollArea className="h-full">
                  <div className="space-y-8 pb-8">
                    <FinalDiagnosisCard
                      finalDiagnosis={formData.finalDiagnosis}
                      onFinalDiagnosisChange={updateFinalDiagnosis}
                    />
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="history" className="mt-6">
                <MedicalHistoryCard patientData={patientData} />
              </TabsContent>

              <TabsContent value="documents" className="mt-6">
                <ScrollArea className="h-full">
                  <div className="space-y-8 pb-8">
                    <DocumentsCard patientData={patientData} />
                    
                    <DoctorNotesCard
                      doctorNotes={formData.doctorNotes}
                      internalNote={formData.internalNote}
                      onDoctorNotesChange={(value) => updateFormData({ doctorNotes: value })}
                      onInternalNoteChange={(checked) => updateFormData({ internalNote: checked })}
                    />
                  </div>
                </ScrollArea>
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