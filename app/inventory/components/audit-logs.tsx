"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { History } from "lucide-react"

interface AuditLogsProps {
  auditLogs: any[]
}

// Helper function to get user-friendly action names
function getActionDisplayName(action: string): string {
  const actionMap: Record<string, string> = {
    'CREATED': '✅ Artículo Creado',
    'UPDATED': '✏️ Artículo Actualizado',
    'DELETED': '🗑️ Artículo Eliminado',
    'STOCK_ADDED': '📈 Stock Agregado',
    'STOCK_REMOVED': '📉 Stock Retirado',
    'STOCK_SET': '🎯 Stock Establecido',
    'BULK_STOCK_ADDED': '📈 Stock Agregado (Lote)',
    'BULK_STOCK_REMOVED': '📉 Stock Retirado (Lote)',
    'BULK_STOCK_SET': '🎯 Stock Establecido (Lote)',
    'STOCK_UPDATE': '📊 Stock Actualizado', // Fallback
    'BULK_STOCK_UPDATE': '📊 Stock Actualizado (Lote)' // Fallback
  };
  
  return actionMap[action] || action;
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
                    <h4 className="font-medium text-foreground">{getActionDisplayName(log.action)}</h4>
                    <p className="text-sm text-muted-foreground">{log.itemName}</p>
                    {log.previousValue && log.newValue && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {log.action.includes('STOCK_') || log.action.includes('BULK_STOCK_') 
                          ? `Stock: ${log.previousValue} → ${log.newValue} unidades`
                          : `${log.previousValue} → ${log.newValue}`
                        }
                      </p>
                    )}
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
