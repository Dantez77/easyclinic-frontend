"use client"

import { Button } from "@/components/ui/button"
import { Package, Download, Plus, Scan } from "lucide-react"

interface InventoryHeaderProps {
  itemCount: number
  onExport: () => void
  onAddItem: () => void
  onScanBarcode?: () => void
}

export function InventoryHeader({ itemCount, onExport, onAddItem, onScanBarcode }: InventoryHeaderProps) {
  return (
    <div className="bg-card border-b border-main-200 dark:border-main-800 p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <Package className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl lg:text-2xl font-bold text-foreground">Inventario Médico</h1>
              <p className="text-sm lg:text-base text-muted-foreground">
                {itemCount} artículo{itemCount !== 1 ? "s" : ""} en inventario
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={onExport} variant="outline" className="bg-transparent">
              <Download className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Exportar</span>
            </Button>
            {onScanBarcode && (
              <Button onClick={onScanBarcode} variant="outline" className="bg-transparent">
                <Scan className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Escanear</span>
              </Button>
            )}
            <Button onClick={onAddItem}>
              <Plus className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Nuevo </span>Artículo
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
