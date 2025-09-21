"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Save } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { cn } from "@/lib/utils"
import type { Patient } from "@/lib/patients-api"

interface EditPatientDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  patient: Patient | null
  onSave: (patient: Partial<Patient>) => void
  onPatientChange: (patient: Patient) => void
}

export function EditPatientDialog({ 
  open, 
  onOpenChange, 
  patient, 
  onSave, 
  onPatientChange 
}: EditPatientDialogProps) {
  const [editedPatient, setEditedPatient] = useState<Patient | null>(patient)
  const [dateOfBirth, setDateOfBirth] = useState<Date>()

  if (!patient || !editedPatient) return null

  const handleInputChange = (field: keyof Patient, value: string) => {
    const updated = { ...editedPatient, [field]: value }
    setEditedPatient(updated)
    onPatientChange(updated)
  }

  const handleSave = () => {
    if (editedPatient) {
      const saveData = {
        ...editedPatient,
        dateOfBirth: dateOfBirth ? format(dateOfBirth, 'yyyy-MM-dd') : editedPatient.dateOfBirth
      }
      onSave(saveData)
    }
  }

  // Initialize date when patient changes
  if (patient.dateOfBirth && !dateOfBirth) {
    setDateOfBirth(new Date(patient.dateOfBirth))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Paciente</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Información Básica</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nombre *</Label>
                <Input
                  id="name"
                  value={editedPatient.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="lastName">Apellido *</Label>
                <Input
                  id="lastName"
                  value={editedPatient.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="dui">DUI</Label>
                <Input
                  id="dui"
                  value={editedPatient.dui || ''}
                  onChange={(e) => handleInputChange("dui", e.target.value)}
                  placeholder="12345678-9"
                />
              </div>

              <div>
                <Label>Fecha de Nacimiento</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !dateOfBirth && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateOfBirth ? format(dateOfBirth, "PPP", { locale: es }) : "Seleccionar fecha"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateOfBirth}
                      onSelect={setDateOfBirth}
                      disabled={(date) => date > new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label htmlFor="gender">Género</Label>
                <Select 
                  value={editedPatient.gender} 
                  onValueChange={(value: any) => handleInputChange("gender", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="M">Masculino</SelectItem>
                    <SelectItem value="F">Femenino</SelectItem>
                    <SelectItem value="Other">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="bloodType">Tipo de Sangre</Label>
                <Select 
                  value={editedPatient.bloodType || ''} 
                  onValueChange={(value: any) => handleInputChange("bloodType", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A+">A+</SelectItem>
                    <SelectItem value="A-">A-</SelectItem>
                    <SelectItem value="B+">B+</SelectItem>
                    <SelectItem value="B-">B-</SelectItem>
                    <SelectItem value="AB+">AB+</SelectItem>
                    <SelectItem value="AB-">AB-</SelectItem>
                    <SelectItem value="O+">O+</SelectItem>
                    <SelectItem value="O-">O-</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Información de Contacto</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Teléfono *</Label>
                <Input
                  id="phone"
                  value={editedPatient.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="7123-4567"
                />
              </div>

              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={editedPatient.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="ejemplo@email.com"
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="address">Dirección</Label>
                <Input
                  id="address"
                  value={editedPatient.address || ''}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="Calle Principal #123, Colonia..."
                />
              </div>

              <div>
                <Label htmlFor="municipality">Municipio</Label>
                <Input
                  id="municipality"
                  value={editedPatient.municipality || ''}
                  onChange={(e) => handleInputChange("municipality", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="province">Provincia</Label>
                <Select 
                  value={editedPatient.province || ''} 
                  onValueChange={(value: any) => handleInputChange("province", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar provincia" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="San Salvador">San Salvador</SelectItem>
                    <SelectItem value="La Libertad">La Libertad</SelectItem>
                    <SelectItem value="Santa Ana">Santa Ana</SelectItem>
                    <SelectItem value="Sonsonate">Sonsonate</SelectItem>
                    <SelectItem value="Usulután">Usulután</SelectItem>
                    <SelectItem value="San Miguel">San Miguel</SelectItem>
                    <SelectItem value="La Unión">La Unión</SelectItem>
                    <SelectItem value="Morazán">Morazán</SelectItem>
                    <SelectItem value="La Paz">La Paz</SelectItem>
                    <SelectItem value="Cabañas">Cabañas</SelectItem>
                    <SelectItem value="Cuscatlán">Cuscatlán</SelectItem>
                    <SelectItem value="San Vicente">San Vicente</SelectItem>
                    <SelectItem value="Chalatenango">Chalatenango</SelectItem>
                    <SelectItem value="Ahuachapán">Ahuachapán</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Información Adicional</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="civilStatus">Estado Civil</Label>
                <Select 
                  value={editedPatient.civilStatus || ''} 
                  onValueChange={(value: any) => handleInputChange("civilStatus", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Single">Soltero/a</SelectItem>
                    <SelectItem value="Married">Casado/a</SelectItem>
                    <SelectItem value="Divorced">Divorciado/a</SelectItem>
                    <SelectItem value="Widowed">Viudo/a</SelectItem>
                    <SelectItem value="Other">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="profession">Profesión</Label>
                <Input
                  id="profession"
                  value={editedPatient.profession || ''}
                  onChange={(e) => handleInputChange("profession", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="nationality">Nacionalidad</Label>
                <Input
                  id="nationality"
                  value={editedPatient.nationality || ''}
                  onChange={(e) => handleInputChange("nationality", e.target.value)}
                  placeholder="Salvadoreña"
                />
              </div>

              <div>
                <Label htmlFor="status">Estado</Label>
                <Select 
                  value={editedPatient.status} 
                  onValueChange={(value: any) => handleInputChange("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Activo</SelectItem>
                    <SelectItem value="inactive">Inactivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Note about Medical Records */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Nota:</strong> Para gestionar alergias, medicamentos y otros datos médicos, 
              utiliza el módulo de <strong>Expedientes Médicos</strong> o haz clic en "Ver EHR Completo" 
              desde la vista del paciente.
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Guardar Cambios
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
