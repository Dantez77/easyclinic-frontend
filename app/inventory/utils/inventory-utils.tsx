import {
  Package,
  AlertTriangle,
  Calendar,
  X,
  Pill,
  Syringe,
  Stethoscope,
  TestTube,
} from "lucide-react"

export const getStatusColor = (status: string) => {
  switch (status) {
    case "Activo":
      return "default"
    case "Stock Bajo":
      return "destructive"
    case "Próximo a Vencer":
      return "secondary"
    case "Vencido":
      return "destructive"
    default:
      return "outline"
  }
}

export const getStatusIcon = (status: string) => {
  switch (status) {
    case "Activo":
      return <Package className="w-4 h-4" />
    case "Stock Bajo":
      return <AlertTriangle className="w-4 h-4" />
    case "Próximo a Vencer":
      return <Calendar className="w-4 h-4" />
    case "Vencido":
      return <X className="w-4 h-4" />
    default:
      return <Package className="w-4 h-4" />
  }
}

export const getCategoryIcon = (category: string) => {
  switch (category) {
    case "Medicamentos":
      return <Pill className="w-4 h-4" />
    case "Consumibles":
      return <Syringe className="w-4 h-4" />
    case "Equipos":
      return <Stethoscope className="w-4 h-4" />
    case "Laboratorio":
      return <TestTube className="w-4 h-4" />
    default:
      return <Package className="w-4 h-4" />
  }
}
