"use client"

import { Card, CardContent } from "@/components/ui/card"
import { BarChart3, TrendingUp, AlertTriangle, Users, Lock, Database } from "lucide-react"

interface SystemMetrics {
  totalActivities: number
  todayActivities: number
  criticalAlerts: number
  failedLogins: number
  activeUsers: number
  systemUptime: string
}

interface DashboardMetricsProps {
  metrics: SystemMetrics
}

export function DashboardMetrics({ metrics }: DashboardMetricsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Actividades Totales</p>
              <p className="text-2xl font-bold text-primary">{metrics.totalActivities}</p>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Actividades Hoy</p>
              <p className="text-2xl font-bold text-green-600">{metrics.todayActivities}</p>
            </div>
            <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Alertas Críticas</p>
              <p className="text-2xl font-bold text-red-600">{metrics.criticalAlerts}</p>
            </div>
            <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Usuarios Activos</p>
              <p className="text-2xl font-bold text-purple-600">{metrics.activeUsers}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Intentos Fallidos</p>
              <p className="text-2xl font-bold text-orange-600">{metrics.failedLogins}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <Lock className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Tiempo de Actividad</p>
              <p className="text-2xl font-bold text-teal-600">{metrics.systemUptime}</p>
            </div>
            <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
              <Database className="w-6 h-6 text-teal-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
