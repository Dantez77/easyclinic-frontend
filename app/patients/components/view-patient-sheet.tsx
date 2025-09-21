"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Phone, Mail, MapPin, User, FileText } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import type { Patient } from "@/lib/patients-api"

interface ViewPatientSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  patient: Patient | null
}

export function ViewPatientSheet({ open, onOpenChange, patient }: ViewPatientSheetProps) {
  if (!patient) return null

  // Helper function to calculate age
  const calculateAge = (dateOfBirth: string) => {
    const today = new Date()
    const birth = new Date(dateOfBirth)
    const age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      return age - 1
    }
    return age
  }

  const getGenderLabel = (gender: string) => {
    switch (gender) {
      case 'M': return 'Masculino'
      case 'F': return 'Femenino'
      default: return 'Otro'
    }
  }

  const getCivilStatusLabel = (status?: string) => {
    switch (status) {
      case 'Single': return 'Soltero/a'
      case 'Married': return 'Casado/a'
      case 'Divorced': return 'Divorciado/a'
      case 'Widowed': return 'Viudo/a'
      default: return 'No especificado'
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Información del Paciente</SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-full mt-6">
          <div className="space-y-6 pb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">
                  {patient.name} {patient.lastName}
                </h3>
                <p className="text-sm text-muted-foreground">{patient.id}</p>
                <Badge variant={patient.status === "active" ? "default" : "secondary"} className="mt-1">
                  {patient.status === "active" ? "Activo" : "Inactivo"}
                </Badge>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-foreground mb-2">Información Personal</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">DUI:</span>
                    <span>{patient.dui || 'No especificado'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Fecha de Nacimiento:</span>
                    <span>
                      {(patient.birthDate || patient.dateOfBirth)
                        ? format(new Date(patient.birthDate || patient.dateOfBirth), "dd/MM/yyyy", { locale: es })
                        : 'No especificado'
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Edad:</span>
                    <span>
                      {(patient.birthDate || patient.dateOfBirth)
                        ? `${calculateAge(patient.birthDate || patient.dateOfBirth)} años`
                        : 'No especificado'
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Género:</span>
                    <span>{getGenderLabel(patient.gender)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tipo de Sangre:</span>
                    <Badge variant="outline">{patient.bloodType || 'No especificado'}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Estado Civil:</span>
                    <span>{getCivilStatusLabel(patient.civilStatus)}</span>
                  </div>
                  {patient.profession && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Profesión:</span>
                      <span>{patient.profession}</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-foreground mb-2">Contacto</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span>{patient.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span>{patient.email}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                    <div>
                      <div>{patient.address || 'No especificado'}</div>
                      <div className="text-muted-foreground">
                        {patient.municipality || 'No especificado'}, {patient.province || 'No especificado'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-foreground mb-2">Información del Sistema</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Fecha de Registro:</span>
                    <span>
                      {patient.createdAt 
                        ? format(new Date(patient.createdAt), "dd/MM/yyyy", { locale: es })
                        : 'No disponible'
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Última Actualización:</span>
                    <span>
                      {patient.updatedAt 
                        ? format(new Date(patient.updatedAt), "dd/MM/yyyy", { locale: es })
                        : 'No disponible'
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Estado:</span>
                    <span className="capitalize">{patient.status === 'active' ? 'Activo' : 'Inactivo'}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Button
                onClick={() => (window.location.href = `/patients/ehr/${patient?.id}`)}
                className="w-full"
              >
                <FileText className="w-4 h-4 mr-2" />
                <span>Ver Expediente Médico Completo</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => (window.location.href = `/patients/ehr-legacy/${patient?.id}`)}
                className="w-full"
              >
                <FileText className="w-4 h-4 mr-2" />
                <span>Ver EHR Legacy (Datos de Prueba)</span>
              </Button>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
