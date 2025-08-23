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

export function generateDocumentNumber(documentType: string, currentCount: number) {
  const prefix =
    {
      ticket: "TKT",
      factura: "FAC",
      creditoFiscal: "CF",
      dteFactura: "DTE-FAC",
      dteComprobante: "DTE-CCF",
    }[documentType] || "DOC"

  return `${prefix}-2024-${String(currentCount + 1).padStart(3, "0")}`
}
