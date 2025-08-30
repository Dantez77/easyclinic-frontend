"use client"

import { Building2, Plus, Upload, Users, Phone, Mail, MapPin } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/lib/language-context"
import { useClinic } from "@/hooks/use-clinic"
import { useClinicUsers } from "@/hooks/use-clinic-users"
import { Skeleton } from "@/components/ui/skeleton"

export function ClinicProfileSection() {
  const { t } = useLanguage()
  const { clinic, isLoading: clinicLoading, error: clinicError, refreshClinic } = useClinic()
  const { clinicUsers, isLoading: usersLoading, error: usersError, refreshClinicUsers } = useClinicUsers()
  
  const isLoading = clinicLoading || usersLoading
  const error = clinicError || usersError
  
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96 mt-2" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-80" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">{t("settings.clinic.title")}</h2>
          <p className="text-muted-foreground">{t("settings.clinic.subtitle")}</p>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-destructive mb-4">{error}</p>
              <Button onClick={refreshClinic}>Retry</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground">{t("settings.clinic.title")}</h2>
        <p className="text-muted-foreground">{t("settings.clinic.subtitle")}</p>
      </div>

      {/* Clinic Overview Card */}
      <Card className="border-main-200 dark:border-main-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Clinic Overview
          </CardTitle>
          <CardDescription>Basic clinic information and statistics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <Users className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold">{clinicUsers?.users?.length || clinic?.users?.length || 0}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <Building2 className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Clinic ID</p>
                <p className="text-2xl font-bold">{clinic?.clinic_id}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <Users className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Active Users</p>
                <p className="text-2xl font-bold text-green-600">
                  {clinicUsers?.users?.filter(u => u.active).length || clinic?.users?.filter(u => u.active).length || 0}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Clinic Details Card */}
      <Card className="border-main-200 dark:border-main-800">
        <CardHeader>
          <CardTitle>{t("settings.clinic.general.title")}</CardTitle>
          <CardDescription>{t("settings.clinic.general.description")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="clinic-name" className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                {t("settings.clinic.general.name")}
              </Label>
              <Input 
                id="clinic-name" 
                value={clinic?.clinic_name || ''} 
                placeholder={t("settings.clinic.general.namePlaceholder")} 
                readOnly
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clinic-id" className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Clinic ID
              </Label>
              <Input 
                id="clinic-id" 
                value={clinic?.clinic_id?.toString() || ''} 
                readOnly
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="clinic-phone" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                {t("settings.clinic.general.phone")}
              </Label>
              <Input 
                id="clinic-phone" 
                value={clinic?.phone || ''} 
                placeholder={t("settings.clinic.general.phonePlaceholder")} 
                readOnly
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clinic-email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                {t("settings.clinic.general.email")}
              </Label>
              <Input 
                id="clinic-email" 
                type="email" 
                value={clinic?.email || ''} 
                placeholder={t("settings.clinic.general.emailPlaceholder")} 
                readOnly
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="clinic-address" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              {t("settings.clinic.general.address")}
            </Label>
            <Textarea 
              id="clinic-address" 
              value={clinic?.address || ''} 
              placeholder={t("settings.clinic.general.addressPlaceholder")} 
              readOnly
            />
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

      {/* Clinic Users Card */}
      <Card className="border-main-200 dark:border-main-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Clinic Users
          </CardTitle>
          <CardDescription>Users associated with this clinic</CardDescription>
        </CardHeader>
        <CardContent>
          {clinicUsers?.users && clinicUsers.users.length > 0 ? (
            <div className="space-y-2">
              {clinicUsers.users.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">
                        {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{user.firstName} {user.lastName}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                      {user.phone && (
                        <p className="text-xs text-muted-foreground">{user.phone}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex flex-wrap gap-1">
                      {user.roles.map((role) => (
                        <Badge key={role.id} variant="outline" className="text-xs">
                          {role.name}
                        </Badge>
                      ))}
                    </div>
                    <Badge variant={user.active ? "default" : "secondary"}>
                      {user.active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-4">No users found for this clinic</p>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button onClick={refreshClinicUsers}>Refresh Users</Button>
        <Button onClick={refreshClinic}>Refresh Clinic Data</Button>
      </div>
    </div>
  )
}
