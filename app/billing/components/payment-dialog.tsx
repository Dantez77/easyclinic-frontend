"use client"

import { CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Invoice } from "../mocks/billing-data"

interface PaymentDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  invoice: Invoice | null
  stripeTerminalConnected: boolean
  isProcessingStripePayment: boolean
  onProcessStripePayment: (invoice: Invoice) => void
  onProcessPayment: (paymentMethod: string) => void
}

export function PaymentDialog({
  isOpen,
  onOpenChange,
  invoice,
  stripeTerminalConnected,
  isProcessingStripePayment,
  onProcessStripePayment,
  onProcessPayment,
}: PaymentDialogProps) {
  if (!invoice) return null

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Procesar Pago</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="p-4 bg-muted rounded-lg">
            <p className="font-medium">{invoice.patientName}</p>
            <p className="text-sm text-muted-foreground">Factura: {invoice.id}</p>
            <p className="text-lg font-bold text-green-600 mt-2">
              Total: ${invoice.patientAmount.toLocaleString()}
            </p>
            {invoice.insuranceCoverage > 0 && (
              <p className="text-sm text-muted-foreground">
                (Seguro cubre: ${invoice.insuranceAmount.toLocaleString()})
              </p>
            )}
          </div>

          {/* Stripe NFC Payment Option */}
          {stripeTerminalConnected && (
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Pago con Tarjeta NFC</h4>
              <Button
                onClick={() => onProcessStripePayment(invoice)}
                disabled={isProcessingStripePayment}
                className="w-full"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                {isProcessingStripePayment ? "Procesando..." : "Pagar con Tarjeta NFC"}
              </Button>
              {isProcessingStripePayment && (
                <p className="text-sm text-blue-700 mt-2">
                  Presente la tarjeta o dispositivo móvil al lector NFC...
                </p>
              )}
            </div>
          )}

          {/* Traditional Payment Methods */}
          <div>
            <Label>Otros Métodos de Pago</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <Button variant="outline" onClick={() => onProcessPayment("Efectivo")} className="bg-transparent">
                Efectivo
              </Button>
              <Button variant="outline" onClick={() => onProcessPayment("Cheque")} className="bg-transparent">
                Cheque
              </Button>
              <Button
                variant="outline"
                onClick={() => onProcessPayment("Transferencia")}
                className="bg-transparent"
              >
                Transferencia
              </Button>
              <Button variant="outline" onClick={() => onProcessPayment("Otro")} className="bg-transparent">
                Otro
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
