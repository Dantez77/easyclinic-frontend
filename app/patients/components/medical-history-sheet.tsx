"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Stethoscope, Activity, TestTube, FileText, Calendar, Clock, ChevronDown } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { mockMedicalHistory } from "../mocks/patients-data"
import type { Patient } from "../mocks/patients-data"

interface MedicalHistorySheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  viewingHistory: string | null
  historyActiveTab: string
  onHistoryTabChange: (tab: string) => void
  patients: Patient[]
}

export function MedicalHistorySheet({
  open,
  onOpenChange,
  viewingHistory,
  historyActiveTab,
  onHistoryTabChange,
  patients,
}: MedicalHistorySheetProps) {
  if (!viewingHistory || !mockMedicalHistory[viewingHistory]) return null

  const patient = patients.find((p) => p.id === viewingHistory)
  const history = mockMedicalHistory[viewingHistory]

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-4xl">
        <SheetHeader>
          <SheetTitle>Historial Médico</SheetTitle>
          {patient && (
            <p className="text-sm text-muted-foreground">
              {patient.name} {patient.lastName}
            </p>
          )}
        </SheetHeader>
        <div className="mt-6 h-full">
          <div className="flex flex-wrap gap-2 mb-6 border-b">
            <Button
              variant={historyActiveTab === "consultations" ? "default" : "ghost"}
              size="sm"
              onClick={() => onHistoryTabChange("consultations")}
              className="rounded-b-none"
            >
              <Stethoscope className="w-4 h-4 mr-2" />
              Consultas ({history.consultations.length})
            </Button>
            <Button
              variant={historyActiveTab === "procedures" ? "default" : "ghost"}
              size="sm"
              onClick={() => onHistoryTabChange("procedures")}
              className="rounded-b-none"
            >
              <Activity className="w-4 h-4 mr-2" />
              Procedimientos ({history.procedures.length})
            </Button>
            <Button
              variant={historyActiveTab === "labs" ? "default" : "ghost"}
              size="sm"
              onClick={() => onHistoryTabChange("labs")}
              className="rounded-b-none"
            >
              <TestTube className="w-4 h-4 mr-2" />
              Laboratorios ({history.labTests.length})
            </Button>
            <Button
              variant={historyActiveTab === "documents" ? "default" : "ghost"}
              size="sm"
              onClick={() => onHistoryTabChange("documents")}
              className="rounded-b-none"
            >
              <FileText className="w-4 h-4 mr-2" />
              Documentos ({history.documents.length})
            </Button>
            <Button
              variant={historyActiveTab === "appointments" ? "default" : "ghost"}
              size="sm"
              onClick={() => onHistoryTabChange("appointments")}
              className="rounded-b-none"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Citas ({history.appointments.length})
            </Button>
          </div>

          <ScrollArea className="h-[calc(100vh-200px)]">
            {/* Consultations Tab */}
            {historyActiveTab === "consultations" && (
              <div className="space-y-4">
                {history.consultations.map((consultation) => (
                  <Card key={consultation.id}>
                    <CardContent className="p-4">
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline">{consultation.status}</Badge>
                            <span className="text-sm text-muted-foreground">
                              {format(new Date(consultation.date), "dd/MM/yyyy", { locale: es })}
                            </span>
                          </div>
                          <h4 className="font-medium text-foreground mb-1">{consultation.reason}</h4>
                          <p className="text-sm text-muted-foreground mb-2">Dr. {consultation.doctor}</p>

                          <Collapsible>
                            <CollapsibleTrigger className="flex items-center gap-2 text-sm text-primary hover:text-blue-700">
                              Ver detalles <ChevronDown className="w-4 h-4" />
                            </CollapsibleTrigger>
                            <CollapsibleContent className="mt-3 space-y-2">
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
                            </CollapsibleContent>
                          </Collapsible>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Procedures Tab */}
            {historyActiveTab === "procedures" && (
              <div className="space-y-4">
                {history.procedures.map((procedure) => (
                  <Card key={procedure.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-medium text-foreground">{procedure.procedure}</h4>
                          <p className="text-sm text-muted-foreground">Dr. {procedure.doctor}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline">{procedure.status}</Badge>
                          <p className="text-sm text-muted-foreground mt-1">
                            {format(new Date(procedure.date), "dd/MM/yyyy", { locale: es })}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <span className="text-sm font-medium text-foreground">Resultados:</span>
                          <p className="text-sm text-muted-foreground">{procedure.results}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-foreground">Notas:</span>
                          <p className="text-sm text-muted-foreground">{procedure.notes}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Lab Tests Tab */}
            {historyActiveTab === "labs" && (
              <div className="space-y-4">
                {history.labTests.map((lab) => (
                  <Card key={lab.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-medium text-foreground">{lab.test}</h4>
                          <p className="text-sm text-muted-foreground">Solicitado por: Dr. {lab.doctor}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline">{lab.status}</Badge>
                          <p className="text-sm text-muted-foreground mt-1">
                            {format(new Date(lab.date), "dd/MM/yyyy", { locale: es })}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <span className="text-sm font-medium text-foreground">Resultado General:</span>
                          <p className="text-sm text-muted-foreground">{lab.results}</p>
                        </div>
                        <Collapsible>
                          <CollapsibleTrigger className="flex items-center gap-2 text-sm text-primary hover:text-blue-700">
                            Ver valores detallados <ChevronDown className="w-4 h-4" />
                          </CollapsibleTrigger>
                          <CollapsibleContent className="mt-3">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-3 bg-muted rounded-lg">
                              {Object.entries(lab.values).map(([key, value]) => (
                                <div key={key} className="flex justify-between text-sm">
                                  <span className="text-foreground">{key}:</span>
                                  <span className="font-medium">{value}</span>
                                </div>
                              ))}
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Documents Tab */}
            {historyActiveTab === "documents" && (
              <div className="space-y-4">
                {history.documents.map((document) => (
                  <Card key={document.id}>
                    <CardContent className="p-4">
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
                            <FileText className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Appointments Tab */}
            {historyActiveTab === "appointments" && (
              <div className="space-y-4">
                {history.appointments.map((appointment) => (
                  <Card key={appointment.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium text-foreground">{appointment.reason}</h4>
                          <p className="text-sm text-muted-foreground">Dr. {appointment.doctor}</p>
                          <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            <span>{format(new Date(appointment.date), "dd/MM/yyyy", { locale: es })}</span>
                            <Clock className="w-4 h-4 ml-2" />
                            <span>{appointment.time}</span>
                          </div>
                        </div>
                        <Badge
                          variant={
                            appointment.status === "Completada"
                              ? "default"
                              : appointment.status === "Programada"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {appointment.status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  )
}
