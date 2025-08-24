"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Phone, Mail, MapPin, User, FileText } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import type { Patient } from "../mocks/patients-data"

interface ViewPatientSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  patient: Patient | null
}

export function ViewPatientSheet({ open, onOpenChange, patient }: ViewPatientSheetProps) {
  if (!patient) return null

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
                  {patient.firstName} {patient.lastName}
                </h3>
                <p className="text-sm text-muted-foreground">{patient.patientId}</p>
                <Badge variant={patient.status === "Activo" ? "default" : "secondary"} className="mt-1">
                  {patient.status}
                </Badge>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-foreground mb-2">Información Personal</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                                          <span className="text-muted-foreground">DUI:</span>
                    <span>{patient.dui}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Fecha de Nacimiento:</span>
                    <span>{format(new Date(patient.dateOfBirth), "dd/MM/yyyy", { locale: es })}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Edad:</span>
                    <span>{patient.age} años</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Género:</span>
                    <span>{patient.gender}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tipo de Sangre:</span>
                    <Badge variant="outline">{patient.bloodType}</Badge>
                  </div>
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
                      <div>{patient.address}</div>
                      <div className="text-muted-foreground">
                        {patient.city}, {patient.province}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-foreground mb-2">Información Médica</h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Alergias:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {patient.allergies.length > 0 ? (
                        patient.allergies.map((allergy, index) => (
                          <Badge key={index} variant="destructive" className="text-xs">
                            {allergy.substance}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-muted-foreground">Sin alergias conocidas</span>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Seguro:</span>
                    <span>{patient.insurance.provider} - {patient.insurance.policyNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Contacto de Emergencia:</span>
                    <span className="text-right">{patient.emergencyContact.name} - {patient.emergencyContact.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Última Visita:</span>
                    <span>{format(new Date(patient.lastVisit), "dd/MM/yyyy", { locale: es })}</span>
                  </div>
                </div>
              </div>
            </div>
            <Button
              onClick={() => (window.location.href = `/patients/ehr/${patient?.id}`)}
              className="w-full"
            >
              <FileText className="w-4 h-4 mr-2" />
              <span>Ver EHR Completo</span>
            </Button>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
