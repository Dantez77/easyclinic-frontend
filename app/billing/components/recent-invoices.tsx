"use client"

import { Shield } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Invoice } from "../mocks/billing-data"
import { getStatusColor, getStatusIcon } from "../utils/billing-utils"

interface RecentInvoicesProps {
  invoices: Invoice[]
  onViewInvoice: (invoice: Invoice) => void
}

export function RecentInvoices({ invoices, onViewInvoice }: RecentInvoicesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Facturas Recientes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {invoices.slice(0, 5).map((invoice) => (
            <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  {getStatusIcon(invoice.status)}
                  <div>
                    <p className="font-medium">{invoice.id}</p>
                    <p className="text-sm text-muted-foreground">{invoice.patientName}</p>
                    {invoice.dteUuid && (
                      <div className="flex items-center gap-1 text-xs text-green-600">
                        <Shield className="w-3 h-3" />
                        DTE Generado
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">${invoice.total.toLocaleString()}</p>
                <Badge variant={getStatusColor(invoice.status)} className="text-xs">
                  {invoice.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
