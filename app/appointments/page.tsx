"use client"

import * as React from "react"
import {
  Clock,
  User,
  Search,
  Plus,
  ChevronLeft,
  ChevronRight,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Phone,
  Mail,
  Calendar,
  Heart,
  Users,
  Stethoscope,
  Award,
  Moon,
  Sun,
  Edit,
} from "lucide-react"
import {
  format,
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
} from "date-fns"
import { useTheme } from "next-themes"
import { useLanguage } from "@/lib/language-context"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { AppHeader } from "@/components/app-header"



// Mock data for appointments
const mockAppointments = [
  {
    id: "1",
    patientName: "John Smith",
    patientPhone: "(555) 123-4567",
    patientEmail: "john.smith@email.com",
    doctor: "Dr. Sarah Johnson",
    date: "2024-01-20",
    time: "09:00",
    duration: 30,
    type: "Consultation",
    status: "confirmed",
    notes: "Regular checkup and blood pressure monitoring",
    patientHistory: ["Previous visit: 2023-12-15", "Hypertension management"],
  },
  {
    id: "2",
    patientName: "Emily Davis",
    patientPhone: "(555) 987-6543",
    patientEmail: "emily.davis@email.com",
    doctor: "Dr. Michael Chen",
    date: "2024-01-20",
    time: "10:30",
    duration: 45,
    type: "Follow-up",
    status: "pending",
    notes: "Neurological assessment follow-up",
    patientHistory: ["Previous visit: 2024-01-05", "Migraine treatment"],
  },
  {
    id: "3",
    patientName: "Robert Wilson",
    patientPhone: "(555) 456-7890",
    patientEmail: "robert.wilson@email.com",
    doctor: "Dr. Emily Rodriguez",
    date: "2024-01-20",
    time: "14:00",
    duration: 30,
    type: "Procedure",
    status: "confirmed",
    notes: "Pediatric vaccination - MMR booster",
    patientHistory: ["Previous visit: 2023-11-20", "Annual checkup"],
  },
  {
    id: "4",
    patientName: "Sarah Brown",
    patientPhone: "(555) 321-0987",
    patientEmail: "sarah.brown@email.com",
    doctor: "Dr. Sarah Johnson",
    date: "2024-01-21",
    time: "11:00",
    duration: 30,
    type: "Consultation",
    status: "cancelled",
    notes: "Cancelled due to patient illness",
    patientHistory: ["Previous visit: 2023-10-15", "Cardiac screening"],
  },
  {
    id: "5",
    patientName: "Michael Johnson",
    patientPhone: "(555) 555-1234",
    patientEmail: "michael.j@email.com",
    doctor: "Dr. Emily Rodriguez",
    date: "2024-01-22",
    time: "15:30",
    duration: 30,
    type: "Consultation",
    status: "confirmed",
    notes: "Annual pediatric checkup",
    patientHistory: ["Previous visit: 2023-01-20", "Growth assessment"],
  },
]

const doctors = ["Dr. Sarah Johnson", "Dr. Michael Chen", "Dr. Emily Rodriguez"]

const appointmentTypes = ["Consultation", "Follow-up", "Procedure", "Emergency", "Screening"]

const timeSlots = [
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
]



function getStatusColor(status: string) {
  switch (status) {
    case "confirmed":
      return "bg-main-100 text-main-800 dark:bg-main-900 dark:text-main-300"
    case "pending":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
    case "cancelled":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
    case "completed":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
    default:
      return "bg-main-100 text-main-800 dark:bg-main-900 dark:text-main-300"
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case "confirmed":
      return <CheckCircle className="h-4 w-4" />
    case "pending":
      return <AlertCircle className="h-4 w-4" />
    case "cancelled":
      return <XCircle className="h-4 w-4" />
    case "completed":
      return <CheckCircle className="h-4 w-4" />
    default:
      return <Clock className="h-4 w-4" />
  }
}

export default function AppointmentsPage() {
  const [currentDate, setCurrentDate] = React.useState(new Date())
  const [selectedView, setSelectedView] = React.useState("week")
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedDoctor, setSelectedDoctor] = React.useState("all")
  const [selectedStatus, setSelectedStatus] = React.useState("all")
  const [appointments, setAppointments] = React.useState(mockAppointments)
  const [isBookingDialogOpen, setIsBookingDialogOpen] = React.useState(false)
  const [selectedAppointment, setSelectedAppointment] = React.useState<any>(null)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = React.useState(false)

  // New appointment form state
  const [newAppointment, setNewAppointment] = React.useState({
    patientName: "",
    patientPhone: "",
    patientEmail: "",
    doctor: "",
    date: "",
    time: "",
    type: "",
    notes: "",
  })

  const filteredAppointments = appointments.filter((appointment) => {
    const matchesSearch =
      appointment.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appointment.doctor.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesDoctor = selectedDoctor === "all" || appointment.doctor === selectedDoctor
    const matchesStatus = selectedStatus === "all" || appointment.status === selectedStatus

    return matchesSearch && matchesDoctor && matchesStatus
  })

  const handleBookAppointment = () => {
    const appointment = {
      id: Date.now().toString(),
      ...newAppointment,
      duration: 30,
      status: "pending",
      patientHistory: [],
    }

    setAppointments([...appointments, appointment])
    setNewAppointment({
      patientName: "",
      patientPhone: "",
      patientEmail: "",
      doctor: "",
      date: "",
      time: "",
      type: "",
      notes: "",
    })
    setIsBookingDialogOpen(false)
  }

  const handleStatusChange = (appointmentId: string, newStatus: string) => {
    setAppointments(appointments.map((apt) => (apt.id === appointmentId ? { ...apt, status: newStatus } : apt)))
  }

  const handleDeleteAppointment = (appointmentId: string) => {
    setAppointments(appointments.filter((apt) => apt.id !== appointmentId))
  }

  const navigateDate = (direction: "prev" | "next") => {
    if (selectedView === "day") {
      setCurrentDate(direction === "next" ? addDays(currentDate, 1) : subDays(currentDate, 1))
    } else if (selectedView === "week") {
      setCurrentDate(direction === "next" ? addDays(currentDate, 7) : subDays(currentDate, -7))
    } else if (selectedView === "month") {
      setCurrentDate(direction === "next" ? addMonths(currentDate, 1) : subMonths(currentDate, 1))
    }
  }

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

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader searchQuery={searchQuery} onSearchChange={setSearchQuery} />
        
        {/* Appointment Management Title */}
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-primary dark:text-main-400 mb-2">
            Appointment Management
          </h1>
        </div>

        <div className="min-h-screen bg-background">
          <div className="container mx-auto px-4 py-6">
            {/* Filters and Search */}
            <Card className="mb-6 border-main-200 dark:border-main-800">
              <CardContent className="p-4 lg:p-6">
                <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-4">
                  <div className="flex-1 min-w-full sm:min-w-64">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Search patients or doctors..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 border-main-200 dark:border-main-800"
                      />
                    </div>
                  </div>

                  <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
                    <SelectTrigger className="w-full sm:w-48 border-main-200 dark:border-main-800">
                      <SelectValue placeholder="Filter by doctor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Doctors</SelectItem>
                      {doctors.map((doctor) => (
                        <SelectItem key={doctor} value={doctor}>
                          {doctor}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="w-full sm:w-48 border-main-200 dark:border-main-800">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button
                    onClick={() => setIsBookingDialogOpen(true)}
                    className="bg-primary hover:bg-main-800 text-white text-sm lg:text-base"
                  >
                    <Plus className="h-4 w-4 mr-1 lg:mr-2" />
                    <span className="hidden sm:inline">Book Appointment</span>
                    <span className="sm:hidden">Book</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Calendar Views */}
            <Tabs value={selectedView} onValueChange={setSelectedView} className="space-y-6">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                <TabsList className="grid w-full sm:w-fit grid-cols-2 sm:grid-cols-4">
                  <TabsTrigger value="day" className="text-xs sm:text-sm">
                    Day
                  </TabsTrigger>
                  <TabsTrigger value="week" className="text-xs sm:text-sm">
                    Week
                  </TabsTrigger>
                  <TabsTrigger value="month" className="text-xs sm:text-sm">
                    Month
                  </TabsTrigger>
                  <TabsTrigger value="list" className="text-xs sm:text-sm">
                    List
                  </TabsTrigger>
                </TabsList>

                <div className="flex items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => navigateDate("prev")}
                    className="border-primary text-primary hover:bg-main-50 dark:border-main-400 dark:text-main-400 h-8 w-8 sm:h-10 sm:w-10"
                  >
                    <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                  <div className="text-sm sm:text-lg font-semibold text-primary dark:text-main-400 min-w-32 sm:min-w-48 text-center">
                    {selectedView === "day" && format(currentDate, "MMM d, yyyy")}
                    {selectedView === "week" &&
                      `${format(startOfWeek(currentDate), "MMM d")} - ${format(endOfWeek(currentDate), "MMM d")}`}
                    {selectedView === "month" && format(currentDate, "MMMM yyyy")}
                    {selectedView === "list" && "All Appointments"}
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => navigateDate("next")}
                    className="border-primary text-primary hover:bg-main-50 dark:border-main-400 dark:text-main-400 h-8 w-8 sm:h-10 sm:w-10"
                  >
                    <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                </div>
              </div>

              {/* Day View */}
              <TabsContent value="day" className="space-y-4">
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
                            className="flex items-center gap-4 p-2 border-b border-gray-100 dark:border-gray-800"
                          >
                            <div className="w-16 text-sm font-medium text-muted-foreground">{time}</div>
                            <div className="flex-1">
                              {appointmentsAtTime.length > 0 ? (
                                appointmentsAtTime.map((appointment) => (
                                  <div
                                    key={appointment.id}
                                    className="flex items-center justify-between p-3 bg-main-50 dark:bg-main-950/20 rounded-lg cursor-pointer hover:bg-main-100 dark:hover:bg-main-950/40"
                                    onClick={() => {
                                      setSelectedAppointment(appointment)
                                      setIsDetailsDialogOpen(true)
                                    }}
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
              </TabsContent>

              {/* Week View */}
              <TabsContent value="week" className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 lg:gap-4">
                  {getWeekDays().map((day) => {
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
                                onClick={() => {
                                  setSelectedAppointment(appointment)
                                  setIsDetailsDialogOpen(true)
                                }}
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
              </TabsContent>

              {/* Month View */}
              <TabsContent value="month" className="space-y-4">
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
                      {getMonthWeeks().map((weekStart, weekIndex) => (
                        <div key={weekIndex} className="grid grid-cols-7 gap-1 lg:gap-2">
                          {getWeekDaysForMonth(weekStart).map((day) => {
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
                                      onClick={() => {
                                        setSelectedAppointment(appointment)
                                        setIsDetailsDialogOpen(true)
                                      }}
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
              </TabsContent>

              {/* List View */}
              <TabsContent value="list" className="space-y-4">
                <Card className="border-main-200 dark:border-main-800">
                  <CardHeader>
                    <CardTitle className="text-primary dark:text-main-400">All Appointments</CardTitle>
                    <CardDescription>Showing {filteredAppointments.length} appointments</CardDescription>
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
                          {filteredAppointments.map((appointment) => (
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
                                    onClick={() => {
                                      setSelectedAppointment(appointment)
                                      setIsDetailsDialogOpen(true)
                                    }}
                                  >
                                    <Eye className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => {
                                      setNewAppointment({
                                        patientName: appointment.patientName,
                                        patientPhone: appointment.patientPhone,
                                        patientEmail: appointment.patientEmail,
                                        doctor: appointment.doctor,
                                        date: appointment.date,
                                        time: appointment.time,
                                        type: appointment.type,
                                        notes: appointment.notes,
                                      })
                                      setIsBookingDialogOpen(true)
                                    }}
                                  >
                                    <Edit className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => handleDeleteAppointment(appointment.id)}
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
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Book Appointment Dialog */}
        <Dialog open={isBookingDialogOpen} onOpenChange={setIsBookingDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-primary dark:text-main-400">
                {newAppointment.patientName ? "Edit Appointment" : "Book New Appointment"}
              </DialogTitle>
              <DialogDescription>Fill in the patient and appointment details below.</DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="patientName">Patient Name *</Label>
                <Input
                  id="patientName"
                  value={newAppointment.patientName}
                  onChange={(e) => setNewAppointment({ ...newAppointment, patientName: e.target.value })}
                  placeholder="Enter patient name"
                  className="border-main-200 dark:border-main-800"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="patientPhone">Phone Number</Label>
                <Input
                  id="patientPhone"
                  value={newAppointment.patientPhone}
                  onChange={(e) => setNewAppointment({ ...newAppointment, patientPhone: e.target.value })}
                  placeholder="(555) 123-4567"
                  className="border-main-200 dark:border-main-800"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="patientEmail">Email Address</Label>
                <Input
                  id="patientEmail"
                  type="email"
                  value={newAppointment.patientEmail}
                  onChange={(e) => setNewAppointment({ ...newAppointment, patientEmail: e.target.value })}
                  placeholder="patient@email.com"
                  className="border-main-200 dark:border-main-800"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="doctor">Doctor *</Label>
                <Select
                  value={newAppointment.doctor}
                  onValueChange={(value) => setNewAppointment({ ...newAppointment, doctor: value })}
                >
                  <SelectTrigger className="border-main-200 dark:border-main-800">
                    <SelectValue placeholder="Select doctor" />
                  </SelectTrigger>
                  <SelectContent>
                    {doctors.map((doctor) => (
                      <SelectItem key={doctor} value={doctor}>
                        {doctor}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={newAppointment.date}
                  onChange={(e) => setNewAppointment({ ...newAppointment, date: e.target.value })}
                  className="border-main-200 dark:border-main-800"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="time">Time *</Label>
                <Select
                  value={newAppointment.time}
                  onValueChange={(value) => setNewAppointment({ ...newAppointment, time: value })}
                >
                  <SelectTrigger className="border-main-200 dark:border-main-800">
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 col-span-2">
                <Label htmlFor="type">Appointment Type *</Label>
                <Select
                  value={newAppointment.type}
                  onValueChange={(value) => setNewAppointment({ ...newAppointment, type: value })}
                >
                  <SelectTrigger className="border-main-200 dark:border-main-800">
                    <SelectValue placeholder="Select appointment type" />
                  </SelectTrigger>
                  <SelectContent>
                    {appointmentTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 col-span-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={newAppointment.notes}
                  onChange={(e) => setNewAppointment({ ...newAppointment, notes: e.target.value })}
                  placeholder="Reason for visit, special instructions..."
                  className="border-main-200 dark:border-main-800"
                  rows={3}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsBookingDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleBookAppointment}
                className="bg-primary hover:bg-main-800 text-white"
                disabled={
                  !newAppointment.patientName ||
                  !newAppointment.doctor ||
                  !newAppointment.date ||
                  !newAppointment.time ||
                  !newAppointment.type
                }
              >
                {newAppointment.patientName &&
                appointments.find((apt) => apt.patientName === newAppointment.patientName)
                  ? "Update Appointment"
                  : "Book Appointment"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Appointment Details Dialog */}
        <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
          <DialogContent className="max-w-2xl">
            {selectedAppointment && (
              <>
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
                        <span>{selectedAppointment.patientName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedAppointment.patientPhone}</span>
                      </div>
                      <div className="flex items-center gap-2 col-span-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedAppointment.patientEmail}</span>
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
                        <p>{selectedAppointment.doctor}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Type</Label>
                        <p>{selectedAppointment.type}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Date</Label>
                        <p>{format(parseISO(selectedAppointment.date), "EEEE, MMMM d, yyyy")}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Time</Label>
                        <p>
                          {selectedAppointment.time} ({selectedAppointment.duration} minutes)
                        </p>
                      </div>
                      <div className="col-span-2">
                        <Label className="text-sm font-medium">Status</Label>
                        <div className="mt-1">
                          <Badge className={getStatusColor(selectedAppointment.status)}>
                            {getStatusIcon(selectedAppointment.status)}
                            <span className="ml-1 capitalize">{selectedAppointment.status}</span>
                          </Badge>
                        </div>
                      </div>
                      {selectedAppointment.notes && (
                        <div className="col-span-2">
                          <Label className="text-sm font-medium">Notes</Label>
                          <p className="text-sm text-muted-foreground mt-1">{selectedAppointment.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <Separator />

                  {/* Patient History */}
                  <div>
                    <h3 className="text-lg font-semibold text-primary dark:text-main-400 mb-3">Patient History</h3>
                    {selectedAppointment.patientHistory.length > 0 ? (
                      <ul className="space-y-1">
                        {selectedAppointment.patientHistory.map((item: string, index: number) => (
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
                      onClick={() => {
                        setNewAppointment({
                          patientName: selectedAppointment.patientName,
                          patientPhone: selectedAppointment.patientPhone,
                          patientEmail: selectedAppointment.patientEmail,
                          doctor: selectedAppointment.doctor,
                          date: selectedAppointment.date,
                          time: selectedAppointment.time,
                          type: selectedAppointment.type,
                          notes: selectedAppointment.notes,
                        })
                        setIsDetailsDialogOpen(false)
                        setIsBookingDialogOpen(true)
                      }}
                      className="border-primary text-primary hover:bg-main-50 dark:border-main-400 dark:text-main-400 bg-transparent"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    {selectedAppointment.status === "confirmed" && (
                      <Button
                        onClick={() =>
                          window.open(
                            `/consultation?patient=${encodeURIComponent(selectedAppointment.patientName)}&appointmentId=${selectedAppointment.id}`,
                            "_blank",
                          )
                        }
                        className="bg-primary hover:bg-main-800 text-white"
                      >
                        <Stethoscope className="h-4 w-4 mr-2" />
                        Attend Patient
                      </Button>
                    )}
                    {selectedAppointment.status === "pending" && (
                      <Button
                        onClick={() => handleStatusChange(selectedAppointment.id, "confirmed")}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Confirm
                      </Button>
                    )}
                    {selectedAppointment.status === "confirmed" && (
                      <Button
                        onClick={() => handleStatusChange(selectedAppointment.id, "completed")}
                                                  className="bg-main-600 hover:bg-main-700 text-white"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Mark Complete
                      </Button>
                    )}
                    <Button
                      variant="destructive"
                      onClick={() => handleStatusChange(selectedAppointment.id, "cancelled")}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                  <Button variant="outline" onClick={() => setIsDetailsDialogOpen(false)}>
                    Close
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
      </SidebarInset>
    </SidebarProvider>
  )
}
