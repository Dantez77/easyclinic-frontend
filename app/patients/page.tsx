"use client"

import { useEffect } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { usePatientsStore } from "@/lib/patients-store"
import { PatientsHeader } from "./components/patients-header"
import { PatientsFilters } from "./components/patients-filters"
import { BulkActions } from "./components/bulk-actions"
import { PatientsTable } from "./components/patients-table"
import { Pagination } from "./components/pagination"
import { ViewPatientSheet } from "./components/view-patient-sheet"
import { EditPatientDialog } from "./components/edit-patient-dialog-simple"
import { MedicalHistorySheet } from "./components/medical-history-sheet"

export default function PatientsPage() {
  const {
    // State
    patients,
    searchTerm,
    statusFilter,
    provinceFilter,
    selectedPatients,
    pagination,
    currentPatient,
    loading,
    error,
    modals,

    // Actions
    fetchPatients,
    setSearchTerm,
    setStatusFilter,
    setProvinceFilter,
    setPage,
    selectPatient,
    togglePatientSelection,
    selectAllPatients,
    clearSelection,
    openModal,
    closeModal,
    clearError,
  } = usePatientsStore()

  // Load patients on mount and when filters change
  useEffect(() => {
    fetchPatients()
  }, [searchTerm, statusFilter, provinceFilter, pagination.page])

  // Computed values for compatibility with existing components
  const filteredPatients = patients
  const paginatedPatients = patients
  const totalPages = pagination.totalPages
  const provinces = ['San Salvador', 'La Libertad', 'Santa Ana', 'Sonsonate'] // Mock provinces for now

  // Handler functions for compatibility with existing components
  const handleSelectAll = () => {
    if (selectedPatients.length === patients.length) {
      clearSelection()
    } else {
      selectAllPatients()
    }
  }

  const handleSelectPatient = (patientId: string) => {
    togglePatientSelection(patientId)
  }

  const handleViewPatient = (patient: any) => {
    selectPatient(patient)
    openModal('viewPatient')
  }

  const handleEditPatient = (patient: any) => {
    selectPatient(patient)
    openModal('editPatient')
  }

  const handleViewHistory = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId)
    if (patient) {
      selectPatient(patient)
      openModal('viewMedicalHistory')
    }
  }

  const handleBulkDelete = async () => {
    // TODO: Implement bulk delete
    console.log('Bulk delete:', selectedPatients)
  }

  const handleExport = () => {
    // TODO: Implement export
    console.log('Export patients')
  }

  const handleSaveEdit = async (patientData: any) => {
    // TODO: Implement save edit
    console.log('Save edit:', patientData)
    closeModal('editPatient')
  }

  const handleDeletePatient = async (patientId: string) => {
    // TODO: Implement delete patient
    console.log('Delete patient:', patientId)
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
      <PatientsHeader patientCount={filteredPatients.length} onExport={handleExport} />

      <div className="max-w-7xl mx-auto p-4 lg:p-6">
        <PatientsFilters
          searchTerm={searchTerm}
          statusFilter={statusFilter}
          provinceFilter={provinceFilter}
          onSearchChange={setSearchTerm}
          onStatusChange={setStatusFilter}
          onProvinceChange={setProvinceFilter}
          provinces={provinces}
        />

        <BulkActions selectedPatients={selectedPatients} onBulkDelete={handleBulkDelete} />

        <PatientsTable
          patients={paginatedPatients}
          selectedPatients={selectedPatients}
          onSelectAll={handleSelectAll}
          onSelectPatient={handleSelectPatient}
          onViewPatient={handleViewPatient}
          onEditPatient={handleEditPatient}
          onViewHistory={handleViewHistory}
          onDeletePatient={handleDeletePatient}
        />

        <Pagination
          currentPage={pagination.page}
          totalPages={totalPages}
          totalItems={pagination.total}
          itemsPerPage={pagination.limit}
          onPageChange={setPage}
        />
      </div>

      <ViewPatientSheet
        open={modals.viewPatient}
        onOpenChange={() => closeModal('viewPatient')}
        patient={currentPatient}
      />

      <EditPatientDialog
        open={modals.editPatient}
        onOpenChange={() => closeModal('editPatient')}
        patient={currentPatient}
        onSave={handleSaveEdit}
        onPatientChange={selectPatient}
      />

      <MedicalHistorySheet
        open={modals.viewMedicalHistory}
        onOpenChange={() => closeModal('viewMedicalHistory')}
        viewingHistory={currentPatient?.id || null}
        historyActiveTab="consultations"
        onHistoryTabChange={() => {}}
        patients={patients}
      />
      </div>
    </ProtectedRoute>
  )
}
