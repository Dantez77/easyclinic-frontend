"use client"

import { Building2, Plus, Upload } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/lib/language-context"

export function ClinicProfileSection() {
  const { t } = useLanguage()
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground">{t("settings.clinic.title")}</h2>
        <p className="text-muted-foreground">{t("settings.clinic.subtitle")}</p>
      </div>

      <Card className="border-main-200 dark:border-main-800">
        <CardHeader>
          <CardTitle>{t("settings.clinic.general.title")}</CardTitle>
          <CardDescription>{t("settings.clinic.general.description")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="clinic-name">{t("settings.clinic.general.name")}</Label>
              <Input id="clinic-name" placeholder={t("settings.clinic.general.namePlaceholder")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clinic-phone">{t("settings.clinic.general.phone")}</Label>
              <Input id="clinic-phone" placeholder={t("settings.clinic.general.phonePlaceholder")} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="clinic-address">{t("settings.clinic.general.address")}</Label>
            <Textarea id="clinic-address" placeholder={t("settings.clinic.general.addressPlaceholder")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="clinic-email">{t("settings.clinic.general.email")}</Label>
            <Input id="clinic-email" type="email" placeholder={t("settings.clinic.general.emailPlaceholder")} />
          </div>

          <div className="space-y-2">
            <Label>{t("settings.clinic.general.logo")}</Label>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                <Building2 className="h-8 w-8 text-muted-foreground" />
              </div>
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                {t("settings.clinic.general.uploadLogo")}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>{t("settings.clinic.general.specialties")}</Label>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">{t("settings.clinic.general.specialty.general")}</Badge>
              <Badge variant="secondary">{t("settings.clinic.general.specialty.cardiology")}</Badge>
              <Badge variant="secondary">{t("settings.clinic.general.specialty.pediatrics")}</Badge>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-1" />
                {t("settings.clinic.general.addSpecialty")}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="language">{t("settings.clinic.general.language")}</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder={t("settings.clinic.general.selectLanguage")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="es">{t("settings.clinic.general.language.es")}</SelectItem>
                  <SelectItem value="en">{t("settings.clinic.general.language.en")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone">{t("settings.clinic.general.timezone")}</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder={t("settings.clinic.general.selectTimezone")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="america/el_salvador">{t("settings.clinic.general.timezone.elSalvador")}</SelectItem>
                  <SelectItem value="america/guatemala">{t("settings.clinic.general.timezone.guatemala")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button>{t("settings.clinic.saveChanges")}</Button>
      </div>
    </div>
  )
}
