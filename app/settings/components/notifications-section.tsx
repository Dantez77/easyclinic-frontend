"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { useLanguage } from "@/lib/language-context"

export function NotificationsSection() {
  const { t } = useLanguage()
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground">{t("settings.notifications.title")}</h2>
        <p className="text-muted-foreground">{t("settings.notifications.subtitle")}</p>
      </div>

      <Card className="border-main-200 dark:border-main-800">
        <CardHeader>
          <CardTitle>{t("settings.notifications.email.title")}</CardTitle>
          <CardDescription>{t("settings.notifications.email.description")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="email-confirmations">{t("settings.notifications.email.confirmations")}</Label>
              <p className="text-sm text-muted-foreground">{t("settings.notifications.email.confirmationsDescription")}</p>
            </div>
            <Switch id="email-confirmations" defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="email-reminders">{t("settings.notifications.email.reminders")}</Label>
              <p className="text-sm text-muted-foreground">{t("settings.notifications.email.remindersDescription")}</p>
            </div>
            <Switch id="email-reminders" defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="email-invoices">{t("settings.notifications.email.invoices")}</Label>
              <p className="text-sm text-muted-foreground">{t("settings.notifications.email.invoicesDescription")}</p>
            </div>
            <Switch id="email-invoices" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-main-200 dark:border-main-800">
        <CardHeader>
          <CardTitle>{t("settings.notifications.sms.title")}</CardTitle>
          <CardDescription>{t("settings.notifications.sms.description")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="sms-reminders">{t("settings.notifications.sms.reminders")}</Label>
              <p className="text-sm text-muted-foreground">{t("settings.notifications.sms.remindersDescription")}</p>
            </div>
            <Switch id="sms-reminders" />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="sms-confirmations">{t("settings.notifications.sms.confirmations")}</Label>
              <p className="text-sm text-muted-foreground">{t("settings.notifications.sms.confirmationsDescription")}</p>
            </div>
            <Switch id="sms-confirmations" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-main-200 dark:border-main-800">
        <CardHeader>
          <CardTitle>{t("settings.notifications.templates.title")}</CardTitle>
          <CardDescription>{t("settings.notifications.templates.description")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reminder-template">{t("settings.notifications.templates.reminder")}</Label>
            <Textarea
              id="reminder-template"
              placeholder={t("settings.notifications.templates.reminderPlaceholder")}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmation-template">{t("settings.notifications.templates.confirmation")}</Label>
            <Textarea
              id="confirmation-template"
              placeholder={t("settings.notifications.templates.confirmationPlaceholder")}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
