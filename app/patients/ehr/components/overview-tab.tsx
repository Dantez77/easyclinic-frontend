"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { User, Phone, Mail, MapPin, Shield, Activity } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { formatVitalSignLabel } from "../utils/ehr-utils"
import type { PatientEHR } from "../mocks/patient-data"

interface OverviewTabProps {
  patientData: PatientEHR
}

export function OverviewTab({ patientData }: OverviewTabProps) {
  return (
    <div className="space-y-6">
      {/* Patient Demographics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Información del Paciente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium text-foreground">Datos Personales</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Nombre Completo:</span>
                  <span className="font-medium">
                    {patientData.firstName} {patientData.lastName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Cédula:</span>
                  <span>{patientData.cedula}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Fecha de Nacimiento:</span>
                  <span>{format(new Date(patientData.dateOfBirth), "dd/MM/yyyy", { locale: es })}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Edad:</span>
                  <span>{patientData.age} años</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Género:</span>
                  <span>{patientData.gender}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Estado Civil:</span>
                  <span>{patientData.maritalStatus}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ocupación:</span>
                  <span>{patientData.occupation}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tipo de Sangre:</span>
                  <Badge variant="outline">{patientData.bloodType}</Badge>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-foreground">Información de Contacto</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span>{patientData.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span>{patientData.email}</span>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <div>
                    <div>{patientData.address}</div>
                    <div className="text-muted-foreground">
                      {patientData.city}, {patientData.province}
                    </div>
                    <div className="text-muted-foreground">{patientData.postalCode}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-foreground">Contacto de Emergencia</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Nombre:</span>
                  <span className="font-medium">{patientData.emergencyContact.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Parentesco:</span>
                  <span>{patientData.emergencyContact.relationship}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span>{patientData.emergencyContact.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span>{patientData.emergencyContact.email}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Insurance Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Información del Seguro
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Proveedor:</span>
                <span className="font-medium">{patientData.insurance.provider}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Número de Póliza:</span>
                <span>{patientData.insurance.policyNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Número de Grupo:</span>
                <span>{patientData.insurance.groupNumber}</span>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Fecha de Vigencia:</span>
                <span>
                  {format(new Date(patientData.insurance.effectiveDate), "dd/MM/yyyy", { locale: es })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Fecha de Vencimiento:</span>
                <span>
                  {format(new Date(patientData.insurance.expirationDate), "dd/MM/yyyy", { locale: es })}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Vital Signs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Signos Vitales Actuales
          </CardTitle>
        </CardHeader>
        <CardContent>
          {patientData.vitalSigns.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
              {Object.entries(patientData.vitalSigns[0])
                .filter(([key]) => key !== "date")
                .map(([key, value]) => (
                  <div key={key} className="text-center p-3 bg-muted rounded-lg">
                    <div className="text-xs text-muted-foreground mb-1">
                      {formatVitalSignLabel(key)}
                    </div>
                    <div className="font-semibold text-foreground">{value}</div>
                  </div>
                ))}
            </div>
          )}
          <div className="mt-4 text-xs text-muted-foreground">
            Última actualización:{" "}
            {format(new Date(patientData.vitalSigns[0].date), "dd/MM/yyyy", { locale: es })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
