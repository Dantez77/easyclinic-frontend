"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Edit, Package, QrCode, MapPin } from "lucide-react"
import { getStatusColor, getStatusIcon, getCategoryIcon } from "../utils/inventory-utils"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface ViewItemSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  item: any
  onUpdateStock: (item: any) => void
  onEditItem: (item: any) => void
  onPrintBarcode: (item: any) => void
}

export function ViewItemSheet({
  open,
  onOpenChange,
  item,
  onUpdateStock,
  onEditItem,
  onPrintBarcode,
}: ViewItemSheetProps) {
  if (!item) return null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl">
        <SheetHeader>
          <SheetTitle>Detalle del Artículo</SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-120px)] pr-4">
          <div className="space-y-6 pb-8 pr-2">
            {/* Item Header */}
            <div className="border-b pb-4">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  {getCategoryIcon(item.category)}
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <p className="text-sm text-muted-foreground">{item.sku}</p>
                  <Badge variant={getStatusColor(item.status)} className="mt-1">
                    {item.status}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Basic Information */}
            <div>
              <h4 className="font-medium text-foreground mb-3">Información Básica</h4>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-muted-foreground">Categoría:</span>
                    <p className="font-medium">{item.category}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Departamento:</span>
                    <p className="font-medium">{item.department}</p>
                  </div>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Descripción:</span>
                  <p className="font-medium">{item.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-muted-foreground">Proveedor:</span>
                    <p className="font-medium">{item.supplier}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Fabricante:</span>
                    <p className="font-medium">{item.manufacturer}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stock Information */}
            <div>
              <h4 className="font-medium text-foreground mb-3">Información de Stock</h4>
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <span className="text-sm text-muted-foreground">Stock Actual:</span>
                    <p className="font-bold text-lg">
                      {item.currentStock} {item.unitOfMeasure}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Stock Mínimo:</span>
                    <p className="font-medium">
                      {item.minThreshold} {item.unitOfMeasure}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Stock Máximo:</span>
                    <p className="font-medium">
                      {item.maxThreshold} {item.unitOfMeasure}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-muted-foreground">Costo Unitario:</span>
                    <p className="font-medium">${item.unitCost.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Valor Total:</span>
                    <p className="font-bold text-green-600">${item.totalValue.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Location & Tracking */}
            <div>
              <h4 className="font-medium text-foreground mb-3">Ubicación y Seguimiento</h4>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-muted-foreground">Ubicación:</span>
                  <p className="font-medium flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {item.location}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-muted-foreground">Número de Lote:</span>
                    <p className="font-medium">{item.batchNumber}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Código de Barras:</span>
                    <p className="font-medium font-mono text-sm">{item.barcode}</p>
                  </div>
                </div>
                {item.expiryDate && (
                  <div>
                    <span className="text-sm text-muted-foreground">Fecha de Vencimiento:</span>
                    <p className="font-medium">
                      {format(new Date(item.expiryDate), "dd/MM/yyyy", { locale: es })}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Compliance & Safety */}
            <div>
              <h4 className="font-medium text-foreground mb-3">Cumplimiento y Seguridad</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Checkbox checked={item.controlledSubstance} disabled />
                  <span className="text-sm">Sustancia Controlada</span>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox checked={item.requiresPrescription} disabled />
                  <span className="text-sm">Requiere Receta Médica</span>
                </div>
              </div>
            </div>

            {/* Last Update */}
            <div>
              <h4 className="font-medium text-foreground mb-3">Última Actualización</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Fecha:</span>
                  <span className="text-sm font-medium">
                    {format(new Date(item.lastUpdated), "dd/MM/yyyy", { locale: es })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Usuario:</span>
                  <span className="text-sm font-medium">{item.updatedBy}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-2 pt-4 sticky bottom-0 bg-card pb-4">
              <Button
                variant="outline"
                className="flex-1 bg-transparent"
                onClick={() => {
                  onUpdateStock(item)
                  onOpenChange(false)
                }}
              >
                <Package className="w-4 h-4 mr-2" />
                Actualizar Stock
              </Button>
              <Button
                variant="outline"
                className="flex-1 bg-transparent"
                onClick={() => onPrintBarcode(item)}
              >
                <QrCode className="w-4 h-4 mr-2" />
                Imprimir Código
              </Button>
              <Button
                variant="outline"
                className="flex-1 bg-transparent"
                onClick={() => {
                  onEditItem(item)
                  onOpenChange(false)
                }}
              >
                <Edit className="w-4 h-4 mr-2" />
                Editar
              </Button>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
