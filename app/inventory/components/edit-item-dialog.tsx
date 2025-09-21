"use client"

import { useState, useEffect } from "react"
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
import type { InventoryItem } from "@/lib/inventory-api"

interface EditItemDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  item: InventoryItem | null
  onEditItem: (itemId: string, updates: Partial<InventoryItem>) => void
}

export function EditItemDialog({ open, onOpenChange, item, onEditItem }: EditItemDialogProps) {
  const { loading } = useInventoryStore()
  const [localError, setLocalError] = useState<string | null>(null)
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false)
  const [editedItem, setEditedItem] = useState({
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

  // Populate form when item changes
  useEffect(() => {
    if (item) {
      setEditedItem({
        name: item.name || "",
        category: item.category || "",
        sku: item.sku || "",
        description: item.description || "",
        supplier: item.supplier || "",
        manufacturer: item.manufacturer || "",
        current_stock: item.current_stock || 0,
        min_threshold: item.min_threshold || 0,
        max_threshold: item.max_threshold || 0,
        unit_of_measure: item.unit_of_measure || "",
        unit_cost: item.unit_cost || 0,
        location: item.location || "",
        department: item.department || "",
        expiry_date: item.expiry_date || "",
        batch_number: item.batch_number || "",
        barcode: item.barcode || "",
        controlled_substance: item.controlled_substance || false,
        requires_prescription: item.requires_prescription || false,
      })
    }
  }, [item])

  const handleSubmit = async () => {
    setHasAttemptedSubmit(true)
    setLocalError(null)
    
    if (!item) return
    
    // Validate required fields
    const missingFields = []
    if (!editedItem.name.trim()) missingFields.push('Nombre')
    if (!editedItem.sku.trim()) missingFields.push('SKU')
    if (!editedItem.category.trim()) missingFields.push('Categoría')
    if (!editedItem.department.trim()) missingFields.push('Departamento')
    if (!editedItem.unit_of_measure.trim()) missingFields.push('Unidad de Medida')
    if (!editedItem.location.trim()) missingFields.push('Ubicación')
    
    if (missingFields.length > 0) {
      setLocalError(`Campos requeridos faltantes: ${missingFields.join(', ')}`)
      return
    }
    
    console.log('Editing item:', item.id, editedItem)
    
    // Clean the data - only send non-empty optional fields
    const cleanedUpdates = {
      // Required fields
      name: editedItem.name.trim(),
      sku: editedItem.sku.trim(),
      category: editedItem.category,
      department: editedItem.department,
      unit_of_measure: editedItem.unit_of_measure,
      location: editedItem.location.trim(),
      
      // Optional fields - only include if not empty
      ...(editedItem.description.trim() && { description: editedItem.description.trim() }),
      ...(editedItem.supplier.trim() && { supplier: editedItem.supplier.trim() }),
      ...(editedItem.manufacturer.trim() && { manufacturer: editedItem.manufacturer.trim() }),
      ...(editedItem.expiry_date && { expiry_date: editedItem.expiry_date }),
      ...(editedItem.batch_number.trim() && { batch_number: editedItem.batch_number.trim() }),
      ...(editedItem.barcode.trim() && { barcode: editedItem.barcode.trim() }),
      
      // Numeric fields
      current_stock: editedItem.current_stock || 0,
      min_threshold: editedItem.min_threshold || 0,
      unit_cost: editedItem.unit_cost || 0,
      
      // Optional numeric field
      ...(editedItem.max_threshold > 0 && { max_threshold: editedItem.max_threshold }),
      
      // Boolean fields
      controlled_substance: editedItem.controlled_substance,
      requires_prescription: editedItem.requires_prescription,
    }
    
    console.log('Cleaned edit data:', cleanedUpdates)
    
    try {
      await onEditItem(item.id, cleanedUpdates)
      setLocalError(null)
      setHasAttemptedSubmit(false)
      onOpenChange(false)
    } catch (error) {
      console.error('Error editing item:', error)
      setLocalError(error instanceof Error ? error.message : 'Error al editar el artículo')
      // Don't close dialog on error
    }
  }

  const isValid = editedItem.name && editedItem.sku && editedItem.category && editedItem.department && editedItem.unit_of_measure && editedItem.location

  // Clear error when all required fields are filled
  const allRequiredFieldsFilled = editedItem.name.trim() && editedItem.sku.trim() && editedItem.category && editedItem.department && editedItem.unit_of_measure && editedItem.location.trim()
  
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

  if (!item) return null

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Artículo</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Editando: {item.name} (SKU: {item.sku})
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
              <Label htmlFor="edit-name">Nombre del Artículo *</Label>
              <Input
                id="edit-name"
                value={editedItem.name}
                onChange={(e) => setEditedItem({ ...editedItem, name: e.target.value })}
                placeholder="Ej: Paracetamol 500mg"
                className={hasAttemptedSubmit && !editedItem.name.trim() ? "border-red-500" : ""}
              />
            </div>
            <div>
              <Label htmlFor="edit-sku">SKU/Código *</Label>
              <Input
                id="edit-sku"
                value={editedItem.sku}
                onChange={(e) => setEditedItem({ ...editedItem, sku: e.target.value })}
                placeholder="Ej: PAR-500-001"
                className={hasAttemptedSubmit && !editedItem.sku.trim() ? "border-red-500" : ""}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="edit-description">Descripción (Opcional)</Label>
            <Textarea
              id="edit-description"
              value={editedItem.description}
              onChange={(e) => setEditedItem({ ...editedItem, description: e.target.value })}
              placeholder="Descripción detallada del artículo..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Categoría *</Label>
              <Select value={editedItem.category} onValueChange={(value) => setEditedItem({ ...editedItem, category: value })}>
                <SelectTrigger className={hasAttemptedSubmit && !editedItem.category ? "border-red-500" : ""}>
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
                value={editedItem.department}
                onValueChange={(value) => setEditedItem({ ...editedItem, department: value })}
              >
                <SelectTrigger className={hasAttemptedSubmit && !editedItem.department ? "border-red-500" : ""}>
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
              <Label htmlFor="edit-supplier">Proveedor (Opcional)</Label>
              <Input
                id="edit-supplier"
                value={editedItem.supplier}
                onChange={(e) => setEditedItem({ ...editedItem, supplier: e.target.value })}
                placeholder="Nombre del proveedor"
              />
            </div>
            <div>
              <Label htmlFor="edit-manufacturer">Fabricante (Opcional)</Label>
              <Input
                id="edit-manufacturer"
                value={editedItem.manufacturer}
                onChange={(e) => setEditedItem({ ...editedItem, manufacturer: e.target.value })}
                placeholder="Nombre del fabricante"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="edit-current_stock">Stock Actual (Opcional)</Label>
              <Input
                id="edit-current_stock"
                type="number"
                min="0"
                value={editedItem.current_stock}
                onChange={(e) => setEditedItem({ ...editedItem, current_stock: e.target.value === '' ? 0 : Number.parseInt(e.target.value) || 0 })}
              />
            </div>
            <div>
              <Label htmlFor="edit-min_threshold">Stock Mínimo (Opcional)</Label>
              <Input
                id="edit-min_threshold"
                type="number"
                min="0"
                value={editedItem.min_threshold}
                onChange={(e) => setEditedItem({ ...editedItem, min_threshold: e.target.value === '' ? 0 : Number.parseInt(e.target.value) || 0 })}
              />
            </div>
            <div>
              <Label htmlFor="edit-max_threshold">Stock Máximo (Opcional)</Label>
              <Input
                id="edit-max_threshold"
                type="number"
                min="0"
                value={editedItem.max_threshold}
                onChange={(e) => setEditedItem({ ...editedItem, max_threshold: e.target.value === '' ? 0 : Number.parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="edit-unit_of_measure">Unidad de Medida *</Label>
              <Select
                value={editedItem.unit_of_measure}
                onValueChange={(value) => setEditedItem({ ...editedItem, unit_of_measure: value })}
              >
                <SelectTrigger className={hasAttemptedSubmit && !editedItem.unit_of_measure ? "border-red-500" : ""}>
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
              <Label htmlFor="edit-unit_cost">Costo Unitario (Opcional)</Label>
              <Input
                id="edit-unit_cost"
                type="number"
                min="0"
                step="0.01"
                value={editedItem.unit_cost}
                onChange={(e) => setEditedItem({ ...editedItem, unit_cost: e.target.value === '' ? 0 : Number.parseFloat(e.target.value) || 0 })}
              />
            </div>
            <div>
              <Label htmlFor="edit-location">Ubicación *</Label>
              <Input
                id="edit-location"
                value={editedItem.location}
                onChange={(e) => setEditedItem({ ...editedItem, location: e.target.value })}
                placeholder="Ej: Farmacia - Estante A1"
                className={hasAttemptedSubmit && !editedItem.location.trim() ? "border-red-500" : ""}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="edit-expiry_date">Fecha de Vencimiento (Opcional)</Label>
              <Input
                id="edit-expiry_date"
                type="date"
                value={editedItem.expiry_date}
                onChange={(e) => setEditedItem({ ...editedItem, expiry_date: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-batch_number">Número de Lote (Opcional)</Label>
              <Input
                id="edit-batch_number"
                value={editedItem.batch_number}
                onChange={(e) => setEditedItem({ ...editedItem, batch_number: e.target.value })}
                placeholder="Ej: BAT-2024-001"
              />
            </div>
            <div>
              <Label htmlFor="edit-barcode">Código de Barras (Opcional)</Label>
              <Input
                id="edit-barcode"
                value={editedItem.barcode}
                onChange={(e) => setEditedItem({ ...editedItem, barcode: e.target.value })}
                placeholder="Ej: 7501234567890"
              />
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="edit-controlled_substance"
                checked={editedItem.controlled_substance}
                onCheckedChange={(checked) => setEditedItem({ ...editedItem, controlled_substance: checked as boolean })}
              />
              <Label htmlFor="edit-controlled_substance">Sustancia Controlada</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="edit-requires_prescription"
                checked={editedItem.requires_prescription}
                onCheckedChange={(checked) => setEditedItem({ ...editedItem, requires_prescription: checked as boolean })}
              />
              <Label htmlFor="edit-requires_prescription">Requiere Receta</Label>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => handleDialogChange(false)} className="bg-transparent">
              Cancelar
            </Button>
            <Button onClick={handleSubmit} disabled={!isValid || loading}>
              <Save className="w-4 h-4 mr-2" />
              {loading ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
