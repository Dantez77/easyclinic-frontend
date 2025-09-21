"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, Edit, Activity, FileText, Trash2, Phone, Mail, User } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
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
import type { Patient } from "../mocks/patients-data"

interface PatientsTableProps {
  patients: Patient[]
  selectedPatients: string[]
  onSelectAll: (checked: boolean) => void
  onSelectPatient: (patientId: string, checked: boolean) => void
  onViewPatient: (patient: Patient) => void
  onEditPatient: (patient: Patient) => void
  onViewHistory: (patientId: string) => void
  onDeletePatient: (patientId: string) => void
}

export function PatientsTable({
  patients,
  selectedPatients,
  onSelectAll,
  onSelectPatient,
  onViewPatient,
  onEditPatient,
  onViewHistory,
  onDeletePatient,
}: PatientsTableProps) {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted border-b">
              <tr>
                <th className="p-4 text-left">
                  <Checkbox
                    checked={selectedPatients.length === patients.length && patients.length > 0}
                    onCheckedChange={onSelectAll}
                  />
                </th>
                <th className="p-4 text-left text-sm font-medium text-foreground">Paciente</th>
                <th className="p-4 text-left text-sm font-medium text-foreground hidden md:table-cell">Contacto</th>
                <th className="p-4 text-left text-sm font-medium text-foreground hidden lg:table-cell">Ubicación</th>
                <th className="p-4 text-left text-sm font-medium text-foreground hidden sm:table-cell">Estado</th>
                <th className="p-4 text-left text-sm font-medium text-foreground hidden lg:table-cell">
                  Última Actualización
                </th>
                <th className="p-4 text-left text-sm font-medium text-foreground w-32">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {patients.map((patient) => (
                <tr key={patient.id} className="hover:bg-muted">
                  <td className="p-4">
                    <Checkbox
                      checked={selectedPatients.includes(patient.id)}
                      onCheckedChange={(checked) => onSelectPatient(patient.id, checked as boolean)}
                    />
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium text-foreground">
                          {patient.name} {patient.lastName}
                        </div>
                        <div className="text-sm text-muted-foreground">{patient.id}</div>
                        <div className="text-sm text-muted-foreground md:hidden">{patient.phone}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 hidden md:table-cell">
                    <div className="text-sm">
                      <div className="flex items-center gap-1 text-foreground">
                        <Phone className="w-3 h-3" />
                        {patient.phone}
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground mt-1">
                        <Mail className="w-3 h-3" />
                        {patient.email}
                      </div>
                    </div>
                  </td>
                  <td className="p-4 hidden lg:table-cell">
                    <div className="text-sm">
                      <div className="text-foreground">{patient.municipality || patient.address || 'No especificado'}</div>
                      <div className="text-muted-foreground">{patient.province || 'No especificado'}</div>
                    </div>
                  </td>
                  <td className="p-4 hidden sm:table-cell">
                    <Badge variant={patient.status === "active" ? "default" : "secondary"}>
                      {patient.status === "active" ? "Activo" : "Inactivo"}
                    </Badge>
                  </td>
                  <td className="p-4 hidden lg:table-cell">
                    <div className="text-sm text-foreground">
                      {patient.updatedAt 
                        ? format(new Date(patient.updatedAt), "dd/MM/yyyy", { locale: es })
                        : 'No disponible'
                      }
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewPatient(patient)}
                        className="h-8 w-8 p-0"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEditPatient(patient)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewHistory(patient.id)}
                        className="h-8 w-8 p-0"
                      >
                        <Activity className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => (window.location.href = `/patients/ehr/${patient.id}`)}
                        className="h-8 w-8 p-0"
                        title="Ver EHR Completo"
                      >
                        <FileText className="w-4 h-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-600 hover:text-red-700">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>¿Eliminar paciente?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta acción eliminará permanentemente a {patient.name} {patient.lastName} y todos
                              sus datos asociados. Esta acción no se puede deshacer.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => onDeletePatient(patient.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Eliminar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
