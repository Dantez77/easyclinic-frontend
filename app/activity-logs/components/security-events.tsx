"use client"

import { format } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Lock, Unlock } from "lucide-react"
import { ActivityLog } from "../mocks/activity-logs-data"

interface SecurityEventsProps {
  activityLogs: ActivityLog[]
}

export function SecurityEvents({ activityLogs }: SecurityEventsProps) {
  const securityLogs = activityLogs
    .filter((log) => log.category === "security")
    .slice(0, 5)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-red-600" />
          Eventos de Seguridad
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {securityLogs.map((log) => (
            <div key={log.id} className="flex items-start gap-3 p-3 border rounded-lg">
              <div className="w-8 h-8 bg-red-500/10 rounded-full flex items-center justify-center flex-shrink-0">
                {log.action.includes("Bloqueado") ? (
                  <Lock className="w-4 h-4 text-red-600" />
                ) : (
                  <Unlock className="w-4 h-4 text-green-600" />
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">{log.action}</p>
                <p className="text-xs text-muted-foreground">{log.description}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  IP: {log.ipAddress} • {format(new Date(log.timestamp), "dd/MM HH:mm")}
                </p>
              </div>
            </div>
          ))}
          {securityLogs.length === 0 && (
            <p className="text-center text-muted-foreground py-4">No hay eventos de seguridad recientes</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
