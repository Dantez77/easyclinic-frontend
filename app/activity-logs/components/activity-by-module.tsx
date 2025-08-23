"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ActivityLog } from "../mocks/activity-logs-data"
import { getModuleIcon } from "../utils/icons"

interface ActivityByModuleProps {
  activityLogs: ActivityLog[]
  modules: string[]
  todayActivities: number
}

export function ActivityByModule({ activityLogs, modules, todayActivities }: ActivityByModuleProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Actividad por Módulo (Últimas 24 horas)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {modules.map((module) => {
            const moduleActivities = activityLogs.filter((log) => log.module === module)
            const todayModuleActivities = moduleActivities.filter((log) => {
              const logDate = new Date(log.timestamp)
              const today = new Date()
              return logDate.toDateString() === today.toDateString()
            })
            const percentage = (todayModuleActivities.length / todayActivities) * 100

            return (
              <div key={module} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getModuleIcon(module)}
                  <div>
                    <p className="font-medium">{module}</p>
                    <p className="text-sm text-muted-foreground">{todayModuleActivities.length} actividades</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-2 bg-muted rounded-full">
                    <div className="h-2 bg-blue-600 rounded-full" style={{ width: `${percentage}%` }}></div>
                  </div>
                  <span className="text-xs text-muted-foreground w-12">{percentage.toFixed(1)}%</span>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
