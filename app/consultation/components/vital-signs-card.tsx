"use client"

import { Thermometer } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { VitalSigns } from "../hooks/use-consultation"

interface VitalSignsCardProps {
  vitalSigns: VitalSigns
  onVitalSignsChange: (updates: Partial<VitalSigns>) => void
  onCalculateBMI: () => void
}

export function VitalSignsCard({ vitalSigns, onVitalSignsChange, onCalculateBMI }: VitalSignsCardProps) {
  return (
    <Card className="border-main-200 dark:border-main-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary dark:text-main-400">
          <Thermometer className="w-5 h-5" />
          Vital Signs
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
          <div>
            <Label htmlFor="temperature">Temperature (°F)</Label>
            <Input
              id="temperature"
              type="number"
              step="0.1"
              value={vitalSigns.temperature}
              onChange={(e) => onVitalSignsChange({ temperature: e.target.value })}
              className="border-main-200 dark:border-main-800"
            />
          </div>
          <div>
            <Label htmlFor="bloodPressure">Blood Pressure</Label>
            <Input
              id="bloodPressure"
              placeholder="120/80"
              value={vitalSigns.bloodPressure}
              onChange={(e) => onVitalSignsChange({ bloodPressure: e.target.value })}
              className="border-main-200 dark:border-main-800"
            />
          </div>
          <div>
            <Label htmlFor="heartRate">Heart Rate</Label>
            <Input
              id="heartRate"
              type="number"
              value={vitalSigns.heartRate}
              onChange={(e) => onVitalSignsChange({ heartRate: e.target.value })}
              className="border-main-200 dark:border-main-800"
            />
          </div>
          <div>
            <Label htmlFor="respiratoryRate">Respiratory Rate</Label>
            <Input
              id="respiratoryRate"
              type="number"
              value={vitalSigns.respiratoryRate}
              onChange={(e) => onVitalSignsChange({ respiratoryRate: e.target.value })}
              className="border-main-200 dark:border-main-800"
            />
          </div>
          <div>
            <Label htmlFor="oxygenSaturation">Oxygen Saturation (%)</Label>
            <Input
              id="oxygenSaturation"
              type="number"
              value={vitalSigns.oxygenSaturation}
              onChange={(e) => onVitalSignsChange({ oxygenSaturation: e.target.value })}
              className="border-main-200 dark:border-main-800"
            />
          </div>
          <div>
            <Label htmlFor="weight">Weight (lbs)</Label>
            <Input
              id="weight"
              type="number"
              step="0.1"
              value={vitalSigns.weight}
              onChange={(e) => onVitalSignsChange({ weight: e.target.value })}
              onBlur={onCalculateBMI}
              className="border-main-200 dark:border-main-800"
            />
          </div>
          <div>
            <Label htmlFor="height">Height (in)</Label>
            <Input
              id="height"
              type="number"
              value={vitalSigns.height}
              onChange={(e) => onVitalSignsChange({ height: e.target.value })}
              onBlur={onCalculateBMI}
              className="border-main-200 dark:border-main-800"
            />
          </div>
          <div>
            <Label htmlFor="bmi">BMI</Label>
            <Input 
              id="bmi" 
              value={vitalSigns.bmi} 
              readOnly 
              className="bg-muted" 
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
