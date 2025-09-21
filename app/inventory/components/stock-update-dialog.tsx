"use client"

import { useState } from "react"
import { useInventoryStore } from "@/lib/inventory-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Save, AlertTriangle } from "lucide-react"

interface StockUpdateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  item: any
  onUpdateStock: (action: "add" | "remove" | "set", quantity: number, reason: string, batchNumber?: string, expiryDate?: string) => void
}

export function StockUpdateDialog({ open, onOpenChange, item, onUpdateStock }: StockUpdateDialogProps) {
  const { error, loading } = useInventoryStore()
  const [stockUpdate, setStockUpdate] = useState({
    action: "add" as "add" | "remove" | "set",
    quantity: 0,
    reason: "",
    batch_number: "",
    expiry_date: "",
  })

  const handleSubmit = () => {
    onUpdateStock(
      stockUpdate.action,
      stockUpdate.quantity,
      stockUpdate.reason,
      stockUpdate.batch_number || undefined,
      stockUpdate.expiry_date || undefined
    )
    setStockUpdate({
      action: "add",
      quantity: 0,
      reason: "",
      batch_number: "",
      expiry_date: "",
    })
    onOpenChange(false)
  }

  if (!item) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Actualizar Stock</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Error Display */}
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="p-4 bg-muted rounded-lg">
            <h4 className="font-medium">{item.name}</h4>
            <p className="text-sm text-muted-foreground">SKU: {item.sku}</p>
            <p className="text-sm text-muted-foreground">
              Stock actual: {item.current_stock} {item.unit_of_measure}
            </p>
            <p className="text-sm text-muted-foreground">
              Mínimo recomendado: {item.min_threshold} {item.unit_of_measure}
            </p>
          </div>

          <div>
            <Label>Acción</Label>
            <Select
              value={stockUpdate.action}
              onValueChange={(value) => setStockUpdate({ ...stockUpdate, action: value as "add" | "remove" | "set" })}
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
            {/* Stock Preview */}
            {stockUpdate.quantity > 0 && (
              <div className="mt-2 p-2 bg-blue-50 rounded text-sm">
                <span className="text-blue-800">
                  Stock después de la operación: {
                    stockUpdate.action === 'add' 
                      ? item.current_stock + stockUpdate.quantity
                      : stockUpdate.action === 'remove'
                      ? Math.max(0, item.current_stock - stockUpdate.quantity)
                      : stockUpdate.quantity
                  } {item.unit_of_measure}
                </span>
                {(stockUpdate.action === 'remove' && (item.current_stock - stockUpdate.quantity) < item.min_threshold) && (
                  <div className="text-yellow-600 mt-1">
                    ⚠️ El stock quedará por debajo del mínimo recomendado
                  </div>
                )}
              </div>
            )}
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
                value={stockUpdate.batch_number}
                onChange={(e) => setStockUpdate({ ...stockUpdate, batch_number: e.target.value })}
                placeholder="Número de lote"
              />
            </div>
            <div>
              <Label htmlFor="newExpiryDate">Nueva Fecha de Vencimiento (opcional)</Label>
              <Input
                id="newExpiryDate"
                type="date"
                value={stockUpdate.expiry_date}
                onChange={(e) => setStockUpdate({ ...stockUpdate, expiry_date: e.target.value })}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="bg-transparent">
              Cancelar
            </Button>
            <Button onClick={handleSubmit} disabled={stockUpdate.quantity <= 0 || !stockUpdate.reason.trim() || loading}>
              <Save className="w-4 h-4 mr-2" />
              {loading ? "Actualizando..." : "Actualizar Stock"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
