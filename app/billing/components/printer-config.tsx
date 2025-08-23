"use client"

import { Receipt } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface PrinterConfigProps {
  onTestPrinter: () => void
}

export function PrinterConfig({ onTestPrinter }: PrinterConfigProps) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Receipt className="w-5 h-5" />
          Configuración de Impresora Térmica
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Instrucciones de Configuración:</h4>
            <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
              <li>Conecte la impresora térmica via USB o Serial</li>
              <li>Instale los drivers necesarios para su impresora</li>
              <li>Configure la velocidad de baudios a 9600</li>
              <li>Al procesar un pago, el sistema solicitará acceso al puerto serial</li>
              <li>Seleccione su impresora térmica de la lista</li>
            </ol>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg">
            <h4 className="font-medium text-yellow-900 mb-2">Impresoras Compatibles:</h4>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>• Epson TM-T20, TM-T82, TM-T88</li>
              <li>• Star TSP100, TSP650, TSP700</li>
              <li>• Citizen CT-S310, CT-S4000</li>
              <li>• Cualquier impresora compatible con ESC/POS</li>
            </ul>
          </div>
          <Button
            variant="outline"
            onClick={onTestPrinter}
            className="bg-transparent"
          >
            <Receipt className="w-4 h-4 mr-2" />
            Probar Impresora
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
