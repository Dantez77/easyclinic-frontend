import {
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react"

export function getStatusColor(status: string) {
  switch (status) {
    case "confirmed":
      return "bg-main-100 text-main-800 dark:bg-main-900 dark:text-main-300"
    case "pending":
      return "bg-yellow-500/10 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
    case "cancelled":
      return "bg-red-500/10 text-red-800 dark:bg-red-900 dark:text-red-300"
    case "completed":
      return "bg-green-500/10 text-green-800 dark:bg-green-900 dark:text-green-300"
    default:
      return "bg-main-100 text-main-800 dark:bg-main-900 dark:text-main-300"
  }
}

export function getStatusIcon(status: string) {
  switch (status) {
    case "confirmed":
      return <CheckCircle className="h-4 w-4" />
    case "pending":
      return <AlertCircle className="h-4 w-4" />
    case "cancelled":
      return <XCircle className="h-4 w-4" />
    case "completed":
      return <CheckCircle className="h-4 w-4" />
    default:
      return <Clock className="h-4 w-4" />
  }
}
