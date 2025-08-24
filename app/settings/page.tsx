"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Settings } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

// Import components
import { ClinicProfileSection } from "./components/clinic-profile-section"
import { UsersRolesSection } from "./components/users-roles-section"
import { ScheduleSection } from "./components/schedule-section"
import { BillingSection } from "./components/billing-section"
import { NotificationsSection } from "./components/notifications-section"
import { SecuritySection } from "./components/security-section"
import { IntegrationsSection } from "./components/integrations-section"

const settingSections = [
  { id: "clinic", label: "settings.sections.clinic" },
  { id: "users", label: "settings.sections.users" },
  { id: "schedule", label: "settings.sections.schedule" },
  { id: "billing", label: "settings.sections.billing" },
  { id: "notifications", label: "settings.sections.notifications" },
  { id: "security", label: "settings.sections.security" },
  { id: "integrations", label: "settings.sections.integrations" },
]

export default function SettingsPage() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-main-200 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:border-main-800">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Settings className="h-6 w-6 text-primary dark:text-main-400" />
            <div>
              <h1 className="text-xl font-semibold text-foreground">{t("settings.title")}</h1>
              <p className="text-sm text-muted-foreground">{t("settings.subtitle")}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <Tabs defaultValue="clinic" className="h-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
            {settingSections.map((section) => (
              <TabsTrigger key={section.id} value={section.id} className="text-xs lg:text-sm">
                <span className="hidden sm:inline">{t(section.label)}</span>
                <span className="sm:hidden">{t(section.label).split(' ')[0]}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="clinic" className="mt-6 h-full">
            <ScrollArea className="h-full">
              <div className="space-y-8 pb-8">
                <ClinicProfileSection />
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="users" className="mt-6 h-full">
            <ScrollArea className="h-full">
              <div className="space-y-8 pb-8">
                <UsersRolesSection />
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="schedule" className="mt-6 h-full">
            <ScrollArea className="h-full">
              <div className="space-y-8 pb-8">
                <ScheduleSection />
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="billing" className="mt-6 h-full">
            <ScrollArea className="h-full">
              <div className="space-y-8 pb-8">
                <BillingSection />
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="notifications" className="mt-6 h-full">
            <ScrollArea className="h-full">
              <div className="space-y-8 pb-8">
                <NotificationsSection />
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="security" className="mt-6 h-full">
            <ScrollArea className="h-full">
              <div className="space-y-8 pb-8">
                <SecuritySection />
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="integrations" className="mt-6 h-full">
            <ScrollArea className="h-full">
              <div className="space-y-8 pb-8">
                <IntegrationsSection />
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
