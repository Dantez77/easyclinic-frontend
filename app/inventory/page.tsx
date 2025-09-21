"use client"

import { useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"
import { useInventoryStore } from "@/lib/inventory-store"
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
import { EditItemDialog } from "./components/edit-item-dialog"
import { BarcodeScanner } from "./components/barcode-scanner"
import { ReportsDashboard } from "./components/reports-dashboard"
import { LoadingSpinner } from "@/components/loading-spinner"

export default function InventoryPage() {
  const {
    // State
    items,
    selectedItems,
    filters,
    pagination,
    alerts,
    purchaseOrders,
    auditLogs,
    loading,
    error,
    activeTab,
    modals,
    currentItem,
    
    // Computed values
    categories,
    departments,
    locations,
    totalStockValue,
    lowStockItems,
    expiringItems,
    controlledItems,
    
    // Actions
    fetchItems,
    fetchAlerts,
    fetchPurchaseOrders,
    fetchAuditLogs,
    createItem,
    updateItem,
    updateStock,
    deleteItem,
    bulkDeleteItems,
    exportInventory,
    setFilters,
    setPagination,
    selectAllItems,
    selectItem,
    setActiveTab,
    openModal,
    closeModal,
    setCurrentItem,
    clearError,
  } = useInventoryStore()

  // Initialize data on component mount
  useEffect(() => {
    fetchItems()
    fetchAlerts()
  }, [fetchItems, fetchAlerts])

  // Fetch data based on active tab
  useEffect(() => {
    switch (activeTab) {
      case 'audit':
        fetchAuditLogs()
        break
      case 'orders':
        fetchPurchaseOrders()
        break
    }
  }, [activeTab, fetchAuditLogs, fetchPurchaseOrders])

  const handleViewItem = (item: any) => {
    setCurrentItem(item)
    openModal('viewItem')
  }

  const handleUpdateStockItem = (item: any) => {
    setCurrentItem(item)
    openModal('updateStock')
  }

  const handleStockUpdate = (action: "add" | "remove" | "set", quantity: number, reason: string, batchNumber?: string, expiryDate?: string) => {
    if (currentItem) {
      updateStock(currentItem.id, action, quantity, reason, batchNumber, expiryDate)
    }
  }

  const handleAddNewItem = (newItem: any) => {
    createItem(newItem)
  }

  const handleEditItem = (item: any) => {
    setCurrentItem(item)
    openModal('editItem')
  }

  const handleEditItemSubmit = (itemId: string, updates: any) => {
    updateItem(itemId, updates)
  }

  const handleBulkDelete = () => {
    if (selectedItems.length > 0) {
      bulkDeleteItems(selectedItems, 'Eliminación en lote')
    }
  }

  const handlePrintBarcode = async (item: any) => {
    // TODO: Implement barcode printing with inventoryAPI
    console.log('Print barcode for:', item.name)
  }

  if (loading && items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Error Display */}
      {error && (
        <Alert variant="destructive" className="mx-4 mt-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {error}
            <button onClick={clearError} className="ml-2 underline">
              Dismiss
            </button>
          </AlertDescription>
        </Alert>
      )}

      <InventoryHeader
        itemCount={items.length}
        onExport={() => exportInventory('csv')}
        onAddItem={() => openModal('addItem')}
        onScanBarcode={() => openModal('scanner' as any)}
      />

      <div className="max-w-7xl mx-auto p-4 lg:p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
            <TabsTrigger value="inventory">Inventario</TabsTrigger>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="reports">Reportes</TabsTrigger>
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
              inventoryItems={items}
              totalStockValue={totalStockValue}
            />
          </TabsContent>

          {/* Inventory Tab */}
          <TabsContent value="inventory" className="space-y-6">
            <InventoryFilters
              searchTerm={filters.search}
              categoryFilter={filters.category}
              statusFilter={filters.status}
              departmentFilter={filters.department}
              onSearchChange={(search) => setFilters({ search })}
              onCategoryChange={(category) => setFilters({ category })}
              onStatusChange={(status) => setFilters({ status })}
              onDepartmentChange={(department) => setFilters({ department })}
              categories={categories}
              departments={departments}
            />

            <BulkActions
              selectedItems={selectedItems}
              onPrintCodes={() => {
                // Handle bulk print codes
                selectedItems.forEach(itemId => {
                  const item = items.find(i => i.id === itemId)
                  if (item) handlePrintBarcode(item)
                })
              }}
              onBulkDelete={handleBulkDelete}
            />

            <InventoryTable
              items={items}
              selectedItems={selectedItems}
              onSelectAll={selectAllItems}
              onSelectItem={selectItem}
              onViewItem={handleViewItem}
              onUpdateStock={handleUpdateStockItem}
              onEditItem={handleEditItem}
              onPrintBarcode={handlePrintBarcode}
              onDeleteItem={(itemId) => deleteItem(itemId, 'Eliminado por usuario')}
            />

            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              totalItems={pagination.total}
              itemsPerPage={pagination.limit}
              onPageChange={(page) => setPagination({ page })}
            />
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <ReportsDashboard />
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

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <LoadingSpinner />
        </div>
      )}

      {/* Dialogs and Sheets */}
      <AddItemDialog
        open={modals.addItem}
        onOpenChange={() => closeModal('addItem')}
        onAddItem={handleAddNewItem}
      />

      <StockUpdateDialog
        open={modals.updateStock}
        onOpenChange={() => closeModal('updateStock')}
        item={currentItem}
        onUpdateStock={handleStockUpdate}
      />

      <ViewItemSheet
        open={modals.viewItem}
        onOpenChange={() => closeModal('viewItem')}
        item={currentItem}
        onUpdateStock={handleUpdateStockItem}
        onEditItem={handleEditItem}
        onPrintBarcode={handlePrintBarcode}
      />

      <EditItemDialog
        open={modals.editItem}
        onOpenChange={() => closeModal('editItem')}
        item={currentItem}
        onEditItem={handleEditItemSubmit}
      />

      <BarcodeScanner
        open={modals.scanner || false}
        onOpenChange={(open) => open ? openModal('scanner' as any) : closeModal('scanner' as any)}
        onItemFound={(item) => {
          setCurrentItem(item)
          openModal('viewItem')
        }}
      />
    </div>
  )
}
