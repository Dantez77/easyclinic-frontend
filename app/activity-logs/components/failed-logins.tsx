"use client"

import { format } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle } from "lucide-react"

interface FailedLogin {
  ip: string
  attempts: number
  lastAttempt: string
}

interface FailedLoginsProps {
  failedLogins: FailedLogin[]
}

export function FailedLogins({ failedLogins }: FailedLoginsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-orange-600" />
          Intentos de Acceso Fallidos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {failedLogins.map((attempt, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
              <div>
                <p className="font-medium text-orange-900">IP: {attempt.ip}</p>
                <p className="text-sm text-orange-700">{attempt.attempts} intentos fallidos</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-orange-600">
                  {format(new Date(attempt.lastAttempt), "dd/MM HH:mm")}
                </p>
              </div>
            </div>
          ))}
          {failedLogins.length === 0 && (
            <p className="text-center text-muted-foreground py-4">No hay intentos de acceso fallidos recientes</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
