"use client"

import { format, parseISO } from "date-fns"
import { User, Phone, Mail, Edit, Stethoscope, CheckCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Appointment } from "../mocks/appointments-data"
import { getStatusColor, getStatusIcon } from "../utils/appointment-utils"

interface AppointmentDetailsDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  appointment: Appointment | null
  onEdit: (appointment: Appointment) => void
  onStatusChange: (appointmentId: string, newStatus: string) => void
}

export function AppointmentDetailsDialog({
  isOpen,
  onOpenChange,
  appointment,
  onEdit,
  onStatusChange,
}: AppointmentDetailsDialogProps) {
  if (!appointment) return null

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-primary dark:text-main-400">Appointment Details</DialogTitle>
          <DialogDescription>View and manage appointment information</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Patient Information */}
          <div>
            <h3 className="text-lg font-semibold text-primary dark:text-main-400 mb-3">
              Patient Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>{appointment.patientName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{appointment.patientPhone}</span>
              </div>
              <div className="flex items-center gap-2 col-span-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{appointment.patientEmail}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Appointment Information */}
          <div>
            <h3 className="text-lg font-semibold text-primary dark:text-main-400 mb-3">
              Appointment Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Doctor</Label>
                <p>{appointment.doctor}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Type</Label>
                <p>{appointment.type}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Date</Label>
                <p>{format(parseISO(appointment.date), "EEEE, MMMM d, yyyy")}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Time</Label>
                <p>
                  {appointment.time} ({appointment.duration} minutes)
                </p>
              </div>
              <div className="col-span-2">
                <Label className="text-sm font-medium">Status</Label>
                <div className="mt-1">
                  <Badge className={getStatusColor(appointment.status)}>
                    {getStatusIcon(appointment.status)}
                    <span className="ml-1 capitalize">{appointment.status}</span>
                  </Badge>
                </div>
              </div>
              {appointment.notes && (
                <div className="col-span-2">
                  <Label className="text-sm font-medium">Notes</Label>
                  <p className="text-sm text-muted-foreground mt-1">{appointment.notes}</p>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Patient History */}
          <div>
            <h3 className="text-lg font-semibold text-primary dark:text-main-400 mb-3">Patient History</h3>
            {appointment.patientHistory.length > 0 ? (
              <ul className="space-y-1">
                {appointment.patientHistory.map((item: string, index: number) => (
                  <li key={index} className="text-sm text-muted-foreground">
                    • {item}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground italic">No previous history available</p>
            )}
          </div>
        </div>

        <DialogFooter className="flex justify-between">
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => onEdit(appointment)}
              className="border-primary text-primary hover:bg-main-50 dark:border-main-400 dark:text-main-400 bg-transparent"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            {appointment.status === "confirmed" && (
              <Button
                onClick={() =>
                  window.location.href = `/consultation?patient=${encodeURIComponent(appointment.patientName)}&appointmentId=${appointment.id}`
                }
                className="bg-primary hover:bg-main-800 text-white"
              >
                <Stethoscope className="h-4 w-4 mr-2" />
                Attend Patient
              </Button>
            )}
            {appointment.status === "pending" && (
              <Button
                onClick={() => onStatusChange(appointment.id, "confirmed")}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Confirm
              </Button>
            )}
            {appointment.status === "confirmed" && (
              <Button
                onClick={() => onStatusChange(appointment.id, "completed")}
                className="bg-main-600 hover:bg-main-700 text-white"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Mark Complete
              </Button>
            )}
            <Button
              variant="destructive"
              onClick={() => onStatusChange(appointment.id, "cancelled")}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </div>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
