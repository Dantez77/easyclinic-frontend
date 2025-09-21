"use client"

import * as React from "react"
import Image from "next/image"
import {
  Heart,
  Users,
  Stethoscope,
  Calendar,
  Award,
  Phone,
  Mail,
  Clock,
  MessageSquare,
  Package,
  UserCheck,
  User,
  Settings,
  Wrench,
  LogOut,
  MoreVertical, 
  Receipt, 
  ScrollText,
  FileText,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/language-context"
import { preloadRoute } from "@/lib/navigation-routes"
import { useAuthContext } from "@/lib/auth-context"
import { usePermissions } from "@/lib/permissions-context"
import Link from "next/link"

const publicNavigationItems = [
  { key: "nav.home", icon: Heart, href: "/" },
  { key: "nav.doctors", icon: Users, href: "/#doctors" },
  { key: "nav.services", icon: Stethoscope, href: "/#services" },
  { key: "nav.news", icon: Award, href: "/#news" },
  { key: "nav.contact", icon: Phone, href: "/#contact" },
]

// Navigation items with their required permissions
const authenticatedNavigationItems = [
  { key: "nav.home", icon: Heart, href: "/", permission: null },
  { key: "nav.messages", icon: MessageSquare, href: "/messages", permission: "access_messages" },
  { key: "nav.appointments", icon: Calendar, href: "/appointments", permission: "access_appointments" },
  { key: "nav.patients", icon: UserCheck, href: "/patients", permission: "access_patients" },
  { key: "nav.billing", icon: Receipt, href: "/billing", permission: "access_billing" },
  { key: "nav.inventory", icon: Package, href: "/inventory", permission: "access_inventory" },
  { key: "nav.activityLogs", icon: ScrollText, href: "/activity-logs", permission: "access_activity_logs" },
]

export function AppSidebar() {
  const { t } = useLanguage()
  const { isAuthenticated, user, logout } = useAuthContext()
  const { hasPermission } = usePermissions()

  // Filter navigation items based on user permissions
  const getFilteredNavigationItems = () => {
    if (!isAuthenticated) {
      return publicNavigationItems
    }

    return authenticatedNavigationItems.filter(item => {
      // If no permission required, always show
      if (!item.permission) return true
      
      // Check if user has the required permission
      return hasPermission(item.permission)
    })
  }

  // Preload routes on hover for better performance
  const handleRouteHover = React.useCallback((href: string) => {
    if (href.startsWith('/') && href !== '/') {
      preloadRoute(href)
    }
  }, [])

  const filteredItems = getFilteredNavigationItems()

  return (
    <Sidebar 
      className="border-r border-main-200 dark:border-main-800 bg-background"
    >
      <SidebarHeader className="border-b border-main-200 dark:border-main-800 p-4">
        <div className="flex items-center gap-3">
          <Image 
            src="/logo2.png" 
            alt="InterGastro Logo" 
            width={40} 
            height={40}
            className="h-10 w-10"
            priority // Prioritize logo loading
          />
          <div>
            <h2 className="text-lg font-semibold">
              <div className="flex items-center">
                <span className="font-bold text-[#1E5A96] text-xl">
                  Inter
                </span>
                <span className="font-bold text-[#4A90E2] text-xl">
                  Gastro
                </span>
              </div>
            </h2>
            <p className="text-sm text-muted-foreground">{t("header.subtitle")}</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-primary dark:text-main-400">Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredItems.map((item) => (
                <SidebarMenuItem key={item.key}>
                  <SidebarMenuButton
                    asChild
                    className="hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/30 transition-colors">
                    {/* Use Next.js Link to prevent full reloads */}
                    <Link 
                      href={item.href} 
                      className="flex items-center gap-3"
                      onMouseEnter={() => handleRouteHover(item.href)}
                      prefetch={item.href.startsWith('/') && item.href !== '/'} // Enable prefetching for internal routes
                    >
                      <item.icon className="h-4 w-4 text-primary dark:text-main-400" />
                      <span>{t(item.key)}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-primary dark:text-main-400">
            {isAuthenticated ? "Quick Contact" : "Contact Information"}
          </SidebarGroupLabel>
          <SidebarGroupContent className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-primary dark:text-main-400" />
              <span>{t("quick.contact.phone")}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary dark:text-main-400" />
              <span>{t("quick.contact.email")}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-primary dark:text-main-400" />
              <span>{t("quick.contact.hours")}</span>
            </div>
            
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-main-200 dark:border-main-800 p-4">
        {isAuthenticated ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white">
                <User className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user?.roles?.[0]?.name || 'User'}
                </p>
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-main-50 dark:hover:bg-main-950 transition-colors">
                  <MoreVertical className="h-4 w-4 text-primary dark:text-main-400" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/tools" className="flex items-center gap-2">
                    <Wrench className="h-4 w-4" />
                    Tools
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={logout}
                  className="flex items-center gap-2 text-red-600 dark:text-red-400 cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => (window.location.href = "/login")}
              className="w-full"
            >
              Login to Access
            </Button>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  )
}
