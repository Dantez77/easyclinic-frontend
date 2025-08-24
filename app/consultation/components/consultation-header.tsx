"use client"

import { ArrowLeft, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ConsultationHeaderProps {
  onBack: () => void
}

export function ConsultationHeader({ onBack }: ConsultationHeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-main-200 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:border-main-800">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2 lg:gap-4">
          <Button
            variant="ghost"
            onClick={onBack}
            className="text-primary dark:text-main-400 text-sm lg:text-base"
          >
            <ArrowLeft className="h-4 w-4 mr-1 lg:mr-2" />
            <span className="hidden sm:inline">Back to Appointments</span>
            <span className="sm:hidden">Back</span>
          </Button>
        </div>

        <div className="flex items-center gap-2 lg:gap-4">
          <div className="flex items-center gap-2 text-xs lg:text-sm text-muted-foreground">
            <Calendar className="w-3 h-3 lg:w-4 lg:h-4" />
            <span className="hidden sm:inline">{new Date().toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </header>
  )
}
