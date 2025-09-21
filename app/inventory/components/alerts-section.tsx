"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, Calendar } from "lucide-react"
import { getCategoryIcon } from "../utils/inventory-utils"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface AlertsSectionProps {
  lowStockItems: any[]
  expiringItems: any[]
}

export function AlertsSection({ lowStockItems, expiringItems }: AlertsSectionProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Low Stock Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            Alertas de Stock Bajo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {lowStockItems.slice(0, 5).map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div className="flex items-center gap-3">
                  {getCategoryIcon(item.category)}
                  <div>
                    <p className="font-medium text-sm">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.location}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-red-600">
                    {item.current_stock} / {item.min_threshold}
                  </p>
                  <p className="text-xs text-muted-foreground">{item.unit_of_measure}</p>
                </div>
              </div>
            ))}
            {lowStockItems.length === 0 && (
              <p className="text-center text-muted-foreground py-4">No hay alertas de stock bajo</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Expiring Items */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-yellow-600" />
            Próximos a Vencer (30 días)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {expiringItems.slice(0, 5).map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div className="flex items-center gap-3">
                  {getCategoryIcon(item.category)}
                  <div>
                    <p className="font-medium text-sm">{item.name}</p>
                    <p className="text-xs text-muted-foreground">Lote: {item.batch_number}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-yellow-600">
                    {item.expiry_date && format(new Date(item.expiry_date), "dd/MM/yyyy", { locale: es })}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {item.current_stock} {item.unit_of_measure}
                  </p>
                </div>
              </div>
            ))}
            {expiringItems.length === 0 && (
              <p className="text-center text-muted-foreground py-4">No hay artículos próximos a vencer</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
