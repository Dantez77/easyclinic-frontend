"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { format, startOfWeek, endOfWeek } from "date-fns"

interface CalendarNavigationProps {
  selectedView: string
  onViewChange: (value: string) => void
  currentDate: Date
  onNavigate: (direction: "prev" | "next") => void
}

export function CalendarNavigation({
  selectedView,
  onViewChange,
  currentDate,
  onNavigate,
}: CalendarNavigationProps) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
      <TabsList className="grid w-full sm:w-fit grid-cols-2 sm:grid-cols-4">
        <TabsTrigger value="day" className="text-xs sm:text-sm">
          Day
        </TabsTrigger>
        <TabsTrigger value="week" className="text-xs sm:text-sm">
          Week
        </TabsTrigger>
        <TabsTrigger value="month" className="text-xs sm:text-sm">
          Month
        </TabsTrigger>
        <TabsTrigger value="list" className="text-xs sm:text-sm">
          List
        </TabsTrigger>
      </TabsList>

      <div className="flex items-center justify-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onNavigate("prev")}
          className="border-primary text-primary hover:bg-main-50 dark:border-main-400 dark:text-main-400 h-8 w-8 sm:h-10 sm:w-10"
        >
          <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
        </Button>
        <div className="text-sm sm:text-lg font-semibold text-primary dark:text-main-400 min-w-32 sm:min-w-48 text-center">
          {selectedView === "day" && format(currentDate, "MMM d, yyyy")}
          {selectedView === "week" &&
            `${format(startOfWeek(currentDate), "MMM d")} - ${format(endOfWeek(currentDate), "MMM d")}`}
          {selectedView === "month" && format(currentDate, "MMMM yyyy")}
          {selectedView === "list" && "All Appointments"}
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onNavigate("next")}
          className="border-primary text-primary hover:bg-main-50 dark:border-main-400 dark:text-main-400 h-8 w-8 sm:h-10 sm:w-10"
        >
          <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
        </Button>
      </div>
    </div>
  )
}
