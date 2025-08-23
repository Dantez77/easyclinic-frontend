"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Pill } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import type { PatientEHR } from "../mocks/patient-data"

interface MedicationsTabProps {
  patientData: PatientEHR
}

export function MedicationsTab({ patientData }: MedicationsTabProps) {
  return (
    <div className="space-y-6">
      {/* Current Medications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Pill className="w-5 h-5" />
            Medicamentos Actuales
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {patientData.currentMedications.map((medication, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-medium text-foreground">{medication.medication}</h4>
                    <p className="text-sm text-muted-foreground">
                      {medication.dosage} - {medication.frequency}
                    </p>
                  </div>
                  <Badge variant="default">Activo</Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Indicación:</span>
                    <p className="font-medium">{medication.indication}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Prescrito por:</span>
                    <p className="font-medium">{medication.prescribedBy}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Fecha de inicio:</span>
                    <p className="font-medium">
                      {format(new Date(medication.startDate), "dd/MM/yyyy", { locale: es })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
