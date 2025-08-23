"use client"

import { format, isSameDay } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Appointment } from "../mocks/appointments-data"

interface WeekViewProps {
  weekDays: Date[]
  appointments: Appointment[]
  onAppointmentClick: (appointment: Appointment) => void
}

export function WeekView({
  weekDays,
  appointments,
  onAppointmentClick,
}: WeekViewProps) {
  const getAppointmentsForDate = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd")
    return appointments.filter((apt) => apt.date === dateStr)
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 lg:gap-4">
      {weekDays.map((day) => {
        const dayAppointments = getAppointmentsForDate(day)
        return (
          <Card key={day.toISOString()} className="border-main-200 dark:border-main-800">
            <CardHeader className="pb-2">
              <CardTitle
                className={`text-sm ${isSameDay(day, new Date()) ? "text-primary dark:text-main-400" : "text-muted-foreground"}`}
              >
                {format(day, "EEE d")}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-1">
                {dayAppointments.slice(0, 3).map((appointment) => (
                  <div
                    key={appointment.id}
                    className="p-2 bg-main-50 dark:bg-main-950/20 rounded text-xs cursor-pointer hover:bg-main-100 dark:hover:bg-main-950/40"
                    onClick={() => onAppointmentClick(appointment)}
                  >
                    <div className="font-medium truncate">{appointment.patientName}</div>
                    <div className="text-muted-foreground">{appointment.time}</div>
                  </div>
                ))}
                {dayAppointments.length > 3 && (
                  <div className="text-xs text-muted-foreground text-center py-1">
                    +{dayAppointments.length - 3} more
                  </div>
                )}
                {dayAppointments.length === 0 && (
                  <div className="text-xs text-muted-foreground italic">No appointments</div>
                )}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
