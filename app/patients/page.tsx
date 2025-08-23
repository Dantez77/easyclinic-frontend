"use client"

import { usePatients } from "./hooks/use-patients"
import { PatientsHeader } from "./components/patients-header"
import { PatientsFilters } from "./components/patients-filters"
import { BulkActions } from "./components/bulk-actions"
import { PatientsTable } from "./components/patients-table"
import { Pagination } from "./components/pagination"
import { ViewPatientSheet } from "./components/view-patient-sheet"
import { EditPatientDialog } from "./components/edit-patient-dialog"
import { MedicalHistorySheet } from "./components/medical-history-sheet"

export default function PatientsPage() {
  const {
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
  } = usePatients()

  return (
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
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredPatients.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      </div>

      <ViewPatientSheet
        open={isViewSheetOpen}
        onOpenChange={setIsViewSheetOpen}
        patient={viewingPatient}
      />

      <EditPatientDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        patient={editingPatient}
        onSave={handleSaveEdit}
        onPatientChange={setEditingPatient}
      />

      <MedicalHistorySheet
        open={isHistorySheetOpen}
        onOpenChange={setIsHistorySheetOpen}
        viewingHistory={viewingHistory}
        historyActiveTab={historyActiveTab}
        onHistoryTabChange={setHistoryActiveTab}
        patients={patients}
      />
    </div>
  )
}
