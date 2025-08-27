"use client"

import { Pill, Plus, X } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { medications } from "../mocks/consultation-data"
import { Prescription } from "../hooks/use-consultation"

interface PrescriptionCardProps {
  prescriptions: Prescription[]
  onAddPrescription: () => void
  onRemovePrescription: (index: number) => void
  onUpdatePrescription: (index: number, updates: Partial<Prescription>) => void
}

export function PrescriptionCard({ 
  prescriptions, 
  onAddPrescription, 
  onRemovePrescription, 
  onUpdatePrescription 
}: PrescriptionCardProps) {
  return (
    <Card className="border-main-200 dark:border-main-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary dark:text-main-400">
          <Pill className="w-5 h-5" />
          Receta Médica
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {prescriptions.map((prescription, index) => (
          <div
            key={index}
            className="border rounded-lg p-4 space-y-4 border-main-200 dark:border-main-800"
          >
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Medicamento {index + 1}</h4>
              {prescriptions.length > 1 && (
                <Button variant="ghost" size="sm" onClick={() => onRemovePrescription(index)}>
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <Label>Medicamento</Label>
                <Select 
                  value={prescription.medication}
                  onValueChange={(value) => onUpdatePrescription(index, { medication: value })}
                >
                  <SelectTrigger className="border-main-200 dark:border-main-800">
                    <SelectValue placeholder="Seleccionar medicamento" />
                  </SelectTrigger>
                  <SelectContent>
                    {medications.map((med, i) => (
                      <SelectItem key={i} value={med}>
                        {med}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Dosis</Label>
                <Input 
                  placeholder="ej. 1 tableta" 
                  className="border-main-200 dark:border-main-800"
                  value={prescription.dosage}
                  onChange={(e) => onUpdatePrescription(index, { dosage: e.target.value })}
                />
              </div>
              <div>
                <Label>Frecuencia</Label>
                <Select 
                  value={prescription.frequency}
                  onValueChange={(value) => onUpdatePrescription(index, { frequency: value })}
                >
                  <SelectTrigger className="border-main-200 dark:border-main-800">
                    <SelectValue placeholder="Seleccionar frecuencia" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="every-8h">Cada 8 horas</SelectItem>
                    <SelectItem value="every-12h">Cada 12 horas</SelectItem>
                    <SelectItem value="every-24h">Cada 24 horas</SelectItem>
                    <SelectItem value="prn">Según necesidad</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Duración</Label>
                <Input 
                  placeholder="ej. 7 días" 
                  className="border-main-200 dark:border-main-800"
                  value={prescription.duration}
                  onChange={(e) => onUpdatePrescription(index, { duration: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label>Instrucciones Adicionales</Label>
              <Textarea
                placeholder="Instrucciones especiales..."
                className="border-main-200 dark:border-main-800"
                value={prescription.instructions}
                onChange={(e) => onUpdatePrescription(index, { instructions: e.target.value })}
              />
            </div>
          </div>
        ))}
        <Button
          onClick={onAddPrescription}
          variant="outline"
          className="w-full border-primary text-primary hover:bg-main-50 dark:border-main-400 dark:text-main-400 bg-transparent"
        >
          <Plus className="w-4 h-4 mr-2" />
          Agregar Medicamento
        </Button>
      </CardContent>
    </Card>
  )
}
