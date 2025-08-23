"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface BulkActionsProps {
  selectedPatients: string[]
  onBulkDelete: () => void
}

export function BulkActions({ selectedPatients, onBulkDelete }: BulkActionsProps) {
  if (selectedPatients.length === 0) return null

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {selectedPatients.length} paciente{selectedPatients.length !== 1 ? "s" : ""} seleccionado
            {selectedPatients.length !== 1 ? "s" : ""}
          </span>
          <div className="flex gap-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Eliminar Seleccionados
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>¿Eliminar pacientes seleccionados?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta acción eliminará permanentemente {selectedPatients.length} paciente
                    {selectedPatients.length !== 1 ? "s" : ""} y todos sus datos asociados. Esta acción no
                    se puede deshacer.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={onBulkDelete} className="bg-red-600 hover:bg-red-700">
                    Eliminar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
