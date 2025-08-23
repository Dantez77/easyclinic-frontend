"use client"

import * as React from "react"
import { Tabs, TabsContent } from "@/components/ui/tabs"

// Import mock data
import { 
  mockAppointments, 
  doctors, 
  appointmentTypes, 
  timeSlots,
  type Appointment 
} from "./mocks/appointments-data"

// Import custom hook
import { useAppointments } from "./hooks/use-appointments"

// Import components
import { AppointmentFilters } from "./components/appointment-filters"
import { CalendarNavigation } from "./components/calendar-navigation"
import { DayView } from "./components/day-view"
import { WeekView } from "./components/week-view"
import { MonthView } from "./components/month-view"
import { ListView } from "./components/list-view"
import { AppointmentBookingDialog } from "./components/appointment-booking-dialog"
import { AppointmentDetailsDialog } from "./components/appointment-details-dialog"

export default function AppointmentsPage() {
  // Use custom hook for appointments management
  const {
    currentDate,
    selectedView,
    setSelectedView,
    searchQuery,
    setSearchQuery,
    selectedDoctor,
    setSelectedDoctor,
    selectedStatus,
    setSelectedStatus,
    filteredAppointments,
    navigateDate,
    getWeekDays,
    getMonthWeeks,
    getWeekDaysForMonth,
    addAppointment,
    updateAppointment,
    deleteAppointment,
    handleStatusChange,
  } = useAppointments(mockAppointments)

  // Dialog states
  const [isBookingDialogOpen, setIsBookingDialogOpen] = React.useState(false)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = React.useState(false)
  const [selectedAppointment, setSelectedAppointment] = React.useState<Appointment | null>(null)
  const [editingAppointment, setEditingAppointment] = React.useState<Appointment | null>(null)

  // Form state
  const [formData, setFormData] = React.useState({
    patientName: "",
    patientPhone: "",
    patientEmail: "",
    doctor: "",
    date: "",
    time: "",
    type: "",
    notes: "",
  })

  const handleBookAppointment = () => {
    addAppointment({
      ...formData,
      duration: 30,
      status: "pending",
      patientHistory: [],
    })
    setFormData({
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

  const handleEditAppointment = (appointment: Appointment) => {
    setFormData({
      patientName: appointment.patientName,
      patientPhone: appointment.patientPhone,
      patientEmail: appointment.patientEmail,
      doctor: appointment.doctor,
      date: appointment.date,
      time: appointment.time,
      type: appointment.type,
      notes: appointment.notes,
    })
    setEditingAppointment(appointment)
    setIsDetailsDialogOpen(false)
    setIsBookingDialogOpen(true)
  }

  const handleUpdateAppointment = () => {
    if (editingAppointment) {
      updateAppointment(editingAppointment.id, formData)
      setEditingAppointment(null)
    } else {
      addAppointment({
        ...formData,
        duration: 30,
        status: "pending",
        patientHistory: [],
      })
    }
    setFormData({
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

  const handleAppointmentClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment)
    setIsDetailsDialogOpen(true)
  }

  const isEditing = editingAppointment !== null

  return (
    <>
      {/* Appointment Management Title */}
      <div className="container mx-auto px-4 py-4">
        <h1 className="text-2xl font-bold text-primary dark:text-main-400 mb-2">
          Appointment Management
        </h1>
      </div>

      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6">
          {/* Filters and Search */}
          <AppointmentFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedDoctor={selectedDoctor}
            onDoctorChange={setSelectedDoctor}
            selectedStatus={selectedStatus}
            onStatusChange={setSelectedStatus}
            doctors={doctors}
            onBookAppointment={() => setIsBookingDialogOpen(true)}
          />

          {/* Calendar Views */}
          <Tabs value={selectedView} onValueChange={setSelectedView} className="space-y-6">
            <CalendarNavigation
              selectedView={selectedView}
              onViewChange={setSelectedView}
              currentDate={currentDate}
              onNavigate={navigateDate}
            />

            {/* Day View */}
            <TabsContent value="day" className="space-y-4">
              <DayView
                currentDate={currentDate}
                timeSlots={timeSlots}
                appointments={filteredAppointments}
                onAppointmentClick={handleAppointmentClick}
              />
            </TabsContent>

            {/* Week View */}
            <TabsContent value="week" className="space-y-4">
              <WeekView
                weekDays={getWeekDays()}
                appointments={filteredAppointments}
                onAppointmentClick={handleAppointmentClick}
              />
            </TabsContent>

            {/* Month View */}
            <TabsContent value="month" className="space-y-4">
              <MonthView
                currentDate={currentDate}
                monthWeeks={getMonthWeeks().map(week => getWeekDaysForMonth(week))}
                appointments={filteredAppointments}
                onAppointmentClick={handleAppointmentClick}
              />
            </TabsContent>

            {/* List View */}
            <TabsContent value="list" className="space-y-4">
              <ListView
                appointments={filteredAppointments}
                onViewAppointment={handleAppointmentClick}
                onEditAppointment={handleEditAppointment}
                onDeleteAppointment={deleteAppointment}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Appointment Booking Dialog */}
      <AppointmentBookingDialog
        isOpen={isBookingDialogOpen}
        onOpenChange={setIsBookingDialogOpen}
        formData={formData}
        onFormDataChange={setFormData}
        doctors={doctors}
        timeSlots={timeSlots}
        appointmentTypes={appointmentTypes}
        onSave={isEditing ? handleUpdateAppointment : handleBookAppointment}
        isEditing={isEditing}
      />

      {/* Appointment Details Dialog */}
      <AppointmentDetailsDialog
        isOpen={isDetailsDialogOpen}
        onOpenChange={setIsDetailsDialogOpen}
        appointment={selectedAppointment}
        onEdit={handleEditAppointment}
        onStatusChange={handleStatusChange}
      />
    </>
  )
}
