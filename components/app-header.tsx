"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Search, Globe, Sun, Moon } from "lucide-react"
import { useTheme } from "next-themes"
import { useLanguage } from "@/lib/language-context"
import { useNavSearch } from "@/hooks/useNavSearch"
import { NavSearchResults } from "@/components/nav-search-results"

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
    >
      {theme === "light" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}

export function AppHeader({ searchQuery, onSearchChange }: AppHeaderProps) {
  const { language, setLanguage, t } = useLanguage()
  const results = useNavSearch(searchQuery, language)
  const [showResults, setShowResults] = React.useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-main-50">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Left section */}
        <div className="flex items-center gap-2 lg:gap-4">
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-6" />
          <h1 className="text-lg lg:text-xl font-semibold hidden sm:block">
            <div className="flex items-center">
              <span className="font-bold text-[#1E5A96] text-xl">Inter</span>
              <span className="font-bold text-[#4A90E2] text-xl">Gastro</span>
            </div>
          </h1>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-2 lg:gap-4">
          {/* Search Bar */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={t("header.search.placeholder")}
              value={searchQuery}
              onFocus={() => setShowResults(true)}
              onChange={(e) => {
                onSearchChange(e.target.value)
                setShowResults(true)
              }}
              className="w-48 lg:w-64 pl-10 border"
            />
            {showResults && searchQuery && (
              <NavSearchResults
                results={results}
                language={language}
                onSelect={() => {
                  onSearchChange("")
                  setShowResults(false)
                }}
              />
            )}
          </div>

          {/* Language Selector */}
          <Button
            variant="outline"
            size="icon"
            onClick={() => setLanguage(language === "en" ? "es" : "en")}
            title={t("header.language." + language)}
          >
            <Globe className="h-4 w-4" />
            <span className="sr-only">{t("header.language." + language)}</span>
          </Button>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Login Button */}
          <Button onClick={() => (window.location.href = "/login")}>
            Login
          </Button>
        </div>
      </div>
    </header>
  )
}
