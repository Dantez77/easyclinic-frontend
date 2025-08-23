"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getCategoryIcon } from "../utils/inventory-utils"

interface CategoriesChartProps {
  categories: string[]
  inventoryItems: any[]
  totalStockValue: number
}

export function CategoriesChart({ categories, inventoryItems, totalStockValue }: CategoriesChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribución por Categorías</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {categories.map((category) => {
            const categoryItems = inventoryItems.filter((item) => item.category === category)
            const categoryValue = categoryItems.reduce((sum, item) => sum + item.totalValue, 0)
            const percentage = (categoryValue / totalStockValue) * 100

            return (
              <div key={category} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getCategoryIcon(category)}
                  <div>
                    <p className="font-medium">{category}</p>
                    <p className="text-sm text-muted-foreground">{categoryItems.length} artículos</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold">${categoryValue.toLocaleString()}</p>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-2 bg-muted rounded-full">
                      <div className="h-2 bg-blue-600 rounded-full" style={{ width: `${percentage}%` }}></div>
                    </div>
                    <span className="text-xs text-muted-foreground">{percentage.toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
