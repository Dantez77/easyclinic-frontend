"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, Download, ShoppingCart } from "lucide-react"
import { format } from "date-fns"

interface PurchaseOrdersProps {
  purchaseOrders: any[]
}

export function PurchaseOrders({ purchaseOrders }: PurchaseOrdersProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="w-5 h-5" />
          Órdenes de Compra
        </CardTitle>
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
                  <Button variant="outline" size="sm" className="bg-transparent">
                    <Eye className="w-4 h-4 mr-2" />
                    Ver
                  </Button>
                  <Button variant="outline" size="sm" className="bg-transparent">
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
  )
}
