"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TestTube, TrendingUp } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { getStatusColor, formatVitalSignLabel } from "../utils/ehr-utils"
import type { PatientEHR } from "../mocks/patient-data"

interface TestsTabProps {
  patientData: PatientEHR
}

export function TestsTab({ patientData }: TestsTabProps) {
  return (
    <div className="space-y-6">
      {/* Laboratory Tests */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="w-5 h-5" />
            Exámenes de Laboratorio
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {patientData.labTests.map((lab) => (
              <div key={lab.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="font-medium text-foreground">{lab.test}</h4>
                    <p className="text-sm text-muted-foreground">Ordenado por: {lab.orderedBy}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(lab.date), "dd/MM/yyyy", { locale: es })}
                    </p>
                  </div>
                  <Badge variant="outline">{lab.status}</Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(lab.values).map(([test, data]) => (
                    <div key={test} className="p-3 bg-muted rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{test}</span>
                        <Badge variant={getStatusColor(data.status)} className="text-xs">
                          {data.status}
                        </Badge>
                      </div>
                      <div className="text-lg font-semibold">
                        {data.value} {data.unit}
                      </div>
                      <div className="text-xs text-muted-foreground">Ref: {data.reference}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Vital Signs Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Tendencias de Signos Vitales
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Fecha</th>
                  <th className="text-left p-2">Temperatura</th>
                  <th className="text-left p-2">Presión Arterial</th>
                  <th className="text-left p-2">Frecuencia Cardíaca</th>
                  <th className="text-left p-2">Peso</th>
                  <th className="text-left p-2">IMC</th>
                </tr>
              </thead>
              <tbody>
                {patientData.vitalSigns.map((vital, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-2">{format(new Date(vital.date), "dd/MM/yyyy", { locale: es })}</td>
                    <td className="p-2">{vital.temperature}</td>
                    <td className="p-2">{vital.bloodPressure}</td>
                    <td className="p-2">{vital.heartRate}</td>
                    <td className="p-2">{vital.weight}</td>
                    <td className="p-2">{vital.bmi}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
