"use client"

import { useState } from "react"
import { useInventoryStore } from "@/lib/inventory-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Save, AlertTriangle } from "lucide-react"

interface AddItemDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddItem: (item: any) => void
}

export function AddItemDialog({ open, onOpenChange, onAddItem }: AddItemDialogProps) {
  const { loading } = useInventoryStore()
  const [localError, setLocalError] = useState<string | null>(null)
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false)
  const [newItem, setNewItem] = useState({
    name: "",
    category: "",
    sku: "",
    description: "",
    supplier: "",
    manufacturer: "",
    current_stock: 0,
    min_threshold: 0,
    max_threshold: 0,
    unit_of_measure: "",
    unit_cost: 0,
    location: "",
    department: "",
    expiry_date: "",
    batch_number: "",
    barcode: "",
    controlled_substance: false,
    requires_prescription: false,
  })

  const handleSubmit = async () => {
    setHasAttemptedSubmit(true)
    setLocalError(null)
    
    // Validate required fields
    const missingFields = []
    if (!newItem.name.trim()) missingFields.push('Nombre')
    if (!newItem.sku.trim()) missingFields.push('SKU')
    if (!newItem.category.trim()) missingFields.push('Categoría')
    if (!newItem.department.trim()) missingFields.push('Departamento')
    if (!newItem.unit_of_measure.trim()) missingFields.push('Unidad de Medida')
    if (!newItem.location.trim()) missingFields.push('Ubicación')
    
    if (missingFields.length > 0) {
      setLocalError(`Campos requeridos faltantes: ${missingFields.join(', ')}`)
      return
    }
    
    console.log('Submitting new item:', newItem)
    
    // Clean the data - only send non-empty optional fields
    const cleanedItem = {
      // Required fields
      name: newItem.name.trim(),
      sku: newItem.sku.trim(),
      category: newItem.category,
      department: newItem.department,
      unit_of_measure: newItem.unit_of_measure,
      location: newItem.location.trim(),
      
      // Optional fields - only include if not empty
      ...(newItem.description.trim() && { description: newItem.description.trim() }),
      ...(newItem.supplier.trim() && { supplier: newItem.supplier.trim() }),
      ...(newItem.manufacturer.trim() && { manufacturer: newItem.manufacturer.trim() }),
      ...(newItem.expiry_date && { expiry_date: newItem.expiry_date }),
      ...(newItem.batch_number.trim() && { batch_number: newItem.batch_number.trim() }),
      ...(newItem.barcode.trim() && { barcode: newItem.barcode.trim() }),
      
      // Numeric fields with defaults
      current_stock: newItem.current_stock || 0,
      min_threshold: newItem.min_threshold || 0,
      unit_cost: newItem.unit_cost || 0,
      
      // Optional numeric field
      ...(newItem.max_threshold > 0 && { max_threshold: newItem.max_threshold }),
      
      // Boolean fields
      controlled_substance: newItem.controlled_substance,
      requires_prescription: newItem.requires_prescription,
    }
    
    console.log('Cleaned item data:', cleanedItem)
    
    try {
      await onAddItem(cleanedItem)
      // Only close dialog and reset form if successful
      setNewItem({
        name: "",
        category: "",
        sku: "",
        description: "",
        supplier: "",
        manufacturer: "",
        current_stock: 0,
        min_threshold: 0,
        max_threshold: 0,
        unit_of_measure: "",
        unit_cost: 0,
        location: "",
        department: "",
        expiry_date: "",
        batch_number: "",
        barcode: "",
        controlled_substance: false,
        requires_prescription: false,
      })
      setLocalError(null)
      setHasAttemptedSubmit(false)
      onOpenChange(false)
    } catch (error) {
      console.error('Error adding item:', error)
      setLocalError(error instanceof Error ? error.message : 'Error al agregar el artículo')
      // Don't close dialog on error
    }
  }

  const isValid = newItem.name && newItem.sku && newItem.category && newItem.department && newItem.unit_of_measure && newItem.location

  // Clear error when all required fields are filled
  const allRequiredFieldsFilled = newItem.name.trim() && newItem.sku.trim() && newItem.category && newItem.department && newItem.unit_of_measure && newItem.location.trim()
  
  // Clear local error when user fills all required fields
  if (hasAttemptedSubmit && localError && allRequiredFieldsFilled) {
    setLocalError(null)
  }

  // Reset states when dialog is closed
  const handleDialogChange = (open: boolean) => {
    onOpenChange(open)
    if (!open) {
      setLocalError(null)
      setHasAttemptedSubmit(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Agregar Nuevo Artículo</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Campos requeridos: Nombre, SKU, Categoría, Departamento, Unidad de Medida, Ubicación
          </p>
        </DialogHeader>
        <div className="space-y-6">
          {/* Error Display - Only show after submit attempt */}
          {localError && hasAttemptedSubmit && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{localError}</AlertDescription>
            </Alert>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nombre del Artículo *</Label>
              <Input
                id="name"
                value={newItem.name}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                placeholder="Ej: Paracetamol 500mg"
                className={hasAttemptedSubmit && !newItem.name.trim() ? "border-red-500" : ""}
              />
            </div>
            <div>
              <Label htmlFor="sku">SKU/Código *</Label>
              <Input
                id="sku"
                value={newItem.sku}
                onChange={(e) => setNewItem({ ...newItem, sku: e.target.value })}
                placeholder="Ej: PAR-500-001"
                className={hasAttemptedSubmit && !newItem.sku.trim() ? "border-red-500" : ""}
              />
            </div>
          </div>

          <div>
              <Label htmlFor="description">Descripción (Opcional)</Label>
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
                <SelectTrigger className={hasAttemptedSubmit && !newItem.category ? "border-red-500" : ""}>
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
                <SelectTrigger className={hasAttemptedSubmit && !newItem.department ? "border-red-500" : ""}>
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
              <Label htmlFor="supplier">Proveedor (Opcional)</Label>
              <Input
                id="supplier"
                value={newItem.supplier}
                onChange={(e) => setNewItem({ ...newItem, supplier: e.target.value })}
                placeholder="Nombre del proveedor"
              />
            </div>
            <div>
              <Label htmlFor="manufacturer">Fabricante (Opcional)</Label>
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
              <Label htmlFor="current_stock">Stock Actual (Opcional)</Label>
              <Input
                id="current_stock"
                type="number"
                min="0"
                value={newItem.current_stock}
                onChange={(e) => setNewItem({ ...newItem, current_stock: e.target.value === '' ? 0 : Number.parseInt(e.target.value) || 0 })}
              />
            </div>
            <div>
              <Label htmlFor="min_threshold">Stock Mínimo (Opcional)</Label>
              <Input
                id="min_threshold"
                type="number"
                min="0"
                value={newItem.min_threshold}
                onChange={(e) => setNewItem({ ...newItem, min_threshold: e.target.value === '' ? 0 : Number.parseInt(e.target.value) || 0 })}
              />
            </div>
            <div>
              <Label htmlFor="max_threshold">Stock Máximo (Opcional)</Label>
              <Input
                id="max_threshold"
                type="number"
                min="0"
                value={newItem.max_threshold}
                onChange={(e) => setNewItem({ ...newItem, max_threshold: e.target.value === '' ? 0 : Number.parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="unit_of_measure">Unidad de Medida *</Label>
              <Select
                value={newItem.unit_of_measure}
                onValueChange={(value) => setNewItem({ ...newItem, unit_of_measure: value })}
              >
                <SelectTrigger className={hasAttemptedSubmit && !newItem.unit_of_measure ? "border-red-500" : ""}>
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
              <Label htmlFor="unit_cost">Costo Unitario (Opcional)</Label>
              <Input
                id="unit_cost"
                type="number"
                min="0"
                step="0.01"
                value={newItem.unit_cost}
                onChange={(e) => setNewItem({ ...newItem, unit_cost: e.target.value === '' ? 0 : Number.parseFloat(e.target.value) || 0 })}
              />
            </div>
            <div>
              <Label htmlFor="location">Ubicación *</Label>
              <Input
                id="location"
                value={newItem.location}
                onChange={(e) => setNewItem({ ...newItem, location: e.target.value })}
                placeholder="Ej: Farmacia - Estante A1"
                className={hasAttemptedSubmit && !newItem.location.trim() ? "border-red-500" : ""}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="expiry_date">Fecha de Vencimiento (Opcional)</Label>
              <Input
                id="expiry_date"
                type="date"
                value={newItem.expiry_date}
                onChange={(e) => setNewItem({ ...newItem, expiry_date: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="batch_number">Número de Lote (Opcional)</Label>
              <Input
                id="batch_number"
                value={newItem.batch_number}
                onChange={(e) => setNewItem({ ...newItem, batch_number: e.target.value })}
                placeholder="Ej: BAT-2024-001"
              />
            </div>
            <div>
              <Label htmlFor="barcode">Código de Barras (Opcional)</Label>
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
                id="controlled_substance"
                checked={newItem.controlled_substance}
                onCheckedChange={(checked) => setNewItem({ ...newItem, controlled_substance: checked as boolean })}
              />
              <Label htmlFor="controlled_substance">Sustancia Controlada</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="requires_prescription"
                checked={newItem.requires_prescription}
                onCheckedChange={(checked) => setNewItem({ ...newItem, requires_prescription: checked as boolean })}
              />
              <Label htmlFor="requires_prescription">Requiere Receta</Label>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => handleDialogChange(false)} className="bg-transparent">
              Cancelar
            </Button>
            <Button onClick={handleSubmit} disabled={!isValid || loading}>
              <Save className="w-4 h-4 mr-2" />
              {loading ? "Agregando..." : "Agregar Artículo"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
