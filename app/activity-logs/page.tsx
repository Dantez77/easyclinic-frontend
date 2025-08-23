"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import {
  Activity,
  Search,
  Download,
  Eye,
  CalendarIcon,
  User,
  UserPlus,
  FileText,
  Stethoscope,
  DollarSign,
  Package,
  Shield,
  AlertTriangle,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  Users,
  TrendingUp,
  Database,
  Settings,
  Lock,
  Unlock,
  RefreshCw,
} from "lucide-react"

// Mock activity logs data
const mockActivityLogs = [
  {
    id: "LOG-001",
    timestamp: "2024-11-15 14:30:25",
    module: "Consulta Médica",
    action: "Consulta Completada",
    description: "Consulta médica completada para paciente María Elena González",
    user: "Dr. Juan Pérez",
    userRole: "Médico",
    patientId: "EXP-2024-001234",
    patientName: "María Elena González",
    ipAddress: "192.168.1.45",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    severity: "info",
    category: "clinical",
    details: {
      consultationId: "CONS-001",
      diagnosis: "Cefalea tensional",
      treatment: "Acetaminofén 500mg c/8h x 5 días",
      duration: "45 minutos",
    },
    changes: [
      { field: "Estado", before: "En Progreso", after: "Completada" },
      { field: "Diagnóstico", before: "", after: "Cefalea tensional" },
      { field: "Tratamiento", before: "", after: "Acetaminofén 500mg c/8h x 5 días" },
    ],
  },
  {
    id: "LOG-002",
    timestamp: "2024-11-15 14:15:10",
    module: "Registro de Pacientes",
    action: "Paciente Registrado",
    description: "Nuevo paciente registrado en el sistema",
    user: "Recepcionista Ana",
    userRole: "Recepcionista",
    patientId: "EXP-2024-001238",
    patientName: "Carlos Alberto Mendoza",
    ipAddress: "192.168.1.23",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    severity: "info",
    category: "administrative",
    details: {
      registrationMethod: "Manual",
      insuranceProvider: "ARS Humano",
      emergencyContact: "María Mendoza - 809-555-0199",
    },
    changes: [
      { field: "Estado", before: "", after: "Activo" },
      { field: "Seguro", before: "", after: "ARS Humano" },
    ],
  },
  {
    id: "LOG-003",
    timestamp: "2024-11-15 13:45:33",
    module: "EHR",
    action: "Historial Médico Actualizado",
    description: "Actualización del expediente médico electrónico",
    user: "Dr. Ana López",
    userRole: "Médico",
    patientId: "EXP-2024-001234",
    patientName: "María Elena González",
    ipAddress: "192.168.1.67",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
    severity: "info",
    category: "clinical",
    details: {
      section: "Alergias",
      addedAllergy: "Mariscos",
      severity: "Moderada",
    },
    changes: [{ field: "Alergias", before: "Penicilina", after: "Penicilina, Mariscos" }],
  },
  {
    id: "LOG-004",
    timestamp: "2024-11-15 13:20:15",
    module: "Facturación",
    action: "Pago Procesado",
    description: "Pago procesado exitosamente con Stripe NFC",
    user: "Cajera María",
    userRole: "Cajera",
    patientId: "EXP-2024-001235",
    patientName: "Juan Carlos Rodríguez",
    ipAddress: "192.168.1.89",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    severity: "info",
    category: "financial",
    details: {
      invoiceId: "FAC-2024-002",
      amount: 4166.0,
      paymentMethod: "Tarjeta NFC",
      stripePaymentId: "pi_1234567890",
      dteGenerated: true,
    },
    changes: [
      { field: "Estado Factura", before: "Pendiente", after: "Pagada" },
      { field: "Método de Pago", before: "", after: "Tarjeta NFC" },
    ],
  },
  {
    id: "LOG-005",
    timestamp: "2024-11-15 12:55:42",
    module: "Inventario",
    action: "Stock Actualizado",
    description: "Stock de medicamento actualizado por dispensación",
    user: "Farmacéutico Carlos",
    userRole: "Farmacéutico",
    patientId: "EXP-2024-001234",
    patientName: "María Elena González",
    ipAddress: "192.168.1.34",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    severity: "info",
    category: "inventory",
    details: {
      itemId: "INV-001",
      itemName: "Paracetamol 500mg",
      action: "Dispensado",
      quantity: 5,
      reason: "Receta médica - Consulta CONS-001",
    },
    changes: [{ field: "Stock", before: "50 Cajas", after: "45 Cajas" }],
  },
  {
    id: "LOG-006",
    timestamp: "2024-11-15 12:30:18",
    module: "Gestión de Pacientes",
    action: "Información Actualizada",
    description: "Información de contacto del paciente actualizada",
    user: "Recepcionista Ana",
    userRole: "Recepcionista",
    patientId: "EXP-2024-001236",
    patientName: "Carmen Rosa Martínez",
    ipAddress: "192.168.1.23",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    severity: "info",
    category: "administrative",
    details: {
      updatedFields: ["Teléfono", "Email"],
    },
    changes: [
      { field: "Teléfono", before: "809-555-0127", after: "809-555-0128" },
      { field: "Email", before: "carmen.martinez@email.com", after: "carmen.martinez@gmail.com" },
    ],
  },
  {
    id: "LOG-007",
    timestamp: "2024-11-15 11:45:55",
    module: "Sistema",
    action: "Inicio de Sesión",
    description: "Usuario inició sesión en el sistema",
    user: "Dr. Juan Pérez",
    userRole: "Médico",
    patientId: null,
    patientName: null,
    ipAddress: "192.168.1.45",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    severity: "info",
    category: "security",
    details: {
      loginMethod: "Credenciales",
      sessionId: "sess_abc123def456",
      location: "Consultorio 1",
    },
    changes: [],
  },
  {
    id: "LOG-008",
    timestamp: "2024-11-15 11:20:33",
    module: "Facturación",
    action: "DTE Generado",
    description: "Documento Tributario Electrónico generado y enviado a Hacienda",
    user: "Sistema",
    userRole: "Sistema",
    patientId: "EXP-2024-001234",
    patientName: "María Elena González",
    ipAddress: "192.168.1.1",
    userAgent: "Sistema Automático",
    severity: "info",
    category: "compliance",
    details: {
      dteUuid: "DTE-UUID-123456789",
      dteType: "Factura",
      haciendaStatus: "Aceptado",
      xmlGenerated: true,
      pdfGenerated: true,
    },
    changes: [{ field: "Estado DTE", before: "Pendiente", after: "Aceptado" }],
  },
  {
    id: "LOG-009",
    timestamp: "2024-11-15 10:15:22",
    module: "Inventario",
    action: "Alerta Stock Bajo",
    description: "Alerta automática generada por stock bajo",
    user: "Sistema",
    userRole: "Sistema",
    patientId: null,
    patientName: null,
    ipAddress: "192.168.1.1",
    userAgent: "Sistema Automático",
    severity: "warning",
    category: "inventory",
    details: {
      itemId: "INV-002",
      itemName: "Guantes de Látex Talla M",
      currentStock: 8,
      minThreshold: 15,
      alertType: "Stock Bajo",
    },
    changes: [{ field: "Estado", before: "Activo", after: "Stock Bajo" }],
  },
  {
    id: "LOG-010",
    timestamp: "2024-11-15 09:30:45",
    module: "EHR",
    action: "Acceso No Autorizado Bloqueado",
    description: "Intento de acceso no autorizado al expediente médico bloqueado",
    user: "Usuario Desconocido",
    userRole: "Desconocido",
    patientId: "EXP-2024-001234",
    patientName: "María Elena González",
    ipAddress: "203.45.67.89",
    userAgent: "Mozilla/5.0 (Linux; Android 10; SM-G975F) AppleWebKit/537.36",
    severity: "critical",
    category: "security",
    details: {
      attemptedAction: "Ver EHR",
      blockReason: "Sin permisos",
      securityLevel: "Alto",
    },
    changes: [],
  },
]

// Mock user activity summary
const mockUserActivity = [
  { user: "Dr. Juan Pérez", role: "Médico", actions: 45, lastActivity: "2024-11-15 14:30:25" },
  { user: "Dr. Ana López", role: "Médico", actions: 38, lastActivity: "2024-11-15 13:45:33" },
  { user: "Recepcionista Ana", role: "Recepcionista", actions: 67, lastActivity: "2024-11-15 14:15:10" },
  { user: "Farmacéutico Carlos", role: "Farmacéutico", actions: 23, lastActivity: "2024-11-15 12:55:42" },
  { user: "Cajera María", role: "Cajera", actions: 34, lastActivity: "2024-11-15 13:20:15" },
]

// Mock system metrics
const mockSystemMetrics = {
  totalActivities: 1247,
  todayActivities: 89,
  criticalAlerts: 3,
  failedLogins: 12,
  activeUsers: 15,
  systemUptime: "99.8%",
}

type ActivityLog = (typeof mockActivityLogs)[0]

export default function ActivityLogsPage() {
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(mockActivityLogs)
  const [searchTerm, setSearchTerm] = useState("")
  const [moduleFilter, setModuleFilter] = useState("all")
  const [severityFilter, setSeverityFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [userFilter, setUserFilter] = useState("all")
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  })
  const [selectedLogs, setSelectedLogs] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [activeTab, setActiveTab] = useState("logs")
  const [isViewSheetOpen, setIsViewSheetOpen] = useState(false)
  const [viewingLog, setViewingLog] = useState<ActivityLog | null>(null)

  const itemsPerPage = 15

  // Get unique values for filters
  const modules = [...new Set(activityLogs.map((log) => log.module))]
  const users = [...new Set(activityLogs.map((log) => log.user))]
  const categories = [...new Set(activityLogs.map((log) => log.category))]

  // Filter activity logs
  const filteredLogs = useMemo(() => {
    return activityLogs.filter((log) => {
      const matchesSearch =
        log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.action.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesModule = moduleFilter === "all" || log.module === moduleFilter
      const matchesSeverity = severityFilter === "all" || log.severity === severityFilter
      const matchesCategory = categoryFilter === "all" || log.category === categoryFilter
      const matchesUser = userFilter === "all" || log.user === userFilter

      const matchesDateRange = (() => {
        if (!dateRange.from && !dateRange.to) return true
        const logDate = new Date(log.timestamp)
        if (dateRange.from && dateRange.to) {
          return logDate >= dateRange.from && logDate <= dateRange.to
        }
        if (dateRange.from) {
          return logDate >= dateRange.from
        }
        if (dateRange.to) {
          return logDate <= dateRange.to
        }
        return true
      })()

      return matchesSearch && matchesModule && matchesSeverity && matchesCategory && matchesUser && matchesDateRange
    })
  }, [activityLogs, searchTerm, moduleFilter, severityFilter, categoryFilter, userFilter, dateRange])

  // Pagination
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage)
  const paginatedLogs = filteredLogs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedLogs(paginatedLogs.map((log) => log.id))
    } else {
      setSelectedLogs([])
    }
  }

  const handleSelectLog = (logId: string, checked: boolean) => {
    if (checked) {
      setSelectedLogs([...selectedLogs, logId])
    } else {
      setSelectedLogs(selectedLogs.filter((id) => id !== logId))
    }
  }

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

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "info":
        return "default"
      case "warning":
        return "secondary"
      case "error":
        return "destructive"
      case "critical":
        return "destructive"
      default:
        return "outline"
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "info":
        return <CheckCircle className="w-4 h-4" />
      case "warning":
        return <AlertTriangle className="w-4 h-4" />
      case "error":
        return <AlertTriangle className="w-4 h-4" />
      case "critical":
        return <AlertTriangle className="w-4 h-4" />
      default:
        return <Activity className="w-4 h-4" />
    }
  }

  const getModuleIcon = (module: string) => {
    switch (module) {
      case "Registro de Pacientes":
        return <UserPlus className="w-4 h-4" />
      case "Gestión de Pacientes":
        return <Users className="w-4 h-4" />
      case "Consulta Médica":
        return <Stethoscope className="w-4 h-4" />
      case "EHR":
        return <FileText className="w-4 h-4" />
      case "Facturación":
        return <DollarSign className="w-4 h-4" />
      case "Inventario":
        return <Package className="w-4 h-4" />
      case "Sistema":
        return <Settings className="w-4 h-4" />
      default:
        return <Activity className="w-4 h-4" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "clinical":
        return "bg-primary/10 text-blue-800"
      case "administrative":
        return "bg-green-500/10 text-green-800"
      case "financial":
        return "bg-yellow-500/10 text-yellow-800"
      case "inventory":
        return "bg-purple-100 text-purple-800"
      case "security":
        return "bg-red-500/10 text-red-800"
      case "compliance":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-muted text-foreground"
    }
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Actividades Totales</p>
                      <p className="text-2xl font-bold text-primary">{mockSystemMetrics.totalActivities}</p>
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
                      <p className="text-2xl font-bold text-green-600">{mockSystemMetrics.todayActivities}</p>
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
                      <p className="text-2xl font-bold text-red-600">{mockSystemMetrics.criticalAlerts}</p>
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
                      <p className="text-2xl font-bold text-purple-600">{mockSystemMetrics.activeUsers}</p>
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
                      <p className="text-2xl font-bold text-orange-600">{mockSystemMetrics.failedLogins}</p>
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
                      <p className="text-2xl font-bold text-teal-600">{mockSystemMetrics.systemUptime}</p>
                    </div>
                    <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                      <Database className="w-6 h-6 text-teal-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Activity by Module */}
            <Card>
              <CardHeader>
                <CardTitle>Actividad por Módulo (Últimas 24 horas)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {modules.map((module) => {
                    const moduleActivities = activityLogs.filter((log) => log.module === module)
                    const todayActivities = moduleActivities.filter((log) => {
                      const logDate = new Date(log.timestamp)
                      const today = new Date()
                      return logDate.toDateString() === today.toDateString()
                    })
                    const percentage = (todayActivities.length / mockSystemMetrics.todayActivities) * 100

                    return (
                      <div key={module} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {getModuleIcon(module)}
                          <div>
                            <p className="font-medium">{module}</p>
                            <p className="text-sm text-muted-foreground">{todayActivities.length} actividades</p>
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

            {/* Recent Critical Activities */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  Actividades Críticas Recientes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {activityLogs
                    .filter((log) => log.severity === "critical" || log.severity === "error")
                    .slice(0, 5)
                    .map((log) => (
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
                            <Badge variant="destructive" className="text-xs">
                              {log.severity}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  {activityLogs.filter((log) => log.severity === "critical" || log.severity === "error").length ===
                    0 && <p className="text-center text-muted-foreground py-4">No hay actividades críticas recientes</p>}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Actividad por Usuario</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockUserActivity.map((user, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{user.user}</p>
                          <p className="text-sm text-muted-foreground">{user.role}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary">{user.actions} acciones</p>
                        <p className="text-xs text-muted-foreground">
                          Última: {format(new Date(user.lastActivity), "dd/MM HH:mm")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Security Events */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-red-600" />
                    Eventos de Seguridad
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {activityLogs
                      .filter((log) => log.category === "security")
                      .slice(0, 5)
                      .map((log) => (
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
                  </div>
                </CardContent>
              </Card>

              {/* Failed Login Attempts */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-orange-600" />
                    Intentos de Acceso Fallidos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {/* Mock failed login attempts */}
                    {[
                      { ip: "203.45.67.89", attempts: 5, lastAttempt: "2024-11-15 14:25:00" },
                      { ip: "192.168.1.99", attempts: 3, lastAttempt: "2024-11-15 13:15:00" },
                      { ip: "10.0.0.45", attempts: 2, lastAttempt: "2024-11-15 12:30:00" },
                    ].map((attempt, index) => (
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
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Compliance Activities */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-green-600" />
                  Actividades de Cumplimiento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {activityLogs
                    .filter((log) => log.category === "compliance")
                    .slice(0, 5)
                    .map((log) => (
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
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Logs Tab */}
          <TabsContent value="logs" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardContent className="p-4">
                <div className="space-y-4">
                  <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          placeholder="Buscar por descripción, usuario, paciente o acción..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Select value={moduleFilter} onValueChange={setModuleFilter}>
                        <SelectTrigger className="w-full sm:w-40">
                          <SelectValue placeholder="Módulo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos los módulos</SelectItem>
                          {modules.map((module) => (
                            <SelectItem key={module} value={module}>
                              {module}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select value={severityFilter} onValueChange={setSeverityFilter}>
                        <SelectTrigger className="w-full sm:w-40">
                          <SelectValue placeholder="Severidad" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todas las severidades</SelectItem>
                          <SelectItem value="info">Info</SelectItem>
                          <SelectItem value="warning">Warning</SelectItem>
                          <SelectItem value="error">Error</SelectItem>
                          <SelectItem value="critical">Critical</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                        <SelectTrigger className="w-full sm:w-40">
                          <SelectValue placeholder="Categoría" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todas las categorías</SelectItem>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Select value={userFilter} onValueChange={setUserFilter}>
                      <SelectTrigger className="w-full sm:w-48">
                        <SelectValue placeholder="Usuario" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos los usuarios</SelectItem>
                        {users.map((user) => (
                          <SelectItem key={user} value={user}>
                            {user}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full sm:w-64 justify-start text-left font-normal bg-transparent"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dateRange.from ? (
                            dateRange.to ? (
                              <>
                                {format(dateRange.from, "dd/MM/yyyy")} - {format(dateRange.to, "dd/MM/yyyy")}
                              </>
                            ) : (
                              format(dateRange.from, "dd/MM/yyyy")
                            )
                          ) : (
                            <span>Seleccionar fechas</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          initialFocus
                          mode="range"
                          defaultMonth={dateRange.from}
                          selected={dateRange}
                          onSelect={setDateRange}
                          numberOfMonths={2}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
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
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted border-b">
                    <tr>
                      <th className="p-4 text-left">
                        <Checkbox
                          checked={selectedLogs.length === paginatedLogs.length && paginatedLogs.length > 0}
                          onCheckedChange={handleSelectAll}
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
                    {paginatedLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-muted">
                        <td className="p-4">
                          <Checkbox
                            checked={selectedLogs.includes(log.id)}
                            onCheckedChange={(checked) => handleSelectLog(log.id, checked as boolean)}
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
                            onClick={() => {
                              setViewingLog(log)
                              setIsViewSheetOpen(true)
                            }}
                            className="h-8 w-8 p-0"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between p-4 border-t">
                    <div className="text-sm text-muted-foreground">
                      Mostrando {(currentPage - 1) * itemsPerPage + 1} a{" "}
                      {Math.min(currentPage * itemsPerPage, filteredLogs.length)} de {filteredLogs.length} registros
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="bg-transparent"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <span className="text-sm">
                        Página {currentPage} de {totalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="bg-transparent"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* View Log Details Sheet */}
      <Sheet open={isViewSheetOpen} onOpenChange={setIsViewSheetOpen}>
        <SheetContent className="w-full sm:max-w-2xl">
          <SheetHeader>
            <SheetTitle>Detalle de Actividad</SheetTitle>
          </SheetHeader>
          {viewingLog && (
            <ScrollArea className="h-[calc(100vh-120px)] pr-4">
              <div className="space-y-6 pb-8 pr-2">
                {/* Activity Header */}
                <div className="border-b pb-4">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      {getModuleIcon(viewingLog.module)}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">{viewingLog.action}</h3>
                      <p className="text-sm text-muted-foreground">{viewingLog.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant={getSeverityColor(viewingLog.severity)} className="flex items-center gap-1">
                          {getSeverityIcon(viewingLog.severity)}
                          {viewingLog.severity}
                        </Badge>
                        <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(viewingLog.category)}`}>
                          {viewingLog.category}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Basic Information */}
                <div>
                  <h4 className="font-medium text-foreground mb-3">Información Básica</h4>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm text-muted-foreground">ID de Registro:</span>
                        <p className="font-medium font-mono text-sm">{viewingLog.id}</p>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Módulo:</span>
                        <p className="font-medium">{viewingLog.module}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm text-muted-foreground">Fecha y Hora:</span>
                        <p className="font-medium">
                          {format(new Date(viewingLog.timestamp), "dd/MM/yyyy HH:mm:ss", { locale: es })}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Categoría:</span>
                        <p className="font-medium capitalize">{viewingLog.category}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* User Information */}
                <div>
                  <h4 className="font-medium text-foreground mb-3">Información del Usuario</h4>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm text-muted-foreground">Usuario:</span>
                        <p className="font-medium">{viewingLog.user}</p>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Rol:</span>
                        <p className="font-medium">{viewingLog.userRole}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm text-muted-foreground">Dirección IP:</span>
                        <p className="font-medium font-mono text-sm">{viewingLog.ipAddress}</p>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Navegador:</span>
                        <p className="font-medium text-sm truncate" title={viewingLog.userAgent}>
                          {viewingLog.userAgent.split(" ")[0]}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Patient Information */}
                {viewingLog.patientId && (
                  <div>
                    <h4 className="font-medium text-foreground mb-3">Información del Paciente</h4>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-sm text-muted-foreground">Nombre:</span>
                          <p className="font-medium">{viewingLog.patientName}</p>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">ID del Paciente:</span>
                          <p className="font-medium font-mono text-sm">{viewingLog.patientId}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Activity Details */}
                {viewingLog.details && Object.keys(viewingLog.details).length > 0 && (
                  <div>
                    <h4 className="font-medium text-foreground mb-3">Detalles de la Actividad</h4>
                    <div className="space-y-2">
                      {Object.entries(viewingLog.details).map(([key, value]) => (
                        <div key={key} className="flex justify-between py-2 border-b border-main-200 dark:border-main-800 last:border-b-0">
                          <span className="text-sm text-muted-foreground capitalize">
                            {key.replace(/([A-Z])/g, " $1").trim()}:
                          </span>
                          <span className="text-sm font-medium text-right max-w-xs truncate" title={String(value)}>
                            {typeof value === "boolean" ? (value ? "Sí" : "No") : String(value)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Changes Made */}
                {viewingLog.changes && viewingLog.changes.length > 0 && (
                  <div>
                    <h4 className="font-medium text-foreground mb-3">Cambios Realizados</h4>
                    <div className="space-y-3">
                      {viewingLog.changes.map((change, index) => (
                        <div key={index} className="p-3 bg-muted rounded-lg">
                          <div className="font-medium text-sm text-foreground mb-2">{change.field}</div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Antes:</span>
                              <p className="font-medium text-red-600">{change.before || "N/A"}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Después:</span>
                              <p className="font-medium text-green-600">{change.after}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Technical Information */}
                <div>
                  <h4 className="font-medium text-foreground mb-3">Información Técnica</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between py-2 border-b border-main-200 dark:border-main-800">
                      <span className="text-muted-foreground">User Agent:</span>
                      <span className="font-mono text-xs max-w-xs truncate" title={viewingLog.userAgent}>
                        {viewingLog.userAgent}
                      </span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-muted-foreground">Timestamp:</span>
                      <span className="font-mono text-xs">{viewingLog.timestamp}</span>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
