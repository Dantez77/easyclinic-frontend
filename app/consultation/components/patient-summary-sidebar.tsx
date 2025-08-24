"use client"

import { User, Phone } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { type Patient } from "../types"

interface PatientSummarySidebarProps {
  patientData: Patient
}

export function PatientSummarySidebar({ patientData }: PatientSummarySidebarProps) {
  return (
    <div className="w-full lg:w-80 bg-card border-b lg:border-b-0 lg:border-r border-main-200 dark:border-main-800 flex flex-col max-h-64 lg:max-h-none">
      <div className="p-4 lg:p-6 border-b border-main-200 dark:border-main-800">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 lg:w-12 lg:h-12 bg-main-100 dark:bg-main-900 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 lg:w-6 lg:h-6 text-primary dark:text-main-400" />
          </div>
          <div>
            <h2 className="text-base lg:text-lg font-semibold text-foreground">
              {patientData.firstName} {patientData.lastName}
            </h2>
            <p className="text-xs lg:text-sm text-muted-foreground">ID: {patientData.patientId}</p>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4 lg:p-6">
        <div className="space-y-4 lg:space-y-6">
          <div>
            <h3 className="text-sm font-medium text-primary dark:text-main-400 mb-2 lg:mb-3">
              Personal Information
            </h3>
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-2 text-xs lg:text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">DOB:</span>
                <span>{patientData.dateOfBirth}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Age:</span>
                <span>{patientData.age}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Gender:</span>
                <span>{patientData.gender}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Blood:</span>
                <Badge variant="outline" className="text-xs">
                  {patientData.bloodType}
                </Badge>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-sm font-medium text-primary dark:text-main-400 mb-2 lg:mb-3">Allergies</h3>
            <div className="flex flex-wrap gap-1 lg:gap-2">
              {patientData.allergies.map((allergy, index) => (
                <Badge key={index} variant="destructive" className="text-xs">
                  {allergy.substance}
                </Badge>
              ))}
            </div>
          </div>

          <div className="hidden lg:block">
            <Separator />
            <div>
              <h3 className="text-sm font-medium text-primary dark:text-main-400 mb-3">Insurance</h3>
              <p className="text-sm text-muted-foreground">
                {patientData.insurance.provider} - {patientData.insurance.policyNumber}
              </p>
            </div>

            <Separator />

            <div>
              <h3 className="text-sm font-medium text-primary dark:text-main-400 mb-3">Emergency Contact</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="w-4 h-4" />
                <span className="text-xs">
                  {patientData.emergencyContact.name} - {patientData.emergencyContact.phone}
                </span>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
