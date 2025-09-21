"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { X, User, Phone, MapPin, Heart, Shield } from "lucide-react"
import { useState } from "react"
import type { Patient, Allergy } from "../types"

interface EditPatientDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  patient: Patient | null
  onSave: () => void
  onPatientChange: (patient: Patient) => void
}

export function EditPatientDialog({ open, onOpenChange, patient, onSave, onPatientChange }: EditPatientDialogProps) {
  const [newAllergySubstance, setNewAllergySubstance] = useState("")
  const [newAllergySeverity, setNewAllergySeverity] = useState<"Leve" | "Moderada" | "Severa">("Leve")
  const [newAllergyReaction, setNewAllergyReaction] = useState("")

  if (!patient) return null

  const handleInputChange = (field: keyof Patient, value: string) => {
    onPatientChange({
      ...patient,
      [field]: value,
    })
  }

  const handleAddAllergy = () => {
    if (newAllergySubstance.trim() && newAllergyReaction.trim()) {
      const newAllergy: Allergy = {
        substance: newAllergySubstance.trim(),
        severity: newAllergySeverity,
        reaction: newAllergyReaction.trim(),
        dateIdentified: new Date().toISOString().split("T")[0],
      }

      // Check if allergy already exists
      const allergyExists = patient.allergies.some(
        (allergy) => allergy.substance.toLowerCase() === newAllergySubstance.trim().toLowerCase(),
      )

      if (!allergyExists) {
        onPatientChange({
          ...patient,
          allergies: [...patient.allergies, newAllergy],
        })
        setNewAllergySubstance("")
        setNewAllergyReaction("")
        setNewAllergySeverity("Leve")
      }
    }
  }

  const handleRemoveAllergy = (allergyToRemove: Allergy) => {
    onPatientChange({
      ...patient,
      allergies: patient.allergies.filter((allergy) => allergy.substance !== allergyToRemove.substance),
    })
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddAllergy()
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Leve":
        return "bg-yellow-50 dark:bg-yellow-950/30 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800 hover:bg-yellow-100 dark:hover:bg-yellow-950/50"
      case "Moderada":
        return "bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800 hover:bg-orange-100 dark:hover:bg-orange-950/50"
      case "Severa":
        return "bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-950/50"
      default:
        return "bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
    }
  }

  const departamentosES = [
    "Ahuachapán",
    "Santa Ana",
    "Sonsonate",
    "Chalatenango",
    "La Libertad",
    "San Salvador",
    "Cuscatlán",
    "La Paz",
    "Cabañas",
    "San Vicente",
    "Usulután",
    "Morazán",
    "San Miguel",
    "La Unión",
  ]

  const aseguradorasES = [
    "ISSS",
    "MAPFRE",
    "SISA",
    "ASESUISA",
    "Seguros del Pacífico",
    "BMI",
    "Atlántida Seguros",
    "Seguro privado",
    "Sin seguro",
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* Make the dialog a flex column so header/footer are sticky and the middle scrolls */}
      <DialogContent className="max-w-4xl h-[95vh] p-0 flex flex-col overflow-hidden">
        <DialogHeader className="px-6 py-4 border-b border-border bg-card flex-shrink-0">
          <DialogTitle className="text-xl font-semibold text-foreground flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            Editar Paciente
          </DialogTitle>
        </DialogHeader>

        {/* Scrollable middle */}
        <ScrollArea className="flex-1">
          <div className="p-6 space-y-6">
            <Card className="border border-border shadow-sm hover:shadow-md transition-shadow duration-200 rounded-xl overflow-hidden">
              <CardHeader className="pb-4 bg-card border-b border-border">
                <CardTitle className="text-lg font-medium flex items-center gap-2 text-foreground">
                  <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  Información Básica
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-sm font-medium text-foreground">
                      Nombre *
                    </Label>
                    <Input
                      id="firstName"
                      value={patient.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      className="focus:ring-2 focus:ring-ring focus:border-ring border-input rounded-lg transition-all duration-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-sm font-medium text-foreground">
                      Apellido *
                    </Label>
                    <Input
                      id="lastName"
                      value={patient.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      className="focus:ring-2 focus:ring-ring focus:border-ring border-input rounded-lg transition-all duration-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dui" className="text-sm font-medium text-foreground">
                      DUI *
                    </Label>
                    <Input
                      id="dui"
                      value={patient.dui}
                      onChange={(e) => handleInputChange("dui", e.target.value)}
                      placeholder="00000000-0"
                      className="focus:ring-2 focus:ring-ring focus:border-ring border-input rounded-lg transition-all duration-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth" className="text-sm font-medium text-foreground">
                      Fecha de Nacimiento *
                    </Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={patient.dateOfBirth}
                      onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                      className="focus:ring-2 focus:ring-ring focus:border-ring border-input rounded-lg transition-all duration-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender" className="text-sm font-medium text-foreground">
                      Género *
                    </Label>
                    <Select value={patient.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                      <SelectTrigger className="focus:ring-2 focus:ring-ring focus:border-ring border-input rounded-lg transition-all duration-200">
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
                    <Label htmlFor="bloodType" className="text-sm font-medium text-foreground">
                      Tipo de Sangre
                    </Label>
                    <Select value={patient.bloodType} onValueChange={(value) => handleInputChange("bloodType", value)}>
                      <SelectTrigger className="focus:ring-2 focus:ring-ring focus:border-ring border-input rounded-lg transition-all duration-200">
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
              </CardContent>
            </Card>

            <Card className="border border-border shadow-sm hover:shadow-md transition-shadow duration-200 rounded-xl overflow-hidden">
              <CardHeader className="pb-4 bg-card border-b border-border">
                <CardTitle className="text-lg font-medium flex items-center gap-2 text-foreground">
                  <Phone className="w-5 h-5 text-green-600 dark:text-green-400" />
                  Información de Contacto
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium text-foreground">
                      Teléfono *
                    </Label>
                    <Input
                      id="phone"
                      value={patient.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="0000-0000"
                      className="focus:ring-2 focus:ring-ring focus:border-ring border-input rounded-lg transition-all duration-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-foreground">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={patient.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="ejemplo@email.com"
                      className="focus:ring-2 focus:ring-ring focus:border-ring border-input rounded-lg transition-all duration-200"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border shadow-sm hover:shadow-md transition-shadow duration-200 rounded-xl overflow-hidden">
              <CardHeader className="pb-4 bg-card border-b border-border">
                <CardTitle className="text-lg font-medium flex items-center gap-2 text-foreground">
                  <MapPin className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  Dirección
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address" className="text-sm font-medium text-foreground">
                    Dirección
                  </Label>
                  <Textarea
                    id="address"
                    value={patient.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    placeholder="Calle, número, colonia, referencias..."
                    className="focus:ring-2 focus:ring-ring focus:border-ring border-input rounded-lg transition-all duration-200 min-h-[80px] resize-none"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city" className="text-sm font-medium text-foreground">
                      Municipio
                    </Label>
                    <Input
                      id="city"
                      value={patient.municipality || ''}
                      onChange={(e) => handleInputChange("municipality", e.target.value)}
                      className="focus:ring-2 focus:ring-ring focus:border-ring border-input rounded-lg transition-all duration-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="province" className="text-sm font-medium text-foreground">
                      Departamento
                    </Label>
                    <Select value={patient.province} onValueChange={(value) => handleInputChange("province", value)}>
                      <SelectTrigger className="focus:ring-2 focus:ring-ring focus:border-ring border-input rounded-lg transition-all duration-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {departamentosES.map((d) => (
                          <SelectItem key={d} value={d}>
                            {d}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border shadow-sm hover:shadow-md transition-shadow duration-200 rounded-xl overflow-hidden">
              <CardHeader className="pb-4 bg-card border-b border-border">
                <CardTitle className="text-lg font-medium flex items-center gap-2 text-foreground">
                  <Heart className="w-5 h-5 text-red-600 dark:text-red-400" />
                  Información Médica
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium text-foreground">Alergias</Label>
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                      {patient.allergies.length} alergia{patient.allergies.length !== 1 ? "s" : ""} registrada
                      {patient.allergies.length !== 1 ? "s" : ""}
                    </span>
                  </div>

                  <div className="bg-muted p-4 rounded-xl border border-border shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
                      <Input
                        value={newAllergySubstance}
                        onChange={(e) => setNewAllergySubstance(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Sustancia..."
                        className="focus:ring-2 focus:ring-ring focus:border-ring border-input rounded-lg transition-all duration-200"
                      />
                      <Input
                        value={newAllergyReaction}
                        onChange={(e) => setNewAllergyReaction(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Reacción..."
                        className="focus:ring-2 focus:ring-ring focus:border-ring border-input rounded-lg transition-all duration-200"
                      />
                      <Select
                        value={newAllergySeverity}
                        onValueChange={(value) => setNewAllergySeverity(value as "Leve" | "Moderada" | "Severa")}
                      >
                        <SelectTrigger className="focus:ring-2 focus:ring-ring focus:border-ring border-input rounded-lg transition-all duration-200">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Leve">Leve</SelectItem>
                          <SelectItem value="Moderada">Moderada</SelectItem>
                          <SelectItem value="Severa">Severa</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        type="button"
                        onClick={handleAddAllergy}
                        className="bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                        disabled={!newAllergySubstance.trim() || !newAllergyReaction.trim()}
                      >
                        Agregar
                      </Button>
                    </div>
                  </div>

                  {patient.allergies.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-2">
                        {patient.allergies.map((allergy, index) => (
                          <Badge
                            key={index}
                            className={`${getSeverityColor(allergy.severity)} flex items-center gap-2 px-3 py-2 text-sm border rounded-full transition-all duration-200`}
                          >
                            <div className="flex flex-col">
                              <span className="font-medium">{allergy.substance}</span>
                              <span className="text-xs opacity-75">
                                {allergy.reaction} • {allergy.dateIdentified}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveAllergy(allergy)}
                              className="ml-1 hover:bg-black/10 dark:hover:bg-white/10 rounded-full p-1 transition-colors"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <Separator className="bg-border" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground flex items-center gap-2">
                      <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      Información de Seguro
                    </h4>
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label htmlFor="insuranceProvider" className="text-sm font-medium text-foreground">
                          Proveedor de Seguro
                        </Label>
                        <Select
                          value={patient.insurance.provider}
                          onValueChange={(value) =>
                            onPatientChange({
                              ...patient,
                              insurance: { ...patient.insurance, provider: value },
                            })
                          }
                        >
                          <SelectTrigger className="focus:ring-2 focus:ring-ring focus:border-ring border-input rounded-lg transition-all duration-200">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {aseguradorasES.map((a) => (
                              <SelectItem key={a} value={a}>
                                {a}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="insurancePolicy" className="text-sm font-medium text-foreground">
                          Número de Póliza
                        </Label>
                        <Input
                          id="insurancePolicy"
                          value={patient.insurance.policyNumber}
                          onChange={(e) =>
                            onPatientChange({
                              ...patient,
                              insurance: { ...patient.insurance, policyNumber: e.target.value },
                            })
                          }
                          placeholder="Número de póliza"
                          className="focus:ring-2 focus:ring-ring focus:border-ring border-input rounded-lg transition-all duration-200"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground flex items-center gap-2">
                      <Phone className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                      Contacto de Emergencia
                    </h4>
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label htmlFor="emergencyContactName" className="text-sm font-medium text-foreground">
                          Nombre del Contacto
                        </Label>
                        <Input
                          id="emergencyContactName"
                          value={patient.emergencyContact.name}
                          onChange={(e) =>
                            onPatientChange({
                              ...patient,
                              emergencyContact: { ...patient.emergencyContact, name: e.target.value },
                            })
                          }
                          placeholder="Nombre completo"
                          className="focus:ring-2 focus:ring-ring focus:border-ring border-input rounded-lg transition-all duration-200"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="emergencyContactPhone" className="text-sm font-medium text-foreground">
                          Teléfono de Emergencia
                        </Label>
                        <Input
                          id="emergencyContactPhone"
                          value={patient.emergencyContact.phone}
                          onChange={(e) =>
                            onPatientChange({
                              ...patient,
                              emergencyContact: { ...patient.emergencyContact, phone: e.target.value },
                            })
                          }
                          placeholder="0000-0000"
                          className="focus:ring-2 focus:ring-ring focus:border-ring border-input rounded-lg transition-all duration-200"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border shadow-sm hover:shadow-md transition-shadow duration-200 rounded-xl overflow-hidden">
              <CardHeader className="pb-4 bg-card border-b border-border">
                <CardTitle className="text-lg font-medium flex items-center gap-2 text-foreground">
                  <Shield className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  Estado del Paciente
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-2">
                  <Label htmlFor="status" className="text-sm font-medium text-foreground">
                    Estado
                  </Label>
                  <Select value={patient.status} onValueChange={(value) => handleInputChange("status", value)}>
                    <SelectTrigger className="focus:ring-2 focus:ring-ring focus:border-ring border-input rounded-lg transition-all duration-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Activo">Activo</SelectItem>
                      <SelectItem value="Inactivo">Inactivo</SelectItem>
                      <SelectItem value="Suspendido">Suspendido</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>

        {/* Sticky footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-border bg-muted flex-shrink-0">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)} 
            className="px-6 hover:bg-accent border-input rounded-lg transition-all duration-200"
          >
            Cancelar
          </Button>
          <Button 
            onClick={onSave} 
            className="px-6 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
          >
            Guardar Cambios
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
