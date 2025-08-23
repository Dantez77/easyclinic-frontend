import { useState, useMemo } from "react"
import { ActivityLog } from "../mocks/activity-logs-data"

interface DateRange {
  from: Date | undefined
  to: Date | undefined
}

interface UseActivityLogsProps {
  activityLogs: ActivityLog[]
  itemsPerPage?: number
}

export const useActivityLogs = ({ activityLogs, itemsPerPage = 15 }: UseActivityLogsProps) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [moduleFilter, setModuleFilter] = useState("all")
  const [severityFilter, setSeverityFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [userFilter, setUserFilter] = useState("all")
  const [dateRange, setDateRange] = useState<DateRange>({
    from: undefined,
    to: undefined,
  })
  const [selectedLogs, setSelectedLogs] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)

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

  const resetFilters = () => {
    setSearchTerm("")
    setModuleFilter("all")
    setSeverityFilter("all")
    setCategoryFilter("all")
    setUserFilter("all")
    setDateRange({ from: undefined, to: undefined })
    setCurrentPage(1)
    setSelectedLogs([])
  }

  return {
    // State
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
    
    // Computed values
    modules,
    users,
    categories,
    filteredLogs,
    paginatedLogs,
    totalPages,
    
    // Handlers
    handleSelectAll,
    handleSelectLog,
    resetFilters,
  }
}
