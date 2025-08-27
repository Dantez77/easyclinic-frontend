"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { commonSymptoms } from "../mocks/consultation-data"
import { useLanguage } from "@/lib/language-context"

interface SymptomsCardProps {
  selectedSymptoms: string[]
  symptomsNotes: string
  onSymptomToggle: (symptom: string) => void
  onSymptomsNotesChange: (value: string) => void
}

export function SymptomsCard({ 
  selectedSymptoms, 
  symptomsNotes, 
  onSymptomToggle, 
  onSymptomsNotesChange 
}: SymptomsCardProps) {
  const { t } = useLanguage()
  
  return (
    <Card className="border-main-200 dark:border-main-800">
      <CardHeader>
        <CardTitle className="text-primary dark:text-main-400">{t('consultation.symptoms.title')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
          {commonSymptoms.map((symptom, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Checkbox
                id={`symptom-${index}`}
                checked={selectedSymptoms.includes(symptom)}
                onCheckedChange={() => onSymptomToggle(symptom)}
              />
              <Label htmlFor={`symptom-${index}`} className="text-sm">
                {symptom}
              </Label>
            </div>
          ))}
        </div>
        <Textarea
          placeholder={t('consultation.symptoms.placeholder')}
          className="min-h-[80px] border-main-200 dark:border-main-800"
          value={symptomsNotes}
          onChange={(e) => onSymptomsNotesChange(e.target.value)}
        />
      </CardContent>
    </Card>
  )
}
