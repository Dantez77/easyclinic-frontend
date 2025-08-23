"use client"

import { format } from "date-fns"
import { Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { ActivityLog } from "../mocks/activity-logs-data"
import { getModuleIcon, getSeverityColor, getSeverityIcon, getCategoryColor } from "../utils/icons"

interface ActivityLogsTableProps {
  logs: ActivityLog[]
  selectedLogs: string[]
  onSelectAll: (checked: boolean) => void
  onSelectLog: (logId: string, checked: boolean) => void
  onViewLog: (log: ActivityLog) => void
  currentPage: number
  totalPages: number
  itemsPerPage: number
  totalLogs: number
  onPageChange: (page: number) => void
}

export function ActivityLogsTable({
  logs,
  selectedLogs,
  onSelectAll,
  onSelectLog,
  onViewLog,
  currentPage,
  totalPages,
  itemsPerPage,
  totalLogs,
  onPageChange,
}: ActivityLogsTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-muted border-b">
          <tr>
            <th className="p-4 text-left">
              <Checkbox
                checked={selectedLogs.length === logs.length && logs.length > 0}
                onCheckedChange={onSelectAll}
              />
            </th>
            <th className="p-4 text-left text-sm font-medium text-foreground">Actividad</th>
            <th className="p-4 text-left text-sm font-medium text-foreground hidden md:table-cell">
              Usuario
            </th>
            <th className="p-4 text-left text-sm font-medium text-foreground hidden lg:table-cell">
              Paciente
            </th>
            <th className="p-4 text-left text-sm font-medium text-foreground hidden sm:table-cell">
              Severidad
            </th>
            <th className="p-4 text-left text-sm font-medium text-foreground hidden lg:table-cell">Fecha</th>
            <th className="p-4 text-left text-sm font-medium text-foreground">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {logs.map((log) => (
            <tr key={log.id} className="hover:bg-muted">
              <td className="p-4">
                <Checkbox
                  checked={selectedLogs.includes(log.id)}
                  onCheckedChange={(checked) => onSelectLog(log.id, checked as boolean)}
                />
              </td>
              <td className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    {getModuleIcon(log.module)}
                  </div>
                  <div>
                    <div className="font-medium text-foreground">{log.action}</div>
                    <div className="text-sm text-muted-foreground line-clamp-2">{log.description}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(log.category)}`}>
                        {log.category}
                      </span>
                      <span className="text-xs text-muted-foreground">{log.module}</span>
                    </div>
                    <div className="text-xs text-muted-foreground md:hidden mt-1">
                      {log.user} • {format(new Date(log.timestamp), "dd/MM HH:mm")}
                    </div>
                  </div>
                </div>
              </td>
              <td className="p-4 hidden md:table-cell">
                <div className="text-sm">
                  <div className="font-medium text-foreground">{log.user}</div>
                  <div className="text-muted-foreground">{log.userRole}</div>
                </div>
              </td>
              <td className="p-4 hidden lg:table-cell">
                {log.patientName ? (
                  <div className="text-sm">
                    <div className="font-medium text-foreground">{log.patientName}</div>
                    <div className="text-muted-foreground">{log.patientId}</div>
                  </div>
                ) : (
                  <span className="text-muted-foreground">N/A</span>
                )}
              </td>
              <td className="p-4 hidden sm:table-cell">
                <Badge variant={getSeverityColor(log.severity)} className="flex items-center gap-1 w-fit">
                  {getSeverityIcon(log.severity)}
                  {log.severity}
                </Badge>
              </td>
              <td className="p-4 hidden lg:table-cell">
                <div className="text-sm text-foreground">{format(new Date(log.timestamp), "dd/MM/yyyy")}</div>
                <div className="text-xs text-muted-foreground">{format(new Date(log.timestamp), "HH:mm:ss")}</div>
              </td>
              <td className="p-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onViewLog(log)}
                  className="h-8 w-8 p-0"
                >
                  <Eye className="w-4 h-4" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between p-4 border-t">
          <div className="text-sm text-muted-foreground">
            Mostrando {(currentPage - 1) * itemsPerPage + 1} a{" "}
            {Math.min(currentPage * itemsPerPage, totalLogs)} de {totalLogs} registros
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="bg-transparent"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Button>
            <span className="text-sm">
              Página {currentPage} de {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="bg-transparent"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
