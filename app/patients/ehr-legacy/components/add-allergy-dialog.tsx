"use client"

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CalendarIcon, Save } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import { useMedicalRecordsStore } from '@/lib/medical-records-store'
import { AddAllergyRequest } from '@/lib/medical-records-api'

interface AddAllergyDialogProps {
  patientId: string
  onSuccess?: () => void
}

export function AddAllergyDialog({ patientId, onSuccess }: AddAllergyDialogProps) {
  const { modals, closeModal, addAllergy, loading, error } = useMedicalRecordsStore()
  
  const [allergyData, setAllergyData] = useState<AddAllergyRequest>({
    allergen: '',
    allergenType: 'medication',
    severity: 'mild',
    reaction: '',
    onsetDate: '',
    lastReactionDate: '',
    status: 'active',
    notes: '',
    reportedBy: ''
  })

  const [onsetDate, setOnsetDate] = useState<Date>()
  const [lastReactionDate, setLastReactionDate] = useState<Date>()
  const [localError, setLocalError] = useState<string | null>(null)
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false)

  const handleSubmit = async () => {
    setHasAttemptedSubmit(true)
    setLocalError(null)

    // Validation
    const missingFields = []
    if (!allergyData.allergen.trim()) missingFields.push('Alérgeno')
    if (!allergyData.reaction.trim()) missingFields.push('Reacción')

    if (missingFields.length > 0) {
      setLocalError(`Campos requeridos faltantes: ${missingFields.join(', ')}`)
      return
    }

    try {
      const cleanedData: AddAllergyRequest = {
        allergen: allergyData.allergen.trim(),
        allergenType: allergyData.allergenType,
        severity: allergyData.severity,
        reaction: allergyData.reaction.trim(),
        onsetDate: onsetDate ? format(onsetDate, 'yyyy-MM-dd') : undefined,
        lastReactionDate: lastReactionDate ? format(lastReactionDate, 'yyyy-MM-dd') : undefined,
        status: allergyData.status,
        ...(allergyData.notes?.trim() && { notes: allergyData.notes.trim() }),
        ...(allergyData.reportedBy?.trim() && { reportedBy: allergyData.reportedBy.trim() })
      }

      await addAllergy(patientId, cleanedData)
      
      // Reset form
      setAllergyData({
        allergen: '',
        allergenType: 'medication',
        severity: 'mild',
        reaction: '',
        onsetDate: '',
        lastReactionDate: '',
        status: 'active',
        notes: '',
        reportedBy: ''
      })
      setOnsetDate(undefined)
      setLastReactionDate(undefined)
      setLocalError(null)
      setHasAttemptedSubmit(false)
      
      // Call success callback to refresh EHR data
      if (onSuccess) onSuccess()
    } catch (error) {
      setLocalError(error instanceof Error ? error.message : 'Error al agregar la alergia')
    }
  }

  const handleDialogChange = (open: boolean) => {
    if (!open) {
      setLocalError(null)
      setHasAttemptedSubmit(false)
    }
    closeModal('addAllergy')
  }

  const displayError = localError || error
  const showFieldError = (fieldValue: string) => hasAttemptedSubmit && !fieldValue.trim()

  return (
    <Dialog open={modals.addAllergy} onOpenChange={handleDialogChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Agregar Nueva Alergia</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Error Display */}
          {displayError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {displayError}
            </div>
          )}

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="allergen">
                Alérgeno <span className="text-red-500">*</span>
              </Label>
              <Input
                id="allergen"
                value={allergyData.allergen}
                onChange={(e) => setAllergyData({ ...allergyData, allergen: e.target.value })}
                placeholder="Ej: Penicilina, Maní, Polen..."
                className={showFieldError(allergyData.allergen) ? 'border-red-500' : ''}
              />
              {showFieldError(allergyData.allergen) && (
                <p className="text-red-500 text-xs mt-1">Este campo es requerido</p>
              )}
            </div>

            <div>
              <Label htmlFor="allergenType">Tipo de Alérgeno</Label>
              <Select 
                value={allergyData.allergenType} 
                onValueChange={(value: any) => setAllergyData({ ...allergyData, allergenType: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="medication">Medicamento</SelectItem>
                  <SelectItem value="food">Alimento</SelectItem>
                  <SelectItem value="environmental">Ambiental</SelectItem>
                  <SelectItem value="contact">Contacto</SelectItem>
                  <SelectItem value="other">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="severity">Severidad</Label>
              <Select 
                value={allergyData.severity} 
                onValueChange={(value: any) => setAllergyData({ ...allergyData, severity: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mild">Leve</SelectItem>
                  <SelectItem value="moderate">Moderada</SelectItem>
                  <SelectItem value="severe">Severa</SelectItem>
                  <SelectItem value="life-threatening">Mortal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="status">Estado</Label>
              <Select 
                value={allergyData.status} 
                onValueChange={(value: any) => setAllergyData({ ...allergyData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Activa</SelectItem>
                  <SelectItem value="inactive">Inactiva</SelectItem>
                  <SelectItem value="resolved">Resuelta</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Reaction Description */}
          <div>
            <Label htmlFor="reaction">
              Descripción de la Reacción <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="reaction"
              value={allergyData.reaction}
              onChange={(e) => setAllergyData({ ...allergyData, reaction: e.target.value })}
              placeholder="Describe los síntomas y reacciones observadas..."
              rows={3}
              className={showFieldError(allergyData.reaction) ? 'border-red-500' : ''}
            />
            {showFieldError(allergyData.reaction) && (
              <p className="text-red-500 text-xs mt-1">Este campo es requerido</p>
            )}
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Fecha de Primera Manifestación</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !onsetDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {onsetDate ? format(onsetDate, "PPP", { locale: es }) : "Seleccionar fecha"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={onsetDate}
                    onSelect={setOnsetDate}
                    disabled={(date) => date > new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label>Fecha de Última Reacción</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !lastReactionDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {lastReactionDate ? format(lastReactionDate, "PPP", { locale: es }) : "Seleccionar fecha"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={lastReactionDate}
                    onSelect={setLastReactionDate}
                    disabled={(date) => date > new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Additional Information */}
          <div>
            <Label htmlFor="reportedBy">Reportado Por</Label>
            <Input
              id="reportedBy"
              value={allergyData.reportedBy}
              onChange={(e) => setAllergyData({ ...allergyData, reportedBy: e.target.value })}
              placeholder="Paciente, familiar, médico..."
            />
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes">Notas Adicionales</Label>
            <Textarea
              id="notes"
              value={allergyData.notes}
              onChange={(e) => setAllergyData({ ...allergyData, notes: e.target.value })}
              placeholder="Información adicional sobre la alergia..."
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => handleDialogChange(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit} disabled={loading}>
              <Save className="w-4 h-4 mr-2" />
              {loading ? "Guardando..." : "Guardar Alergia"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
