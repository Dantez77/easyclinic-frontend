"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Search, User, Phone, Mail } from "lucide-react"
import { type AppointmentFormData, type Patient, APPOINTMENT_TYPES, TIME_SLOTS } from "../types"

interface AppointmentBookingDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  formData: AppointmentFormData
  onFormDataChange: (data: AppointmentFormData) => void
  doctors: string[]
  timeSlots: string[]
  appointmentTypes: string[]
  onSave: () => void
  isEditing: boolean
  patients: Patient[]
}

export function AppointmentBookingDialog({
  isOpen,
  onOpenChange,
  formData,
  onFormDataChange,
  doctors,
  timeSlots,
  appointmentTypes,
  onSave,
  isEditing,
  patients,
}: AppointmentBookingDialogProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Patient[]>([])
  const [showSearchResults, setShowSearchResults] = useState(false)

  const isFormValid = 
    formData.patientId &&
    formData.doctor &&
    formData.date &&
    formData.time &&
    formData.type

  const handlePatientSearch = (query: string) => {
    setSearchQuery(query)
    if (query.length >= 2) {
      const results = patients.filter(patient => 
        patient.firstName.toLowerCase().includes(query.toLowerCase()) ||
        patient.lastName.toLowerCase().includes(query.toLowerCase()) ||
        patient.dui.includes(query) ||
        patient.patientId.toLowerCase().includes(query.toLowerCase())
      )
      setSearchResults(results)
      setShowSearchResults(true)
    } else {
      setSearchResults([])
      setShowSearchResults(false)
    }
  }

  const selectPatient = (patient: Patient) => {
    onFormDataChange({
      ...formData,
      patientId: patient.id,
      patientName: `${patient.firstName} ${patient.lastName}`,
      patientPhone: patient.phone,
      patientEmail: patient.email,
    })
    setSearchQuery(`${patient.firstName} ${patient.lastName}`)
    setShowSearchResults(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-primary dark:text-main-400">
            {isEditing ? "Edit Appointment" : "Book New Appointment"}
          </DialogTitle>
          <DialogDescription>Fill in the patient and appointment details below.</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4">
          {/* Patient Search */}
          <div className="space-y-2 col-span-2">
            <Label htmlFor="patientSearch">Search Patient *</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="patientSearch"
                value={searchQuery}
                onChange={(e) => handlePatientSearch(e.target.value)}
                placeholder="Search by name, cédula, or patient ID..."
                className="pl-10 border-main-200 dark:border-main-800"
              />
              {showSearchResults && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-background border border-main-200 dark:border-main-800 rounded-md shadow-lg z-50 max-h-48 overflow-y-auto">
                  {searchResults.map((patient) => (
                    <div
                      key={patient.id}
                      className="p-3 hover:bg-main-50 dark:hover:bg-main-950 cursor-pointer border-b border-main-100 dark:border-main-800 last:border-b-0"
                      onClick={() => selectPatient(patient)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{patient.firstName} {patient.lastName}</div>
                          <div className="text-sm text-muted-foreground flex items-center gap-4">
                            <span className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {patient.phone}
                            </span>
                            <span className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {patient.email}
                            </span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            ID: {patient.patientId} | DUI: {patient.dui}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="patientName">Patient Name</Label>
            <Input
              id="patientName"
              value={formData.patientName}
              disabled
              className="border-main-200 dark:border-main-800 bg-muted"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="patientPhone">Phone Number</Label>
            <Input
              id="patientPhone"
              value={formData.patientPhone}
              disabled
              className="border-main-200 dark:border-main-800 bg-muted"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="patientEmail">Email Address</Label>
            <Input
              id="patientEmail"
              value={formData.patientEmail}
              disabled
              className="border-main-200 dark:border-main-800 bg-muted"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="doctor">Doctor *</Label>
            <Select
              value={formData.doctor}
              onValueChange={(value) => onFormDataChange({ ...formData, doctor: value })}
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
              value={formData.date}
              onChange={(e) => onFormDataChange({ ...formData, date: e.target.value })}
              className="border-main-200 dark:border-main-800"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="time">Time *</Label>
            <Select
              value={formData.time}
              onValueChange={(value) => onFormDataChange({ ...formData, time: value })}
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
              value={formData.type}
              onValueChange={(value) => onFormDataChange({ ...formData, type: value })}
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
              value={formData.notes}
              onChange={(e) => onFormDataChange({ ...formData, notes: e.target.value })}
              placeholder="Reason for visit, special instructions..."
              className="border-main-200 dark:border-main-800"
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={onSave}
            className="bg-primary hover:bg-main-800 text-white"
            disabled={!isFormValid}
          >
            {isEditing ? "Update Appointment" : "Book Appointment"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
