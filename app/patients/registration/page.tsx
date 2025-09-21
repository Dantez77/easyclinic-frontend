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
  CreditCard,
} from "lucide-react"
import { 
  PROVINCES, 
  BLOOD_TYPES, 
  INSURANCE_PROVIDERS, 
  COMMON_ALLERGIES, 
  COMMON_CONDITIONS,
  type PatientRegistrationForm 
} from "../types"
import { 
  validateDUI, 
  validateNIT, 
  validatePhone, 
  validateEmail, 
  formatDUI, 
  formatNIT, 
  formatPhone,
  calculateAge 
} from "@/lib/validation-utils"
import { patientsAPI } from "@/lib/patients-api"

export default function PatientRegistrationPage() {
  const [dateOfBirth, setDateOfBirth] = useState<Date>()
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>([])
  const [selectedConditions, setSelectedConditions] = useState<string[]>([])
  const [customAllergies, setCustomAllergies] = useState<string[]>([])
  const [customConditions, setCustomConditions] = useState<string[]>([])
  const [newAllergy, setNewAllergy] = useState("")
  const [newCondition, setNewCondition] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [formData, setFormData] = useState<PatientRegistrationForm>({
    // Personal Information
    firstName: "",
    lastName: "",
    dui: "",
    nit: "",
    gender: "",
    bloodType: "",
    maritalStatus: "",
    occupation: "",

    // Contact Information
    phone: "",
    email: "",
    address: "",
    city: "",
    province: "",
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
    allergies: [],
    chronicConditions: [],
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      if (e.currentTarget.id === "newAllergy") {
        addCustomAllergy()
      } else if (e.currentTarget.id === "newCondition") {
        addCustomCondition()
      }
    }
  }

  const handleInputChange = (field: keyof PatientRegistrationForm, value: string) => {
    setFormData((prev: PatientRegistrationForm) => ({ ...prev, [field]: value }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev: Record<string, string>) => ({ ...prev, [field]: "" }))
    }
    
    // Auto-format certain fields
    if (field === 'dui') {
      const formatted = formatDUI(value)
      if (formatted !== value) {
        setFormData((prev: PatientRegistrationForm) => ({ ...prev, [field]: formatted }))
      }
    } else if (field === 'nit' && value) {
      const formatted = formatNIT(value)
      if (formatted !== value) {
        setFormData((prev: PatientRegistrationForm) => ({ ...prev, [field]: formatted }))
      }
    } else if (field === 'phone') {
      const formatted = formatPhone(value)
      if (formatted !== value) {
        setFormData((prev: PatientRegistrationForm) => ({ ...prev, [field]: formatted }))
      }
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}
    
    // Required field validations
    if (!formData.firstName.trim()) newErrors.firstName = "Los nombres son requeridos"
    if (!formData.lastName.trim()) newErrors.lastName = "Los apellidos son requeridos"
    if (!formData.dui.trim()) newErrors.dui = "El DUI es requerido"
    if (!formData.gender) newErrors.gender = "El género es requerido"
    if (!formData.phone.trim()) newErrors.phone = "El teléfono es requerido"
    if (!formData.address.trim()) newErrors.address = "La dirección es requerida"
    if (!formData.city.trim()) newErrors.city = "La ciudad es requerida"
    if (!formData.province) newErrors.province = "La provincia es requerida"
    if (!formData.emergencyName.trim()) newErrors.emergencyName = "El nombre del contacto de emergencia es requerido"
    if (!formData.emergencyPhone.trim()) newErrors.emergencyPhone = "El teléfono de emergencia es requerido"
    if (!dateOfBirth) newErrors.dateOfBirth = "La fecha de nacimiento es requerida"
    
    // Format validations
    if (formData.dui) {
      const duiValidation = validateDUI(formData.dui)
      if (!duiValidation.isValid) {
        newErrors.dui = duiValidation.error!
      }
    }
    
    if (formData.nit) {
      const nitValidation = validateNIT(formData.nit)
      if (!nitValidation.isValid) {
        newErrors.nit = nitValidation.error!
      }
    }
    
    if (formData.phone) {
      const phoneValidation = validatePhone(formData.phone)
      if (!phoneValidation.isValid) {
        newErrors.phone = phoneValidation.error!
      }
    }
    
    if (formData.email) {
      const emailValidation = validateEmail(formData.email)
      if (!emailValidation.isValid) {
        newErrors.email = emailValidation.error!
      }
    }
    
    if (formData.emergencyPhone) {
      const emergencyPhoneValidation = validatePhone(formData.emergencyPhone)
      if (!emergencyPhoneValidation.isValid) {
        newErrors.emergencyPhone = emergencyPhoneValidation.error!
      }
    }
    
    if (formData.emergencyEmail) {
      const emergencyEmailValidation = validateEmail(formData.emergencyEmail)
      if (!emergencyEmailValidation.isValid) {
        newErrors.emergencyEmail = emergencyEmailValidation.error!
      }
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setIsSubmitting(true)
    
    try {
      // Combine selected and custom allergies/conditions
      const allAllergies = [...selectedAllergies, ...customAllergies]
      const allConditions = [...selectedConditions, ...customConditions]
      
      // Create the complete patient data for the API
      const patientData = {
        // Personal Information
        firstName: formData.firstName,
        lastName: formData.lastName,
        dui: formData.dui,
        nit: formData.nit || undefined,
        dateOfBirth: dateOfBirth.toISOString().split('T')[0], // Format as YYYY-MM-DD
        gender: formData.gender,
        bloodType: formData.bloodType || undefined,
        maritalStatus: formData.maritalStatus || undefined,
        occupation: formData.occupation || undefined,
        
        // Contact Information
        phone: formData.phone,
        email: formData.email || undefined,
        address: formData.address,
        city: formData.city,
        province: formData.province,
        postalCode: formData.postalCode || undefined,
        
        // Emergency Contact
        emergencyName: formData.emergencyName,
        emergencyRelationship: formData.emergencyRelationship || undefined,
        emergencyPhone: formData.emergencyPhone,
        emergencyEmail: formData.emergencyEmail || undefined,
        
        // Insurance Information
        insuranceProvider: formData.insuranceProvider || undefined,
        policyNumber: formData.policyNumber || undefined,
        groupNumber: formData.groupNumber || undefined,
        
        // Medical Information
        allergies: allAllergies,
        chronicConditions: allConditions,
        referredBy: formData.referredBy || undefined,
        notes: formData.notes || undefined
      }
      
      // Send to backend API using patients API client
      const result = await patientsAPI.registerPatient(patientData)
      
      alert("¡Paciente registrado exitosamente!")
      
      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        dui: "",
        nit: "",
        gender: "",
        bloodType: "",
        maritalStatus: "",
        occupation: "",
        phone: "",
        email: "",
        address: "",
        city: "",
        province: "",
        postalCode: "",
        emergencyName: "",
        emergencyRelationship: "",
        emergencyPhone: "",
        emergencyEmail: "",
        insuranceProvider: "",
        policyNumber: "",
        groupNumber: "",
        allergies: [],
        chronicConditions: [],
        referredBy: "",
        notes: "",
      })
      setDateOfBirth(undefined)
      setSelectedAllergies([])
      setSelectedConditions([])
      setCustomAllergies([])
      setCustomConditions([])
      setErrors({})
      
      // Redirect to patients list
      setTimeout(() => {
        window.location.href = "/patients"
      }, 2000)
      
    } catch (error) {
      console.error("Error registering patient:", error)
      alert(`Error al registrar el paciente: ${error instanceof Error ? error.message : 'Error desconocido'}`)
    } finally {
      setIsSubmitting(false)
    }
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
                    className={`mt-1 ${errors.firstName ? 'border-red-500' : ''}`}
                  />
                  {errors.firstName && (
                    <p className="text-sm text-red-600 mt-1">{errors.firstName}</p>
                  )}
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
                    className={`mt-1 ${errors.lastName ? 'border-red-500' : ''}`}
                  />
                  {errors.lastName && (
                    <p className="text-sm text-red-600 mt-1">{errors.lastName}</p>
                  )}
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
                    className={`mt-1 ${errors.dui ? 'border-red-500' : ''}`}
                  />
                  {errors.dui && (
                    <p className="text-sm text-red-600 mt-1">{errors.dui}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">Documento Único de Identidad</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="nit" className="text-sm font-medium">
                    NIT (Opcional)
                  </Label>
                  <Input
                    id="nit"
                    value={formData.nit}
                    onChange={(e) => handleInputChange("nit", e.target.value)}
                    placeholder="0000-000000-000-0"
                    className={`mt-1 ${errors.nit ? 'border-red-500' : ''}`}
                  />
                  {errors.nit && (
                    <p className="text-sm text-red-600 mt-1">{errors.nit}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">Número de Identificación Tributaria</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Fecha de Nacimiento *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={`w-full justify-start text-left font-normal mt-1 bg-transparent ${errors.dateOfBirth ? 'border-red-500' : ''}`}
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
                  {dateOfBirth && <p className="text-xs text-muted-foreground mt-1">Edad: {calculateAge(dateOfBirth.toISOString())} años</p>}
                  {errors.dateOfBirth && (
                    <p className="text-sm text-red-600 mt-1">{errors.dateOfBirth}</p>
                  )}
                </div>

                <div>
                  <Label className="text-sm font-medium">Género *</Label>
                  <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                    <SelectTrigger className={`mt-1 ${errors.gender ? 'border-red-500' : ''}`}>
                      <SelectValue placeholder="Seleccionar género" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Masculino">Masculino</SelectItem>
                      <SelectItem value="Femenino">Femenino</SelectItem>
                      <SelectItem value="Otro">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.gender && (
                    <p className="text-sm text-red-600 mt-1">{errors.gender}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Tipo de Sangre</Label>
                  <Select value={formData.bloodType} onValueChange={(value) => handleInputChange("bloodType", value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {BLOOD_TYPES.map((type) => (
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
                      <SelectItem value="Soltero/a">Soltero/a</SelectItem>
                      <SelectItem value="Casado/a">Casado/a</SelectItem>
                      <SelectItem value="Divorciado/a">Divorciado/a</SelectItem>
                      <SelectItem value="Viudo/a">Viudo/a</SelectItem>
                      <SelectItem value="Unión Libre">Unión Libre</SelectItem>
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
                      placeholder="7123-4567"
                      required
                      className={`pl-10 ${errors.phone ? 'border-red-500' : ''}`}
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-sm text-red-600 mt-1">{errors.phone}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">Formato: 0000-0000</p>
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
                      className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-red-600 mt-1">{errors.email}</p>
                  )}
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
                    className={`pl-10 min-h-[80px] ${errors.address ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors.address && (
                  <p className="text-sm text-red-600 mt-1">{errors.address}</p>
                )}
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
                    className={`mt-1 ${errors.city ? 'border-red-500' : ''}`}
                  />
                  {errors.city && (
                    <p className="text-sm text-red-600 mt-1">{errors.city}</p>
                  )}
                </div>
                <div>
                  <Label className="text-sm font-medium">
                    Provincia *
                  </Label>
                  <Select value={formData.province} onValueChange={(value) => handleInputChange("province", value)}>
                    <SelectTrigger className={`mt-1 ${errors.province ? 'border-red-500' : ''}`}>
                      <SelectValue placeholder="Seleccionar provincia" />
                    </SelectTrigger>
                    <SelectContent>
                      {PROVINCES.map((province) => (
                        <SelectItem key={province} value={province}>
                          {province}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.province && (
                    <p className="text-sm text-red-600 mt-1">{errors.province}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="postalCode" className="text-sm font-medium">
                    Código Postal
                  </Label>
                  <Input
                    id="postalCode"
                    value={formData.postalCode}
                    onChange={(e) => handleInputChange("postalCode", e.target.value)}
                    placeholder="1101"
                    className="mt-1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Opcional en El Salvador</p>
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
                    className={`mt-1 ${errors.emergencyName ? 'border-red-500' : ''}`}
                  />
                  {errors.emergencyName && (
                    <p className="text-sm text-red-600 mt-1">{errors.emergencyName}</p>
                  )}
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
                      <SelectItem value="Esposo/a">Esposo/a</SelectItem>
                      <SelectItem value="Padre">Padre</SelectItem>
                      <SelectItem value="Madre">Madre</SelectItem>
                      <SelectItem value="Hijo/a">Hijo/a</SelectItem>
                      <SelectItem value="Hermano/a">Hermano/a</SelectItem>
                      <SelectItem value="Amigo/a">Amigo/a</SelectItem>
                      <SelectItem value="Otro">Otro</SelectItem>
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
                      placeholder="7123-4567"
                      required
                      className={`pl-10 ${errors.emergencyPhone ? 'border-red-500' : ''}`}
                    />
                  </div>
                  {errors.emergencyPhone && (
                    <p className="text-sm text-red-600 mt-1">{errors.emergencyPhone}</p>
                  )}
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
                      className={`pl-10 ${errors.emergencyEmail ? 'border-red-500' : ''}`}
                    />
                  </div>
                  {errors.emergencyEmail && (
                    <p className="text-sm text-red-600 mt-1">{errors.emergencyEmail}</p>
                  )}
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
                      {INSURANCE_PROVIDERS.map((provider) => (
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
                  {COMMON_ALLERGIES.map((allergy, index) => (
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
                    id="newAllergy"
                    value={newAllergy}
                    onChange={(e) => setNewAllergy(e.target.value)}
                    placeholder="Agregar otra alergia..."
                    className="flex-1"
                    onKeyPress={handleKeyPress}
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
                  {COMMON_CONDITIONS.map((condition, index) => (
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
                    id="newCondition"
                    value={newCondition}
                    onChange={(e) => setNewCondition(e.target.value)}
                    placeholder="Agregar otra condición..."
                    className="flex-1"
                    onKeyPress={handleKeyPress}
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
            <Button 
              type="submit" 
              disabled={isSubmitting} 
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSubmitting ? "Registrando..." : "Registrar Paciente"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
