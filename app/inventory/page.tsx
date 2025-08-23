"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useInventory } from "./hooks/use-inventory"
import { InventoryHeader } from "./components/inventory-header"
import { DashboardMetrics } from "./components/dashboard-metrics"
import { AlertsSection } from "./components/alerts-section"
import { CategoriesChart } from "./components/categories-chart"
import { InventoryFilters } from "./components/inventory-filters"
import { BulkActions } from "./components/bulk-actions"
import { InventoryTable } from "./components/inventory-table"
import { Pagination } from "./components/pagination"
import { AuditLogs } from "./components/audit-logs"
import { PurchaseOrders } from "./components/purchase-orders"
import { AddItemDialog } from "./components/add-item-dialog"
import { StockUpdateDialog } from "./components/stock-update-dialog"
import { ViewItemSheet } from "./components/view-item-sheet"

export default function InventoryPage() {
  const {
    // State
    inventoryItems,
    auditLogs,
    purchaseOrders,
    searchTerm,
    categoryFilter,
    statusFilter,
    departmentFilter,
    selectedItems,
    currentPage,
    activeTab,
    
    // Computed values
    categories,
    departments,
    filteredItems,
    totalPages,
    paginatedItems,
    totalStockValue,
    lowStockItems,
    expiringItems,
    controlledItems,
    
    // Actions
    setSearchTerm,
    setCategoryFilter,
    setStatusFilter,
    setDepartmentFilter,
    setCurrentPage,
    setActiveTab,
    handleSelectAll,
    handleSelectItem,
    handleAddItem,
    handleUpdateStock,
    handleDeleteItem,
    handleBulkDelete,
    handleExport,
    handlePrintBarcode,
  } = useInventory()

  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isStockUpdateDialogOpen, setIsStockUpdateDialogOpen] = useState(false)
  const [isViewSheetOpen, setIsViewSheetOpen] = useState(false)
  const [updatingStockItem, setUpdatingStockItem] = useState<any>(null)
  const [viewingItem, setViewingItem] = useState<any>(null)

  const handleViewItem = (item: any) => {
    setViewingItem(item)
    setIsViewSheetOpen(true)
  }

  const handleUpdateStockItem = (item: any) => {
    setUpdatingStockItem(item)
    setIsStockUpdateDialogOpen(true)
  }

  const handleStockUpdate = (action: "add" | "remove" | "set", quantity: number, reason: string, batchNumber?: string, expiryDate?: string) => {
    if (updatingStockItem) {
      handleUpdateStock(updatingStockItem.id, action, quantity, reason, batchNumber, expiryDate)
    }
  }

  const handleAddNewItem = (newItem: any) => {
    handleAddItem(newItem)
  }

  return (
    <div className="min-h-screen bg-background">
      <InventoryHeader
        itemCount={filteredItems.length}
        onExport={handleExport}
        onAddItem={() => setIsAddDialogOpen(true)}
      />

      <div className="max-w-7xl mx-auto p-4 lg:p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
            <TabsTrigger value="inventory">Inventario</TabsTrigger>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="audit">Auditoría</TabsTrigger>
            <TabsTrigger value="orders">Órdenes</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <DashboardMetrics
              totalStockValue={totalStockValue}
              lowStockItems={lowStockItems}
              expiringItems={expiringItems}
              controlledItems={controlledItems}
            />
            <AlertsSection lowStockItems={lowStockItems} expiringItems={expiringItems} />
            <CategoriesChart
              categories={categories}
              inventoryItems={inventoryItems}
              totalStockValue={totalStockValue}
            />
          </TabsContent>

          {/* Inventory Tab */}
          <TabsContent value="inventory" className="space-y-6">
            <InventoryFilters
              searchTerm={searchTerm}
              categoryFilter={categoryFilter}
              statusFilter={statusFilter}
              departmentFilter={departmentFilter}
              onSearchChange={setSearchTerm}
              onCategoryChange={setCategoryFilter}
              onStatusChange={setStatusFilter}
              onDepartmentChange={setDepartmentFilter}
              categories={categories}
              departments={departments}
            />

            <BulkActions
              selectedItems={selectedItems}
              onPrintCodes={() => {
                // Handle bulk print codes
                selectedItems.forEach(itemId => {
                  const item = inventoryItems.find(i => i.id === itemId)
                  if (item) handlePrintBarcode(item)
                })
              }}
              onBulkDelete={handleBulkDelete}
            />

            <InventoryTable
              items={paginatedItems}
              selectedItems={selectedItems}
              onSelectAll={handleSelectAll}
              onSelectItem={handleSelectItem}
              onViewItem={handleViewItem}
              onUpdateStock={handleUpdateStockItem}
              onEditItem={() => {
                // TODO: Implement edit functionality
              }}
              onPrintBarcode={handlePrintBarcode}
              onDeleteItem={handleDeleteItem}
            />

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredItems.length}
              itemsPerPage={10}
              onPageChange={setCurrentPage}
            />
          </TabsContent>

          {/* Audit Tab */}
          <TabsContent value="audit" className="space-y-6">
            <AuditLogs auditLogs={auditLogs} />
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <PurchaseOrders purchaseOrders={purchaseOrders} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Dialogs and Sheets */}
      <AddItemDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onAddItem={handleAddNewItem}
      />

      <StockUpdateDialog
        open={isStockUpdateDialogOpen}
        onOpenChange={setIsStockUpdateDialogOpen}
        item={updatingStockItem}
        onUpdateStock={handleStockUpdate}
      />

      <ViewItemSheet
        open={isViewSheetOpen}
        onOpenChange={setIsViewSheetOpen}
        item={viewingItem}
        onUpdateStock={handleUpdateStockItem}
        onEditItem={() => {
          // TODO: Implement edit functionality
        }}
        onPrintBarcode={handlePrintBarcode}
      />
    </div>
  )
}
