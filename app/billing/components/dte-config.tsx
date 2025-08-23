"use client"

import { Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function DteConfig() {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Configuración DTE El Salvador
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-4 bg-green-50 rounded-lg">
            <h4 className="font-medium text-green-900 mb-2">Estado DTE:</h4>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-sm text-green-800">Conectado al Ministerio de Hacienda</span>
            </div>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Información de la Clínica:</h4>
            <div className="text-sm text-blue-800 space-y-1">
              <p>
                <strong>NIT:</strong> 0614-123456-001-2
              </p>
              <p>
                <strong>Nombre:</strong> Clínica Médica El Salvador
              </p>
              <p>
                <strong>Actividad Económica:</strong> Servicios de Salud
              </p>
              <p>
                <strong>Ambiente:</strong> Producción
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={() => {
              // BACKEND: Test DTE connection
              alert("Probando conexión con Ministerio de Hacienda...")
            }}
            className="bg-transparent"
          >
            <Shield className="w-4 h-4 mr-2" />
            Probar Conexión DTE
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
