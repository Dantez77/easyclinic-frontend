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
          Instrucciones Médicas Generales
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Recomendaciones de Estilo de Vida</Label>
          <Textarea
            placeholder="Dieta, actividad física, recomendaciones generales..."
            className="border-main-200 dark:border-main-800"
            value={lifestyleRecommendations}
            onChange={(e) => onLifestyleRecommendationsChange(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <Label>Nota de Retorno al Trabajo/Escuela</Label>
            <Select value={returnToWorkNote} onValueChange={onReturnToWorkNoteChange}>
              <SelectTrigger className="border-main-200 dark:border-main-800">
                <SelectValue placeholder="Seleccionar opción" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="immediate">Inmediato</SelectItem>
                <SelectItem value="3-days">3 días</SelectItem>
                <SelectItem value="1-week">1 semana</SelectItem>
                <SelectItem value="2-weeks">2 semanas</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Próxima Cita de Seguimiento</Label>
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
