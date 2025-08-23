"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Save } from "lucide-react"

interface StockUpdateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  item: any
  onUpdateStock: (action: "add" | "remove" | "set", quantity: number, reason: string, batchNumber?: string, expiryDate?: string) => void
}

export function StockUpdateDialog({ open, onOpenChange, item, onUpdateStock }: StockUpdateDialogProps) {
  const [stockUpdate, setStockUpdate] = useState({
    action: "add" as "add" | "remove" | "set",
    quantity: 0,
    reason: "",
    batchNumber: "",
    expiryDate: "",
  })

  const handleSubmit = () => {
    onUpdateStock(
      stockUpdate.action,
      stockUpdate.quantity,
      stockUpdate.reason,
      stockUpdate.batchNumber || undefined,
      stockUpdate.expiryDate || undefined
    )
    setStockUpdate({
      action: "add",
      quantity: 0,
      reason: "",
      batchNumber: "",
      expiryDate: "",
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
          <div className="p-4 bg-muted rounded-lg">
            <h4 className="font-medium">{item.name}</h4>
            <p className="text-sm text-muted-foreground">SKU: {item.sku}</p>
            <p className="text-sm text-muted-foreground">
              Stock actual: {item.currentStock} {item.unitOfMeasure}
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
            <Button variant="outline" onClick={() => onOpenChange(false)} className="bg-transparent">
              Cancelar
            </Button>
            <Button onClick={handleSubmit} disabled={stockUpdate.quantity <= 0}>
              <Save className="w-4 h-4 mr-2" />
              Actualizar Stock
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
