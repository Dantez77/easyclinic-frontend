"use client"

import { CreditCard, Wifi, Receipt } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface StripeTerminalConfigProps {
  stripeTerminalConnected: boolean
  onConnectTerminal: () => void
}

export function StripeTerminalConfig({
  stripeTerminalConnected,
  onConnectTerminal,
}: StripeTerminalConfigProps) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          Configuración Stripe Terminal NFC
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Estado de Conexión:</h4>
            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${stripeTerminalConnected ? "bg-green-500" : "bg-red-500"}`}
              />
              <span className="text-sm text-blue-800">
                {stripeTerminalConnected ? "Terminal NFC Conectado" : "Terminal NFC Desconectado"}
              </span>
            </div>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg">
            <h4 className="font-medium text-yellow-900 mb-2">Dispositivos Compatibles:</h4>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>• Stripe Terminal BBPOS WisePOS E</li>
              <li>• Stripe Terminal Verifone P400</li>
              <li>• Tap to Pay en iPhone/Android</li>
              <li>• Cualquier lector NFC compatible con Stripe</li>
            </ul>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={onConnectTerminal}
              disabled={stripeTerminalConnected}
              className={stripeTerminalConnected ? "bg-green-600" : ""}
            >
              <Wifi className="w-4 h-4 mr-2" />
              {stripeTerminalConnected ? "Conectado" : "Conectar Terminal"}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                // BACKEND: Test Stripe Terminal connection
                alert("Probando conexión con Stripe Terminal...")
              }}
              className="bg-transparent"
            >
              <Receipt className="w-4 h-4 mr-2" />
              Probar Conexión
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
