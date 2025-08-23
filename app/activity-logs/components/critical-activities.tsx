"use client"

import { format } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle } from "lucide-react"
import { ActivityLog } from "../mocks/activity-logs-data"
import { getSeverityIcon } from "../utils/icons"

interface CriticalActivitiesProps {
  activityLogs: ActivityLog[]
}

export function CriticalActivities({ activityLogs }: CriticalActivitiesProps) {
  const criticalLogs = activityLogs
    .filter((log) => log.severity === "critical" || log.severity === "error")
    .slice(0, 5)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-red-600" />
          Actividades Críticas Recientes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {criticalLogs.map((log) => (
            <div key={log.id} className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
              <div className="w-8 h-8 bg-red-500/10 rounded-full flex items-center justify-center flex-shrink-0">
                {getSeverityIcon(log.severity)}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-red-900">{log.action}</p>
                    <p className="text-sm text-red-700">{log.description}</p>
                    <p className="text-xs text-red-600 mt-1">
                      {log.user} • {format(new Date(log.timestamp), "dd/MM/yyyy HH:mm")}
                    </p>
                  </div>
                  <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                    {log.severity}
                  </span>
                </div>
              </div>
            </div>
          ))}
          {criticalLogs.length === 0 && (
            <p className="text-center text-muted-foreground py-4">No hay actividades críticas recientes</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
