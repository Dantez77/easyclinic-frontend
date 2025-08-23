"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

interface DoctorNotesCardProps {
  doctorNotes: string
  internalNote: boolean
  onDoctorNotesChange: (value: string) => void
  onInternalNoteChange: (checked: boolean) => void
}

export function DoctorNotesCard({ 
  doctorNotes, 
  internalNote, 
  onDoctorNotesChange, 
  onInternalNoteChange 
}: DoctorNotesCardProps) {
  return (
    <Card className="border-main-200 dark:border-main-800">
      <CardHeader>
        <CardTitle className="text-primary dark:text-main-400">Doctor's Notes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Textarea
            placeholder="Write your private notes about the patient and consultation..."
            className="min-h-[200px] border-main-200 dark:border-main-800"
            value={doctorNotes}
            onChange={(e) => onDoctorNotesChange(e.target.value)}
          />
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="internal-only" 
              checked={internalNote}
              onCheckedChange={(checked) => onInternalNoteChange(checked as boolean)}
            />
            <Label htmlFor="internal-only" className="text-sm">
              Mark as internal note (not visible to patient)
            </Label>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
