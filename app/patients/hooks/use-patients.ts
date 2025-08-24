import { useState, useMemo } from "react"
import { mockPatients, mockMedicalHistory, type Patient } from "../mocks/patients-data"

export const usePatients = () => {
  const [patients, setPatients] = useState<Patient[]>(mockPatients)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [provinceFilter, setProvinceFilter] = useState("all")
  const [selectedPatients, setSelectedPatients] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null)
  const [viewingPatient, setViewingPatient] = useState<Patient | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewSheetOpen, setIsViewSheetOpen] = useState(false)
  const [viewingHistory, setViewingHistory] = useState<string | null>(null)
  const [isHistorySheetOpen, setIsHistorySheetOpen] = useState(false)
  const [historyActiveTab, setHistoryActiveTab] = useState("consultations")
  const itemsPerPage = 10

  // Filter and search patients
  const filteredPatients = useMemo(() => {
    return patients.filter((patient) => {
      const matchesSearch =
        patient.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.dui.includes(searchTerm) ||
        patient.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.phone.includes(searchTerm)

      const matchesStatus = statusFilter === "all" || patient.status.toLowerCase() === statusFilter.toLowerCase()
      const matchesProvince = provinceFilter === "all" || patient.province === provinceFilter

      return matchesSearch && matchesStatus && matchesProvince
    })
  }, [patients, searchTerm, statusFilter, provinceFilter])

  // Pagination
  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage)
  const paginatedPatients = filteredPatients.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  // Get unique provinces for filter
  const provinces = [...new Set(patients.map((p) => p.province))]

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedPatients(paginatedPatients.map((p) => p.id))
    } else {
      setSelectedPatients([])
    }
  }

  const handleSelectPatient = (patientId: string, checked: boolean) => {
    if (checked) {
      setSelectedPatients([...selectedPatients, patientId])
    } else {
      setSelectedPatients(selectedPatients.filter((id) => id !== patientId))
    }
  }

  const handleDeletePatient = (patientId: string) => {
    setPatients(patients.filter((p) => p.id !== patientId))
    setSelectedPatients(selectedPatients.filter((id) => id !== patientId))
  }

  const handleBulkDelete = () => {
    setPatients(patients.filter((p) => !selectedPatients.includes(p.id)))
    setSelectedPatients([])
  }

  const handleEditPatient = (patient: Patient) => {
    setEditingPatient({ ...patient })
    setIsEditDialogOpen(true)
  }

  const handleViewPatient = (patient: Patient) => {
    setViewingPatient(patient)
    setIsViewSheetOpen(true)
  }

  const handleViewHistory = (patientId: string) => {
    setViewingHistory(patientId)
    setIsHistorySheetOpen(true)
  }

  const handleSaveEdit = () => {
    if (editingPatient) {
      setPatients(patients.map((p) => (p.id === editingPatient.id ? editingPatient : p)))
      setIsEditDialogOpen(false)
      setEditingPatient(null)
    }
  }

  const handleExport = () => {
    // Mock export functionality
    const csvContent =
      "data:text/csv;charset=utf-8," +
              "ID,Nombre,Apellido,DUI,Teléfono,Email,Estado\n" +
      filteredPatients
        .map((p) => `${p.id},${p.firstName},${p.lastName},${p.dui},${p.phone},${p.email},${p.status}`)
        .join("\n")

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "pacientes.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return {
    // State
    patients,
    searchTerm,
    statusFilter,
    provinceFilter,
    selectedPatients,
    currentPage,
    editingPatient,
    viewingPatient,
    isEditDialogOpen,
    isViewSheetOpen,
    viewingHistory,
    isHistorySheetOpen,
    historyActiveTab,
    itemsPerPage,
    
    // Computed values
    filteredPatients,
    totalPages,
    paginatedPatients,
    provinces,
    
    // Actions
    setPatients,
    setSearchTerm,
    setStatusFilter,
    setProvinceFilter,
    setSelectedPatients,
    setCurrentPage,
    setEditingPatient,
    setViewingPatient,
    setIsEditDialogOpen,
    setIsViewSheetOpen,
    setViewingHistory,
    setIsHistorySheetOpen,
    setHistoryActiveTab,
    handleSelectAll,
    handleSelectPatient,
    handleDeletePatient,
    handleBulkDelete,
    handleEditPatient,
    handleViewPatient,
    handleViewHistory,
    handleSaveEdit,
    handleExport,
  }
}
