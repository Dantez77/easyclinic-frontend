"use client"

import { History, Users, Scissors, Heart, Smoking, Wine, Utensils, Dumbbell, Briefcase } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import { type MedicalAntecedents } from "../types"

interface MedicalAntecedentsCardProps {
  antecedents: MedicalAntecedents
  onAntecedentsChange: (updates: Partial<MedicalAntecedents>) => void
}

export function MedicalAntecedentsCard({ antecedents, onAntecedentsChange }: MedicalAntecedentsCardProps) {
  const addPersonalHistory = (value: string) => {
    if (value.trim() && !antecedents.personalHistory.includes(value.trim())) {
      onAntecedentsChange({
        personalHistory: [...antecedents.personalHistory, value.trim()]
      })
    }
  }

  const removePersonalHistory = (index: number) => {
    onAntecedentsChange({
      personalHistory: antecedents.personalHistory.filter((_, i) => i !== index)
    })
  }

  const addFamilyHistory = (value: string) => {
    if (value.trim() && !antecedents.familyHistory.includes(value.trim())) {
      onAntecedentsChange({
        familyHistory: [...antecedents.familyHistory, value.trim()]
      })
    }
  }

  const removeFamilyHistory = (index: number) => {
    onAntecedentsChange({
      familyHistory: antecedents.familyHistory.filter((_, i) => i !== index)
    })
  }

  const addSurgicalHistory = (value: string) => {
    if (value.trim() && !antecedents.surgicalHistory.includes(value.trim())) {
      onAntecedentsChange({
        surgicalHistory: [...antecedents.surgicalHistory, value.trim()]
      })
    }
  }

  const removeSurgicalHistory = (index: number) => {
    onAntecedentsChange({
      surgicalHistory: antecedents.surgicalHistory.filter((_, i) => i !== index)
    })
  }

  return (
    <Card className="border-main-200 dark:border-main-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary dark:text-main-400">
          <History className="w-5 h-5" />
          Medical Antecedents
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Personal Medical History */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Personal Medical History</Label>
          <div className="space-y-2">
            {antecedents.personalHistory.map((history, index) => (
              <div key={index} className="flex items-center gap-2">
                <Badge variant="outline" className="flex-1">
                  {history}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removePersonalHistory(index)}
                  className="h-6 w-6 p-0"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            ))}
            <div className="flex gap-2">
              <Input
                placeholder="Add medical condition..."
                className="flex-1 border-main-200 dark:border-main-800"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    addPersonalHistory(e.currentTarget.value)
                    e.currentTarget.value = ''
                  }
                }}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  const input = e.currentTarget.previousElementSibling as HTMLInputElement
                  addPersonalHistory(input.value)
                  input.value = ''
                }}
              >
                Add
              </Button>
            </div>
          </div>
        </div>

        {/* Family History */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Family History</Label>
          <div className="space-y-2">
            {antecedents.familyHistory.map((history, index) => (
              <div key={index} className="flex items-center gap-2">
                <Badge variant="outline" className="flex-1">
                  {history}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFamilyHistory(index)}
                  className="h-6 w-6 p-0"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            ))}
            <div className="flex gap-2">
              <Input
                placeholder="Add family condition..."
                className="flex-1 border-main-200 dark:border-main-800"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    addFamilyHistory(e.currentTarget.value)
                    e.currentTarget.value = ''
                  }
                }}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  const input = e.currentTarget.previousElementSibling as HTMLInputElement
                  addFamilyHistory(input.value)
                  input.value = ''
                }}
              >
                Add
              </Button>
            </div>
          </div>
        </div>

        {/* Surgical History */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Surgical History</Label>
          <div className="space-y-2">
            {antecedents.surgicalHistory.map((surgery, index) => (
              <div key={index} className="flex items-center gap-2">
                <Badge variant="outline" className="flex-1">
                  {surgery}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeSurgicalHistory(index)}
                  className="h-6 w-6 p-0"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            ))}
            <div className="flex gap-2">
              <Input
                placeholder="Add surgical procedure..."
                className="flex-1 border-main-200 dark:border-main-800"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    addSurgicalHistory(e.currentTarget.value)
                    e.currentTarget.value = ''
                  }
                }}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  const input = e.currentTarget.previousElementSibling as HTMLInputElement
                  addSurgicalHistory(input.value)
                  input.value = ''
                }}
              >
                Add
              </Button>
            </div>
          </div>
        </div>

        {/* Obstetric History (for female patients) */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Obstetric History</Label>
          <Textarea
            placeholder="Pregnancies, deliveries, complications..."
            className="border-main-200 dark:border-main-800"
            value={antecedents.obstetricHistory || ''}
            onChange={(e) => onAntecedentsChange({ obstetricHistory: e.target.value })}
          />
        </div>

        {/* Lifestyle Factors */}
        <div className="space-y-4">
          <Label className="text-sm font-medium">Lifestyle Factors</Label>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <Label className="text-xs text-muted-foreground">Smoking</Label>
              <Select
                value={antecedents.lifestyleFactors.smoking}
                onValueChange={(value: "none" | "former" | "current") =>
                  onAntecedentsChange({
                    lifestyleFactors: { ...antecedents.lifestyleFactors, smoking: value }
                  })
                }
              >
                <SelectTrigger className="border-main-200 dark:border-main-800">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="former">Former</SelectItem>
                  <SelectItem value="current">Current</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-xs text-muted-foreground">Alcohol</Label>
              <Select
                value={antecedents.lifestyleFactors.alcohol}
                onValueChange={(value: "none" | "occasional" | "moderate" | "heavy") =>
                  onAntecedentsChange({
                    lifestyleFactors: { ...antecedents.lifestyleFactors, alcohol: value }
                  })
                }
              >
                <SelectTrigger className="border-main-200 dark:border-main-800">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="occasional">Occasional</SelectItem>
                  <SelectItem value="moderate">Moderate</SelectItem>
                  <SelectItem value="heavy">Heavy</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-xs text-muted-foreground">Diet</Label>
              <Input
                placeholder="Dietary habits..."
                className="border-main-200 dark:border-main-800"
                value={antecedents.lifestyleFactors.diet}
                onChange={(e) =>
                  onAntecedentsChange({
                    lifestyleFactors: { ...antecedents.lifestyleFactors, diet: e.target.value }
                  })
                }
              />
            </div>

            <div>
              <Label className="text-xs text-muted-foreground">Exercise</Label>
              <Input
                placeholder="Physical activity..."
                className="border-main-200 dark:border-main-800"
                value={antecedents.lifestyleFactors.exercise}
                onChange={(e) =>
                  onAntecedentsChange({
                    lifestyleFactors: { ...antecedents.lifestyleFactors, exercise: e.target.value }
                  })
                }
              />
            </div>
          </div>

          <div>
            <Label className="text-xs text-muted-foreground">Occupation</Label>
            <Input
              placeholder="Current occupation..."
              className="border-main-200 dark:border-main-800"
              value={antecedents.lifestyleFactors.occupation}
              onChange={(e) =>
                onAntecedentsChange({
                  lifestyleFactors: { ...antecedents.lifestyleFactors, occupation: e.target.value }
                })
              }
            />
          </div>

          <div>
            <Label className="text-xs text-muted-foreground">Other Lifestyle Factors</Label>
            <Textarea
              placeholder="Other relevant lifestyle information..."
              className="border-main-200 dark:border-main-800"
              value={antecedents.lifestyleFactors.other}
              onChange={(e) =>
                onAntecedentsChange({
                  lifestyleFactors: { ...antecedents.lifestyleFactors, other: e.target.value }
                })
              }
            />
          </div>
        </div>

        {/* Social History */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Social History</Label>
          <Textarea
            placeholder="Living situation, support systems, social factors..."
            className="border-main-200 dark:border-main-800"
            value={antecedents.socialHistory}
            onChange={(e) => onAntecedentsChange({ socialHistory: e.target.value })}
          />
        </div>
      </CardContent>
    </Card>
  )
}
