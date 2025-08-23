"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface MedicalInstructionsCardProps {
  lifestyleRecommendations: string
  returnToWorkNote: string
  followUpDate: string
  onLifestyleRecommendationsChange: (value: string) => void
  onReturnToWorkNoteChange: (value: string) => void
  onFollowUpDateChange: (value: string) => void
}

export function MedicalInstructionsCard({ 
  lifestyleRecommendations, 
  returnToWorkNote, 
  followUpDate, 
  onLifestyleRecommendationsChange, 
  onReturnToWorkNoteChange, 
  onFollowUpDateChange 
}: MedicalInstructionsCardProps) {
  return (
    <Card className="border-main-200 dark:border-main-800">
      <CardHeader>
        <CardTitle className="text-primary dark:text-main-400">
          General Medical Instructions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Lifestyle Recommendations</Label>
          <Textarea
            placeholder="Diet, physical activity, general recommendations..."
            className="border-main-200 dark:border-main-800"
            value={lifestyleRecommendations}
            onChange={(e) => onLifestyleRecommendationsChange(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <Label>Return to Work/School Note</Label>
            <Select value={returnToWorkNote} onValueChange={onReturnToWorkNoteChange}>
              <SelectTrigger className="border-main-200 dark:border-main-800">
                <SelectValue placeholder="Select option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="immediate">Immediate</SelectItem>
                <SelectItem value="3-days">3 days</SelectItem>
                <SelectItem value="1-week">1 week</SelectItem>
                <SelectItem value="2-weeks">2 weeks</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Next Follow-up Appointment</Label>
            <Input 
              type="date" 
              className="border-main-200 dark:border-main-800"
              value={followUpDate}
              onChange={(e) => onFollowUpDateChange(e.target.value)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
