"use client"

import { FileDown, Send, Save } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ActionButtonsProps {
  onGeneratePDF: () => void
  onSendPrescription: () => void
  onSaveConsultation: () => void
}

export function ActionButtons({ onGeneratePDF, onSendPrescription, onSaveConsultation }: ActionButtonsProps) {
  return (
    <div className="bg-card border-t border-main-200 dark:border-main-800 p-4 lg:p-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex flex-col sm:flex-row gap-2 lg:gap-3">
          <Button
            variant="outline"
            className="border-primary text-primary hover:bg-main-50 dark:border-main-400 dark:text-main-400 bg-transparent text-sm lg:text-base"
            onClick={onGeneratePDF}
          >
            <FileDown className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Generate PDF Report</span>
            <span className="sm:hidden">PDF Report</span>
          </Button>
          <Button
            variant="outline"
            className="border-primary text-primary hover:bg-main-50 dark:border-main-400 dark:text-main-400 bg-transparent text-sm lg:text-base"
            onClick={onSendPrescription}
          >
            <Send className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Send Prescription</span>
            <span className="sm:hidden">Send Rx</span>
          </Button>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 lg:gap-3">
          <Button variant="outline" className="text-sm lg:text-base bg-transparent">
            <span className="hidden sm:inline">New Consultation</span>
            <span className="sm:hidden">New</span>
          </Button>
          <Button
            onClick={onSaveConsultation}
            className="bg-primary hover:bg-main-800 text-white text-sm lg:text-base"
          >
            <Save className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Save & Close</span>
            <span className="sm:hidden">Save</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
