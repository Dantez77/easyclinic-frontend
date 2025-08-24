"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/lib/language-context"

export function SecuritySection() {
  const { t } = useLanguage()
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground">{t("settings.security.title")}</h2>
        <p className="text-muted-foreground">{t("settings.security.subtitle")}</p>
      </div>

      <Card className="border-main-200 dark:border-main-800">
        <CardHeader>
          <CardTitle>{t("settings.security.password.title")}</CardTitle>
          <CardDescription>{t("settings.security.password.description")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password">{t("settings.security.password.current")}</Label>
            <Input id="current-password" type="password" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="new-password">{t("settings.security.password.new")}</Label>
            <Input id="new-password" type="password" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-password">{t("settings.security.password.confirm")}</Label>
            <Input id="confirm-password" type="password" />
          </div>

          <Button>{t("settings.security.password.change")}</Button>
        </CardContent>
      </Card>

      <Card className="border-main-200 dark:border-main-800">
        <CardHeader>
          <CardTitle>{t("settings.security.2fa.title")}</CardTitle>
          <CardDescription>{t("settings.security.2fa.description")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="2fa-enabled">{t("settings.security.2fa.enable")}</Label>
              <p className="text-sm text-muted-foreground">{t("settings.security.2fa.enableDescription")}</p>
            </div>
            <Switch id="2fa-enabled" />
          </div>

          <div className="space-y-2">
            <Label>{t("settings.security.2fa.method")}</Label>
            <select className="w-full p-2 border rounded-md border-main-200 dark:border-main-800">
              <option value="sms">{t("settings.security.2fa.method.sms")}</option>
              <option value="email">{t("settings.security.2fa.method.email")}</option>
              <option value="app">{t("settings.security.2fa.method.app")}</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <Card className="border-main-200 dark:border-main-800">
        <CardHeader>
          <CardTitle>{t("settings.security.sessions.title")}</CardTitle>
          <CardDescription>{t("settings.security.sessions.description")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg border-main-200 dark:border-main-800">
              <div>
                <p className="font-medium">{t("settings.security.sessions.chromeWindows")}</p>
                <p className="text-sm text-muted-foreground">{t("settings.security.sessions.chromeWindowsDetails")}</p>
              </div>
              <Badge variant="secondary">{t("settings.security.sessions.current")}</Badge>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg border-main-200 dark:border-main-800">
              <div>
                <p className="font-medium">{t("settings.security.sessions.safariIphone")}</p>
                <p className="text-sm text-muted-foreground">{t("settings.security.sessions.safariIphoneDetails")}</p>
              </div>
              <Button variant="outline" size="sm">
                {t("settings.security.sessions.logout")}
              </Button>
            </div>
          </div>

          <Button variant="destructive" size="sm">
            {t("settings.security.sessions.logoutAll")}
          </Button>
        </CardContent>
      </Card>

      <Card className="border-main-200 dark:border-main-800">
        <CardHeader>
          <CardTitle>{t("settings.security.policies.title")}</CardTitle>
          <CardDescription>{t("settings.security.policies.description")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="min-length">{t("settings.security.policies.minLength")}</Label>
              <Input id="min-length" type="number" defaultValue="8" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expiry-days">{t("settings.security.policies.expiryDays")}</Label>
              <Input id="expiry-days" type="number" defaultValue="90" />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="require-uppercase">{t("settings.security.policies.requireUppercase")}</Label>
              <Switch id="require-uppercase" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="require-numbers">{t("settings.security.policies.requireNumbers")}</Label>
              <Switch id="require-numbers" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="require-symbols">{t("settings.security.policies.requireSymbols")}</Label>
              <Switch id="require-symbols" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
