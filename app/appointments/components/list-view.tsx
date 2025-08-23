"use client"

import { format, parseISO } from "date-fns"
import { Eye, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Appointment } from "../mocks/appointments-data"
import { getStatusColor, getStatusIcon } from "../utils/appointment-utils"

interface ListViewProps {
  appointments: Appointment[]
  onViewAppointment: (appointment: Appointment) => void
  onEditAppointment: (appointment: Appointment) => void
  onDeleteAppointment: (appointmentId: string) => void
}

export function ListView({
  appointments,
  onViewAppointment,
  onEditAppointment,
  onDeleteAppointment,
}: ListViewProps) {
  return (
    <Card className="border-main-200 dark:border-main-800">
      <CardHeader>
        <CardTitle className="text-primary dark:text-main-400">All Appointments</CardTitle>
        <CardDescription>Showing {appointments.length} appointments</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-32">Patient</TableHead>
                <TableHead className="hidden sm:table-cell">Doctor</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead className="hidden md:table-cell">Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell className="min-w-32">
                    <div>
                      <div className="font-medium text-sm">{appointment.patientName}</div>
                      <div className="text-xs text-muted-foreground sm:hidden">{appointment.doctor}</div>
                      <div className="text-xs text-muted-foreground">{appointment.patientPhone}</div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">{appointment.doctor}</TableCell>
                  <TableCell>
                    <div>
                      <div className="text-sm">{format(parseISO(appointment.date), "MMM d")}</div>
                      <div className="text-xs text-muted-foreground">{appointment.time}</div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{appointment.type}</TableCell>
                  <TableCell>
                    <Badge className={`${getStatusColor(appointment.status)} text-xs`}>
                      {getStatusIcon(appointment.status)}
                      <span className="ml-1 capitalize hidden sm:inline">{appointment.status}</span>
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => onViewAppointment(appointment)}
                      >
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => onEditAppointment(appointment)}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => onDeleteAppointment(appointment.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
