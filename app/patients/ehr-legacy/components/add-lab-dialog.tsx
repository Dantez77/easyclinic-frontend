"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useMedicalRecordsStore } from '@/lib/medical-records-store'

interface AddLabDialogProps {
  patientId: string
  onSuccess?: () => void
}

export function AddLabDialog({ patientId, onSuccess }: AddLabDialogProps) {
  const { modals, closeModal } = useMedicalRecordsStore()

  return (
    <Dialog open={modals.addLab} onOpenChange={() => closeModal('addLab')}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Agregar Examen de Laboratorio</DialogTitle>
        </DialogHeader>
        <div className="p-4">
          <p className="text-muted-foreground">Funcionalidad en desarrollo...</p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
