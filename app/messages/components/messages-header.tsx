"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, X } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

interface MessagesHeaderProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  filterStatus: string
  onFilterChange: (status: string) => void
  onClearFilters: () => void
  hasActiveFilters: boolean
}

export function MessagesHeader({
                                 searchQuery,
                                 onSearchChange,
                                 filterStatus,
                                 onFilterChange,
                                 onClearFilters,
                                 hasActiveFilters,
                               }: MessagesHeaderProps) {
  const { t } = useLanguage()

  return (
    <div className="mb-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground text-balance">{t('messages.title')}</h1>
          <p className="text-muted-foreground mt-2">{t('messages.subtitle')}</p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={t('messages.search.placeholder')}
              className="pl-10 w-full sm:w-80"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <Select value={filterStatus} onValueChange={onFilterChange}>
              <SelectTrigger className="w-32">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('messages.filter.all')}</SelectItem>
                <SelectItem value="new">{t('messages.filter.new')}</SelectItem>
                <SelectItem value="reviewed">{t('messages.filter.reviewed')}</SelectItem>
              </SelectContent>
            </Select>

            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={onClearFilters}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
