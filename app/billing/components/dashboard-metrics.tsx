"use client"

import { TrendingUp, Clock, AlertCircle, Receipt } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface DashboardMetricsProps {
  totalRevenue: number
  pendingAmount: number
  overdueAmount: number
  totalInvoices: number
}

export function DashboardMetrics({
  totalRevenue,
  pendingAmount,
  overdueAmount,
  totalInvoices,
}: DashboardMetricsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Ingresos Totales</p>
              <p className="text-2xl font-bold text-green-600">${totalRevenue.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Facturas Pendientes</p>
              <p className="text-2xl font-bold text-yellow-600">${pendingAmount.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-500/10 rounded-full flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Facturas Vencidas</p>
              <p className="text-2xl font-bold text-red-600">${overdueAmount.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Facturas</p>
              <p className="text-2xl font-bold text-primary">{totalInvoices}</p>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Receipt className="w-6 h-6 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
