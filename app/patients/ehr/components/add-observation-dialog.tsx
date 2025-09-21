"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useMedicalRecordsStore } from '@/lib/medical-records-store'

interface AddObservationDialogProps {
  patientId: string
  onSuccess?: () => void
}

export function AddObservationDialog({ patientId, onSuccess }: AddObservationDialogProps) {
  const { modals, closeModal } = useMedicalRecordsStore()

  return (
    <Dialog open={modals.addObservation} onOpenChange={() => closeModal('addObservation')}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Agregar Observación Clínica</DialogTitle>
        </DialogHeader>
        <div className="p-4">
          <p className="text-muted-foreground">Funcionalidad en desarrollo...</p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
