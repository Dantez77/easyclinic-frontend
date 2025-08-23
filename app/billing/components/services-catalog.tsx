"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Service } from "../mocks/billing-data"

interface ServicesCatalogProps {
  services: Service[]
}

export function ServicesCatalog({ services }: ServicesCatalogProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Catálogo de Servicios</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service) => (
            <div key={service.id} className="border rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-medium">{service.name}</h4>
                  <Badge variant="outline" className="text-xs mt-1">
                    {service.category}
                  </Badge>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">${service.price.toLocaleString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
