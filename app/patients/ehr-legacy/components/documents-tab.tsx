"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Eye, FileDown } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import type { PatientEHR } from "../mocks/patient-data"

interface DocumentsTabProps {
  patientData: PatientEHR
}

export function DocumentsTab({ patientData }: DocumentsTabProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Documentos Adjuntos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {patientData.documents.map((document) => (
              <div key={document.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">{document.name}</h4>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Badge variant="secondary" className="text-xs">
                          {document.type}
                        </Badge>
                        <span>{document.size}</span>
                        <span>•</span>
                        <span>{format(new Date(document.date), "dd/MM/yyyy", { locale: es })}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Subido por: {document.uploadedBy}</p>
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
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
