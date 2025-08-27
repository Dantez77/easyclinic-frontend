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
          Antecedentes Médicos
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Personal Medical History */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Historial Médico Personal</Label>
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
                placeholder="Agregar condición médica..."
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
                Agregar
              </Button>
            </div>
          </div>
        </div>

        {/* Family History */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Historial Familiar</Label>
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
                placeholder="Agregar condición familiar..."
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
                Agregar
              </Button>
            </div>
          </div>
        </div>

        {/* Surgical History */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Historial Quirúrgico</Label>
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
                placeholder="Agregar procedimiento quirúrgico..."
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
                Agregar
              </Button>
            </div>
          </div>
        </div>

        {/* Obstetric History (for female patients) */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Historial Obstétrico</Label>
          <Textarea
            placeholder="Embarazos, partos, complicaciones..."
            className="border-main-200 dark:border-main-800"
            value={antecedents.obstetricHistory || ''}
            onChange={(e) => onAntecedentsChange({ obstetricHistory: e.target.value })}
          />
        </div>

        {/* Lifestyle Factors */}
        <div className="space-y-4">
          <Label className="text-sm font-medium">Factores de Estilo de Vida</Label>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <Label className="text-xs text-muted-foreground">Tabaquismo</Label>
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
                  <SelectItem value="none">Ninguno</SelectItem>
                  <SelectItem value="former">Ex-fumador</SelectItem>
                  <SelectItem value="current">Fumador actual</SelectItem>
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
                  <SelectItem value="none">Ninguno</SelectItem>
                  <SelectItem value="occasional">Ocasional</SelectItem>
                  <SelectItem value="moderate">Moderado</SelectItem>
                  <SelectItem value="heavy">Excesivo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-xs text-muted-foreground">Dieta</Label>
              <Input
                placeholder="Hábitos dietéticos..."
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
              <Label className="text-xs text-muted-foreground">Ejercicio</Label>
              <Input
                placeholder="Actividad física..."
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
            <Label className="text-xs text-muted-foreground">Ocupación</Label>
            <Input
              placeholder="Ocupación actual..."
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
            <Label className="text-xs text-muted-foreground">Otros Factores de Estilo de Vida</Label>
            <Textarea
              placeholder="Otra información relevante del estilo de vida..."
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
          <Label className="text-sm font-medium">Historial Social</Label>
          <Textarea
            placeholder="Situación de vivienda, sistemas de apoyo, factores sociales..."
            className="border-main-200 dark:border-main-800"
            value={antecedents.socialHistory}
            onChange={(e) => onAntecedentsChange({ socialHistory: e.target.value })}
          />
        </div>
      </CardContent>
    </Card>
  )
}
