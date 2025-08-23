"use client"

import { Search, Plus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface AppointmentFiltersProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  selectedDoctor: string
  onDoctorChange: (value: string) => void
  selectedStatus: string
  onStatusChange: (value: string) => void
  doctors: string[]
  onBookAppointment: () => void
}

export function AppointmentFilters({
  searchQuery,
  onSearchChange,
  selectedDoctor,
  onDoctorChange,
  selectedStatus,
  onStatusChange,
  doctors,
  onBookAppointment,
}: AppointmentFiltersProps) {
  return (
    <Card className="mb-6 border-main-200 dark:border-main-800">
      <CardContent className="p-4 lg:p-6">
        <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-4">
          <div className="flex-1 min-w-full sm:min-w-64">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search patients or doctors..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 border-main-200 dark:border-main-800"
              />
            </div>
          </div>

          <Select value={selectedDoctor} onValueChange={onDoctorChange}>
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

          <Select value={selectedStatus} onValueChange={onStatusChange}>
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
            onClick={onBookAppointment}
            className="bg-primary hover:bg-main-800 text-white text-sm lg:text-base"
          >
            <Plus className="h-4 w-4 mr-1 lg:mr-2" />
            <span className="hidden sm:inline">Book Appointment</span>
            <span className="sm:hidden">Book</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
