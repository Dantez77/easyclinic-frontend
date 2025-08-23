"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import {
  Package,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Download,
  AlertTriangle,
  Calendar,
  BarChart3,
  QrCode,
  History,
  ShoppingCart,
  MapPin,
  Pill,
  Stethoscope,
  TestTube,
  Syringe,
  ChevronLeft,
  ChevronRight,
  Save,
  X,
  TrendingDown,
} from "lucide-react"

// Mock inventory data
const mockInventoryItems = [
  {
    id: "INV-001",
    name: "Paracetamol 500mg",
    category: "Medicamentos",
    sku: "PAR-500-001",
    description: "Tabletas de paracetamol 500mg, caja x 100 unidades",
    supplier: "Laboratorios Bago",
    manufacturer: "Bago S.A.",
    currentStock: 45,
    minThreshold: 20,
    maxThreshold: 200,
    unitOfMeasure: "Cajas",
    unitCost: 12.5,
    totalValue: 562.5,
    location: "Farmacia - Estante A1",
    department: "Farmacia",
    expiryDate: "2025-08-15",
    batchNumber: "BAT-2024-001",
    status: "Activo",
    lastUpdated: "2024-11-15",
    updatedBy: "Dr. Ana López",
    barcode: "7501234567890",
    controlledSubstance: false,
    requiresPrescription: true,
  },
  {
    id: "INV-002",
    name: "Guantes de Látex Talla M",
    category: "Consumibles",
    sku: "GLV-LAT-M-001",
    description: "Guantes de látex desechables, talla mediana, caja x 100 pares",
    supplier: "Suministros Médicos SA",
    manufacturer: "MedGlove Inc.",
    currentStock: 8,
    minThreshold: 15,
    maxThreshold: 100,
    unitOfMeasure: "Cajas",
    unitCost: 25.0,
    totalValue: 200.0,
    location: "Almacén - Sección B2",
    department: "General",
    expiryDate: "2026-12-31",
    batchNumber: "GLV-2024-045",
    status: "Stock Bajo",
    lastUpdated: "2024-11-10",
    updatedBy: "Enfermera María",
    barcode: "7501234567891",
    controlledSubstance: false,
    requiresPrescription: false,
  },
  {
    id: "INV-003",
    name: "Jeringas Desechables 5ml",
    category: "Consumibles",
    sku: "SYR-5ML-001",
    description: "Jeringas desechables estériles de 5ml con aguja 21G",
    supplier: "Equipos Médicos del Caribe",
    manufacturer: "SyringeMax",
    currentStock: 150,
    minThreshold: 50,
    maxThreshold: 500,
    unitOfMeasure: "Unidades",
    unitCost: 0.75,
    totalValue: 112.5,
    location: "Consultorio 1 - Gaveta 3",
    department: "Consulta Externa",
    expiryDate: "2027-03-20",
    batchNumber: "SYR-2024-078",
    status: "Activo",
    lastUpdated: "2024-11-12",
    updatedBy: "Dr. Juan Pérez",
    barcode: "7501234567892",
    controlledSubstance: false,
    requiresPrescription: false,
  },
  {
    id: "INV-004",
    name: "Tramadol 50mg",
    category: "Medicamentos",
    sku: "TRA-50-001",
    description: "Tramadol clorhidrato 50mg, ampolletas x 10 unidades",
    supplier: "Farmacéutica Nacional",
    manufacturer: "PharmaPlus",
    currentStock: 25,
    minThreshold: 10,
    maxThreshold: 100,
    unitOfMeasure: "Cajas",
    unitCost: 45.0,
    totalValue: 1125.0,
    location: "Farmacia - Caja Fuerte",
    department: "Farmacia",
    expiryDate: "2024-12-30",
    batchNumber: "TRA-2024-012",
    status: "Próximo a Vencer",
    lastUpdated: "2024-11-08",
    updatedBy: "Farmacéutico Carlos",
    barcode: "7501234567893",
    controlledSubstance: true,
    requiresPrescription: true,
  },
  {
    id: "INV-005",
    name: "Kit de Prueba COVID-19",
    category: "Laboratorio",
    sku: "COV-TEST-001",
    description: "Kit de prueba rápida antígeno COVID-19, caja x 25 tests",
    supplier: "Diagnósticos Rápidos",
    manufacturer: "RapidTest Corp",
    currentStock: 12,
    minThreshold: 20,
    maxThreshold: 200,
    unitOfMeasure: "Cajas",
    unitCost: 180.0,
    totalValue: 2160.0,
    location: "Laboratorio - Refrigerador 1",
    department: "Laboratorio",
    expiryDate: "2025-06-15",
    batchNumber: "COV-2024-089",
    status: "Stock Bajo",
    lastUpdated: "2024-11-14",
    updatedBy: "Técnico Lab Rosa",
    barcode: "7501234567894",
    controlledSubstance: false,
    requiresPrescription: false,
  },
  {
    id: "INV-006",
    name: "Tensiómetro Digital",
    category: "Equipos",
    sku: "BP-DIG-001",
    description: "Tensiómetro digital automático con brazalete adulto",
    supplier: "Equipos Médicos Profesionales",
    manufacturer: "OmronHealth",
    currentStock: 3,
    minThreshold: 2,
    maxThreshold: 10,
    unitOfMeasure: "Unidades",
    unitCost: 125.0,
    totalValue: 375.0,
    location: "Consultorio 2",
    department: "Consulta Externa",
    expiryDate: null,
    batchNumber: "OMR-2024-156",
    status: "Activo",
    lastUpdated: "2024-11-01",
    updatedBy: "Dr. Ana López",
    barcode: "7501234567895",
    controlledSubstance: false,
    requiresPrescription: false,
  },
]

// Mock audit log data
const mockAuditLogs = [
  {
    id: "AUD-001",
    itemId: "INV-001",
    itemName: "Paracetamol 500mg",
    action: "Stock Actualizado",
    previousValue: "50 Cajas",
    newValue: "45 Cajas",
    reason: "Dispensado a paciente",
    user: "Dr. Ana López",
    timestamp: "2024-11-15 14:30:00",
    department: "Farmacia",
  },
  {
    id: "AUD-002",
    itemId: "INV-002",
    itemName: "Guantes de Látex Talla M",
    action: "Alerta Stock Bajo",
    previousValue: "15 Cajas",
    newValue: "8 Cajas",
    reason: "Uso en consultas",
    user: "Sistema",
    timestamp: "2024-11-10 09:15:00",
    department: "General",
  },
  {
    id: "AUD-003",
    itemId: "INV-004",
    itemName: "Tramadol 50mg",
    action: "Alerta Próximo Vencimiento",
    previousValue: "Activo",
    newValue: "Próximo a Vencer",
    reason: "Fecha de vencimiento en 45 días",
    user: "Sistema",
    timestamp: "2024-11-08 08:00:00",
    department: "Farmacia",
  },
]

// Mock purchase orders
const mockPurchaseOrders = [
  {
    id: "PO-001",
    supplier: "Laboratorios Bago",
    items: [
      { name: "Paracetamol 500mg", quantity: 50, unitCost: 12.5 },
      { name: "Ibuprofeno 400mg", quantity: 30, unitCost: 18.0 },
    ],
    total: 1165.0,
    status: "Pendiente",
    orderDate: "2024-11-12",
    expectedDelivery: "2024-11-20",
    requestedBy: "Dr. Ana López",
  },
  {
    id: "PO-002",
    supplier: "Suministros Médicos SA",
    items: [
      { name: "Guantes de Látex Talla M", quantity: 20, unitCost: 25.0 },
      { name: "Mascarillas N95", quantity: 100, unitCost: 2.5 },
    ],
    total: 750.0,
    status: "En Tránsito",
    orderDate: "2024-11-08",
    expectedDelivery: "2024-11-16",
    requestedBy: "Enfermera María",
  },
]

type InventoryItem = (typeof mockInventoryItems)[0]
type AuditLog = (typeof mockAuditLogs)[0]
type PurchaseOrder = (typeof mockPurchaseOrders)[0]

export default function InventoryPage() {
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
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewSheetOpen, setIsViewSheetOpen] = useState(false)
  const [isAuditSheetOpen, setIsAuditSheetOpen] = useState(false)
  const [isStockUpdateDialogOpen, setIsStockUpdateDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null)
  const [viewingItem, setViewingItem] = useState<InventoryItem | null>(null)
  const [updatingStockItem, setUpdatingStockItem] = useState<InventoryItem | null>(null)

  // New item form state
  const [newItem, setNewItem] = useState({
    name: "",
    category: "",
    sku: "",
    description: "",
    supplier: "",
    manufacturer: "",
    currentStock: 0,
    minThreshold: 0,
    maxThreshold: 0,
    unitOfMeasure: "",
    unitCost: 0,
    location: "",
    department: "",
    expiryDate: "",
    batchNumber: "",
    barcode: "",
    controlledSubstance: false,
    requiresPrescription: false,
  })

  // Stock update form state
  const [stockUpdate, setStockUpdate] = useState({
    action: "add", // add, remove, set
    quantity: 0,
    reason: "",
    batchNumber: "",
    expiryDate: "",
  })

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

  const handleAddItem = () => {
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

    setIsAddDialogOpen(false)
    setNewItem({
      name: "",
      category: "",
      sku: "",
      description: "",
      supplier: "",
      manufacturer: "",
      currentStock: 0,
      minThreshold: 0,
      maxThreshold: 0,
      unitOfMeasure: "",
      unitCost: 0,
      location: "",
      department: "",
      expiryDate: "",
      batchNumber: "",
      barcode: "",
      controlledSubstance: false,
      requiresPrescription: false,
    })
  }

  const handleUpdateStock = () => {
    if (!updatingStockItem) return

    let newStock = updatingStockItem.currentStock
    let actionDescription = ""

    switch (stockUpdate.action) {
      case "add":
        newStock += stockUpdate.quantity
        actionDescription = `Agregado ${stockUpdate.quantity} ${updatingStockItem.unitOfMeasure}`
        break
      case "remove":
        newStock = Math.max(0, newStock - stockUpdate.quantity)
        actionDescription = `Removido ${stockUpdate.quantity} ${updatingStockItem.unitOfMeasure}`
        break
      case "set":
        newStock = stockUpdate.quantity
        actionDescription = `Stock establecido a ${stockUpdate.quantity} ${updatingStockItem.unitOfMeasure}`
        break
    }

    // Determine new status
    let newStatus = "Activo"
    if (newStock <= updatingStockItem.minThreshold) {
      newStatus = "Stock Bajo"
    }
    if (updatingStockItem.expiryDate) {
      const expiryDate = new Date(updatingStockItem.expiryDate)
      const thirtyDaysFromNow = new Date()
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)
      if (expiryDate <= thirtyDaysFromNow) {
        newStatus = "Próximo a Vencer"
      }
    }

    // BACKEND: Update inventory item
    const updatedItems = inventoryItems.map((item) =>
      item.id === updatingStockItem.id
        ? {
          ...item,
          currentStock: newStock,
          totalValue: newStock * item.unitCost,
          status: newStatus,
          lastUpdated: format(new Date(), "yyyy-MM-dd"),
          updatedBy: "Usuario Actual",
          ...(stockUpdate.batchNumber && { batchNumber: stockUpdate.batchNumber }),
          ...(stockUpdate.expiryDate && { expiryDate: stockUpdate.expiryDate }),
        }
        : item,
    )
    setInventoryItems(updatedItems)

    // BACKEND: Add audit log entry
    const auditEntry: AuditLog = {
      id: `AUD-${String(auditLogs.length + 1).padStart(3, "0")}`,
      itemId: updatingStockItem.id,
      itemName: updatingStockItem.name,
      action: "Stock Actualizado",
      previousValue: `${updatingStockItem.currentStock} ${updatingStockItem.unitOfMeasure}`,
      newValue: `${newStock} ${updatingStockItem.unitOfMeasure}`,
      reason: stockUpdate.reason || actionDescription,
      user: "Usuario Actual",
      timestamp: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
      department: updatingStockItem.department,
    }
    setAuditLogs([auditEntry, ...auditLogs])

    setIsStockUpdateDialogOpen(false)
    setUpdatingStockItem(null)
    setStockUpdate({
      action: "add",
      quantity: 0,
      reason: "",
      batchNumber: "",
      expiryDate: "",
    })
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Activo":
        return "default"
      case "Stock Bajo":
        return "destructive"
      case "Próximo a Vencer":
        return "secondary"
      case "Vencido":
        return "destructive"
      default:
        return "outline"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Activo":
        return <Package className="w-4 h-4" />
      case "Stock Bajo":
        return <AlertTriangle className="w-4 h-4" />
      case "Próximo a Vencer":
        return <Calendar className="w-4 h-4" />
      case "Vencido":
        return <X className="w-4 h-4" />
      default:
        return <Package className="w-4 h-4" />
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Medicamentos":
        return <Pill className="w-4 h-4" />
      case "Consumibles":
        return <Syringe className="w-4 h-4" />
      case "Equipos":
        return <Stethoscope className="w-4 h-4" />
      case "Laboratorio":
        return <TestTube className="w-4 h-4" />
      default:
        return <Package className="w-4 h-4" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 lg:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Package className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Inventario Médico</h1>
                <p className="text-sm lg:text-base text-gray-500">
                  {filteredItems.length} artículo{filteredItems.length !== 1 ? "s" : ""} en inventario
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleExport} variant="outline" className="bg-transparent">
                <Download className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Exportar</span>
              </Button>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Nuevo </span>Artículo
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
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
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Valor Total Inventario</p>
                      <p className="text-2xl font-bold text-green-600">${totalStockValue.toLocaleString()}</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <BarChart3 className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Stock Bajo</p>
                      <p className="text-2xl font-bold text-red-600">{lowStockItems.length}</p>
                    </div>
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                      <TrendingDown className="w-6 h-6 text-red-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Próximos a Vencer</p>
                      <p className="text-2xl font-bold text-yellow-600">{expiringItems.length}</p>
                    </div>
                    <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-yellow-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Sustancias Controladas</p>
                      <p className="text-2xl font-bold text-purple-600">{controlledItems.length}</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <AlertTriangle className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Alerts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Low Stock Alerts */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    Alertas de Stock Bajo
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {lowStockItems.slice(0, 5).map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          {getCategoryIcon(item.category)}
                          <div>
                            <p className="font-medium text-sm">{item.name}</p>
                            <p className="text-xs text-gray-500">{item.location}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-red-600">
                            {item.currentStock} / {item.minThreshold}
                          </p>
                          <p className="text-xs text-gray-500">{item.unitOfMeasure}</p>
                        </div>
                      </div>
                    ))}
                    {lowStockItems.length === 0 && (
                      <p className="text-center text-gray-500 py-4">No hay alertas de stock bajo</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Expiring Items */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-yellow-600" />
                    Próximos a Vencer (30 días)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {expiringItems.slice(0, 5).map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          {getCategoryIcon(item.category)}
                          <div>
                            <p className="font-medium text-sm">{item.name}</p>
                            <p className="text-xs text-gray-500">Lote: {item.batchNumber}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-yellow-600">
                            {item.expiryDate && format(new Date(item.expiryDate), "dd/MM/yyyy")}
                          </p>
                          <p className="text-xs text-gray-500">
                            {item.currentStock} {item.unitOfMeasure}
                          </p>
                        </div>
                      </div>
                    ))}
                    {expiringItems.length === 0 && (
                      <p className="text-center text-gray-500 py-4">No hay artículos próximos a vencer</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Top Categories Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Distribución por Categorías</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categories.map((category) => {
                    const categoryItems = inventoryItems.filter((item) => item.category === category)
                    const categoryValue = categoryItems.reduce((sum, item) => sum + item.totalValue, 0)
                    const percentage = (categoryValue / totalStockValue) * 100

                    return (
                      <div key={category} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {getCategoryIcon(category)}
                          <div>
                            <p className="font-medium">{category}</p>
                            <p className="text-sm text-gray-500">{categoryItems.length} artículos</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">${categoryValue.toLocaleString()}</p>
                          <div className="flex items-center gap-2">
                            <div className="w-20 h-2 bg-gray-200 rounded-full">
                              <div className="h-2 bg-blue-600 rounded-full" style={{ width: `${percentage}%` }}></div>
                            </div>
                            <span className="text-xs text-gray-500">{percentage.toFixed(1)}%</span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Inventory Tab */}
          <TabsContent value="inventory" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        placeholder="Buscar por nombre, SKU, descripción o proveedor..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger className="w-full sm:w-40">
                        <SelectValue placeholder="Categoría" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas las categorías</SelectItem>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-full sm:w-40">
                        <SelectValue placeholder="Estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos los estados</SelectItem>
                        <SelectItem value="Activo">Activo</SelectItem>
                        <SelectItem value="Stock Bajo">Stock Bajo</SelectItem>
                        <SelectItem value="Próximo a Vencer">Próximo a Vencer</SelectItem>
                        <SelectItem value="Vencido">Vencido</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                      <SelectTrigger className="w-full sm:w-40">
                        <SelectValue placeholder="Departamento" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos los departamentos</SelectItem>
                        {departments.map((department) => (
                          <SelectItem key={department} value={department}>
                            {department}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Bulk Actions */}
            {selectedItems.length > 0 && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      {selectedItems.length} artículo{selectedItems.length !== 1 ? "s" : ""} seleccionado
                      {selectedItems.length !== 1 ? "s" : ""}
                    </span>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="bg-transparent">
                        <QrCode className="w-4 h-4 mr-2" />
                        Imprimir Códigos
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Eliminar Seleccionados
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>¿Eliminar artículos seleccionados?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta acción eliminará permanentemente {selectedItems.length} artículo
                              {selectedItems.length !== 1 ? "s" : ""} del inventario. Esta acción no se puede deshacer.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={handleBulkDelete} className="bg-red-600 hover:bg-red-700">
                              Eliminar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Inventory Table */}
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="p-4 text-left">
                        <Checkbox
                          checked={selectedItems.length === paginatedItems.length && paginatedItems.length > 0}
                          onCheckedChange={handleSelectAll}
                        />
                      </th>
                      <th className="p-4 text-left text-sm font-medium text-gray-900">Artículo</th>
                      <th className="p-4 text-left text-sm font-medium text-gray-900 hidden md:table-cell">Stock</th>
                      <th className="p-4 text-left text-sm font-medium text-gray-900 hidden lg:table-cell">
                        Ubicación
                      </th>
                      <th className="p-4 text-left text-sm font-medium text-gray-900 hidden sm:table-cell">Estado</th>
                      <th className="p-4 text-left text-sm font-medium text-gray-900 hidden lg:table-cell">Valor</th>
                      <th className="p-4 text-left text-sm font-medium text-gray-900">Acciones</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                    {paginatedItems.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="p-4">
                          <Checkbox
                            checked={selectedItems.includes(item.id)}
                            onCheckedChange={(checked) => handleSelectItem(item.id, checked as boolean)}
                          />
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              {getCategoryIcon(item.category)}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{item.name}</div>
                              <div className="text-sm text-gray-500">{item.sku}</div>
                              <div className="text-xs text-gray-400 md:hidden">
                                Stock: {item.currentStock} {item.unitOfMeasure}
                              </div>
                              {item.controlledSubstance && (
                                <Badge variant="destructive" className="text-xs mt-1">
                                  Controlada
                                </Badge>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="p-4 hidden md:table-cell">
                          <div className="text-sm">
                            <div className="font-medium text-gray-900">
                              {item.currentStock} {item.unitOfMeasure}
                            </div>
                            <div className="text-gray-500">
                              Mín: {item.minThreshold} | Máx: {item.maxThreshold}
                            </div>
                            {item.currentStock <= item.minThreshold && (
                              <div className="text-red-600 text-xs font-medium">¡Stock Bajo!</div>
                            )}
                          </div>
                        </td>
                        <td className="p-4 hidden lg:table-cell">
                          <div className="text-sm">
                            <div className="flex items-center gap-1 text-gray-900">
                              <MapPin className="w-3 h-3" />
                              {item.location}
                            </div>
                            <div className="text-gray-500">{item.department}</div>
                          </div>
                        </td>
                        <td className="p-4 hidden sm:table-cell">
                          <Badge variant={getStatusColor(item.status)} className="flex items-center gap-1">
                            {getStatusIcon(item.status)}
                            {item.status}
                          </Badge>
                        </td>
                        <td className="p-4 hidden lg:table-cell">
                          <div className="text-sm">
                            <div className="font-medium text-gray-900">${item.totalValue.toLocaleString()}</div>
                            <div className="text-gray-500">${item.unitCost} c/u</div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setViewingItem(item)
                                setIsViewSheetOpen(true)
                              }}
                              className="h-8 w-8 p-0"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setUpdatingStockItem(item)
                                setIsStockUpdateDialogOpen(true)
                              }}
                              className="h-8 w-8 p-0"
                              title="Actualizar Stock"
                            >
                              <Package className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setEditingItem(item)
                                setIsEditDialogOpen(true)
                              }}
                              className="h-8 w-8 p-0"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handlePrintBarcode(item)}
                              className="h-8 w-8 p-0"
                              title="Imprimir Código de Barras"
                            >
                              <QrCode className="w-4 h-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>¿Eliminar artículo?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Esta acción eliminará permanentemente "{item.name}" del inventario. Esta acción no
                                    se puede deshacer.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteItem(item.id)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Eliminar
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </td>
                      </tr>
                    ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between p-4 border-t">
                    <div className="text-sm text-gray-500">
                      Mostrando {(currentPage - 1) * itemsPerPage + 1} a{" "}
                      {Math.min(currentPage * itemsPerPage, filteredItems.length)} de {filteredItems.length} artículos
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="bg-transparent"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <span className="text-sm">
                        Página {currentPage} de {totalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="bg-transparent"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Audit Tab */}
          <TabsContent value="audit" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="w-5 h-5" />
                  Registro de Auditoría
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {auditLogs.map((log) => (
                    <div key={log.id} className="flex items-start gap-4 p-4 border rounded-lg">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <History className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900">{log.action}</h4>
                            <p className="text-sm text-gray-600">{log.itemName}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {log.previousValue} → {log.newValue}
                            </p>
                            {log.reason && <p className="text-xs text-gray-500">Razón: {log.reason}</p>}
                          </div>
                          <div className="text-right text-xs text-gray-500">
                            <p>{log.user}</p>
                            <p>{log.timestamp}</p>
                            <Badge variant="outline" className="mt-1">
                              {log.department}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  Órdenes de Compra
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {purchaseOrders.map((order) => (
                    <div key={order.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="font-medium text-gray-900">{order.id}</h4>
                          <p className="text-sm text-gray-600">{order.supplier}</p>
                          <p className="text-xs text-gray-500">Solicitado por: {order.requestedBy}</p>
                        </div>
                        <div className="text-right">
                          <Badge
                            variant={
                              order.status === "Pendiente"
                                ? "secondary"
                                : order.status === "En Tránsito"
                                  ? "default"
                                  : "outline"
                            }
                          >
                            {order.status}
                          </Badge>
                          <p className="text-sm font-bold text-green-600 mt-1">${order.total.toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span>{item.name}</span>
                            <span>
                              {item.quantity} x ${item.unitCost} = ${(item.quantity * item.unitCost).toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between items-center mt-4 pt-4 border-t">
                        <div className="text-sm text-gray-500">
                          <p>Fecha: {format(new Date(order.orderDate), "dd/MM/yyyy")}</p>
                          <p>Entrega esperada: {format(new Date(order.expectedDelivery), "dd/MM/yyyy")}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="bg-transparent">
                            <Eye className="w-4 h-4 mr-2" />
                            Ver
                          </Button>
                          <Button variant="outline" size="sm" className="bg-transparent">
                            <Download className="w-4 h-4 mr-2" />
                            PDF
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Add Item Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Agregar Nuevo Artículo</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nombre del Artículo *</Label>
                <Input
                  id="name"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  placeholder="Ej: Paracetamol 500mg"
                />
              </div>
              <div>
                <Label htmlFor="sku">SKU/Código *</Label>
                <Input
                  id="sku"
                  value={newItem.sku}
                  onChange={(e) => setNewItem({ ...newItem, sku: e.target.value })}
                  placeholder="Ej: PAR-500-001"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                value={newItem.description}
                onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                placeholder="Descripción detallada del artículo..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Categoría *</Label>
                <Select value={newItem.category} onValueChange={(value) => setNewItem({ ...newItem, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Medicamentos">Medicamentos</SelectItem>
                    <SelectItem value="Consumibles">Consumibles</SelectItem>
                    <SelectItem value="Equipos">Equipos</SelectItem>
                    <SelectItem value="Laboratorio">Laboratorio</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Departamento *</Label>
                <Select
                  value={newItem.department}
                  onValueChange={(value) => setNewItem({ ...newItem, department: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar departamento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Farmacia">Farmacia</SelectItem>
                    <SelectItem value="Consulta Externa">Consulta Externa</SelectItem>
                    <SelectItem value="Laboratorio">Laboratorio</SelectItem>
                    <SelectItem value="General">General</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="supplier">Proveedor</Label>
                <Input
                  id="supplier"
                  value={newItem.supplier}
                  onChange={(e) => setNewItem({ ...newItem, supplier: e.target.value })}
                  placeholder="Nombre del proveedor"
                />
              </div>
              <div>
                <Label htmlFor="manufacturer">Fabricante</Label>
                <Input
                  id="manufacturer"
                  value={newItem.manufacturer}
                  onChange={(e) => setNewItem({ ...newItem, manufacturer: e.target.value })}
                  placeholder="Nombre del fabricante"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="currentStock">Stock Actual *</Label>
                <Input
                  id="currentStock"
                  type="number"
                  min="0"
                  value={newItem.currentStock}
                  onChange={(e) => setNewItem({ ...newItem, currentStock: Number.parseInt(e.target.value) || 0 })}
                />
              </div>
              <div>
                <Label htmlFor="minThreshold">Stock Mínimo *</Label>
                <Input
                  id="minThreshold"
                  type="number"
                  min="0"
                  value={newItem.minThreshold}
                  onChange={(e) => setNewItem({ ...newItem, minThreshold: Number.parseInt(e.target.value) || 0 })}
                />
              </div>
              <div>
                <Label htmlFor="maxThreshold">Stock Máximo</Label>
                <Input
                  id="maxThreshold"
                  type="number"
                  min="0"
                  value={newItem.maxThreshold}
                  onChange={(e) => setNewItem({ ...newItem, maxThreshold: Number.parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="unitOfMeasure">Unidad de Medida *</Label>
                <Select
                  value={newItem.unitOfMeasure}
                  onValueChange={(value) => setNewItem({ ...newItem, unitOfMeasure: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar unidad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Unidades">Unidades</SelectItem>
                    <SelectItem value="Cajas">Cajas</SelectItem>
                    <SelectItem value="Frascos">Frascos</SelectItem>
                    <SelectItem value="Viales">Viales</SelectItem>
                    <SelectItem value="Ampolletas">Ampolletas</SelectItem>
                    <SelectItem value="Litros">Litros</SelectItem>
                    <SelectItem value="Mililitros">Mililitros</SelectItem>
                    <SelectItem value="Gramos">Gramos</SelectItem>
                    <SelectItem value="Kilogramos">Kilogramos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="unitCost">Costo Unitario *</Label>
                <Input
                  id="unitCost"
                  type="number"
                  min="0"
                  step="0.01"
                  value={newItem.unitCost}
                  onChange={(e) => setNewItem({ ...newItem, unitCost: Number.parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div>
                <Label htmlFor="location">Ubicación *</Label>
                <Input
                  id="location"
                  value={newItem.location}
                  onChange={(e) => setNewItem({ ...newItem, location: e.target.value })}
                  placeholder="Ej: Farmacia - Estante A1"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="expiryDate">Fecha de Vencimiento</Label>
                <Input
                  id="expiryDate"
                  type="date"
                  value={newItem.expiryDate}
                  onChange={(e) => setNewItem({ ...newItem, expiryDate: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="batchNumber">Número de Lote</Label>
                <Input
                  id="batchNumber"
                  value={newItem.batchNumber}
                  onChange={(e) => setNewItem({ ...newItem, batchNumber: e.target.value })}
                  placeholder="Ej: BAT-2024-001"
                />
              </div>
              <div>
                <Label htmlFor="barcode">Código de Barras</Label>
                <Input
                  id="barcode"
                  value={newItem.barcode}
                  onChange={(e) => setNewItem({ ...newItem, barcode: e.target.value })}
                  placeholder="Ej: 7501234567890"
                />
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="controlledSubstance"
                  checked={newItem.controlledSubstance}
                  onCheckedChange={(checked) => setNewItem({ ...newItem, controlledSubstance: checked as boolean })}
                />
                <Label htmlFor="controlledSubstance">Sustancia Controlada</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="requiresPrescription"
                  checked={newItem.requiresPrescription}
                  onCheckedChange={(checked) => setNewItem({ ...newItem, requiresPrescription: checked as boolean })}
                />
                <Label htmlFor="requiresPrescription">Requiere Receta</Label>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="bg-transparent">
                Cancelar
              </Button>
              <Button
                onClick={handleAddItem}
                disabled={!newItem.name || !newItem.sku || !newItem.category || !newItem.unitOfMeasure}
              >
                <Save className="w-4 h-4 mr-2" />
                Agregar Artículo
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Stock Update Dialog */}
      <Dialog open={isStockUpdateDialogOpen} onOpenChange={setIsStockUpdateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Actualizar Stock</DialogTitle>
          </DialogHeader>
          {updatingStockItem && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium">{updatingStockItem.name}</h4>
                <p className="text-sm text-gray-500">SKU: {updatingStockItem.sku}</p>
                <p className="text-sm text-gray-500">
                  Stock actual: {updatingStockItem.currentStock} {updatingStockItem.unitOfMeasure}
                </p>
              </div>

              <div>
                <Label>Acción</Label>
                <Select
                  value={stockUpdate.action}
                  onValueChange={(value) => setStockUpdate({ ...stockUpdate, action: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="add">Agregar Stock</SelectItem>
                    <SelectItem value="remove">Remover Stock</SelectItem>
                    <SelectItem value="set">Establecer Stock</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="quantity">{stockUpdate.action === "set" ? "Nuevo Stock" : "Cantidad"}</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="0"
                  value={stockUpdate.quantity}
                  onChange={(e) => setStockUpdate({ ...stockUpdate, quantity: Number.parseInt(e.target.value) || 0 })}
                />
              </div>

              <div>
                <Label htmlFor="reason">Razón</Label>
                <Textarea
                  id="reason"
                  value={stockUpdate.reason}
                  onChange={(e) => setStockUpdate({ ...stockUpdate, reason: e.target.value })}
                  placeholder="Motivo de la actualización..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="newBatchNumber">Nuevo Lote (opcional)</Label>
                  <Input
                    id="newBatchNumber"
                    value={stockUpdate.batchNumber}
                    onChange={(e) => setStockUpdate({ ...stockUpdate, batchNumber: e.target.value })}
                    placeholder="Número de lote"
                  />
                </div>
                <div>
                  <Label htmlFor="newExpiryDate">Nueva Fecha de Vencimiento (opcional)</Label>
                  <Input
                    id="newExpiryDate"
                    type="date"
                    value={stockUpdate.expiryDate}
                    onChange={(e) => setStockUpdate({ ...stockUpdate, expiryDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsStockUpdateDialogOpen(false)} className="bg-transparent">
                  Cancelar
                </Button>
                <Button onClick={handleUpdateStock} disabled={stockUpdate.quantity <= 0}>
                  <Save className="w-4 h-4 mr-2" />
                  Actualizar Stock
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* View Item Sheet */}
      <Sheet open={isViewSheetOpen} onOpenChange={setIsViewSheetOpen}>
        <SheetContent className="w-full sm:max-w-2xl">
          <SheetHeader>
            <SheetTitle>Detalle del Artículo</SheetTitle>
          </SheetHeader>
          {viewingItem && (
            <ScrollArea className="h-[calc(100vh-120px)] pr-4">
              <div className="space-y-6 pb-8 pr-2">
                {/* Item Header */}
                <div className="border-b pb-4">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                      {getCategoryIcon(viewingItem.category)}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{viewingItem.name}</h3>
                      <p className="text-sm text-gray-500">{viewingItem.sku}</p>
                      <Badge variant={getStatusColor(viewingItem.status)} className="mt-1">
                        {viewingItem.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Basic Information */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Información Básica</h4>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm text-gray-500">Categoría:</span>
                        <p className="font-medium">{viewingItem.category}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Departamento:</span>
                        <p className="font-medium">{viewingItem.department}</p>
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Descripción:</span>
                      <p className="font-medium">{viewingItem.description}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm text-gray-500">Proveedor:</span>
                        <p className="font-medium">{viewingItem.supplier}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Fabricante:</span>
                        <p className="font-medium">{viewingItem.manufacturer}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stock Information */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Información de Stock</h4>
                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <span className="text-sm text-gray-500">Stock Actual:</span>
                        <p className="font-bold text-lg">
                          {viewingItem.currentStock} {viewingItem.unitOfMeasure}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Stock Mínimo:</span>
                        <p className="font-medium">
                          {viewingItem.minThreshold} {viewingItem.unitOfMeasure}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Stock Máximo:</span>
                        <p className="font-medium">
                          {viewingItem.maxThreshold} {viewingItem.unitOfMeasure}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm text-gray-500">Costo Unitario:</span>
                        <p className="font-medium">${viewingItem.unitCost.toLocaleString()}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Valor Total:</span>
                        <p className="font-bold text-green-600">${viewingItem.totalValue.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Location & Tracking */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Ubicación y Seguimiento</h4>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-gray-500">Ubicación:</span>
                      <p className="font-medium flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {viewingItem.location}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm text-gray-500">Número de Lote:</span>
                        <p className="font-medium">{viewingItem.batchNumber}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Código de Barras:</span>
                        <p className="font-medium font-mono text-sm">{viewingItem.barcode}</p>
                      </div>
                    </div>
                    {viewingItem.expiryDate && (
                      <div>
                        <span className="text-sm text-gray-500">Fecha de Vencimiento:</span>
                        <p className="font-medium">
                          {format(new Date(viewingItem.expiryDate), "dd/MM/yyyy", { locale: es })}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Compliance & Safety */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Cumplimiento y Seguridad</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Checkbox checked={viewingItem.controlledSubstance} disabled />
                      <span className="text-sm">Sustancia Controlada</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox checked={viewingItem.requiresPrescription} disabled />
                      <span className="text-sm">Requiere Receta Médica</span>
                    </div>
                  </div>
                </div>

                {/* Last Update */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Última Actualización</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Fecha:</span>
                      <span className="text-sm font-medium">
                        {format(new Date(viewingItem.lastUpdated), "dd/MM/yyyy", { locale: es })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Usuario:</span>
                      <span className="text-sm font-medium">{viewingItem.updatedBy}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-2 pt-4 sticky bottom-0 bg-white pb-4">
                  <Button
                    variant="outline"
                    className="flex-1 bg-transparent"
                    onClick={() => {
                      setUpdatingStockItem(viewingItem)
                      setIsStockUpdateDialogOpen(true)
                      setIsViewSheetOpen(false)
                    }}
                  >
                    <Package className="w-4 h-4 mr-2" />
                    Actualizar Stock
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 bg-transparent"
                    onClick={() => handlePrintBarcode(viewingItem)}
                  >
                    <QrCode className="w-4 h-4 mr-2" />
                    Imprimir Código
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 bg-transparent"
                    onClick={() => {
                      setEditingItem(viewingItem)
                      setIsEditDialogOpen(true)
                      setIsViewSheetOpen(false)
                    }}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Editar
                  </Button>
                </div>
              </div>
            </ScrollArea>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
