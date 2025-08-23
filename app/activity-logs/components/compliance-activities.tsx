"use client"

import { format } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, CheckCircle } from "lucide-react"
import { ActivityLog } from "../mocks/activity-logs-data"

interface ComplianceActivitiesProps {
  activityLogs: ActivityLog[]
}

export function ComplianceActivities({ activityLogs }: ComplianceActivitiesProps) {
  const complianceLogs = activityLogs
    .filter((log) => log.category === "compliance")
    .slice(0, 5)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-green-600" />
          Actividades de Cumplimiento
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {complianceLogs.map((log) => (
            <div key={log.id} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
              <div className="w-8 h-8 bg-green-500/10 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-green-900">{log.action}</p>
                <p className="text-sm text-green-700">{log.description}</p>
                <p className="text-xs text-green-600 mt-1">
                  {log.user} • {format(new Date(log.timestamp), "dd/MM/yyyy HH:mm")}
                </p>
              </div>
            </div>
          ))}
          {complianceLogs.length === 0 && (
            <p className="text-center text-muted-foreground py-4">No hay actividades de cumplimiento recientes</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
