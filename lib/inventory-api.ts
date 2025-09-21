import { apiClient } from './api'
import { config } from './config'

// Types
export interface InventoryItem {
  id: string
  name: string
  sku: string
  description?: string
  category: string
  department: string
  supplier?: string
  manufacturer?: string
  current_stock: number
  min_threshold: number
  max_threshold?: number
  unit_of_measure: string
  unit_cost: number
  total_value: number
  location: string
  batch_number?: string
  barcode?: string
  expiry_date?: string
  status: string
  controlled_substance: boolean
  requires_prescription: boolean
  created_at: string
  updated_at: string
  created_by?: string
  updated_by?: string
  creator?: {
    id: string
    firstName: string
    lastName: string
  }
  updater?: {
    id: string
    firstName: string
    lastName: string
  }
}

export interface PaginatedResponse<T> {
  items: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  filters?: {
    categories: string[]
    departments: string[]
    locations: string[]
  }
}

export interface StockUpdateRequest {
  action: 'add' | 'remove' | 'set'
  quantity: number
  reason: string
  batch_number?: string
  expiry_date?: string
}

export interface StockUpdateResponse {
  item: InventoryItem
  movement: {
    id: string
    item_id: string
    movement_type: string
    quantity: number
    previous_stock: number
    new_stock: number
    reason: string
    user_id: string
    created_at: string
  }
  previousStock: number
  newStock: number
}

export interface BulkStockUpdate {
  updates: Array<{
    itemId: string
    action: 'add' | 'remove' | 'set'
    quantity: number
    reason: string
  }>
}

export interface PurchaseOrder {
  id: string
  po_number: string
  supplier: string
  status: string
  order_date: string
  expected_delivery?: string
  actual_delivery?: string
  subtotal: number
  tax: number
  total: number
  items: PurchaseOrderItem[]
  requested_by?: string
  approved_by?: string
}

export interface PurchaseOrderItem {
  id: string
  item_id: string
  quantity: number
  unit_cost: number
  total_cost: number
  quantity_received?: number
  date_received?: string
}

export interface AuditLog {
  id: string
  item_id: string
  item_name: string
  action: string
  previous_value?: string
  new_value?: string
  reason?: string
  user_id: string
  user_name: string
  department?: string
  timestamp: string
}

export interface Alert {
  id: string
  item_id: string
  alert_type: string
  severity: string
  message: string
  status: string
  created_at: string
}

// API Service Class
export class InventoryAPI {
  private baseUrl = '/inventory'

  // Inventory Items
  async getItems(params: {
    page?: number
    limit?: number
    search?: string
    category?: string
    status?: string
    department?: string
    location?: string
    sortBy?: string
    sortOrder?: 'ASC' | 'DESC'
  } = {}): Promise<PaginatedResponse<InventoryItem>> {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        searchParams.append(key, value.toString())
      }
    })

    const response = await apiClient.get(`${this.baseUrl}/items?${searchParams}`)
    if (response.error) throw new Error(response.error)
    return response.data!
  }


  async getItem(id: string): Promise<InventoryItem> {
    const response = await apiClient.get(`${this.baseUrl}/items/${id}`)
    if (response.error) throw new Error(response.error)
    return response.data!
  }

  async createItem(item: Omit<InventoryItem, 'id' | 'total_value' | 'created_at' | 'updated_at' | 'creator' | 'updater'>): Promise<InventoryItem> {
    
    const response = await apiClient.post(`${this.baseUrl}/items`, item)
    if (response.error) {
      throw new Error(response.error)
    }
    return response.data!
  }

  async updateItem(id: string, item: Partial<InventoryItem>): Promise<InventoryItem> {
    
    const response = await apiClient.put(`${this.baseUrl}/items/${id}`, item)
    if (response.error) {
      throw new Error(response.error)
    }
    return response.data!
  }

  async deleteItem(id: string, reason?: string): Promise<void> {
    // Custom fetch for DELETE with body since apiClient.delete doesn't support body
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('easyclinic_token') : null
      const response = await fetch(`${config.api.baseUrl}/inventory/items/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify({ reason: reason || 'Item deleted' })
      })

      if (!response.ok) {
        const errorData = await response.text()
        throw new Error(errorData || `HTTP ${response.status}: ${response.statusText}`)
      }
    } catch (error) {
      throw error
    }
  }

  // Stock Management
  async updateStock(itemId: string, update: StockUpdateRequest): Promise<StockUpdateResponse> {
    
    const response = await apiClient.post(`${this.baseUrl}/items/${itemId}/stock`, update)
    if (response.error) {
      throw new Error(response.error)
    }
    return response.data!
  }


  async bulkUpdateStock(updates: BulkStockUpdate): Promise<void> {
    const response = await apiClient.post(`${this.baseUrl}/bulk-stock-update`, updates)
    if (response.error) throw new Error(response.error)
  }

  async getStockHistory(itemId: string, page = 1, limit = 10): Promise<PaginatedResponse<any>> {
    const response = await apiClient.get(`${this.baseUrl}/items/${itemId}/stock-history?page=${page}&limit=${limit}`)
    if (response.error) throw new Error(response.error)
    
    // Backend returns { movements: [...], pagination: {...} } but we need { items: [...], pagination: {...} }
    const backendData = response.data!
    return {
      items: backendData.movements || [],
      pagination: backendData.pagination
    }
  }

  // Alerts
  async getLowStockAlerts(): Promise<Alert[]> {
    const response = await apiClient.get(`${this.baseUrl}/alerts/low-stock`)
    if (response.error) throw new Error(response.error)
    return response.data!
  }

  async getExpiringItems(days = 30): Promise<Alert[]> {
    const response = await apiClient.get(`${this.baseUrl}/alerts/expiring?days=${days}`)
    if (response.error) throw new Error(response.error)
    return response.data!
  }

  async getControlledSubstanceAlerts(): Promise<Alert[]> {
    const response = await apiClient.get(`${this.baseUrl}/alerts/controlled-substances`)
    if (response.error) throw new Error(response.error)
    return response.data!
  }


  async dismissAlert(alertId: string): Promise<void> {
    const response = await apiClient.post(`${this.baseUrl}/alerts/dismiss/${alertId}`, {})
    if (response.error) throw new Error(response.error)
  }

  // Purchase Orders
  async getPurchaseOrders(params: {
    page?: number
    limit?: number
    status?: string
    supplier?: string
  } = {}): Promise<PaginatedResponse<PurchaseOrder>> {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        searchParams.append(key, value.toString())
      }
    })

    const response = await apiClient.get(`${this.baseUrl}/purchase-orders?${searchParams}`)
    if (response.error) throw new Error(response.error)
    
    // Backend returns { orders: [...], pagination: {...} } but we need { items: [...], pagination: {...} }
    const backendData = response.data!
    return {
      items: backendData.orders || [],
      pagination: backendData.pagination
    }
  }


  async getPurchaseOrder(id: string): Promise<PurchaseOrder> {
    const response = await apiClient.get(`${this.baseUrl}/purchase-orders/${id}`)
    if (response.error) throw new Error(response.error)
    return response.data!
  }

  async createPurchaseOrder(po: {
    supplier: string
    order_date: string
    expected_delivery?: string
    items: Array<{
      item_id: string
      quantity: number
      unit_cost: number
    }>
  }): Promise<PurchaseOrder> {
    const response = await apiClient.post(`${this.baseUrl}/purchase-orders`, po)
    if (response.error) throw new Error(response.error)
    return response.data!
  }

  async updatePurchaseOrder(id: string, update: {
    status?: string
    actual_delivery?: string
  }): Promise<PurchaseOrder> {
    const response = await apiClient.put(`${this.baseUrl}/purchase-orders/${id}`, update)
    if (response.error) throw new Error(response.error)
    return response.data!
  }

  async deletePurchaseOrder(id: string, reason?: string): Promise<void> {
    // Custom fetch for DELETE with body since apiClient.delete doesn't support body
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('easyclinic_token') : null
      const response = await fetch(`${config.api.baseUrl}/inventory/purchase-orders/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify({ reason: reason || 'Purchase order deleted' })
      })

      if (!response.ok) {
        const errorData = await response.text()
        throw new Error(errorData || `HTTP ${response.status}: ${response.statusText}`)
      }
    } catch (error) {
      throw error
    }
  }

  async receivePurchaseOrder(id: string, receivedItems: Array<{
    item_id: string
    quantity_received: number
    date_received: string
  }>): Promise<void> {
    const response = await apiClient.post(`${this.baseUrl}/purchase-orders/${id}/receive`, { receivedItems })
    if (response.error) throw new Error(response.error)
  }

  async generatePurchaseOrderPDF(id: string): Promise<Blob> {
    const response = await fetch(`${config.api.baseUrl}/inventory/purchase-orders/${id}/pdf`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      }
    })
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    
    return await response.blob()
  }

  // Barcodes
  async generateBarcode(itemId: string, options: {
    format?: string
    size?: string
  } = {}): Promise<{ barcode: string; image: string }> {
    const response = await apiClient.post(`${this.baseUrl}/items/${itemId}/barcode`, options)
    if (response.error) throw new Error(response.error)
    return response.data!
  }

  async scanBarcode(barcode: string, action = 'lookup'): Promise<InventoryItem> {
    const response = await apiClient.post(`${this.baseUrl}/scan`, { barcode, action })
    if (response.error) throw new Error(response.error)
    return response.data!
  }

  async printBarcodeLabel(itemId: string, options: {
    format?: string
    size?: string
    labelType?: string
    copies?: number
  } = {}): Promise<Blob> {
    const searchParams = new URLSearchParams()
    Object.entries(options).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, value.toString())
      }
    })

    const response = await apiClient.get(`${this.baseUrl}/items/${itemId}/barcode/print?${searchParams}`)
    if (response.error) throw new Error(response.error)
    return response.data! as Blob
  }

  async downloadBarcode(itemId: string): Promise<Blob> {
    const response = await apiClient.get(`${this.baseUrl}/items/${itemId}/barcode/download`)
    if (response.error) throw new Error(response.error)
    return response.data! as Blob
  }

  async bulkGenerateBarcodes(itemIds: string[], format = 'CODE128'): Promise<Array<{
    itemId: string
    barcode: string
    image: string
  }>> {
    const response = await apiClient.post(`${this.baseUrl}/barcodes/bulk-generate`, {
      itemIds,
      format
    })
    if (response.error) throw new Error(response.error)
    return response.data!
  }

  async getBarcodeStats(): Promise<any> {
    const response = await apiClient.get(`${this.baseUrl}/barcodes/stats`)
    if (response.error) throw new Error(response.error)
    return response.data!
  }

  // Reports
  async getValuationReport(params: {
    category?: string
    department?: string
  } = {}): Promise<any> {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        searchParams.append(key, value.toString())
      }
    })

    const response = await apiClient.get(`${this.baseUrl}/reports/valuation?${searchParams}`)
    if (response.error) throw new Error(response.error)
    return response.data!
  }

  async getUsageAnalytics(params: {
    days?: number
    category?: string
    department?: string
  } = {}): Promise<any> {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, value.toString())
      }
    })

    const response = await apiClient.get(`${this.baseUrl}/reports/usage?${searchParams}`)
    if (response.error) throw new Error(response.error)
    return response.data!
  }

  async getComplianceReport(params: {
    reportType?: 'general' | 'controlled_substances' | 'stock_movements' | 'audit_summary'
    dateFrom?: string
    dateTo?: string
  } = {}): Promise<any> {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        searchParams.append(key, value.toString())
      }
    })

    const response = await apiClient.get(`${this.baseUrl}/audit-reports?${searchParams}`)
    if (response.error) throw new Error(response.error)
    return response.data!
  }

  async exportInventory(params: {
    format?: 'csv' | 'json'
    category?: string
    department?: string
    includeMovements?: boolean
  } = {}): Promise<Blob> {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        searchParams.append(key, value.toString())
      }
    })

    const response = await apiClient.get(`${this.baseUrl}/reports/export?${searchParams}`)
    if (response.error) throw new Error(response.error)
    return response.data! as Blob
  }

  async getAuditLogs(params: {
    page?: number
    limit?: number
    itemId?: string
    userId?: string
    action?: string
    dateFrom?: string
    dateTo?: string
    department?: string
  } = {}): Promise<PaginatedResponse<AuditLog>> {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        searchParams.append(key, value.toString())
      }
    })

    const response = await apiClient.get(`${this.baseUrl}/audit-logs?${searchParams}`)
    if (response.error) throw new Error(response.error)
    
    // Backend returns { logs: [...], pagination: {...} } but we need { items: [...], pagination: {...} }
    const backendData = response.data!
    
    // Map backend field names to frontend expected format
    const mappedLogs = (backendData.logs || []).map((log: any) => ({
      id: log.id,
      action: log.action,
      itemName: log.item_name,
      previousValue: log.previous_value,
      newValue: log.new_value,
      reason: log.reason,
      user: log.user_name,
      department: log.department,
      timestamp: new Date(log.created_at || log.timestamp).toLocaleString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    }))
    
    return {
      items: mappedLogs,
      pagination: backendData.pagination
    }
  }

}

// Export singleton instance
export const inventoryAPI = new InventoryAPI()