"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { type Patient } from "../types"

interface MedicalHistoryCardProps {
  patientData: Patient
}

export function MedicalHistoryCard({ patientData }: MedicalHistoryCardProps) {
  // For now, we'll show a placeholder since the mock data structure might not match
  // In a real app, this would come from the patient's EHR
  const medicalHistory = [
    {
      id: "1",
      title: "Consulta General",
      doctor: "Dr. Juan Pérez",
      date: "2024-11-15",
      status: "Completada",
      description: "Control de hipertensión y migraña. Medicación ajustada."
    },
    {
      id: "2",
      title: "Examen Físico",
      doctor: "Dr. Ana López",
      date: "2024-10-20",
      status: "Completada",
      description: "Examen físico anual. Paciente en buen estado general."
    }
  ]

  return (
    <Card className="border-main-200 dark:border-main-800">
      <CardHeader>
        <CardTitle className="text-primary dark:text-main-400">Medical History - {patientData.firstName} {patientData.lastName}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {medicalHistory.map((item) => (
            <div key={item.id} className="border-l-4 border-main-500 pl-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">{item.title}</h4>
                  <p className="text-sm text-muted-foreground">{item.doctor} • {item.date}</p>
                </div>
                <Badge variant="outline">{item.status}</Badge>
              </div>
              <p className="text-sm mt-2">{item.description}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
