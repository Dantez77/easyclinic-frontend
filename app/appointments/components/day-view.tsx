"use client"

import { format } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Appointment } from "../mocks/appointments-data"
import { getStatusColor, getStatusIcon } from "../utils/appointment-utils"

interface DayViewProps {
  currentDate: Date
  timeSlots: string[]
  appointments: Appointment[]
  onAppointmentClick: (appointment: Appointment) => void
}

export function DayView({
  currentDate,
  timeSlots,
  appointments,
  onAppointmentClick,
}: DayViewProps) {
  const getAppointmentsForDate = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd")
    return appointments.filter((apt) => apt.date === dateStr)
  }

  return (
    <Card className="border-main-200 dark:border-main-800">
      <CardHeader>
        <CardTitle className="text-primary dark:text-main-400">
          {format(currentDate, "EEEE, MMMM d, yyyy")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {timeSlots.map((time) => {
            const appointmentsAtTime = getAppointmentsForDate(currentDate).filter(
              (apt) => apt.time === time,
            )
            return (
              <div
                key={time}
                className="flex items-center gap-4 p-2 border-b border-main-200 dark:border-main-800 dark:border-main-200 dark:border-main-800"
              >
                <div className="w-16 text-sm font-medium text-muted-foreground">{time}</div>
                <div className="flex-1">
                  {appointmentsAtTime.length > 0 ? (
                    appointmentsAtTime.map((appointment) => (
                      <div
                        key={appointment.id}
                        className="flex items-center justify-between p-3 bg-main-50 dark:bg-main-950/20 rounded-lg cursor-pointer hover:bg-main-100 dark:hover:bg-main-950/40"
                        onClick={() => onAppointmentClick(appointment)}
                      >
                        <div>
                          <div className="font-medium">{appointment.patientName}</div>
                          <div className="text-sm text-muted-foreground">
                            {appointment.doctor} • {appointment.type}
                          </div>
                        </div>
                        <Badge className={getStatusColor(appointment.status)}>
                          {getStatusIcon(appointment.status)}
                          <span className="ml-1 capitalize">{appointment.status}</span>
                        </Badge>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-muted-foreground italic">No appointments</div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
