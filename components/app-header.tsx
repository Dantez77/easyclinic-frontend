"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Search, Globe, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useLanguage } from "@/lib/language-context"

interface AppHeaderProps {
  searchQuery: string
  onSearchChange: (query: string) => void
}

function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="border-primary text-primary hover:bg-main-50 dark:border-main-400 dark:text-main-400 dark:hover:bg-main-950"
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}

export function AppHeader({ searchQuery, onSearchChange }: AppHeaderProps) {
  const { language, setLanguage, t } = useLanguage()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-main-200 bg-main-50 dark:bg-main-950/20 relative transform-gpu">
      {/* Dark mode background enhancement - matching Contact Us section */}
      <div className="absolute inset-0 hidden dark:block -z-10 transform-gpu">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(215,52%,37%,0.08),transparent_50%)]"></div>
      </div>
      <div className="container flex h-16 items-center justify-between px-4 relative z-10 transform-gpu">
        <div className="flex items-center gap-2 lg:gap-4">
          <SidebarTrigger className="text-primary dark:text-main-400" />
          <Separator orientation="vertical" className="h-6" />
          <h1 className="text-lg lg:text-xl font-semibold hidden sm:block">
            <div className="flex items-center">
              <span className="font-bold text-[#1E5A96] text-xl">
                Inter
              </span>
              <span className="font-bold text-[#4A90E2] text-xl">
                Gastro
              </span>
            </div>
          </h1>
        </div>

        <div className="flex items-center gap-2 lg:gap-4">
          {/* Search Bar */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={t('header.search.placeholder')}
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-48 lg:w-64 pl-10 border-primary focus:ring-primary dark:border-main-400"
            />
          </div>

          {/* Language Selector */}
          <Button
            variant="outline"
            size="icon"
            onClick={() => setLanguage(language === "en" ? "es" : "en")}
            className="border-primary text-primary hover:bg-main-50 dark:border-main-400 dark:text-main-400 dark:hover:bg-main-950"
            title={t('header.language.' + language)}
          >
            <Globe className="h-4 w-4" />
            <span className="sr-only">
              {t('header.language.' + language)}
            </span>
          </Button>

          {/* Theme Toggle */}
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
