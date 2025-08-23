"use client"

import { TestTube } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { labTests } from "../mocks/consultation-data"

interface MedicalOrdersCardProps {
  selectedTests: string[]
  labNotes: string
  labPriority: "normal" | "urgent"
  onTestToggle: (test: string) => void
  onLabNotesChange: (value: string) => void
  onLabPriorityChange: (value: "normal" | "urgent") => void
}

export function MedicalOrdersCard({ 
  selectedTests, 
  labNotes, 
  labPriority, 
  onTestToggle, 
  onLabNotesChange, 
  onLabPriorityChange 
}: MedicalOrdersCardProps) {
  return (
    <Card className="border-main-200 dark:border-main-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary dark:text-main-400">
          <TestTube className="w-5 h-5" />
          Medical Orders / Tests
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
          {labTests.map((test, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Checkbox
                id={`test-${index}`}
                checked={selectedTests.includes(test)}
                onCheckedChange={() => onTestToggle(test)}
              />
              <Label htmlFor={`test-${index}`} className="text-sm">
                {test}
              </Label>
            </div>
          ))}
        </div>
        <div>
          <Label>Lab Notes</Label>
          <Textarea
            placeholder="Special instructions for lab personnel..."
            className="border-main-200 dark:border-main-800"
            value={labNotes}
            onChange={(e) => onLabNotesChange(e.target.value)}
          />
        </div>
        <div>
          <Label>Priority</Label>
          <Select value={labPriority} onValueChange={(value: "normal" | "urgent") => onLabPriorityChange(value)}>
            <SelectTrigger className="w-48 border-main-200 dark:border-main-800">
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  )
}
