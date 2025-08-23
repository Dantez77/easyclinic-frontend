"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { medicalHistory } from "../mocks/consultation-data"

export function MedicalHistoryCard() {
  return (
    <Card className="border-main-200 dark:border-main-800">
      <CardHeader>
        <CardTitle className="text-primary dark:text-main-400">Medical History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {medicalHistory.map((item) => (
            <div key={item.id} className="border-l-4 border-main-500 pl-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">{item.title}</h4>
                  <p className="text-sm text-muted-foreground">{item.doctor} • {item.date}</p>
                </div>
                <Badge variant="outline">{item.status}</Badge>
              </div>
              <p className="text-sm mt-2">{item.description}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
