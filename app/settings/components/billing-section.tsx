"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useLanguage } from "@/lib/language-context"

export function BillingSection() {
  const { t } = useLanguage()
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground">{t("settings.billing.title")}</h2>
        <p className="text-muted-foreground">{t("settings.billing.subtitle")}</p>
      </div>

      <Card className="border-main-200 dark:border-main-800">
        <CardHeader>
          <CardTitle>{t("settings.billing.tax.title")}</CardTitle>
          <CardDescription>{t("settings.billing.tax.description")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tax-id">{t("settings.billing.tax.nit")}</Label>
              <Input id="tax-id" placeholder={t("settings.billing.tax.nitPlaceholder")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tax-name">{t("settings.billing.tax.businessName")}</Label>
              <Input id="tax-name" placeholder={t("settings.billing.tax.businessNamePlaceholder")} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tax-address">{t("settings.billing.tax.taxAddress")}</Label>
            <Textarea id="tax-address" placeholder={t("settings.billing.tax.taxAddressPlaceholder")} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="currency">{t("settings.billing.tax.currency")}</Label>
              <select className="w-full p-2 border rounded-md border-main-200 dark:border-main-800">
                <option value="usd">{t("settings.billing.tax.currency.usd")}</option>
                <option value="eur">{t("settings.billing.tax.currency.eur")}</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tax-rate">{t("settings.billing.tax.vatRate")}</Label>
              <Input id="tax-rate" type="number" placeholder="13" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-main-200 dark:border-main-800">
        <CardHeader>
          <CardTitle>{t("settings.billing.dte.title")}</CardTitle>
          <CardDescription>{t("settings.billing.dte.description")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="dte-enabled">{t("settings.billing.dte.enable")}</Label>
              <p className="text-sm text-muted-foreground">{t("settings.billing.dte.enableDescription")}</p>
            </div>
            <Switch id="dte-enabled" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dte-environment">{t("settings.billing.dte.environment")}</Label>
              <select className="w-full p-2 border rounded-md border-main-200 dark:border-main-800">
                <option value="test">{t("settings.billing.dte.environment.test")}</option>
                <option value="production">{t("settings.billing.dte.environment.production")}</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="invoice-series">{t("settings.billing.dte.invoiceSeries")}</Label>
              <Input id="invoice-series" placeholder="A001" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="next-invoice">{t("settings.billing.dte.nextInvoiceNumber")}</Label>
            <Input id="next-invoice" type="number" placeholder="1" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
