"use client"

import { format, isSameDay, isSameMonth } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Appointment } from "../mocks/appointments-data"

interface MonthViewProps {
  currentDate: Date
  monthWeeks: Date[][]
  appointments: Appointment[]
  onAppointmentClick: (appointment: Appointment) => void
}

export function MonthView({
  currentDate,
  monthWeeks,
  appointments,
  onAppointmentClick,
}: MonthViewProps) {
  const getAppointmentsForDate = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd")
    return appointments.filter((apt) => apt.date === dateStr)
  }

  return (
    <Card className="border-main-200 dark:border-main-800">
      <CardHeader>
        <CardTitle className="text-primary dark:text-main-400">
          {format(currentDate, "MMMM yyyy")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {/* Days of week header */}
          <div className="grid grid-cols-7 gap-1 lg:gap-2 mb-4">
            {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
              <div
                key={day}
                className="text-center text-xs lg:text-sm font-medium text-muted-foreground p-1 lg:p-2"
              >
                <span className="sm:hidden">{day}</span>
                <span className="hidden sm:inline">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][index]}
                </span>
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          {monthWeeks.map((week, weekIndex) => (
            <div key={weekIndex} className="grid grid-cols-7 gap-1 lg:gap-2">
              {week.map((day) => {
                const dayAppointments = getAppointmentsForDate(day)
                const isCurrentMonth = isSameMonth(day, currentDate)
                const isToday = isSameDay(day, new Date())

                return (
                  <div
                    key={day.toISOString()}
                    className={`min-h-16 sm:min-h-20 lg:min-h-24 p-1 lg:p-2 border rounded-lg ${
                      isCurrentMonth
                        ? "bg-background border-main-200 dark:border-main-800"
                        : "bg-muted/30 border-muted"
                    } ${isToday ? "ring-1 lg:ring-2 ring-primary dark:ring-main-400" : ""}`}
                  >
                    <div
                      className={`text-xs lg:text-sm font-medium mb-1 ${
                        isToday
                          ? "text-primary dark:text-main-400"
                          : isCurrentMonth
                            ? "text-foreground"
                            : "text-muted-foreground"
                      }`}
                    >
                      {format(day, "d")}
                    </div>

                    <div className="space-y-1">
                      {dayAppointments.slice(0, 1).map((appointment) => (
                        <div
                          key={appointment.id}
                          className="text-xs p-1 bg-main-100 dark:bg-main-900/30 rounded cursor-pointer hover:bg-main-200 dark:hover:bg-main-900/50 truncate"
                          onClick={() => onAppointmentClick(appointment)}
                          title={`${appointment.time} - ${appointment.patientName}`}
                        >
                          <div className="font-medium truncate hidden sm:block">{appointment.time}</div>
                          <div className="truncate text-muted-foreground">
                            {appointment.patientName.split(" ")[0]}
                          </div>
                        </div>
                      ))}
                      {dayAppointments.length > 1 && (
                        <div className="text-xs text-center text-muted-foreground">
                          +{dayAppointments.length - 1}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
