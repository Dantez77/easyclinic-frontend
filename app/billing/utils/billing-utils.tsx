import {
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
} from "lucide-react"

export function getStatusColor(status: string) {
  switch (status) {
    case "Pagada":
      return "default"
    case "Pendiente":
      return "secondary"
    case "Vencida":
      return "destructive"
    default:
      return "outline"
  }
}

export function getStatusIcon(status: string) {
  switch (status) {
    case "Pagada":
      return <CheckCircle className="w-4 h-4" />
    case "Pendiente":
      return <Clock className="w-4 h-4" />
    case "Vencida":
      return <AlertCircle className="w-4 h-4" />
    default:
      return <FileText className="w-4 h-4" />
  }
}

export const generateDocumentNumber = (documentType: string, sequence: number): string => {
  // In El Salvador, IVA is included in the displayed price
  // When generating document numbers, we use the standard format
  // but the pricing calculations handle IVA extraction from total price
  
  const prefix = documentType === "dteFactura" ? "FAC" : 
                 documentType === "dteComprobante" ? "COM" : 
                 documentType === "ticket" ? "TKT" : "DOC"
  
  const year = new Date().getFullYear()
  const sequenceStr = String(sequence).padStart(6, "0")
  
  return `${prefix}-${year}-${sequenceStr}`
}
