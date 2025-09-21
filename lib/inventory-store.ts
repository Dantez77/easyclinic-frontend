import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { inventoryAPI, type InventoryItem, type PurchaseOrder, type AuditLog, type Alert } from './inventory-api'

interface InventoryFilters {
  search: string
  category: string
  status: string
  department: string
  location: string
  sortBy: string
  sortOrder: 'ASC' | 'DESC'
}

interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

interface InventoryState {
  // Data
  items: InventoryItem[]
  selectedItems: string[]
  filters: InventoryFilters
  pagination: Pagination
  alerts: Alert[]
  purchaseOrders: PurchaseOrder[]
  auditLogs: AuditLog[]
  
  // UI State
  loading: boolean
  error: string | null
  activeTab: string
  modals: {
    addItem: boolean
    updateStock: boolean
    viewItem: boolean
    createPO: boolean
    scanner: boolean
    editItem: boolean
  }
  
  // Current selections
  currentItem: InventoryItem | null
  currentPO: PurchaseOrder | null
  
  // Computed values
  totalStockValue: number
  lowStockItems: InventoryItem[]
  expiringItems: InventoryItem[]
  controlledItems: InventoryItem[]
  
  // Filter options
  categories: string[]
  departments: string[]
  locations: string[]
}

interface InventoryActions {
  // Data actions
  fetchItems: () => Promise<void>
  fetchItem: (id: string) => Promise<void>
  createItem: (item: Omit<InventoryItem, 'id' | 'total_value' | 'created_at' | 'updated_at'>) => Promise<void>
  updateItem: (id: string, item: Partial<InventoryItem>) => Promise<void>
  deleteItem: (id: string, reason: string) => Promise<void>
  updateStock: (itemId: string, action: 'add' | 'remove' | 'set', quantity: number, reason: string, batchNumber?: string, expiryDate?: string) => Promise<void>
  
  // Alerts
  fetchAlerts: () => Promise<void>
  dismissAlert: (alertId: string) => Promise<void>
  
  // Purchase Orders
  fetchPurchaseOrders: () => Promise<void>
  createPurchaseOrder: (po: any) => Promise<void>
  updatePurchaseOrderStatus: (id: string, status: string, actualDelivery?: string) => Promise<void>
  receivePurchaseOrderItems: (id: string, receivedItems: Array<{item_id: string, quantity_received: number, date_received: string}>) => Promise<void>
  downloadPurchaseOrderPDF: (id: string) => Promise<void>
  
  // Audit Logs
  fetchAuditLogs: () => Promise<void>
  
  // UI actions
  setFilters: (filters: Partial<InventoryFilters>) => void
  setPagination: (pagination: Partial<Pagination>) => void
  setSelectedItems: (items: string[]) => void
  selectItem: (itemId: string, selected: boolean) => void
  selectAllItems: (selected: boolean) => void
  setActiveTab: (tab: string) => void
  openModal: (modal: keyof InventoryState['modals']) => void
  closeModal: (modal: keyof InventoryState['modals']) => void
  setCurrentItem: (item: InventoryItem | null) => void
  setCurrentPO: (po: PurchaseOrder | null) => void
  setError: (error: string | null) => void
  clearError: () => void
  
  // Bulk actions
  bulkDeleteItems: (itemIds: string[], reason: string) => Promise<void>
  bulkUpdateStock: (updates: Array<{ itemId: string; action: 'add' | 'remove' | 'set'; quantity: number; reason: string }>) => Promise<void>
  
  // Export
  exportInventory: (format: 'csv' | 'json') => Promise<void>
}

type InventoryStore = InventoryState & InventoryActions

const initialFilters: InventoryFilters = {
  search: '',
  category: '',
  status: '',
  department: '',
  location: '',
  sortBy: 'name',
  sortOrder: 'ASC'
}

const initialPagination: Pagination = {
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0
}

export const useInventoryStore = create<InventoryStore>()(
  devtools(
    (set, get) => ({
      // Initial state
      items: [],
      selectedItems: [],
      filters: initialFilters,
      pagination: initialPagination,
      alerts: [],
      purchaseOrders: [],
      auditLogs: [],
      loading: false,
      error: null,
      activeTab: 'inventory',
      modals: {
        addItem: false,
        updateStock: false,
        viewItem: false,
        createPO: false,
        scanner: false,
        editItem: false
      },
      currentItem: null,
      currentPO: null,
      totalStockValue: 0,
      lowStockItems: [],
      expiringItems: [],
      controlledItems: [],
      categories: [],
      departments: [],
      locations: [],

      // Actions
      fetchItems: async () => {
        set({ loading: true, error: null })
        try {
          const { filters, pagination } = get()
          const response = await inventoryAPI.getItems({
            ...filters,
            page: pagination.page,
            limit: pagination.limit
          })
          
          set({
            items: response.items,
            pagination: response.pagination,
            categories: response.filters?.categories || [],
            departments: response.filters?.departments || [],
            locations: response.filters?.locations || [],
            totalStockValue: response.items.reduce((sum, item) => sum + item.total_value, 0),
            lowStockItems: response.items.filter(item => item.current_stock <= item.min_threshold),
            expiringItems: response.items.filter(item => {
              if (!item.expiry_date) return false
              const expiryDate = new Date(item.expiry_date)
              const thirtyDaysFromNow = new Date()
              thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)
              return expiryDate <= thirtyDaysFromNow
            }),
            controlledItems: response.items.filter(item => item.controlled_substance),
            loading: false
          })
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch items',
            loading: false 
          })
        }
      },

      fetchItem: async (id: string) => {
        set({ loading: true, error: null })
        try {
          const item = await inventoryAPI.getItem(id)
          set({ currentItem: item, loading: false })
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch item',
            loading: false 
          })
        }
      },

      createItem: async (itemData) => {
        set({ loading: true, error: null })
        try {
          const result = await inventoryAPI.createItem(itemData)
          await get().fetchItems() // Refresh items
          set({ loading: false })
          get().closeModal('addItem')
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to create item',
            loading: false 
          })
        }
      },

      updateItem: async (id: string, itemData: Partial<InventoryItem>) => {
        set({ loading: true, error: null })
        try {
          const result = await inventoryAPI.updateItem(id, itemData)
          await get().fetchItems() // Refresh items
          set({ loading: false })
          get().closeModal('editItem')
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to update item',
            loading: false 
          })
        }
      },

      deleteItem: async (id: string, reason: string) => {
        set({ loading: true, error: null })
        try {
          await inventoryAPI.deleteItem(id, reason)
          await get().fetchItems() // Refresh items
          set({ 
            selectedItems: get().selectedItems.filter(itemId => itemId !== id),
            loading: false 
          })
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to delete item',
            loading: false 
          })
        }
      },

      updateStock: async (itemId: string, action: 'add' | 'remove' | 'set', quantity: number, reason: string, batchNumber?: string, expiryDate?: string) => {
        set({ loading: true, error: null })
        try {
          const result = await inventoryAPI.updateStock(itemId, {
            action,
            quantity,
            reason,
            batch_number: batchNumber,
            expiry_date: expiryDate
          })
          
          await get().fetchItems() // Refresh items
          set({ loading: false })
          get().closeModal('updateStock')
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to update stock',
            loading: false 
          })
        }
      },

      fetchAlerts: async () => {
        try {
          const [lowStock, expiring, controlled] = await Promise.all([
            inventoryAPI.getLowStockAlerts(),
            inventoryAPI.getExpiringItems(30),
            inventoryAPI.getControlledSubstanceAlerts()
          ])
          
          set({
            alerts: [...lowStock, ...expiring, ...controlled]
          })
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch alerts'
          })
        }
      },

      dismissAlert: async (alertId: string) => {
        try {
          await inventoryAPI.dismissAlert(alertId)
          set({
            alerts: get().alerts.filter(alert => alert.id !== alertId)
          })
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to dismiss alert'
          })
        }
      },

      fetchPurchaseOrders: async () => {
        set({ loading: true, error: null })
        try {
          const response = await inventoryAPI.getPurchaseOrders()
          set({ 
            purchaseOrders: response.items,
            loading: false 
          })
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch purchase orders',
            loading: false 
          })
        }
      },

      createPurchaseOrder: async (poData) => {
        set({ loading: true, error: null })
        try {
          await inventoryAPI.createPurchaseOrder(poData)
          await get().fetchPurchaseOrders() // Refresh POs
          set({ loading: false })
          get().closeModal('createPO')
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to create purchase order',
            loading: false 
          })
        }
      },

      updatePurchaseOrderStatus: async (id: string, status: string, actualDelivery?: string) => {
        set({ loading: true, error: null })
        try {
          await inventoryAPI.updatePurchaseOrder(id, { status, actual_delivery: actualDelivery })
          await get().fetchPurchaseOrders() // Refresh POs
          set({ loading: false })
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to update purchase order',
            loading: false 
          })
        }
      },

      receivePurchaseOrderItems: async (id: string, receivedItems: Array<{item_id: string, quantity_received: number, date_received: string}>) => {
        set({ loading: true, error: null })
        try {
          await inventoryAPI.receivePurchaseOrder(id, receivedItems)
          await get().fetchPurchaseOrders() // Refresh POs
          await get().fetchItems() // Refresh inventory items as stock will be updated
          set({ loading: false })
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to receive items',
            loading: false 
          })
        }
      },

      downloadPurchaseOrderPDF: async (id: string) => {
        try {
          const blob = await inventoryAPI.generatePurchaseOrderPDF(id)
          const url = window.URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.href = url
          link.download = `purchase-order-${id}.pdf`
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          window.URL.revokeObjectURL(url)
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to download PDF'
          })
        }
      },

      fetchAuditLogs: async () => {
        set({ loading: true, error: null })
        try {
          const response = await inventoryAPI.getAuditLogs()
          set({ 
            auditLogs: response.items,
            loading: false 
          })
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch audit logs',
            loading: false 
          })
        }
      },

      // UI Actions
      setFilters: (newFilters) => {
        set({ 
          filters: { ...get().filters, ...newFilters },
          pagination: { ...get().pagination, page: 1 } // Reset to first page
        })
        get().fetchItems() // Auto-fetch when filters change
      },

      setPagination: (newPagination) => {
        set({ pagination: { ...get().pagination, ...newPagination } })
        get().fetchItems() // Auto-fetch when pagination changes
      },

      setSelectedItems: (items) => {
        set({ selectedItems: items })
      },

      selectItem: (itemId, selected) => {
        const { selectedItems } = get()
        if (selected) {
          set({ selectedItems: [...selectedItems, itemId] })
        } else {
          set({ selectedItems: selectedItems.filter(id => id !== itemId) })
        }
      },

      selectAllItems: (selected) => {
        const { items } = get()
        if (selected) {
          set({ selectedItems: items.map(item => item.id) })
        } else {
          set({ selectedItems: [] })
        }
      },

      setActiveTab: (tab) => {
        set({ activeTab: tab })
      },

      openModal: (modal) => {
        set({ modals: { ...get().modals, [modal]: true } })
      },

      closeModal: (modal) => {
        set({ modals: { ...get().modals, [modal]: false } })
      },

      setCurrentItem: (item) => {
        set({ currentItem: item })
      },

      setCurrentPO: (po) => {
        set({ currentPO: po })
      },

      setError: (error) => {
        set({ error })
      },

      clearError: () => {
        set({ error: null })
      },

      // Bulk Actions
      bulkDeleteItems: async (itemIds, reason) => {
        set({ loading: true, error: null })
        try {
          await Promise.all(itemIds.map(id => inventoryAPI.deleteItem(id, reason)))
          await get().fetchItems() // Refresh items
          set({ 
            selectedItems: [],
            loading: false 
          })
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to delete items',
            loading: false 
          })
        }
      },

      bulkUpdateStock: async (updates) => {
        set({ loading: true, error: null })
        try {
          await inventoryAPI.bulkUpdateStock({ updates })
          await get().fetchItems() // Refresh items
          set({ 
            selectedItems: [],
            loading: false 
          })
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to update stock',
            loading: false 
          })
        }
      },

      exportInventory: async (format) => {
        set({ loading: true, error: null })
        try {
          const blob = await inventoryAPI.exportInventory({ format })
          
          // Create download link
          const url = window.URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.href = url
          link.download = `inventory_${new Date().toISOString().split('T')[0]}.${format}`
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          window.URL.revokeObjectURL(url)
          
          set({ loading: false })
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to export inventory',
            loading: false 
          })
        }
      }
    }),
    {
      name: 'inventory-store'
    }
  )
)
