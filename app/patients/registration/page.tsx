"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import {
  UserPlus,
  CalendarIcon,
  Phone,
  Mail,
  MapPin,
  Heart,
  Shield,
  FileText,
  Save,
  X,
  Plus,
  AlertTriangle,
  User,
  Home,
  Users,
} from "lucide-react"

const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
const insuranceProviders = [
  "Seguro Social Dominicano",
  "ARS Humano",
  "ARS Palic",
  "ARS Universal",
  "ARS Futuro",
  "SeNaSa",
  "Seguro Privado",
  "Sin Seguro",
]

const commonAllergies = [
  "Penicilina",
  "Aspirina",
  "Mariscos",
  "Nueces",
  "Látex",
  "Polen",
  "Polvo",
  "Huevos",
  "Leche",
  "Soja",
]

const commonConditions = [
  "Hipertensión",
  "Diabetes",
  "Asma",
  "Artritis",
  "Migraña",
  "Depresión",
  "Ansiedad",
  "Colesterol Alto",
  "Enfermedad Cardíaca",
  "Osteoporosis",
]

export default function PatientRegistrationPage() {
  const [dateOfBirth, setDateOfBirth] = useState<Date>()
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>([])
  const [selectedConditions, setSelectedConditions] = useState<string[]>([])
  const [customAllergies, setCustomAllergies] = useState<string[]>([])
  const [customConditions, setCustomConditions] = useState<string[]>([])
  const [newAllergy, setNewAllergy] = useState("")
  const [newCondition, setNewCondition] = useState("")

  const [formData, setFormData] = useState({
    // Personal Information
    firstName: "",
    lastName: "",
    dui: "",
    gender: "",
    bloodType: "",
    maritalStatus: "",
    occupation: "",

    // Contact Information
    phone: "",
    email: "",
    address: "",
    city: "",
    departamento: "",
    postalCode: "",

    // Emergency Contact
    emergencyName: "",
    emergencyRelationship: "",
    emergencyPhone: "",
    emergencyEmail: "",

    // Insurance Information
    insuranceProvider: "",
    policyNumber: "",
    groupNumber: "",

    // Additional Information
    referredBy: "",
    notes: "",
  })

  const addCustomAllergy = () => {
    if (newAllergy.trim() && !customAllergies.includes(newAllergy.trim())) {
      setCustomAllergies([...customAllergies, newAllergy.trim()])
      setNewAllergy("")
    }
  }

  const addCustomCondition = () => {
    if (newCondition.trim() && !customConditions.includes(newCondition.trim())) {
      setCustomConditions([...customConditions, newCondition.trim()])
      setNewCondition("")
    }
  }

  const removeCustomAllergy = (allergy: string) => {
    setCustomAllergies(customAllergies.filter((a) => a !== allergy))
  }

  const removeCustomCondition = (condition: string) => {
    setCustomConditions(customConditions.filter((c) => c !== condition))
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const calculateAge = (birthDate: Date) => {
    const today = new Date()
    const age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1
    }
    return age
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the data to your backend
    console.log("Patient Registration Data:", {
      ...formData,
      dateOfBirth,
      selectedAllergies: [...selectedAllergies, ...customAllergies],
      selectedConditions: [...selectedConditions, ...customConditions],
    })
    alert("Paciente registrado exitosamente!")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Page Header */}
      <div className="bg-card border-b border-main-200 dark:border-main-800 p-4 lg:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <UserPlus className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-xl lg:text-2xl font-bold text-foreground">Registro de Paciente</h1>
                <p className="text-sm lg:text-base text-muted-foreground">Ingrese la información del nuevo paciente</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={() => (window.location.href = "/patients")} 
                variant="outline" 
                className="bg-transparent"
              >
                <Users className="w-4 h-4 mr-2" />
                Volver a Pacientes
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-4 lg:p-6">
        <form onSubmit={handleSubmit} className="space-y-6 lg:space-y-8">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg lg:text-xl">
                <User className="w-5 h-5" />
                Información Personal
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="firstName" className="text-sm font-medium">
                    Nombres *
                  </Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    placeholder="Nombres del paciente"
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName" className="text-sm font-medium">
                    Apellidos *
                  </Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    placeholder="Apellidos del paciente"
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="dui" className="text-sm font-medium">
                    DUI *
                  </Label>
                  <Input
                    id="dui"
                    value={formData.dui}
                    onChange={(e) => handleInputChange("dui", e.target.value)}
                    placeholder="00000000-0"
                    required
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <Label className="text-sm font-medium">Fecha de Nacimiento *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal mt-1 bg-transparent"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateOfBirth ? (
                          format(dateOfBirth, "dd/MM/yyyy", { locale: es })
                        ) : (
                          <span>Seleccionar fecha</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={dateOfBirth}
                        onSelect={setDateOfBirth}
                        disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  {dateOfBirth && <p className="text-xs text-muted-foreground mt-1">Edad: {calculateAge(dateOfBirth)} años</p>}
                </div>

                <div>
                  <Label className="text-sm font-medium">Género *</Label>
                  <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Seleccionar género" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="masculino">Masculino</SelectItem>
                      <SelectItem value="femenino">Femenino</SelectItem>
                      <SelectItem value="otro">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium">Tipo de Sangre</Label>
                  <Select value={formData.bloodType} onValueChange={(value) => handleInputChange("bloodType", value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {bloodTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium">Estado Civil</Label>
                  <Select
                    value={formData.maritalStatus}
                    onValueChange={(value) => handleInputChange("maritalStatus", value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Seleccionar estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="soltero">Soltero/a</SelectItem>
                      <SelectItem value="casado">Casado/a</SelectItem>
                      <SelectItem value="divorciado">Divorciado/a</SelectItem>
                      <SelectItem value="viudo">Viudo/a</SelectItem>
                      <SelectItem value="union-libre">Unión Libre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="occupation" className="text-sm font-medium">
                  Ocupación
                </Label>
                <Input
                  id="occupation"
                  value={formData.occupation}
                  onChange={(e) => handleInputChange("occupation", e.target.value)}
                  placeholder="Profesión u ocupación del paciente"
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg lg:text-xl">
                <Home className="w-5 h-5" />
                Información de Contacto
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone" className="text-sm font-medium">
                    Teléfono *
                  </Label>
                  <div className="relative mt-1">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="503-0000-0000"
                      required
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email" className="text-sm font-medium">
                    Correo Electrónico
                  </Label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="correo@ejemplo.com"
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="address" className="text-sm font-medium">
                  Dirección *
                </Label>
                <div className="relative mt-1">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    placeholder="Calle, número, sector, referencias..."
                    required
                    className="pl-10 min-h-[80px]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city" className="text-sm font-medium">
                    Ciudad *
                  </Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    placeholder="Ciudad"
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="departamento" className="text-sm font-medium">
                    Departamento *
                  </Label>
                  <Input
                    id="departamento"
                    value={formData.departamento}
                    onChange={(e) => handleInputChange("departamento", e.target.value)}
                    placeholder="Departamento"
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="postalCode" className="text-sm font-medium">
                    Código Postal
                  </Label>
                  <Input
                    id="postalCode"
                    value={formData.postalCode}
                    onChange={(e) => handleInputChange("postalCode", e.target.value)}
                    placeholder="00000"
                    className="mt-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Emergency Contact */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg lg:text-xl">
                <AlertTriangle className="w-5 h-5" />
                Contacto de Emergencia
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="emergencyName" className="text-sm font-medium">
                    Nombre Completo *
                  </Label>
                  <Input
                    id="emergencyName"
                    value={formData.emergencyName}
                    onChange={(e) => handleInputChange("emergencyName", e.target.value)}
                    placeholder="Nombre del contacto de emergencia"
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="emergencyRelationship" className="text-sm font-medium">
                    Parentesco *
                  </Label>
                  <Select
                    value={formData.emergencyRelationship}
                    onValueChange={(value) => handleInputChange("emergencyRelationship", value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Seleccionar parentesco" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="esposo">Esposo/a</SelectItem>
                      <SelectItem value="padre">Padre</SelectItem>
                      <SelectItem value="madre">Madre</SelectItem>
                      <SelectItem value="hijo">Hijo/a</SelectItem>
                      <SelectItem value="hermano">Hermano/a</SelectItem>
                      <SelectItem value="amigo">Amigo/a</SelectItem>
                      <SelectItem value="otro">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="emergencyPhone" className="text-sm font-medium">
                    Teléfono *
                  </Label>
                  <div className="relative mt-1">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="emergencyPhone"
                      value={formData.emergencyPhone}
                      onChange={(e) => handleInputChange("emergencyPhone", e.target.value)}
                      placeholder="809-000-0000"
                      required
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="emergencyEmail" className="text-sm font-medium">
                    Correo Electrónico
                  </Label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="emergencyEmail"
                      type="email"
                      value={formData.emergencyEmail}
                      onChange={(e) => handleInputChange("emergencyEmail", e.target.value)}
                      placeholder="correo@ejemplo.com"
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Insurance Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg lg:text-xl">
                <Shield className="w-5 h-5" />
                Información del Seguro
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm font-medium">Proveedor de Seguro</Label>
                  <Select
                    value={formData.insuranceProvider}
                    onValueChange={(value) => handleInputChange("insuranceProvider", value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Seleccionar proveedor" />
                    </SelectTrigger>
                    <SelectContent>
                      {insuranceProviders.map((provider) => (
                        <SelectItem key={provider} value={provider}>
                          {provider}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="policyNumber" className="text-sm font-medium">
                    Número de Póliza
                  </Label>
                  <Input
                    id="policyNumber"
                    value={formData.policyNumber}
                    onChange={(e) => handleInputChange("policyNumber", e.target.value)}
                    placeholder="Número de póliza"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="groupNumber" className="text-sm font-medium">
                    Número de Grupo
                  </Label>
                  <Input
                    id="groupNumber"
                    value={formData.groupNumber}
                    onChange={(e) => handleInputChange("groupNumber", e.target.value)}
                    placeholder="Número de grupo"
                    className="mt-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Medical History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg lg:text-xl">
                <Heart className="w-5 h-5" />
                Historial Médico
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Allergies */}
              <div>
                <Label className="text-sm font-medium mb-3 block">Alergias Conocidas</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-4">
                  {commonAllergies.map((allergy, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Checkbox
                        id={`allergy-${index}`}
                        checked={selectedAllergies.includes(allergy)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedAllergies([...selectedAllergies, allergy])
                          } else {
                            setSelectedAllergies(selectedAllergies.filter((a) => a !== allergy))
                          }
                        }}
                      />
                      <Label htmlFor={`allergy-${index}`} className="text-sm">
                        {allergy}
                      </Label>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 mb-3">
                  <Input
                    value={newAllergy}
                    onChange={(e) => setNewAllergy(e.target.value)}
                    placeholder="Agregar otra alergia..."
                    className="flex-1"
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addCustomAllergy())}
                  />
                  <Button
                    type="button"
                    onClick={addCustomAllergy}
                    variant="outline"
                    size="sm"
                    className="bg-transparent"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                {customAllergies.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {customAllergies.map((allergy, index) => (
                      <Badge key={index} variant="destructive" className="flex items-center gap-1">
                        {allergy}
                        <X className="w-3 h-3 cursor-pointer" onClick={() => removeCustomAllergy(allergy)} />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <Separator />

              {/* Chronic Conditions */}
              <div>
                <Label className="text-sm font-medium mb-3 block">Condiciones Médicas Crónicas</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-4">
                  {commonConditions.map((condition, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Checkbox
                        id={`condition-${index}`}
                        checked={selectedConditions.includes(condition)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedConditions([...selectedConditions, condition])
                          } else {
                            setSelectedConditions(selectedConditions.filter((c) => c !== condition))
                          }
                        }}
                      />
                      <Label htmlFor={`condition-${index}`} className="text-sm">
                        {condition}
                      </Label>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 mb-3">
                  <Input
                    value={newCondition}
                    onChange={(e) => setNewCondition(e.target.value)}
                    placeholder="Agregar otra condición..."
                    className="flex-1"
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addCustomCondition())}
                  />
                  <Button
                    type="button"
                    onClick={addCustomCondition}
                    variant="outline"
                    size="sm"
                    className="bg-transparent"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                {customConditions.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {customConditions.map((condition, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {condition}
                        <X className="w-3 h-3 cursor-pointer" onClick={() => removeCustomCondition(condition)} />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg lg:text-xl">
                <FileText className="w-5 h-5" />
                Información Adicional
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="referredBy" className="text-sm font-medium">
                  Referido por
                </Label>
                <Input
                  id="referredBy"
                  value={formData.referredBy}
                  onChange={(e) => handleInputChange("referredBy", e.target.value)}
                  placeholder="Nombre del médico o persona que refirió al paciente"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="notes" className="text-sm font-medium">
                  Notas Adicionales
                </Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  placeholder="Cualquier información adicional relevante sobre el paciente..."
                  className="mt-1 min-h-[100px]"
                />
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6">
            <Button type="button" variant="outline" className="bg-transparent">
              Cancelar
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              <Save className="w-4 h-4 mr-2" />
              Registrar Paciente
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
