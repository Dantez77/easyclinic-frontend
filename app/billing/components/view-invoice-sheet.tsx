"use client"

import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Send, Shield, Receipt } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Invoice } from "../mocks/billing-data"
import { getStatusColor } from "../utils/billing-utils"

interface ViewInvoiceSheetProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  invoice: Invoice | null
  onReprintReceipt: (invoice: Invoice) => void
}

export function ViewInvoiceSheet({
  isOpen,
  onOpenChange,
  invoice,
  onReprintReceipt,
}: ViewInvoiceSheetProps) {
  if (!invoice) return null

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl">
        <SheetHeader>
          <SheetTitle>Detalle de Factura</SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-120px)] pr-4">
          <div className="space-y-6 pb-8 pr-2">
            {/* Invoice Header */}
            <div className="border-b pb-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">{invoice.id}</h3>
                  <p className="text-sm text-muted-foreground">
                    Fecha: {format(new Date(invoice.date), "dd/MM/yyyy", { locale: es })}
                  </p>
                  {invoice.dteUuid && (
                    <div className="flex items-center gap-2 mt-2">
                      <Shield className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-green-600">DTE: {invoice.dteUuid}</span>
                    </div>
                  )}
                </div>
                <Badge variant={getStatusColor(invoice.status)} className="text-sm">
                  {invoice.status}
                </Badge>
              </div>
              <div>
                <p className="font-medium">{invoice.patientName}</p>
                <p className="text-sm text-muted-foreground">{invoice.patientId}</p>
                {invoice.nit && <p className="text-sm text-muted-foreground">NIT: {invoice.nit}</p>}
              </div>
            </div>

            {/* Services */}
            <div>
              <h4 className="font-medium text-foreground mb-3">Servicios</h4>
              <div className="space-y-2">
                {invoice.services.map((service, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{service.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {service.quantity} x ${service.unitPrice.toLocaleString()}
                      </p>
                    </div>
                    <p className="font-medium">${service.total.toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals */}
            <div className="border-t pt-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal:</span>
                  <span>${invoice.subtotal.toLocaleString()}</span>
                </div>
                {invoice.discount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Descuento:</span>
                    <span className="text-red-600">-${invoice.discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {invoice.documentType.includes("dte") ? "IVA (13%)" : "ITBIS (18%)"}:
                  </span>
                  <span>${invoice.tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total:</span>
                  <span>${invoice.total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Insurance Coverage */}
            {invoice.insuranceCoverage > 0 && (
              <div className="border-t pt-4">
                <h4 className="font-medium text-foreground mb-3">Cobertura del Seguro</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cobertura ({invoice.insuranceCoverage}%):</span>
                    <span className="text-green-600">${invoice.insuranceAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>Monto del Paciente:</span>
                    <span>${invoice.patientAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Payment Info */}
            {invoice.status === "Pagada" && (
              <div className="border-t pt-4">
                <h4 className="font-medium text-foreground mb-3">Información de Pago</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Método de Pago:</span>
                    <span>{invoice.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Fecha de Pago:</span>
                    <span>{format(new Date(invoice.paymentDate), "dd/MM/yyyy", { locale: es })}</span>
                  </div>
                  {invoice.stripePaymentId && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Stripe ID:</span>
                      <span className="text-xs font-mono">{invoice.stripePaymentId}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* DTE Information */}
            {invoice.dteUuid && (
              <div className="border-t pt-4">
                <h4 className="font-medium text-foreground mb-3">Información DTE</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">UUID DTE:</span>
                    <span className="text-xs font-mono">{invoice.dteUuid}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Estado DTE:</span>
                    <Badge variant={invoice.dteStatus === "accepted" ? "default" : "secondary"}>
                      {invoice.dteStatus}
                    </Badge>
                  </div>
                </div>
              </div>
            )}

            {/* Notes */}
            {invoice.notes && (
              <div className="border-t pt-4">
                <h4 className="font-medium text-foreground mb-2">Notas</h4>
                <p className="text-sm text-muted-foreground">{invoice.notes}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-2 pt-4 sticky bottom-0 bg-card pb-4">
              <Button variant="outline" className="flex-1 bg-transparent">
                <Send className="w-4 h-4 mr-2" />
                Enviar por Email
              </Button>
              {invoice.dteXmlUrl && (
                <Button variant="outline" className="flex-1 bg-transparent">
                  <Shield className="w-4 h-4 mr-2" />
                  Descargar DTE
                </Button>
              )}
              {invoice.status === "Pagada" && (
                <Button
                  variant="outline"
                  className="flex-1 bg-transparent"
                  onClick={() => onReprintReceipt(invoice)}
                >
                  <Receipt className="w-4 h-4 mr-2" />
                  Reimprimir Recibo
                </Button>
              )}
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
