"use client"

import { Button } from "@/components/ui/button"
import { FileText, Printer, Download } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface PatientHeaderProps {
  patientName: string
  patientId: string
  onPrint: () => void
  onExportPDF: () => void
}

export function PatientHeader({ patientName, patientId, onPrint, onExportPDF }: PatientHeaderProps) {
  return (
    <>
      {/* Screen Header */}
      <div className="bg-card border-b border-main-200 dark:border-main-800 p-4 lg:p-6 print:hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-xl lg:text-2xl font-bold text-foreground">Expediente Médico Electrónico</h1>
                <p className="text-sm lg:text-base text-muted-foreground">
                  {patientName} - {patientId}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={onPrint} variant="outline" className="bg-transparent">
                <Printer className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Imprimir</span>
              </Button>
              <Button onClick={onExportPDF} variant="outline" className="bg-transparent">
                <Download className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Exportar </span>PDF
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Print Header - Only visible when printing */}
      <div className="hidden print:block p-6 border-b">
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold">EXPEDIENTE MÉDICO ELECTRÓNICO</h1>
          <p className="text-muted-foreground">Centro Médico - Sistema de Salud</p>
        </div>
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold">{patientName}</h2>
            <p>ID: {patientId}</p>
          </div>
          <div className="text-right">
            <p>Fecha de impresión: {format(new Date(), "dd/MM/yyyy HH:mm", { locale: es })}</p>
          </div>
        </div>
      </div>
    </>
  )
}
