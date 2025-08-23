"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Save } from "lucide-react"

interface AddItemDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddItem: (item: any) => void
}

export function AddItemDialog({ open, onOpenChange, onAddItem }: AddItemDialogProps) {
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

  const handleSubmit = () => {
    onAddItem(newItem)
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
    onOpenChange(false)
  }

  const isValid = newItem.name && newItem.sku && newItem.category && newItem.unitOfMeasure

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
            <Button variant="outline" onClick={() => onOpenChange(false)} className="bg-transparent">
              Cancelar
            </Button>
            <Button onClick={handleSubmit} disabled={!isValid}>
              <Save className="w-4 h-4 mr-2" />
              Agregar Artículo
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
