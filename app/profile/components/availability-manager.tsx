"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Clock, Calendar, Plus, Trash2, Save, X, AlertCircle } from "lucide-react"

interface TimeSlot {
  start: string
  end: string
  isBreak?: boolean
}

interface DaySchedule {
  isWorking: boolean
  slots: TimeSlot[]
}

interface WeeklySchedule {
  [key: string]: DaySchedule
}

export default function AvailabilityManager({ onClose }: { onClose: () => void }) {
  const [schedule, setSchedule] = useState<WeeklySchedule>({
    monday: {
      isWorking: true,
      slots: [
        { start: "09:00", end: "12:00" },
        { start: "13:00", end: "17:00" },
      ],
    },
    tuesday: {
      isWorking: true,
      slots: [
        { start: "09:00", end: "12:00" },
        { start: "13:00", end: "17:00" },
      ],
    },
    wednesday: {
      isWorking: true,
      slots: [
        { start: "09:00", end: "12:00" },
        { start: "13:00", end: "17:00" },
      ],
    },
    thursday: {
      isWorking: true,
      slots: [
        { start: "09:00", end: "12:00" },
        { start: "13:00", end: "17:00" },
      ],
    },
    friday: {
      isWorking: true,
      slots: [
        { start: "09:00", end: "12:00" },
        { start: "13:00", end: "17:00" },
      ],
    },
    saturday: {
      isWorking: false,
      slots: [],
    },
    sunday: {
      isWorking: false,
      slots: [],
    },
  })

  const [timeOffDates, setTimeOffDates] = useState<string[]>(["2024-12-25", "2024-01-01"])

  const [newTimeOffDate, setNewTimeOffDate] = useState("")

  const daysOfWeek = [
    { key: "monday", label: "Monday" },
    { key: "tuesday", label: "Tuesday" },
    { key: "wednesday", label: "Wednesday" },
    { key: "thursday", label: "Thursday" },
    { key: "friday", label: "Friday" },
    { key: "saturday", label: "Saturday" },
    { key: "sunday", label: "Sunday" },
  ]

  const toggleDayWorking = (day: string) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        isWorking: !prev[day].isWorking,
        slots: !prev[day].isWorking ? [{ start: "09:00", end: "17:00" }] : [],
      },
    }))
  }

  const addTimeSlot = (day: string) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        slots: [...prev[day].slots, { start: "09:00", end: "17:00" }],
      },
    }))
  }

  const removeTimeSlot = (day: string, index: number) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        slots: prev[day].slots.filter((_, i) => i !== index),
      },
    }))
  }

  const updateTimeSlot = (day: string, index: number, field: "start" | "end", value: string) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        slots: prev[day].slots.map((slot, i) => (i === index ? { ...slot, [field]: value } : slot)),
      },
    }))
  }

  const addTimeOff = () => {
    if (newTimeOffDate && !timeOffDates.includes(newTimeOffDate)) {
      setTimeOffDates((prev) => [...prev, newTimeOffDate].sort())
      setNewTimeOffDate("")
    }
  }

  const removeTimeOff = (date: string) => {
    setTimeOffDates((prev) => prev.filter((d) => d !== date))
  }

  const handleSave = () => {
    // Here you would save to database
    alert("Availability updated successfully!")
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-background rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        <div className="p-6 border-b border-border flex-shrink-0">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Manage Availability</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-8">
            {/* Weekly Schedule */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  Weekly Schedule
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {daysOfWeek.map(({ key, label }) => (
                  <div key={key} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          id={`working-${key}`}
                          checked={schedule[key].isWorking}
                          onChange={() => toggleDayWorking(key)}
                          className="w-4 h-4"
                        />
                        <Label htmlFor={`working-${key}`} className="font-semibold">
                          {label}
                        </Label>
                        {!schedule[key].isWorking && (
                          <Badge variant="secondary" className="text-xs">
                            Day Off
                          </Badge>
                        )}
                      </div>
                      {schedule[key].isWorking && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => addTimeSlot(key)}
                          className="flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" />
                          Add Time Slot
                        </Button>
                      )}
                    </div>

                    {schedule[key].isWorking && (
                      <div className="ml-7 space-y-2">
                        {schedule[key].slots.map((slot, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <Clock className="w-4 h-4 text-muted-foreground" />
                            <Input
                              type="time"
                              value={slot.start}
                              onChange={(e) => updateTimeSlot(key, index, "start", e.target.value)}
                              className="w-32"
                            />
                            <span className="text-muted-foreground">to</span>
                            <Input
                              type="time"
                              value={slot.end}
                              onChange={(e) => updateTimeSlot(key, index, "end", e.target.value)}
                              className="w-32"
                            />
                            {schedule[key].slots.length > 1 && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeTimeSlot(key, index)}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Time Off Management */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-primary" />
                  Time Off & Holidays
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-3">
                  <Input
                    type="date"
                    value={newTimeOffDate}
                    onChange={(e) => setNewTimeOffDate(e.target.value)}
                    className="flex-1"
                    min={new Date().toISOString().split("T")[0]}
                  />
                  <Button onClick={addTimeOff} disabled={!newTimeOffDate}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Date
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label>Scheduled Time Off:</Label>
                  <div className="flex flex-wrap gap-2">
                    {timeOffDates.map((date) => (
                      <Badge key={date} variant="secondary" className="flex items-center gap-2">
                        {new Date(date).toLocaleDateString()}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeTimeOff(date)}
                          className="h-auto p-0 text-destructive hover:text-destructive"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </Badge>
                    ))}
                    {timeOffDates.length === 0 && (
                      <span className="text-sm text-muted-foreground">No time off scheduled</span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      const newSchedule = { ...schedule }
                      Object.keys(newSchedule).forEach((day) => {
                        if (day !== "saturday" && day !== "sunday") {
                          newSchedule[day] = {
                            isWorking: true,
                            slots: [{ start: "09:00", end: "17:00" }],
                          }
                        }
                      })
                      setSchedule(newSchedule)
                    }}
                  >
                    Standard Hours (9-5)
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      const newSchedule = { ...schedule }
                      Object.keys(newSchedule).forEach((day) => {
                        if (day !== "saturday" && day !== "sunday") {
                          newSchedule[day] = {
                            isWorking: true,
                            slots: [
                              { start: "08:00", end: "12:00" },
                              { start: "13:00", end: "18:00" },
                            ],
                          }
                        }
                      })
                      setSchedule(newSchedule)
                    }}
                  >
                    Extended Hours (8-6)
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      const newSchedule = { ...schedule }
                      Object.keys(newSchedule).forEach((day) => {
                        newSchedule[day] = { isWorking: false, slots: [] }
                      })
                      setSchedule(newSchedule)
                    }}
                  >
                    Clear All
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="p-6 border-t border-border flex justify-end gap-3 flex-shrink-0">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="flex items-center gap-2">
            <Save className="w-4 h-4" />
            Save Availability
          </Button>
        </div>
      </div>
    </div>
  )
}
