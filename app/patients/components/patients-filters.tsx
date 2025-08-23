"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"

interface PatientsFiltersProps {
  searchTerm: string
  statusFilter: string
  provinceFilter: string
  onSearchChange: (value: string) => void
  onStatusChange: (value: string) => void
  onProvinceChange: (value: string) => void
  provinces: string[]
}

export function PatientsFilters({
  searchTerm,
  statusFilter,
  provinceFilter,
  onSearchChange,
  onStatusChange,
  onProvinceChange,
  provinces,
}: PatientsFiltersProps) {
  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre, cédula, ID o teléfono..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Select value={statusFilter} onValueChange={onStatusChange}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="activo">Activo</SelectItem>
                <SelectItem value="inactivo">Inactivo</SelectItem>
              </SelectContent>
            </Select>
            <Select value={provinceFilter} onValueChange={onProvinceChange}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Provincia" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las provincias</SelectItem>
                {provinces.map((province) => (
                  <SelectItem key={province} value={province}>
                    {province}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
