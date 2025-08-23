"use client"

import { Stethoscope } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { commonComplaints } from "../mocks/consultation-data"

interface ChiefComplaintCardProps {
  chiefComplaint: string
  onChiefComplaintChange: (value: string) => void
}

export function ChiefComplaintCard({ chiefComplaint, onChiefComplaintChange }: ChiefComplaintCardProps) {
  return (
    <Card className="border-main-200 dark:border-main-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary dark:text-main-400">
          <Stethoscope className="w-5 h-5" />
          Chief Complaint
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="Describe the main reason for the consultation..."
          className="min-h-[100px] border-main-200 dark:border-main-800"
          value={chiefComplaint}
          onChange={(e) => onChiefComplaintChange(e.target.value)}
        />
        <div>
          <label className="text-sm font-medium">Common Complaints</label>
          <div className="flex flex-wrap gap-2 mt-2">
            {commonComplaints.map((complaint, index) => (
              <Badge
                key={index}
                variant="outline"
                className="cursor-pointer hover:bg-main-50 dark:hover:bg-main-950"
                onClick={() => onChiefComplaintChange(complaint)}
              >
                {complaint}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
