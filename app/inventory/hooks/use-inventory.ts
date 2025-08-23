import { useState, useMemo } from "react"
import { format } from "date-fns"
import { mockInventoryItems, mockAuditLogs, mockPurchaseOrders, type InventoryItem, type AuditLog, type PurchaseOrder } from "../mocks/inventory-data"

export const useInventory = () => {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>(mockInventoryItems)
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(mockAuditLogs)
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(mockPurchaseOrders)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [locationFilter, setLocationFilter] = useState("all")
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [activeTab, setActiveTab] = useState("inventory")

  const itemsPerPage = 10

  // Get unique values for filters
  const categories = [...new Set(inventoryItems.map((item) => item.category))]
  const departments = [...new Set(inventoryItems.map((item) => item.department))]
  const locations = [...new Set(inventoryItems.map((item) => item.location))]

  // Filter inventory items
  const filteredItems = useMemo(() => {
    return inventoryItems.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.supplier.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesCategory = categoryFilter === "all" || item.category === categoryFilter
      const matchesStatus = statusFilter === "all" || item.status === statusFilter
      const matchesDepartment = departmentFilter === "all" || item.department === departmentFilter
      const matchesLocation = locationFilter === "all" || item.location === locationFilter

      return matchesSearch && matchesCategory && matchesStatus && matchesDepartment && matchesLocation
    })
  }, [inventoryItems, searchTerm, categoryFilter, statusFilter, departmentFilter, locationFilter])

  // Pagination
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage)
  const paginatedItems = filteredItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  // Calculate dashboard metrics
  const totalStockValue = inventoryItems.reduce((sum, item) => sum + item.totalValue, 0)
  const lowStockItems = inventoryItems.filter((item) => item.currentStock <= item.minThreshold)
  const expiringItems = inventoryItems.filter((item) => {
    if (!item.expiryDate) return false
    const expiryDate = new Date(item.expiryDate)
    const thirtyDaysFromNow = new Date()
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)
    return expiryDate <= thirtyDaysFromNow
  })
  const controlledItems = inventoryItems.filter((item) => item.controlledSubstance)

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(paginatedItems.map((item) => item.id))
    } else {
      setSelectedItems([])
    }
  }

  const handleSelectItem = (itemId: string, checked: boolean) => {
    if (checked) {
      setSelectedItems([...selectedItems, itemId])
    } else {
      setSelectedItems(selectedItems.filter((id) => id !== itemId))
    }
  }

  const handleAddItem = (newItem: Omit<InventoryItem, "id" | "totalValue" | "status" | "lastUpdated" | "updatedBy">) => {
    // BACKEND: Create new inventory item
    const item: InventoryItem = {
      id: `INV-${String(inventoryItems.length + 1).padStart(3, "0")}`,
      ...newItem,
      totalValue: newItem.currentStock * newItem.unitCost,
      status: newItem.currentStock <= newItem.minThreshold ? "Stock Bajo" : "Activo",
      lastUpdated: format(new Date(), "yyyy-MM-dd"),
      updatedBy: "Usuario Actual", // BACKEND: Get from auth context
    }

    setInventoryItems([...inventoryItems, item])

    // BACKEND: Add audit log entry
    const auditEntry: AuditLog = {
      id: `AUD-${String(auditLogs.length + 1).padStart(3, "0")}`,
      itemId: item.id,
      itemName: item.name,
      action: "Artículo Creado",
      previousValue: "N/A",
      newValue: `${item.currentStock} ${item.unitOfMeasure}`,
      reason: "Nuevo artículo agregado al inventario",
      user: "Usuario Actual",
      timestamp: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
      department: item.department,
    }
    setAuditLogs([auditEntry, ...auditLogs])

    return item
  }

  const handleUpdateStock = (
    itemId: string,
    action: "add" | "remove" | "set",
    quantity: number,
    reason: string,
    batchNumber?: string,
    expiryDate?: string
  ) => {
    const item = inventoryItems.find((i) => i.id === itemId)
    if (!item) return

    let newStock = item.currentStock
    let actionDescription = ""

    switch (action) {
      case "add":
        newStock += quantity
        actionDescription = `Agregado ${quantity} ${item.unitOfMeasure}`
        break
      case "remove":
        newStock = Math.max(0, newStock - quantity)
        actionDescription = `Removido ${quantity} ${item.unitOfMeasure}`
        break
      case "set":
        newStock = quantity
        actionDescription = `Stock establecido a ${quantity} ${item.unitOfMeasure}`
        break
    }

    // Determine new status
    let newStatus = "Activo"
    if (newStock <= item.minThreshold) {
      newStatus = "Stock Bajo"
    }
    if (item.expiryDate) {
      const expiryDate = new Date(item.expiryDate)
      const thirtyDaysFromNow = new Date()
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)
      if (expiryDate <= thirtyDaysFromNow) {
        newStatus = "Próximo a Vencer"
      }
    }

    // BACKEND: Update inventory item
    const updatedItems = inventoryItems.map((invItem) =>
      invItem.id === itemId
        ? {
          ...invItem,
          currentStock: newStock,
          totalValue: newStock * invItem.unitCost,
          status: newStatus,
          lastUpdated: format(new Date(), "yyyy-MM-dd"),
          updatedBy: "Usuario Actual",
          ...(batchNumber && { batchNumber }),
          ...(expiryDate && { expiryDate }),
        }
        : invItem,
    )
    setInventoryItems(updatedItems)

    // BACKEND: Add audit log entry
    const auditEntry: AuditLog = {
      id: `AUD-${String(auditLogs.length + 1).padStart(3, "0")}`,
      itemId: item.id,
      itemName: item.name,
      action: "Stock Actualizado",
      previousValue: `${item.currentStock} ${item.unitOfMeasure}`,
      newValue: `${newStock} ${invItem.unitOfMeasure}`,
      reason: reason || actionDescription,
      user: "Usuario Actual",
      timestamp: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
      department: item.department,
    }
    setAuditLogs([auditEntry, ...auditLogs])
  }

  const handleDeleteItem = (itemId: string) => {
    // BACKEND: Soft delete inventory item
    const item = inventoryItems.find((i) => i.id === itemId)
    if (!item) return

    setInventoryItems(inventoryItems.filter((i) => i.id !== itemId))
    setSelectedItems(selectedItems.filter((id) => id !== itemId))

    // BACKEND: Add audit log entry
    const auditEntry: AuditLog = {
      id: `AUD-${String(auditLogs.length + 1).padStart(3, "0")}`,
      itemId: item.id,
      itemName: item.name,
      action: "Artículo Eliminado",
      previousValue: `${item.currentStock} ${item.unitOfMeasure}`,
      newValue: "0",
      reason: "Artículo eliminado del inventario",
      user: "Usuario Actual",
      timestamp: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
      department: item.department,
    }
    setAuditLogs([auditEntry, ...auditLogs])
  }

  const handleBulkDelete = () => {
    // BACKEND: Bulk delete selected items
    const itemsToDelete = inventoryItems.filter((item) => selectedItems.includes(item.id))

    setInventoryItems(inventoryItems.filter((item) => !selectedItems.includes(item.id)))

    // BACKEND: Add audit log entries for each deleted item
    const auditEntries = itemsToDelete.map((item, index) => ({
      id: `AUD-${String(auditLogs.length + index + 1).padStart(3, "0")}`,
      itemId: item.id,
      itemName: item.name,
      action: "Artículo Eliminado (Lote)",
      previousValue: `${item.currentStock} ${item.unitOfMeasure}`,
      newValue: "0",
      reason: "Eliminación en lote",
      user: "Usuario Actual",
      timestamp: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
      department: item.department,
    }))
    setAuditLogs([...auditEntries, ...auditLogs])

    setSelectedItems([])
  }

  const handleExport = () => {
    // BACKEND: Generate and download inventory report
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "ID,Nombre,Categoría,SKU,Stock Actual,Stock Mínimo,Ubicación,Estado,Valor Total\n" +
      filteredItems
        .map(
          (item) =>
            `${item.id},${item.name},${item.category},${item.sku},${item.currentStock},${item.minThreshold},${item.location},${item.status},${item.totalValue}`,
        )
        .join("\n")

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `inventario_${format(new Date(), "yyyy-MM-dd")}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handlePrintBarcode = (item: InventoryItem) => {
    // BACKEND: Generate and print barcode label
    const printWindow = window.open("", "_blank")
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Código de Barras - ${item.name}</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              text-align: center; 
              padding: 20px;
            }
            .barcode {
              font-family: 'Libre Barcode 128', monospace;
              font-size: 48px;
              margin: 20px 0;
            }
            .info {
              font-size: 12px;
              margin: 5px 0;
            }
          </style>
        </head>
        <body>
          <div class="info"><strong>${item.name}</strong></div>
          <div class="info">SKU: ${item.sku}</div>
          <div class="barcode">${item.barcode}</div>
          <div class="info">Ubicación: ${item.location}</div>
          <div class="info">Lote: ${item.batchNumber}</div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 1000);
            }
          </script>
        </body>
        </html>
      `)
      printWindow.document.close()
    }
  }

  return {
    // State
    inventoryItems,
    auditLogs,
    purchaseOrders,
    searchTerm,
    categoryFilter,
    statusFilter,
    departmentFilter,
    locationFilter,
    selectedItems,
    currentPage,
    activeTab,
    
    // Computed values
    categories,
    departments,
    locations,
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
    setLocationFilter,
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
  }
}
