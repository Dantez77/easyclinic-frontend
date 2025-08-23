"use client"

import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Eye, CreditCard, DollarSign, Download, Receipt, User, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Invoice, DOCUMENT_TYPES } from "../mocks/billing-data"
import { getStatusColor } from "../utils/billing-utils"

interface InvoicesTableProps {
  invoices: Invoice[]
  stripeTerminalConnected: boolean
  isProcessingStripePayment: boolean
  onViewInvoice: (invoice: Invoice) => void
  onProcessStripePayment: (invoice: Invoice) => void
  onProcessPayment: (invoice: Invoice) => void
  onReprintReceipt: (invoice: Invoice) => void
}

export function InvoicesTable({
  invoices,
  stripeTerminalConnected,
  isProcessingStripePayment,
  onViewInvoice,
  onProcessStripePayment,
  onProcessPayment,
  onReprintReceipt,
}: InvoicesTableProps) {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted border-b">
              <tr>
                <th className="p-4 text-left text-sm font-medium text-foreground">Documento</th>
                <th className="p-4 text-left text-sm font-medium text-foreground">Paciente</th>
                <th className="p-4 text-left text-sm font-medium text-foreground hidden md:table-cell">Fecha</th>
                <th className="p-4 text-left text-sm font-medium text-foreground hidden lg:table-cell">
                  Vencimiento
                </th>
                <th className="p-4 text-left text-sm font-medium text-foreground">Total</th>
                <th className="p-4 text-left text-sm font-medium text-foreground">Estado</th>
                <th className="p-4 text-left text-sm font-medium text-foreground">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-muted">
                  <td className="p-4">
                    <div className="font-medium text-foreground">{invoice.id}</div>
                    <div className="text-xs text-muted-foreground">{DOCUMENT_TYPES[invoice.documentType]?.name}</div>
                    {invoice.dteUuid && (
                      <div className="flex items-center gap-1 text-xs text-green-600 mt-1">
                        <Shield className="w-3 h-3" />
                        DTE: {invoice.dteStatus}
                      </div>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium text-foreground">{invoice.patientName}</div>
                        <div className="text-sm text-muted-foreground">{invoice.patientId}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 hidden md:table-cell">
                    <div className="text-sm text-foreground">
                      {format(new Date(invoice.date), "dd/MM/yyyy", { locale: es })}
                    </div>
                  </td>
                  <td className="p-4 hidden lg:table-cell">
                    <div className="text-sm text-foreground">
                      {format(new Date(invoice.dueDate), "dd/MM/yyyy", { locale: es })}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-medium text-foreground">${invoice.total.toLocaleString()}</div>
                    {invoice.insuranceCoverage > 0 && (
                      <div className="text-xs text-muted-foreground">Seguro: {invoice.insuranceCoverage}%</div>
                    )}
                  </td>
                  <td className="p-4">
                    <Badge variant={getStatusColor(invoice.status)}>{invoice.status}</Badge>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewInvoice(invoice)}
                        className="h-8 w-8 p-0"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      {invoice.status === "Pendiente" && (
                        <>
                          {stripeTerminalConnected && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onProcessStripePayment(invoice)}
                              disabled={isProcessingStripePayment}
                              className="h-8 w-8 p-0"
                              title="Pago con Tarjeta NFC"
                            >
                              <CreditCard className="w-4 h-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onProcessPayment(invoice)}
                            className="h-8 w-8 p-0"
                            title="Otros métodos de pago"
                          >
                            <DollarSign className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Download className="w-4 h-4" />
                      </Button>
                      {invoice.status === "Pagada" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onReprintReceipt(invoice)}
                          className="h-8 w-8 p-0"
                          title="Reimprimir Recibo"
                        >
                          <Receipt className="w-4 h-4" />
                        </Button>
                      )}
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
