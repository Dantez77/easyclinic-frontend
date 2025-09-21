"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useMedicalRecordsStore } from '@/lib/medical-records-store'

interface AddMedicationDialogProps {
  patientId: string
  onSuccess?: () => void
}

export function AddMedicationDialog({ patientId, onSuccess }: AddMedicationDialogProps) {
  const { modals, closeModal } = useMedicalRecordsStore()

  return (
    <Dialog open={modals.addMedication} onOpenChange={() => closeModal('addMedication')}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Agregar Medicamento</DialogTitle>
        </DialogHeader>
        <div className="p-4">
          <p className="text-muted-foreground">Funcionalidad en desarrollo...</p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
