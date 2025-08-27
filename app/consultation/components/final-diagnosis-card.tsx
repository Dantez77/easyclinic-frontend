"use client"

import { Stethoscope, Plus, X, Brain, FileText, Calendar, ClipboardList } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { type FinalDiagnosis } from "../types"

interface FinalDiagnosisCardProps {
  finalDiagnosis: FinalDiagnosis
  onFinalDiagnosisChange: (updates: Partial<FinalDiagnosis>) => void
}

export function FinalDiagnosisCard({ finalDiagnosis, onFinalDiagnosisChange }: FinalDiagnosisCardProps) {
  const addSecondaryDiagnosis = (value: string) => {
    if (value.trim() && !finalDiagnosis.secondaryDiagnoses.includes(value.trim())) {
      onFinalDiagnosisChange({
        secondaryDiagnoses: [...finalDiagnosis.secondaryDiagnoses, value.trim()]
      })
    }
  }

  const removeSecondaryDiagnosis = (index: number) => {
    onFinalDiagnosisChange({
      secondaryDiagnoses: finalDiagnosis.secondaryDiagnoses.filter((_, i) => i !== index)
    })
  }

  const addDifferentialDiagnosis = (value: string) => {
    if (value.trim() && !finalDiagnosis.differentialDiagnoses.includes(value.trim())) {
      onFinalDiagnosisChange({
        differentialDiagnoses: [...finalDiagnosis.differentialDiagnoses, value.trim()]
      })
    }
  }

  const removeDifferentialDiagnosis = (index: number) => {
    onFinalDiagnosisChange({
      differentialDiagnoses: finalDiagnosis.differentialDiagnoses.filter((_, i) => i !== index)
    })
  }

  const addICD10Code = (value: string) => {
    if (value.trim() && !finalDiagnosis.icd10Codes.includes(value.trim())) {
      onFinalDiagnosisChange({
        icd10Codes: [...finalDiagnosis.icd10Codes, value.trim()]
      })
    }
  }

  const removeICD10Code = (index: number) => {
    onFinalDiagnosisChange({
      icd10Codes: finalDiagnosis.icd10Codes.filter((_, i) => i !== index)
    })
  }

  return (
    <Card className="border-main-200 dark:border-main-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary dark:text-main-400">
          <Stethoscope className="w-5 h-5" />
          Final Diagnosis & Treatment Plan
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Primary Diagnosis */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Primary Diagnosis</Label>
          <Input
            placeholder="Enter primary diagnosis..."
            className="border-main-200 dark:border-main-800"
            value={finalDiagnosis.primaryDiagnosis}
            onChange={(e) => onFinalDiagnosisChange({ primaryDiagnosis: e.target.value })}
          />
        </div>

        {/* Secondary Diagnoses */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Secondary Diagnoses</Label>
          <div className="space-y-2">
            {finalDiagnosis.secondaryDiagnoses.map((diagnosis, index) => (
              <div key={index} className="flex items-center gap-2">
                <Badge variant="outline" className="flex-1">
                  {diagnosis}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeSecondaryDiagnosis(index)}
                  className="h-6 w-6 p-0"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            ))}
            <div className="flex gap-2">
              <Input
                placeholder="Add secondary diagnosis..."
                className="flex-1 border-main-200 dark:border-main-800"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    addSecondaryDiagnosis(e.currentTarget.value)
                    e.currentTarget.value = ''
                  }
                }}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  const input = e.currentTarget.previousElementSibling as HTMLInputElement
                  addSecondaryDiagnosis(input.value)
                  input.value = ''
                }}
              >
                Add
              </Button>
            </div>
          </div>
        </div>

        {/* Differential Diagnoses */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Differential Diagnoses</Label>
          <div className="space-y-2">
            {finalDiagnosis.differentialDiagnoses.map((diagnosis, index) => (
              <div key={index} className="flex items-center gap-2">
                <Badge variant="secondary" className="flex-1">
                  {diagnosis}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeDifferentialDiagnosis(index)}
                  className="h-6 w-6 p-0"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            ))}
            <div className="flex gap-2">
              <Input
                placeholder="Add differential diagnosis..."
                className="flex-1 border-main-200 dark:border-main-800"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    addDifferentialDiagnosis(e.currentTarget.value)
                    e.currentTarget.value = ''
                  }
                }}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  const input = e.currentTarget.previousElementSibling as HTMLInputElement
                  addDifferentialDiagnosis(input.value)
                  input.value = ''
                }}
              >
                Add
              </Button>
            </div>
          </div>
        </div>

        {/* ICD-10 Codes */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">ICD-10 Codes</Label>
          <div className="space-y-2">
            {finalDiagnosis.icd10Codes.map((code, index) => (
              <div key={index} className="flex items-center gap-2">
                <Badge variant="outline" className="flex-1 font-mono">
                  {code}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeICD10Code(index)}
                  className="h-6 w-6 p-0"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            ))}
            <div className="flex gap-2">
              <Input
                placeholder="Add ICD-10 code..."
                className="flex-1 border-main-200 dark:border-main-800 font-mono"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    addICD10Code(e.currentTarget.value)
                    e.currentTarget.value = ''
                  }
                }}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  const input = e.currentTarget.previousElementSibling as HTMLInputElement
                  addICD10Code(input.value)
                  input.value = ''
                }}
              >
                Add
              </Button>
            </div>
          </div>
        </div>

        {/* Clinical Impression */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Clinical Impression</Label>
          <Textarea
            placeholder="Detailed clinical impression and reasoning..."
            className="min-h-[100px] border-main-200 dark:border-main-800"
            value={finalDiagnosis.clinicalImpression}
            onChange={(e) => onFinalDiagnosisChange({ clinicalImpression: e.target.value })}
          />
        </div>

        {/* Treatment Plan */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Treatment Plan</Label>
          <Textarea
            placeholder="Detailed treatment plan including medications, procedures, and recommendations..."
            className="min-h-[100px] border-main-200 dark:border-main-800"
            value={finalDiagnosis.treatmentPlan}
            onChange={(e) => onFinalDiagnosisChange({ treatmentPlan: e.target.value })}
          />
        </div>

        {/* Follow-up Plan */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Follow-up Plan</Label>
          <Textarea
            placeholder="Follow-up schedule, monitoring requirements, and next steps..."
            className="min-h-[80px] border-main-200 dark:border-main-800"
            value={finalDiagnosis.followUpPlan}
            onChange={(e) => onFinalDiagnosisChange({ followUpPlan: e.target.value })}
          />
        </div>

        {/* Additional Notes */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Additional Notes</Label>
          <Textarea
            placeholder="Any additional clinical notes or observations..."
            className="min-h-[80px] border-main-200 dark:border-main-800"
            value={finalDiagnosis.notes}
            onChange={(e) => onFinalDiagnosisChange({ notes: e.target.value })}
          />
        </div>
      </CardContent>
    </Card>
  )
}
