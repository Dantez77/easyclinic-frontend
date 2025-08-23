"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Stethoscope } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import type { PatientEHR } from "../mocks/patient-data"

interface HistoryTabProps {
  patientData: PatientEHR
}

export function HistoryTab({ patientData }: HistoryTabProps) {
  return (
    <div className="space-y-6">
      {/* Consultations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Stethoscope className="w-5 h-5" />
            Historial de Consultas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {patientData.consultations.map((consultation) => (
              <div key={consultation.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="font-medium text-foreground">{consultation.reason}</h4>
                    <p className="text-sm text-muted-foreground">
                      {consultation.doctor} - {consultation.specialty}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(consultation.date), "dd/MM/yyyy", { locale: es })}
                    </p>
                  </div>
                  <Badge variant="outline">{consultation.status}</Badge>
                </div>

                <div className="space-y-3">
                  {consultation.symptoms.length > 0 && (
                    <div>
                      <span className="text-sm font-medium text-foreground">Síntomas:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {consultation.symptoms.map((symptom, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {symptom}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <span className="text-sm font-medium text-foreground">Diagnóstico:</span>
                    <p className="text-sm text-muted-foreground">{consultation.diagnosis}</p>
                  </div>

                  <div>
                    <span className="text-sm font-medium text-foreground">Tratamiento:</span>
                    <p className="text-sm text-muted-foreground">{consultation.treatment}</p>
                  </div>

                  <div>
                    <span className="text-sm font-medium text-foreground">Notas:</span>
                    <p className="text-sm text-muted-foreground">{consultation.notes}</p>
                  </div>

                  {consultation.followUp && (
                    <div>
                      <span className="text-sm font-medium text-foreground">Próximo seguimiento:</span>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(consultation.followUp), "dd/MM/yyyy", { locale: es })}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
