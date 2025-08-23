import { useState, useMemo } from "react"
import {
  addDays,
  subDays,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameDay,
  parseISO,
  startOfMonth,
  endOfMonth,
  addMonths,
  subMonths,
  eachWeekOfInterval,
  isSameMonth,
  format,
} from "date-fns"
import { Appointment } from "../mocks/appointments-data"

export const useAppointments = (initialAppointments: Appointment[]) => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedView, setSelectedView] = useState("week")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDoctor, setSelectedDoctor] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [appointments, setAppointments] = useState(initialAppointments)

  // Filter appointments
  const filteredAppointments = useMemo(() => {
    return appointments.filter((appointment) => {
      const matchesSearch =
        appointment.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        appointment.doctor.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesDoctor = selectedDoctor === "all" || appointment.doctor === selectedDoctor
      const matchesStatus = selectedStatus === "all" || appointment.status === selectedStatus

      return matchesSearch && matchesDoctor && matchesStatus
    })
  }, [appointments, searchQuery, selectedDoctor, selectedStatus])

  // Calendar navigation
  const navigateDate = (direction: "prev" | "next") => {
    if (selectedView === "day") {
      setCurrentDate(direction === "next" ? addDays(currentDate, 1) : subDays(currentDate, 1))
    } else if (selectedView === "week") {
      setCurrentDate(direction === "next" ? addDays(currentDate, 7) : subDays(currentDate, -7))
    } else if (selectedView === "month") {
      setCurrentDate(direction === "next" ? addMonths(currentDate, 1) : subMonths(currentDate, 1))
    }
  }

  // Calendar data helpers
  const getWeekDays = () => {
    const start = startOfWeek(currentDate)
    const end = endOfWeek(currentDate)
    return eachDayOfInterval({ start, end })
  }

  const getMonthWeeks = () => {
    const start = startOfMonth(currentDate)
    const end = endOfMonth(currentDate)
    const startWeek = startOfWeek(start)
    const endWeek = endOfWeek(end)

    return eachWeekOfInterval({ start: startWeek, end: endWeek })
  }

  const getWeekDaysForMonth = (weekStart: Date) => {
    const end = endOfWeek(weekStart)
    return eachDayOfInterval({ start: weekStart, end })
  }

  const getAppointmentsForDate = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd")
    return filteredAppointments.filter((apt) => apt.date === dateStr)
  }

  // Appointment management
  const addAppointment = (appointment: Omit<Appointment, "id">) => {
    const newAppointment = {
      id: Date.now().toString(),
      ...appointment,
      duration: 30,
      status: "pending" as const,
      patientHistory: [],
    }
    setAppointments([...appointments, newAppointment])
  }

  const updateAppointment = (appointmentId: string, updates: Partial<Appointment>) => {
    setAppointments(appointments.map((apt) => 
      apt.id === appointmentId ? { ...apt, ...updates } : apt
    ))
  }

  const deleteAppointment = (appointmentId: string) => {
    setAppointments(appointments.filter((apt) => apt.id !== appointmentId))
  }

  const handleStatusChange = (appointmentId: string, newStatus: string) => {
    updateAppointment(appointmentId, { status: newStatus as Appointment["status"] })
  }

  return {
    // State
    currentDate,
    setCurrentDate,
    selectedView,
    setSelectedView,
    searchQuery,
    setSearchQuery,
    selectedDoctor,
    setSelectedDoctor,
    selectedStatus,
    setSelectedStatus,
    appointments,
    
    // Computed values
    filteredAppointments,
    
    // Calendar helpers
    navigateDate,
    getWeekDays,
    getMonthWeeks,
    getWeekDaysForMonth,
    getAppointmentsForDate,
    
    // Appointment management
    addAppointment,
    updateAppointment,
    deleteAppointment,
    handleStatusChange,
  }
}
