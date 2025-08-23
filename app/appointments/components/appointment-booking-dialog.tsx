"use client"

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
import { Appointment } from "../mocks/appointments-data"

interface AppointmentFormData {
  patientName: string
  patientPhone: string
  patientEmail: string
  doctor: string
  date: string
  time: string
  type: string
  notes: string
}

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
}: AppointmentBookingDialogProps) {
  const isFormValid = 
    formData.patientName &&
    formData.doctor &&
    formData.date &&
    formData.time &&
    formData.type

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
          <div className="space-y-2">
            <Label htmlFor="patientName">Patient Name *</Label>
            <Input
              id="patientName"
              value={formData.patientName}
              onChange={(e) => onFormDataChange({ ...formData, patientName: e.target.value })}
              placeholder="Enter patient name"
              className="border-main-200 dark:border-main-800"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="patientPhone">Phone Number</Label>
            <Input
              id="patientPhone"
              value={formData.patientPhone}
              onChange={(e) => onFormDataChange({ ...formData, patientPhone: e.target.value })}
              placeholder="(555) 123-4567"
              className="border-main-200 dark:border-main-800"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="patientEmail">Email Address</Label>
            <Input
              id="patientEmail"
              type="email"
              value={formData.patientEmail}
              onChange={(e) => onFormDataChange({ ...formData, patientEmail: e.target.value })}
              placeholder="patient@email.com"
              className="border-main-200 dark:border-main-800"
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
