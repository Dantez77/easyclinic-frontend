"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, Download, ShoppingCart, Plus, Package, CheckCircle, Clock } from "lucide-react"
import { format } from "date-fns"
import { useInventoryStore } from "@/lib/inventory-store"

interface PurchaseOrdersProps {
  purchaseOrders: any[]
}

export function PurchaseOrders({ purchaseOrders }: PurchaseOrdersProps) {
  const { 
    createPurchaseOrder, 
    updatePurchaseOrderStatus, 
    receivePurchaseOrderItems,
    downloadPurchaseOrderPDF,
    loading 
  } = useInventoryStore()
  
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showReceiveDialog, setShowReceiveDialog] = useState(false)
  const [receivedQuantities, setReceivedQuantities] = useState<{[key: string]: number}>({})

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    const actualDelivery = newStatus === "Entregado" ? new Date().toISOString().split('T')[0] : undefined
    await updatePurchaseOrderStatus(orderId, newStatus, actualDelivery)
  }

  const handleReceiveItems = async (orderId: string) => {
    const order = purchaseOrders.find(po => po.id === orderId)
    setSelectedOrder(order)
    setShowReceiveDialog(true)
    // Initialize received quantities
    const initialQuantities: {[key: string]: number} = {}
    order?.items?.forEach((item: any, index: number) => {
      initialQuantities[index] = item.quantity // Default to full quantity
    })
    setReceivedQuantities(initialQuantities)
  }

  const handleDownloadPDF = async (orderId: string) => {
    await downloadPurchaseOrderPDF(orderId)
  }

  const handleConfirmReceiving = async () => {
    if (!selectedOrder) return
    
    const receivedItems = selectedOrder.items?.map((item: any, index: number) => ({
      item_id: item.item_id || item.id,
      quantity_received: receivedQuantities[index] || 0,
      date_received: new Date().toISOString().split('T')[0]
    })) || []
    
    await receivePurchaseOrderItems(selectedOrder.id, receivedItems)
    setShowReceiveDialog(false)
    setSelectedOrder(null)
    setReceivedQuantities({})
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              Órdenes de Compra
            </CardTitle>
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Nueva Orden
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Crear Nueva Orden de Compra</DialogTitle>
                </DialogHeader>
                <div className="p-4">
                  <p className="text-muted-foreground">Funcionalidad de creación de órdenes en desarrollo...</p>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {purchaseOrders.map((order) => (
            <div key={order.id} className="border rounded-lg p-4">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="font-medium text-foreground">{order.id}</h4>
                  <p className="text-sm text-muted-foreground">{order.supplier}</p>
                  <p className="text-xs text-muted-foreground">Solicitado por: {order.requestedBy}</p>
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
                {order.items.map((item: any, index: number) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>{item.name}</span>
                    <span>
                      {item.quantity} x ${item.unitCost} = ${(item.quantity * item.unitCost).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center mt-4 pt-4 border-t">
                <div className="text-sm text-muted-foreground">
                  <p>Fecha: {format(new Date(order.orderDate), "dd/MM/yyyy")}</p>
                  <p>Entrega esperada: {format(new Date(order.expectedDelivery), "dd/MM/yyyy")}</p>
                </div>
                <div className="flex gap-2">
                  {order.status === "Pendiente" && (
                    <Select onValueChange={(value) => handleStatusUpdate(order.id, value)}>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Aprobado">Aprobar</SelectItem>
                        <SelectItem value="Cancelado">Cancelar</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                  {order.status === "En Tránsito" && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleReceiveItems(order.id)}
                      className="bg-transparent"
                    >
                      <Package className="w-4 h-4 mr-2" />
                      Recibir
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleDownloadPDF(order.id)}
                    className="bg-transparent"
                  >
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

    {/* Receive Items Dialog */}
    <Dialog open={showReceiveDialog} onOpenChange={setShowReceiveDialog}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Recibir Artículos - Orden {selectedOrder?.id}</DialogTitle>
        </DialogHeader>
        {selectedOrder && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
              <div>
                <p className="text-sm font-medium">Proveedor</p>
                <p className="text-sm text-muted-foreground">{selectedOrder.supplier}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Fecha de Orden</p>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(selectedOrder.orderDate), "dd/MM/yyyy")}
                </p>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium">Artículos a Recibir</h4>
              {selectedOrder.items?.map((item: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Ordenado: {item.quantity} unidades
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Recibido:</span>
                    <input 
                      type="number" 
                      className="w-20 px-2 py-1 border rounded text-center"
                      value={receivedQuantities[index] || item.quantity}
                      onChange={(e) => setReceivedQuantities(prev => ({
                        ...prev,
                        [index]: parseInt(e.target.value) || 0
                      }))}
                      max={item.quantity}
                      min="0"
                    />
                    <span className="text-sm text-muted-foreground">/ {item.quantity}</span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setShowReceiveDialog(false)}>
                Cancelar
              </Button>
              <Button onClick={handleConfirmReceiving} disabled={loading}>
                <CheckCircle className="w-4 h-4 mr-2" />
                Confirmar Recepción
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  </div>
  )
}
