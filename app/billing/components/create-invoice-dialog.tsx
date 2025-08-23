"use client"

import * as React from "react"
import { Plus, X, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Service, Patient, DOCUMENT_TYPES } from "../mocks/billing-data"

interface CreateInvoiceDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  newInvoice: {
    patientId: string
    services: { serviceId: string; quantity: number; customPrice: number }[]
    discount: number
    notes: string
    documentType: string
  }
  onNewInvoiceChange: (invoice: any) => void
  searchPatientTerm: string
  onSearchPatientTermChange: (term: string) => void
  showPatientSuggestions: boolean
  onShowPatientSuggestionsChange: (show: boolean) => void
  filteredPatientSuggestions: Patient[]
  allPatients: Patient[]
  onPatientSelect: (patient: Patient) => void
  onAddService: () => void
  onRemoveService: (index: number) => void
  onUpdateService: (index: number, field: string, value: any) => void
  onCreateInvoice: () => void
  services: Service[]
}

export function CreateInvoiceDialog({
  isOpen,
  onOpenChange,
  newInvoice,
  onNewInvoiceChange,
  searchPatientTerm,
  onSearchPatientTermChange,
  showPatientSuggestions,
  onShowPatientSuggestionsChange,
  filteredPatientSuggestions,
  allPatients,
  onPatientSelect,
  onAddService,
  onRemoveService,
  onUpdateService,
  onCreateInvoice,
  services,
}: CreateInvoiceDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nueva Factura</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {/* Patient Selection */}
          <div>
            <Label>Paciente</Label>
            <div className="relative mt-1">
              <Input
                placeholder="Buscar paciente por nombre..."
                value={
                  newInvoice.patientId
                    ? allPatients.find((p) => p.id === newInvoice.patientId)?.name || ""
                    : searchPatientTerm
                }
                onChange={(e) => {
                  const value = e.target.value
                  onSearchPatientTermChange(value)
                  onNewInvoiceChange({ ...newInvoice, patientId: "" })
                  onShowPatientSuggestionsChange(value.length > 0)
                }}
                onFocus={() => onShowPatientSuggestionsChange(searchPatientTerm.length > 0)}
              />
              {showPatientSuggestions && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-main-200 dark:border-main-800 rounded-md shadow-lg max-h-60 overflow-auto">
                  {filteredPatientSuggestions.length > 0 ? (
                    filteredPatientSuggestions.map((patient) => (
                      <div
                        key={patient.id}
                        className="px-4 py-2 hover:bg-accent cursor-pointer border-b border-main-200 dark:border-main-800 last:border-b-0"
                        onClick={() => onPatientSelect(patient)}
                      >
                        <div className="font-medium text-foreground">{patient.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {patient.id} - {patient.insurance}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Cobertura: {patient.coverage}% | NIT: {patient.nit || "No registrado"}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-muted-foreground text-sm">No se encontraron pacientes</div>
                  )}
                </div>
              )}
            </div>
                          {newInvoice.patientId && (
                <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      {(() => {
                        // Find patient from the full list of patients
                        const selectedPatient = allPatients.find((p) => p.id === newInvoice.patientId)
                        return (
                          <>
                            <p className="font-medium text-blue-900">
                              {selectedPatient?.name || "Paciente seleccionado"}
                            </p>
                            <p className="text-sm text-blue-700">
                              {selectedPatient?.insurance || "Sin seguro"} - Cobertura:{" "}
                              {selectedPatient?.coverage || 0}%
                            </p>
                            <p className="text-xs text-primary">
                              NIT: {selectedPatient?.nit || "No registrado"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              ID: {selectedPatient?.id || newInvoice.patientId}
                            </p>
                            {selectedPatient?.email && (
                              <p className="text-xs text-muted-foreground">
                                Email: {selectedPatient.email}
                              </p>
                            )}
                            {selectedPatient?.phone && (
                              <p className="text-xs text-muted-foreground">
                                Tel: {selectedPatient.phone}
                              </p>
                            )}
                          </>
                        )
                      })()}
                    </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      onNewInvoiceChange({ ...newInvoice, patientId: "" })
                      onSearchPatientTermChange("")
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Document Type Selection */}
          <div>
            <Label>Tipo de Documento</Label>
            <Select
              value={newInvoice.documentType}
              onValueChange={(value) => onNewInvoiceChange({ ...newInvoice, documentType: value })}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Seleccionar tipo de documento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ticket">Ticket</SelectItem>
                <SelectItem value="dteFactura">Factura </SelectItem>
                <SelectItem value="dteComprobante">Credito Fiscal </SelectItem>
              </SelectContent>
            </Select>
            {(newInvoice.documentType === "dteFactura" || newInvoice.documentType === "dteComprobante") && (
              <div className="mt-2 p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-green-800">
                  <strong>DTE El Salvador:</strong> Este documento incluye IVA (13%) y requiere NIT del paciente. Se
                  enviará automáticamente al Ministerio de Hacienda después del pago.
                </p>
                {newInvoice.patientId && (() => {
                  const selectedPatient = allPatients.find((p) => p.id === newInvoice.patientId)
                  if (!selectedPatient?.nit) {
                    return (
                      <div className="mt-2 p-2 bg-red-100 border border-red-300 rounded">
                        <p className="text-sm text-red-700">
                          <strong>⚠️ Advertencia:</strong> El paciente seleccionado no tiene NIT registrado. 
                          Este documento requiere NIT para ser válido.
                        </p>
                      </div>
                    )
                  }
                  return null
                })()}
              </div>
            )}
            {(newInvoice.documentType === "factura" || newInvoice.documentType === "creditoFiscal") && (
              <div className="mt-2 p-3 bg-yellow-50 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Nota:</strong> Este documento incluye ITBIS (18%) y requiere RNC del paciente.
                </p>
                {newInvoice.patientId && (() => {
                  const selectedPatient = allPatients.find((p) => p.id === newInvoice.patientId)
                  if (!selectedPatient?.rnc) {
                    return (
                      <div className="mt-2 p-2 bg-red-100 border border-red-300 rounded">
                        <p className="text-sm text-red-700">
                          <strong>⚠️ Advertencia:</strong> El paciente seleccionado no tiene RNC registrado. 
                          Este documento requiere RNC para ser válido.
                        </p>
                      </div>
                    )
                  }
                  return null
                })()}
              </div>
            )}
          </div>

          {/* Services */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <Label>Servicios</Label>
              <Button onClick={onAddService} variant="outline" size="sm" className="bg-transparent">
                <Plus className="w-4 h-4 mr-2" />
                Agregar Servicio
              </Button>
            </div>
            <div className="space-y-4">
              {newInvoice.services.map((service, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium">Servicio {index + 1}</h4>
                    {newInvoice.services.length > 1 && (
                      <Button variant="ghost" size="sm" onClick={() => onRemoveService(index)}>
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-sm">Servicio</Label>
                      <Select
                        value={service.serviceId}
                        onValueChange={(value) => onUpdateService(index, "serviceId", value)}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Seleccionar servicio" />
                        </SelectTrigger>
                        <SelectContent>
                          {services.map((s) => (
                            <SelectItem key={s.id} value={s.id}>
                              {s.name} - ${s.price}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-sm">Cantidad</Label>
                      <Input
                        type="number"
                        min="1"
                        value={service.quantity}
                        onChange={(e) => onUpdateService(index, "quantity", Number.parseInt(e.target.value))}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-sm">Precio Personalizado (opcional)</Label>
                      <Input
                        type="number"
                        min="0"
                        value={service.customPrice}
                        onChange={(e) => onUpdateService(index, "customPrice", Number.parseFloat(e.target.value) || 0)}
                        className="mt-1"
                        placeholder="Dejar vacío para precio estándar"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Discount */}
          <div>
            <Label htmlFor="discount">Descuento (%)</Label>
            <Input
              id="discount"
              type="number"
              min="0"
              max="100"
              value={newInvoice.discount}
              onChange={(e) => onNewInvoiceChange({ ...newInvoice, discount: Number.parseFloat(e.target.value) || 0 })}
              className="mt-1"
            />
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes">Notas</Label>
            <Textarea
              id="notes"
              value={newInvoice.notes}
              onChange={(e) => onNewInvoiceChange({ ...newInvoice, notes: e.target.value })}
              placeholder="Notas adicionales..."
              className="mt-1"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="bg-transparent">
              Cancelar
            </Button>
            <Button
              onClick={onCreateInvoice}
              disabled={(() => {
                // Check basic requirements
                if (!newInvoice.patientId || newInvoice.services.some((s) => !s.serviceId)) {
                  return true
                }
                
                // Check document type requirements
                const selectedPatient = allPatients.find((p) => p.id === newInvoice.patientId)
                if (!selectedPatient) return true
                
                const docType = DOCUMENT_TYPES[newInvoice.documentType]
                if (docType?.requiresNIT && !selectedPatient?.nit) return true
                if (docType?.requiresRNC && !selectedPatient?.rnc) return true
                
                return false
              })()}
            >
              <Save className="w-4 h-4 mr-2" />
              Crear Factura
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
