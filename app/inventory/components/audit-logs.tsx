"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { History } from "lucide-react"

interface AuditLogsProps {
  auditLogs: any[]
}

export function AuditLogs({ auditLogs }: AuditLogsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="w-5 h-5" />
          Registro de Auditoría
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {auditLogs.map((log) => (
            <div key={log.id} className="flex items-start gap-4 p-4 border rounded-lg">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <History className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium text-foreground">{log.action}</h4>
                    <p className="text-sm text-muted-foreground">{log.itemName}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {log.previousValue} → {log.newValue}
                    </p>
                    {log.reason && <p className="text-xs text-muted-foreground">Razón: {log.reason}</p>}
                  </div>
                  <div className="text-right text-xs text-muted-foreground">
                    <p>{log.user}</p>
                    <p>{log.timestamp}</p>
                    <Badge variant="outline" className="mt-1">
                      {log.department}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
