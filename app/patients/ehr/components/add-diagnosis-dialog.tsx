"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useMedicalRecordsStore } from '@/lib/medical-records-store'

interface AddDiagnosisDialogProps {
  patientId: string
  onSuccess?: () => void
}

export function AddDiagnosisDialog({ patientId, onSuccess }: AddDiagnosisDialogProps) {
  const { modals, closeModal } = useMedicalRecordsStore()

  return (
    <Dialog open={modals.addDiagnosis} onOpenChange={() => closeModal('addDiagnosis')}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Agregar Diagnóstico</DialogTitle>
        </DialogHeader>
        <div className="p-4">
          <p className="text-muted-foreground">Funcionalidad en desarrollo...</p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
