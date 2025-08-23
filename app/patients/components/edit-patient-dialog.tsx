"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import { useState } from "react"
import type { Patient } from "../mocks/patients-data"

interface EditPatientDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  patient: Patient | null
  onSave: () => void
  onPatientChange: (patient: Patient) => void
}

export function EditPatientDialog({
  open,
  onOpenChange,
  patient,
  onSave,
  onPatientChange,
}: EditPatientDialogProps) {
  const [newAllergy, setNewAllergy] = useState("")

  if (!patient) return null

  const handleInputChange = (field: keyof Patient, value: string) => {
    onPatientChange({
      ...patient,
      [field]: value,
    })
  }

  const handleAddAllergy = () => {
    if (newAllergy.trim() && !patient.allergies.includes(newAllergy.trim())) {
      onPatientChange({
        ...patient,
        allergies: [...patient.allergies, newAllergy.trim()],
      })
      setNewAllergy("")
    }
  }

  const handleRemoveAllergy = (allergyToRemove: string) => {
    onPatientChange({
      ...patient,
      allergies: patient.allergies.filter((allergy) => allergy !== allergyToRemove),
    })
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddAllergy()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Editar Paciente</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(90vh-120px)]">
          <div className="space-y-6 p-1">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Información Básica</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Nombre *</Label>
                  <Input
                    id="firstName"
                    value={patient.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Apellido *</Label>
                  <Input
                    id="lastName"
                    value={patient.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cedula">Cédula *</Label>
                  <Input
                    id="cedula"
                    value={patient.cedula}
                    onChange={(e) => handleInputChange("cedula", e.target.value)}
                    placeholder="000-0000000-0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Fecha de Nacimiento *</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={patient.dateOfBirth}
                    onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Género *</Label>
                  <Select value={patient.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Masculino">Masculino</SelectItem>
                      <SelectItem value="Femenino">Femenino</SelectItem>
                      <SelectItem value="Otro">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bloodType">Tipo de Sangre</Label>
                  <Select value={patient.bloodType} onValueChange={(value) => handleInputChange("bloodType", value)}>
                    <SelectTrigger>
                      <SelectValue />
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
              <h3 className="text-lg font-medium">Información de Contacto</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono *</Label>
                  <Input
                    id="phone"
                    value={patient.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="809-000-0000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={patient.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="ejemplo@email.com"
                  />
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Dirección</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Dirección</Label>
                  <Textarea
                    id="address"
                    value={patient.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    placeholder="Calle, número, sector..."
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">Ciudad</Label>
                    <Input
                      id="city"
                      value={patient.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="province">Provincia</Label>
                    <Select value={patient.province} onValueChange={(value) => handleInputChange("province", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Distrito Nacional">Distrito Nacional</SelectItem>
                        <SelectItem value="Santo Domingo">Santo Domingo</SelectItem>
                        <SelectItem value="Santiago">Santiago</SelectItem>
                        <SelectItem value="La Vega">La Vega</SelectItem>
                        <SelectItem value="San Cristóbal">San Cristóbal</SelectItem>
                        <SelectItem value="San Pedro de Macorís">San Pedro de Macorís</SelectItem>
                        <SelectItem value="La Romana">La Romana</SelectItem>
                        <SelectItem value="Puerto Plata">Puerto Plata</SelectItem>
                        <SelectItem value="Azua">Azua</SelectItem>
                        <SelectItem value="Barahona">Barahona</SelectItem>
                        <SelectItem value="Dajabón">Dajabón</SelectItem>
                        <SelectItem value="Duarte">Duarte</SelectItem>
                        <SelectItem value="Elías Piña">Elías Piña</SelectItem>
                        <SelectItem value="El Seibo">El Seibo</SelectItem>
                        <SelectItem value="Espaillat">Espaillat</SelectItem>
                        <SelectItem value="Hato Mayor">Hato Mayor</SelectItem>
                        <SelectItem value="Hermanas Mirabal">Hermanas Mirabal</SelectItem>
                        <SelectItem value="Independencia">Independencia</SelectItem>
                        <SelectItem value="María Trinidad Sánchez">María Trinidad Sánchez</SelectItem>
                        <SelectItem value="Monseñor Nouel">Monseñor Nouel</SelectItem>
                        <SelectItem value="Monte Cristi">Monte Cristi</SelectItem>
                        <SelectItem value="Monte Plata">Monte Plata</SelectItem>
                        <SelectItem value="Pedernales">Pedernales</SelectItem>
                        <SelectItem value="Peravia">Peravia</SelectItem>
                        <SelectItem value="Samaná">Samaná</SelectItem>
                        <SelectItem value="San José de Ocoa">San José de Ocoa</SelectItem>
                        <SelectItem value="San Juan">San Juan</SelectItem>
                        <SelectItem value="Valverde">Valverde</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            {/* Medical Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Información Médica</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Alergias</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newAllergy}
                      onChange={(e) => setNewAllergy(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Agregar alergia..."
                    />
                    <Button type="button" onClick={handleAddAllergy} variant="outline">
                      Agregar
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {patient.allergies.map((allergy, index) => (
                      <Badge key={index} variant="destructive" className="flex items-center gap-1">
                        {allergy}
                        <button
                          type="button"
                          onClick={() => handleRemoveAllergy(allergy)}
                          className="ml-1 hover:bg-red-700 rounded-full p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="insuranceProvider">Proveedor de Seguro</Label>
                    <Select
                      value={patient.insuranceProvider}
                      onValueChange={(value) => handleInputChange("insuranceProvider", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ARS Humano">ARS Humano</SelectItem>
                        <SelectItem value="ARS Palic">ARS Palic</SelectItem>
                        <SelectItem value="ARS Universal">ARS Universal</SelectItem>
                        <SelectItem value="SeNaSa">SeNaSa</SelectItem>
                        <SelectItem value="ARS Futuro">ARS Futuro</SelectItem>
                        <SelectItem value="ARS Monumental">ARS Monumental</SelectItem>
                        <SelectItem value="ARS CMD">ARS CMD</SelectItem>
                        <SelectItem value="ARS Renacer">ARS Renacer</SelectItem>
                        <SelectItem value="ARS Simag">ARS Simag</SelectItem>
                        <SelectItem value="ARS Yuna">ARS Yuna</SelectItem>
                        <SelectItem value="Sin seguro">Sin seguro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emergencyContact">Contacto de Emergencia *</Label>
                    <Input
                      id="emergencyContact"
                      value={patient.emergencyContact}
                      onChange={(e) => handleInputChange("emergencyContact", e.target.value)}
                      placeholder="Nombre - Teléfono"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Estado</h3>
              <div className="space-y-2">
                <Label htmlFor="status">Estado del Paciente</Label>
                <Select value={patient.status} onValueChange={(value) => handleInputChange("status", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Activo">Activo</SelectItem>
                    <SelectItem value="Inactivo">Inactivo</SelectItem>
                    <SelectItem value="Suspendido">Suspendido</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={onSave}>Guardar Cambios</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
