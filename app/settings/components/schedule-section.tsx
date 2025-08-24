"use client"

import { Plus, Trash2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useLanguage } from "@/lib/language-context"

export function ScheduleSection() {
  const { t } = useLanguage()
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground">{t("settings.schedule.title")}</h2>
        <p className="text-muted-foreground">{t("settings.schedule.subtitle")}</p>
      </div>

      <Card className="border-main-200 dark:border-main-800">
        <CardHeader>
          <CardTitle>{t("settings.schedule.hours.title")}</CardTitle>
          <CardDescription>{t("settings.schedule.hours.description")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"].map((day) => (
            <div key={day} className="flex items-center gap-4">
              <div className="w-20">
                <Label>{t(`settings.schedule.hours.days.${day}`)}</Label>
              </div>
              <Switch defaultChecked={day !== "sunday"} />
              <div className="flex items-center gap-2">
                <Input type="time" defaultValue="08:00" className="w-32" />
                <span className="text-muted-foreground">{t("settings.schedule.hours.to")}</span>
                <Input type="time" defaultValue="17:00" className="w-32" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-main-200 dark:border-main-800">
        <CardHeader>
          <CardTitle>{t("settings.schedule.appointments.title")}</CardTitle>
          <CardDescription>{t("settings.schedule.appointments.description")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="appointment-duration">{t("settings.schedule.appointments.duration")}</Label>
              <select className="w-full p-2 border rounded-md border-main-200 dark:border-main-800">
                <option value="15">{t("settings.schedule.appointments.duration.15min")}</option>
                <option value="30">{t("settings.schedule.appointments.duration.30min")}</option>
                <option value="45">{t("settings.schedule.appointments.duration.45min")}</option>
                <option value="60">{t("settings.schedule.appointments.duration.1hour")}</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="buffer-time">{t("settings.schedule.appointments.bufferTime")}</Label>
              <select className="w-full p-2 border rounded-md border-main-200 dark:border-main-800">
                <option value="0">{t("settings.schedule.appointments.buffer.noBuffer")}</option>
                <option value="5">{t("settings.schedule.appointments.buffer.5min")}</option>
                <option value="10">{t("settings.schedule.appointments.buffer.10min")}</option>
                <option value="15">{t("settings.schedule.appointments.buffer.15min")}</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>{t("settings.schedule.appointments.holidays")}</Label>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 border rounded-lg border-main-200 dark:border-main-800">
                <span>{t("settings.schedule.appointments.holidays.newYear")}</span>
                <Button variant="ghost" size="sm">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg border-main-200 dark:border-main-800">
                <span>{t("settings.schedule.appointments.holidays.independence")}</span>
                <Button variant="ghost" size="sm">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                {t("settings.schedule.appointments.holidays.addHoliday")}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
