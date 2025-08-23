"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { format } from "date-fns"
import {
  Activity,
  Download,
  RefreshCw,
} from "lucide-react"

// Import mock data
import { 
  mockActivityLogs, 
  mockUserActivity, 
  mockSystemMetrics, 
  mockFailedLogins,
  type ActivityLog 
} from "./mocks/activity-logs-data"

// Import custom hook
import { useActivityLogs } from "./hooks/use-activity-logs"

// Import components
import { ActivityLogsTable } from "./components/activity-logs-table"
import { ActivityFilters } from "./components/activity-filters"
import { DashboardMetrics } from "./components/dashboard-metrics"
import { LogDetailSheet } from "./components/log-detail-sheet"
import { ActivityByModule } from "./components/activity-by-module"
import { CriticalActivities } from "./components/critical-activities"
import { SecurityEvents } from "./components/security-events"
import { FailedLogins } from "./components/failed-logins"
import { ComplianceActivities } from "./components/compliance-activities"
import { UserActivity } from "./components/user-activity"

// Import utilities
import { getModuleIcon } from "./utils/icons"

export default function ActivityLogsPage() {
  const [activeTab, setActiveTab] = useState("logs")
  const [isViewSheetOpen, setIsViewSheetOpen] = useState(false)
  const [viewingLog, setViewingLog] = useState<ActivityLog | null>(null)

  // Use custom hook for activity logs management
  const {
    searchTerm,
    setSearchTerm,
    moduleFilter,
    setModuleFilter,
    severityFilter,
    setSeverityFilter,
    categoryFilter,
    setCategoryFilter,
    userFilter,
    setUserFilter,
    dateRange,
    setDateRange,
    selectedLogs,
    setSelectedLogs,
    currentPage,
    setCurrentPage,
    modules,
    users,
    categories,
    filteredLogs,
    paginatedLogs,
    totalPages,
    handleSelectAll,
    handleSelectLog,
  } = useActivityLogs({ activityLogs: mockActivityLogs })

  const handleExport = () => {
    // BACKEND: Generate and download activity logs report
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Timestamp,Module,Action,User,Patient,Severity,Description\n" +
      filteredLogs
        .map(
          (log) =>
            `${log.timestamp},${log.module},${log.action},${log.user},${log.patientName || "N/A"},${log.severity},${log.description}`,
        )
        .join("\n")

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `activity_logs_${format(new Date(), "yyyy-MM-dd")}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleViewLog = (log: ActivityLog) => {
    setViewingLog(log)
    setIsViewSheetOpen(true)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-main-200 dark:border-main-800 p-4 lg:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Activity className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-xl lg:text-2xl font-bold text-foreground">Registro de Actividades</h1>
                <p className="text-sm lg:text-base text-muted-foreground">
                  {filteredLogs.length} actividad{filteredLogs.length !== 1 ? "es" : ""} registrada
                  {filteredLogs.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleExport} variant="outline" className="bg-transparent">
                <Download className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Exportar</span>
              </Button>
              <Button variant="outline" className="bg-transparent">
                <RefreshCw className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Actualizar</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-4 lg:p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
            <TabsTrigger value="logs">Registros</TabsTrigger>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="users">Usuarios</TabsTrigger>
            <TabsTrigger value="security">Seguridad</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* System Metrics */}
            <DashboardMetrics metrics={mockSystemMetrics} />

            {/* Activity by Module */}
            <ActivityByModule 
              activityLogs={mockActivityLogs}
              modules={modules}
              todayActivities={mockSystemMetrics.todayActivities}
            />

            {/* Recent Critical Activities */}
            <CriticalActivities activityLogs={mockActivityLogs} />
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <UserActivity userActivity={mockUserActivity} />
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Security Events */}
              <SecurityEvents activityLogs={mockActivityLogs} />

              {/* Failed Login Attempts */}
              <FailedLogins failedLogins={mockFailedLogins} />
            </div>

            {/* Compliance Activities */}
            <ComplianceActivities activityLogs={mockActivityLogs} />
          </TabsContent>

          {/* Logs Tab */}
          <TabsContent value="logs" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardContent className="p-4">
                <ActivityFilters
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                  moduleFilter={moduleFilter}
                  onModuleFilterChange={setModuleFilter}
                  severityFilter={severityFilter}
                  onSeverityFilterChange={setSeverityFilter}
                  categoryFilter={categoryFilter}
                  onCategoryFilterChange={setCategoryFilter}
                  userFilter={userFilter}
                  onUserFilterChange={setUserFilter}
                  dateRange={dateRange}
                  onDateRangeChange={setDateRange}
                  modules={modules}
                  users={users}
                  categories={categories}
                />
              </CardContent>
            </Card>

            {/* Bulk Actions */}
            {selectedLogs.length > 0 && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {selectedLogs.length} registro{selectedLogs.length !== 1 ? "s" : ""} seleccionado
                      {selectedLogs.length !== 1 ? "s" : ""}
                    </span>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="bg-transparent">
                        <Download className="w-4 h-4 mr-2" />
                        Exportar Seleccionados
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Activity Logs Table */}
            <Card>
              <CardContent className="p-0">
                <ActivityLogsTable
                  logs={paginatedLogs}
                  selectedLogs={selectedLogs}
                  onSelectAll={handleSelectAll}
                  onSelectLog={handleSelectLog}
                  onViewLog={handleViewLog}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  itemsPerPage={15}
                  totalLogs={filteredLogs.length}
                  onPageChange={setCurrentPage}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Log Detail Sheet */}
      <LogDetailSheet
        isOpen={isViewSheetOpen}
        onOpenChange={setIsViewSheetOpen}
        log={viewingLog}
      />
    </div>
  )
}
