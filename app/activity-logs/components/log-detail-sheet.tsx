"use client"

import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { ActivityLog } from "../mocks/activity-logs-data"
import { getModuleIcon, getSeverityColor, getSeverityIcon, getCategoryColor } from "../utils/icons"

interface LogDetailSheetProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  log: ActivityLog | null
}

export function LogDetailSheet({ isOpen, onOpenChange, log }: LogDetailSheetProps) {
  if (!log) return null

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl">
        <SheetHeader>
          <SheetTitle>Detalle de Actividad</SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-120px)] pr-4">
          <div className="space-y-6 pb-8 pr-2">
            {/* Activity Header */}
            <div className="border-b pb-4">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  {getModuleIcon(log.module)}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{log.action}</h3>
                  <p className="text-sm text-muted-foreground">{log.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant={getSeverityColor(log.severity)} className="flex items-center gap-1">
                      {getSeverityIcon(log.severity)}
                      {log.severity}
                    </Badge>
                    <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(log.category)}`}>
                      {log.category}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Basic Information */}
            <div>
              <h4 className="font-medium text-foreground mb-3">Información Básica</h4>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-muted-foreground">ID de Registro:</span>
                    <p className="font-medium font-mono text-sm">{log.id}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Módulo:</span>
                    <p className="font-medium">{log.module}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-muted-foreground">Fecha y Hora:</span>
                    <p className="font-medium">
                      {format(new Date(log.timestamp), "dd/MM/yyyy HH:mm:ss", { locale: es })}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Categoría:</span>
                    <p className="font-medium capitalize">{log.category}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* User Information */}
            <div>
              <h4 className="font-medium text-foreground mb-3">Información del Usuario</h4>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-muted-foreground">Usuario:</span>
                    <p className="font-medium">{log.user}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Rol:</span>
                    <p className="font-medium">{log.userRole}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-muted-foreground">Dirección IP:</span>
                    <p className="font-medium font-mono text-sm">{log.ipAddress}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Navegador:</span>
                    <p className="font-medium text-sm truncate" title={log.userAgent}>
                      {log.userAgent.split(" ")[0]}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Patient Information */}
            {log.patientId && (
              <div>
                <h4 className="font-medium text-foreground mb-3">Información del Paciente</h4>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-muted-foreground">Nombre:</span>
                      <p className="font-medium">{log.patientName}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">ID del Paciente:</span>
                      <p className="font-medium font-mono text-sm">{log.patientId}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Activity Details */}
            {log.details && Object.keys(log.details).length > 0 && (
              <div>
                <h4 className="font-medium text-foreground mb-3">Detalles de la Actividad</h4>
                <div className="space-y-2">
                  {Object.entries(log.details).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b border-main-200 dark:border-main-800 last:border-b-0">
                      <span className="text-sm text-muted-foreground capitalize">
                        {key.replace(/([A-Z])/g, " $1").trim()}:
                      </span>
                      <span className="text-sm font-medium text-right max-w-xs truncate" title={String(value)}>
                        {typeof value === "boolean" ? (value ? "Sí" : "No") : String(value)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Changes Made */}
            {log.changes && log.changes.length > 0 && (
              <div>
                <h4 className="font-medium text-foreground mb-3">Cambios Realizados</h4>
                <div className="space-y-3">
                  {log.changes.map((change, index) => (
                    <div key={index} className="p-3 bg-muted rounded-lg">
                      <div className="font-medium text-sm text-foreground mb-2">{change.field}</div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Antes:</span>
                          <p className="font-medium text-red-600">{change.before || "N/A"}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Después:</span>
                          <p className="font-medium text-green-600">{change.after}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Technical Information */}
            <div>
              <h4 className="font-medium text-foreground mb-3">Información Técnica</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between py-2 border-b border-main-200 dark:border-main-800">
                  <span className="text-muted-foreground">User Agent:</span>
                  <span className="font-mono text-xs max-w-xs truncate" title={log.userAgent}>
                    {log.userAgent}
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Timestamp:</span>
                  <span className="font-mono text-xs">{log.timestamp}</span>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
