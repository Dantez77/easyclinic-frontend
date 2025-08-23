"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Heart } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { getSeverityColor, getStatusColor } from "../utils/ehr-utils"
import type { PatientEHR } from "../mocks/patient-data"

interface MedicalTabProps {
  patientData: PatientEHR
}

export function MedicalTab({ patientData }: MedicalTabProps) {
  return (
    <div className="space-y-6">
      {/* Allergies */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Alergias
          </CardTitle>
        </CardHeader>
        <CardContent>
          {patientData.allergies.length > 0 ? (
            <div className="space-y-4">
              {patientData.allergies.map((allergy, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium text-foreground">{allergy.substance}</h4>
                      <p className="text-sm text-muted-foreground">Reacción: {allergy.reaction}</p>
                      <p className="text-xs text-muted-foreground">
                        Identificada: {format(new Date(allergy.dateIdentified), "dd/MM/yyyy", { locale: es })}
                      </p>
                    </div>
                    <Badge variant={getSeverityColor(allergy.severity)}>
                      {allergy.severity}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">Sin alergias conocidas</p>
          )}
        </CardContent>
      </Card>

      {/* Chronic Conditions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5" />
            Condiciones Crónicas
          </CardTitle>
        </CardHeader>
        <CardContent>
          {patientData.chronicConditions.length > 0 ? (
            <div className="space-y-4">
              {patientData.chronicConditions.map((condition, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium text-foreground">{condition.condition}</h4>
                      <p className="text-sm text-muted-foreground">{condition.notes}</p>
                      <p className="text-xs text-muted-foreground">
                        Diagnosticada: {format(new Date(condition.diagnosisDate), "dd/MM/yyyy", { locale: es })}
                      </p>
                    </div>
                    <Badge variant={getStatusColor(condition.status)}>
                      {condition.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">Sin condiciones crónicas registradas</p>
          )}
        </CardContent>
      </Card>

      {/* Social History */}
      <Card>
        <CardHeader>
          <CardTitle>Historia Social</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-foreground mb-2">Hábitos</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tabaquismo:</span>
                    <span>{patientData.socialHistory.smoking.status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Alcohol:</span>
                    <span>{patientData.socialHistory.alcohol.status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Drogas:</span>
                    <span>{patientData.socialHistory.drugs.status}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-foreground mb-2">Estilo de Vida</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Ejercicio:</span>
                    <span>{patientData.socialHistory.exercise.frequency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tipo:</span>
                    <span>{patientData.socialHistory.exercise.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Dieta:</span>
                    <span>{patientData.socialHistory.diet.type}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Family History */}
      <Card>
        <CardHeader>
          <CardTitle>Historia Familiar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {patientData.familyHistory.map((family, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <span className="font-medium">{family.relation}</span>
                  <span className="text-muted-foreground ml-2">- {family.condition}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Edad de inicio: {family.ageOfOnset} años ({family.status})
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
