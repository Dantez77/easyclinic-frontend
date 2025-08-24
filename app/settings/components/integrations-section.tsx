"use client"

import { CreditCard, Calendar, Building2, Shield } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/lib/language-context"

export function IntegrationsSection() {
  const { t } = useLanguage()
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground">{t("settings.integrations.title")}</h2>
        <p className="text-muted-foreground">{t("settings.integrations.subtitle")}</p>
      </div>

      <Card className="border-main-200 dark:border-main-800">
        <CardHeader>
          <CardTitle>{t("settings.integrations.payments.title")}</CardTitle>
          <CardDescription>{t("settings.integrations.payments.description")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg border-main-200 dark:border-main-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium">{t("settings.integrations.payments.stripe.name")}</p>
                <p className="text-sm text-muted-foreground">{t("settings.integrations.payments.stripe.description")}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{t("settings.integrations.status.disconnected")}</Badge>
              <Button variant="outline" size="sm">
                {t("settings.integrations.connect")}
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg border-main-200 dark:border-main-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium">{t("settings.integrations.payments.paypal.name")}</p>
                <p className="text-sm text-muted-foreground">{t("settings.integrations.payments.paypal.description")}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{t("settings.integrations.status.connected")}</Badge>
              <Button variant="outline" size="sm">
                {t("settings.integrations.configure")}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-main-200 dark:border-main-800">
        <CardHeader>
          <CardTitle>{t("settings.integrations.calendar.title")}</CardTitle>
          <CardDescription>{t("settings.integrations.calendar.description")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg border-main-200 dark:border-main-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <Calendar className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="font-medium">{t("settings.integrations.calendar.google.name")}</p>
                <p className="text-sm text-muted-foreground">{t("settings.integrations.calendar.google.description")}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{t("settings.integrations.status.connected")}</Badge>
              <Button variant="outline" size="sm">
                {t("settings.integrations.configure")}
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg border-main-200 dark:border-main-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium">{t("settings.integrations.calendar.outlook.name")}</p>
                <p className="text-sm text-muted-foreground">{t("settings.integrations.calendar.outlook.description")}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{t("settings.integrations.status.disconnected")}</Badge>
              <Button variant="outline" size="sm">
                {t("settings.integrations.connect")}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-main-200 dark:border-main-800">
        <CardHeader>
          <CardTitle>{t("settings.integrations.laboratories.title")}</CardTitle>
          <CardDescription>{t("settings.integrations.laboratories.description")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg border-main-200 dark:border-main-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Building2 className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium">{t("settings.integrations.laboratories.labcorp.name")}</p>
                <p className="text-sm text-muted-foreground">{t("settings.integrations.laboratories.labcorp.description")}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{t("settings.integrations.status.disconnected")}</Badge>
              <Button variant="outline" size="sm">
                {t("settings.integrations.connect")}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-main-200 dark:border-main-800">
        <CardHeader>
          <CardTitle>{t("settings.integrations.ai.title")}</CardTitle>
          <CardDescription>{t("settings.integrations.ai.description")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg border-main-200 dark:border-main-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Shield className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="font-medium">{t("settings.integrations.ai.transcription.name")}</p>
                <p className="text-sm text-muted-foreground">{t("settings.integrations.ai.transcription.description")}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{t("settings.integrations.status.disconnected")}</Badge>
              <Button variant="outline" size="sm">
                {t("settings.integrations.connect")}
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg border-main-200 dark:border-main-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Shield className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="font-medium">{t("settings.integrations.ai.diagnosis.name")}</p>
                <p className="text-sm text-muted-foreground">{t("settings.integrations.ai.diagnosis.description")}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{t("settings.integrations.status.disconnected")}</Badge>
              <Button variant="outline" size="sm">
                {t("settings.integrations.connect")}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
