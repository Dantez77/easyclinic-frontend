"use client"

import { DollarSign, Plus, Wifi } from "lucide-react"
import { Button } from "@/components/ui/button"

interface BillingHeaderProps {
  stripeTerminalConnected: boolean
  onConnectTerminal: () => void
  onCreateInvoice: () => void
}

export function BillingHeader({
  stripeTerminalConnected,
  onConnectTerminal,
  onCreateInvoice,
}: BillingHeaderProps) {
  return (
    <div className="bg-card border-b border-main-200 dark:border-main-800 p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h1 className="text-xl lg:text-2xl font-bold text-foreground">Facturación</h1>
              <p className="text-sm lg:text-base text-muted-foreground">Gestión de facturas y pagos</p>
            </div>
          </div>
          <div className="flex gap-2">
            {/* Stripe Terminal Connection Status */}
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-muted">
              <div className={`w-2 h-2 rounded-full ${stripeTerminalConnected ? "bg-green-500" : "bg-red-500"}`} />
              <span className="text-xs text-muted-foreground">
                {stripeTerminalConnected ? "Terminal Conectado" : "Terminal Desconectado"}
              </span>
            </div>
            {!stripeTerminalConnected && (
              <Button onClick={onConnectTerminal} variant="outline" size="sm" className="bg-transparent">
                <Wifi className="w-4 h-4 mr-2" />
                Conectar Terminal
              </Button>
            )}
            <Button onClick={onCreateInvoice}>
              <Plus className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Nueva </span>Factura
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
