"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, Package, Edit, QrCode, Trash2, MapPin } from "lucide-react"
import { getStatusColor, getStatusIcon, getCategoryIcon } from "../utils/inventory-utils"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface InventoryTableProps {
  items: any[]
  selectedItems: string[]
  onSelectAll: (checked: boolean) => void
  onSelectItem: (itemId: string, checked: boolean) => void
  onViewItem: (item: any) => void
  onUpdateStock: (item: any) => void
  onEditItem: (item: any) => void
  onPrintBarcode: (item: any) => void
  onDeleteItem: (itemId: string) => void
}

export function InventoryTable({
  items,
  selectedItems,
  onSelectAll,
  onSelectItem,
  onViewItem,
  onUpdateStock,
  onEditItem,
  onPrintBarcode,
  onDeleteItem,
}: InventoryTableProps) {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted border-b">
              <tr>
                <th className="p-4 text-left">
                  <Checkbox
                    checked={selectedItems.length === items.length && items.length > 0}
                    onCheckedChange={onSelectAll}
                  />
                </th>
                <th className="p-4 text-left text-sm font-medium text-foreground">Artículo</th>
                <th className="p-4 text-left text-sm font-medium text-foreground hidden md:table-cell">Stock</th>
                <th className="p-4 text-left text-sm font-medium text-foreground hidden lg:table-cell">
                  Ubicación
                </th>
                <th className="p-4 text-left text-sm font-medium text-foreground hidden sm:table-cell">Estado</th>
                <th className="p-4 text-left text-sm font-medium text-foreground hidden lg:table-cell">Valor</th>
                <th className="p-4 text-left text-sm font-medium text-foreground">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-muted">
                  <td className="p-4">
                    <Checkbox
                      checked={selectedItems.includes(item.id)}
                      onCheckedChange={(checked) => onSelectItem(item.id, checked as boolean)}
                    />
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        {getCategoryIcon(item.category)}
                      </div>
                      <div>
                        <div className="font-medium text-foreground">{item.name}</div>
                        <div className="text-sm text-muted-foreground">{item.sku}</div>
                        <div className="text-xs text-muted-foreground md:hidden">
                          Stock: {item.current_stock} {item.unit_of_measure}
                        </div>
                        {item.controlled_substance && (
                          <Badge variant="destructive" className="text-xs mt-1">
                            Controlada
                          </Badge>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="p-4 hidden md:table-cell">
                    <div className="text-sm">
                      <div className="font-medium text-foreground">
                        {item.current_stock} {item.unit_of_measure}
                      </div>
                      <div className="text-muted-foreground">
                        Mín: {item.min_threshold} | Máx: {item.max_threshold}
                      </div>
                      {item.current_stock <= item.min_threshold && (
                        <div className="text-red-600 text-xs font-medium">¡Stock Bajo!</div>
                      )}
                    </div>
                  </td>
                  <td className="p-4 hidden lg:table-cell">
                    <div className="text-sm">
                      <div className="flex items-center gap-1 text-foreground">
                        <MapPin className="w-3 h-3" />
                        {item.location}
                      </div>
                      <div className="text-muted-foreground">{item.department}</div>
                    </div>
                  </td>
                  <td className="p-4 hidden sm:table-cell">
                    <Badge variant={getStatusColor(item.status)} className="flex items-center gap-1">
                      {getStatusIcon(item.status)}
                      {item.status}
                    </Badge>
                  </td>
                  <td className="p-4 hidden lg:table-cell">
                    <div className="text-sm">
                      <div className="font-medium text-foreground">${item.total_value.toLocaleString()}</div>
                      <div className="text-muted-foreground">${item.unit_cost} c/u</div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewItem(item)}
                        className="h-8 w-8 p-0"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onUpdateStock(item)}
                        className="h-8 w-8 p-0"
                        title="Actualizar Stock"
                      >
                        <Package className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEditItem(item)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onPrintBarcode(item)}
                        className="h-8 w-8 p-0"
                        title="Imprimir Código de Barras"
                      >
                        <QrCode className="w-4 h-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>¿Eliminar artículo?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta acción eliminará permanentemente "{item.name}" del inventario. Esta acción no
                              se puede deshacer.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => onDeleteItem(item.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Eliminar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
