import { useState, useMemo } from "react"
import { format } from "date-fns"
import { Invoice, Patient, Service, DOCUMENT_TYPES } from "../mocks/billing-data"
import { generateDocumentNumber } from "../utils/billing-utils"

export const useBilling = (initialInvoices: Invoice[]) => {
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")
  const [documentTypeFilter, setDocumentTypeFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)

  // Filter invoices
  const filteredInvoices = useMemo(() => {
    return invoices.filter((invoice) => {
      const matchesSearch =
        invoice.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.id.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === "all" || invoice.status.toLowerCase() === statusFilter.toLowerCase()

      const matchesDate = (() => {
        if (dateFilter === "all") return true
        const invoiceDate = new Date(invoice.date)
        const today = new Date()
        const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
        const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)

        switch (dateFilter) {
          case "today":
            return invoiceDate.toDateString() === today.toDateString()
          case "week":
            return invoiceDate >= sevenDaysAgo
          case "month":
            return invoiceDate >= thirtyDaysAgo
          default:
            return true
        }
      })()

      const matchesDocumentType =
        documentTypeFilter === "all" || invoice.documentType.toLowerCase() === documentTypeFilter.toLowerCase()

      return matchesSearch && matchesStatus && matchesDate && matchesDocumentType
    })
  }, [invoices, searchTerm, statusFilter, dateFilter, documentTypeFilter])

  // Pagination
  const itemsPerPage = 10
  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage)
  const paginatedInvoices = filteredInvoices.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  // Calculate totals
  const totalRevenue = invoices.reduce((sum, invoice) => sum + (invoice.status === "Pagada" ? invoice.total : 0), 0)
  const pendingAmount = invoices.reduce((sum, invoice) => sum + (invoice.status === "Pendiente" ? invoice.total : 0), 0)
  const overdueAmount = invoices.reduce((sum, invoice) => sum + (invoice.status === "Vencida" ? invoice.total : 0), 0)

  // Invoice management
  const addInvoice = (invoice: Omit<Invoice, "id">) => {
    const newInvoice = {
      id: generateDocumentNumber(invoice.documentType, invoices.length),
      ...invoice,
    }
    setInvoices([newInvoice, ...invoices])
  }

  const updateInvoice = (invoiceId: string, updates: Partial<Invoice>) => {
    setInvoices(invoices.map((inv) => 
      inv.id === invoiceId ? { ...inv, ...updates } : inv
    ))
  }

  const deleteInvoice = (invoiceId: string) => {
    setInvoices(invoices.filter((inv) => inv.id !== invoiceId))
  }

  return {
    // State
    invoices,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    dateFilter,
    setDateFilter,
    documentTypeFilter,
    setDocumentTypeFilter,
    currentPage,
    setCurrentPage,
    
    // Computed values
    filteredInvoices,
    paginatedInvoices,
    totalPages,
    itemsPerPage,
    totalRevenue,
    pendingAmount,
    overdueAmount,
    
    // Invoice management
    addInvoice,
    updateInvoice,
    deleteInvoice,
  }
}
