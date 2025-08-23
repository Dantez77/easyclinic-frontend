import {
  Activity,
  CheckCircle,
  AlertTriangle,
  UserPlus,
  Users,
  Stethoscope,
  FileText,
  DollarSign,
  Package,
  Settings,
} from "lucide-react"

export const getSeverityColor = (severity: string) => {
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

export const getSeverityIcon = (severity: string) => {
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

export const getModuleIcon = (module: string) => {
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

export const getCategoryColor = (category: string) => {
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
