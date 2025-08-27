"use client"

import { FileText, Upload, Eye, FileDown } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { type Patient } from "../types"

interface DocumentsCardProps {
  patientData: Patient
}

export function DocumentsCard({ patientData }: DocumentsCardProps) {
  // For now, we'll show a placeholder since the mock data structure might not match
  // In a real app, this would come from the patient's EHR
  const documents = [
    {
      id: "1",
      name: "Examen de Sangre - CBC",
      size: "2.3 MB",
      uploadedAt: "2024-11-15"
    },
    {
      id: "2",
      name: "Radiografía de Tórax",
      size: "5.1 MB",
      uploadedAt: "2024-10-20"
    }
  ]

  return (
    <Card className="border-main-200 dark:border-main-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary dark:text-main-400">
          <FileText className="w-5 h-5" />
          Documentos Adjuntos - {patientData.firstName} {patientData.lastName}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border-2 border-dashed border-main-300 dark:border-main-700 rounded-lg p-8 text-center">
          <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
          <p className="text-muted-foreground">Arrastre archivos aquí o haga clic para subir</p>
          <Button
            variant="outline"
            className="mt-2 border-primary text-primary hover:bg-main-50 dark:border-main-400 dark:text-main-400 bg-transparent"
          >
            Seleccionar Archivos
          </Button>
        </div>
        <div className="space-y-2">
          {documents.map((document) => (
            <div key={document.id} className="flex items-center justify-between p-3 border rounded-lg border-main-200 dark:border-main-800">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-primary dark:text-main-400" />
                <div>
                  <p className="font-medium">{document.name}</p>
                  <p className="text-sm text-muted-foreground">{document.size} • Subido {document.uploadedAt}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm">
                  <Eye className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <FileDown className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
