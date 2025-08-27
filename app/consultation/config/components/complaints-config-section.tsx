"use client"

import { useState } from "react"
import { Plus, Trash2, Edit, Stethoscope } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useLanguage } from "@/lib/language-context"

interface Complaint {
  id: string
  name: string
  category: string
  description: string
  icd10Code: string
  severity: "leve" | "moderado" | "grave"
  commonSymptoms: string[]
  isActive: boolean
}

// Mock data for complaints
const mockComplaints: Complaint[] = [
  {
    id: "1",
    name: "Dolor de cabeza",
    category: "Neurológico",
    description: "Dolor o molestia en la cabeza, cuero cabelludo o cuello",
    icd10Code: "R51.9",
    severity: "moderado",
    commonSymptoms: ["Dolor pulsátil", "Náuseas", "Sensibilidad a la luz"],
    isActive: true,
  },
  {
    id: "2",
    name: "Fiebre",
    category: "Sistémico",
    description: "Elevación de la temperatura corporal por encima de lo normal",
    icd10Code: "R50.9",
    severity: "moderado",
    commonSymptoms: ["Escalofríos", "Sudoración", "Dolor muscular"],
    isActive: true,
  },
  {
    id: "3",
    name: "Dolor abdominal",
    category: "Gastrointestinal",
    description: "Dolor o molestia en el área del abdomen",
    icd10Code: "R10.9",
    severity: "moderado",
    commonSymptoms: ["Náuseas", "Vómitos", "Pérdida de apetito"],
    isActive: true,
  },
  {
    id: "4",
    name: "Fatiga",
    category: "Sistémico",
    description: "Sensación de cansancio o agotamiento extremo",
    icd10Code: "R53.83",
    severity: "leve",
    commonSymptoms: ["Debilidad", "Dificultad para concentrarse", "Somnolencia"],
    isActive: true,
  },
  {
    id: "5",
    name: "Tos",
    category: "Respiratorio",
    description: "Expulsión súbita de aire de los pulmones",
    icd10Code: "R05.9",
    severity: "leve",
    commonSymptoms: ["Dolor de garganta", "Congestión nasal", "Flema"],
    isActive: true,
  },
]

const complaintCategories = [
  "Neurológico",
  "Cardiovascular",
  "Respiratorio",
  "Gastrointestinal",
  "Genitourinario",
  "Musculoesquelético",
  "Dermatológico",
  "Endocrinológico",
  "Sistémico",
  "Otros",
]

const severityLevels = [
  { value: "leve", label: "Leve" },
  { value: "moderado", label: "Moderado" },
  { value: "grave", label: "Grave" },
]

const commonSymptomOptions = [
  "Dolor",
  "Náuseas",
  "Vómitos",
  "Diarrea",
  "Estreñimiento",
  "Fiebre",
  "Escalofríos",
  "Sudoración",
  "Fatiga",
  "Debilidad",
  "Dolor de garganta",
  "Congestión nasal",
  "Tos",
  "Flema",
  "Dificultad para respirar",
  "Dolor en el pecho",
  "Mareos",
  "Dolor muscular",
  "Dolor en las articulaciones",
  "Pérdida de apetito",
  "Pérdida de peso",
  "Hinchazón",
  "Erupción cutánea",
  "Picazón",
  "Dolor pulsátil",
  "Sensibilidad a la luz",
  "Somnolencia",
  "Dificultad para concentrarse",
]

export function ComplaintsConfigSection() {
  const { t } = useLanguage()
  const [complaints, setComplaints] = useState<Complaint[]>(mockComplaints)
  const [isAddComplaintOpen, setIsAddComplaintOpen] = useState(false)
  const [isEditComplaintOpen, setIsEditComplaintOpen] = useState(false)
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null)
  const [newComplaint, setNewComplaint] = useState({
    name: '',
    category: '',
    description: '',
    icd10Code: '',
    severity: 'leve' as 'leve' | 'moderado' | 'grave',
    commonSymptoms: [] as string[],
  })

  const handleAddComplaint = () => {
    if (newComplaint.name && newComplaint.category) {
      const complaint: Complaint = {
        id: Date.now().toString(),
        ...newComplaint,
        isActive: true,
      }
      setComplaints([...complaints, complaint])
      setNewComplaint({
        name: '', category: '', description: '', icd10Code: '', severity: 'leve', commonSymptoms: []
      })
      setIsAddComplaintOpen(false)
    }
  }

  const handleEditComplaint = (complaint: Complaint) => {
    setSelectedComplaint(complaint)
    setIsEditComplaintOpen(true)
  }

  const handleUpdateComplaint = () => {
    if (selectedComplaint) {
      setComplaints(complaints.map(c => c.id === selectedComplaint.id ? selectedComplaint : c))
      setIsEditComplaintOpen(false)
      setSelectedComplaint(null)
    }
  }

  const handleDeleteComplaint = (complaintId: string) => {
    setComplaints(complaints.filter(c => c.id !== complaintId))
  }

  const toggleComplaintStatus = (complaintId: string) => {
    setComplaints(complaints.map(c => 
      c.id === complaintId ? { ...c, isActive: !c.isActive } : c
    ))
  }

  const handleSymptomToggle = (symptom: string) => {
    setNewComplaint(prev => ({
      ...prev,
      commonSymptoms: prev.commonSymptoms.includes(symptom)
        ? prev.commonSymptoms.filter(s => s !== symptom)
        : [...prev.commonSymptoms, symptom]
    }))
  }

  const getCategoryBadgeVariant = (category: string) => {
    const variants: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
      "Neurológico": "default",
      "Cardiovascular": "destructive",
      "Respiratorio": "secondary",
      "Gastrointestinal": "outline",
      "Genitourinario": "default",
      "Musculoesquelético": "secondary",
      "Dermatológico": "outline",
      "Endocrinológico": "default",
      "Sistémico": "secondary",
      "Otros": "outline",
    }
    return variants[category] || "outline"
  }

  const getSeverityBadgeVariant = (severity: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      "leve": "default",
      "moderado": "secondary",
      "grave": "destructive",
    }
    return variants[severity] || "default"
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">{t("consultation.config.complaints.title")}</h2>
          <p className="text-muted-foreground">{t("consultation.config.complaints.subtitle")}</p>
        </div>
        <Dialog open={isAddComplaintOpen} onOpenChange={setIsAddComplaintOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              {t("consultation.config.complaints.addComplaint")}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{t("consultation.config.complaints.addComplaint")}</DialogTitle>
              <DialogDescription>
                {t("consultation.config.complaints.addComplaintDescription")}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="complaint-name">{t("consultation.config.complaints.form.name")}</Label>
                  <Input
                    id="complaint-name"
                    value={newComplaint.name}
                    onChange={(e) => setNewComplaint({...newComplaint, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="complaint-category">{t("consultation.config.complaints.form.category")}</Label>
                  <Select value={newComplaint.category} onValueChange={(value) => setNewComplaint({...newComplaint, category: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder={t("consultation.config.complaints.form.selectCategory")} />
                    </SelectTrigger>
                    <SelectContent>
                      {complaintCategories.map((category) => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="complaint-icd10">{t("consultation.config.complaints.form.icd10Code")}</Label>
                  <Input
                    id="complaint-icd10"
                    value={newComplaint.icd10Code}
                    onChange={(e) => setNewComplaint({...newComplaint, icd10Code: e.target.value})}
                    placeholder="R51.9"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="complaint-severity">{t("consultation.config.complaints.form.severity")}</Label>
                  <Select value={newComplaint.severity} onValueChange={(value: 'leve' | 'moderado' | 'grave') => setNewComplaint({...newComplaint, severity: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {severityLevels.map((level) => (
                        <SelectItem key={level.value} value={level.value}>{level.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="complaint-description">{t("consultation.config.complaints.form.description")}</Label>
                <Textarea
                  id="complaint-description"
                  value={newComplaint.description}
                  onChange={(e) => setNewComplaint({...newComplaint, description: e.target.value})}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>{t("consultation.config.complaints.form.commonSymptoms")}</Label>
                <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto border rounded-md p-3">
                  {commonSymptomOptions.map((symptom) => (
                    <div key={symptom} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`symptom-${symptom}`}
                        checked={newComplaint.commonSymptoms.includes(symptom)}
                        onChange={() => handleSymptomToggle(symptom)}
                        className="rounded border-gray-300"
                      />
                      <Label htmlFor={`symptom-${symptom}`} className="text-sm">{symptom}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleAddComplaint}>
                {t("consultation.config.complaints.addComplaint")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-main-200 dark:border-main-800">
        <CardHeader>
          <CardTitle>{t("consultation.config.complaints.complaintList.title")}</CardTitle>
          <CardDescription>{t("consultation.config.complaints.complaintList.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {complaints.map((complaint) => (
              <div key={complaint.id} className="flex items-start justify-between p-4 border rounded-lg border-main-200 dark:border-main-800">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Stethoscope className="h-5 w-5 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{complaint.name}</h4>
                      <Badge variant={getCategoryBadgeVariant(complaint.category)}>
                        {complaint.category}
                      </Badge>
                      <Badge variant={getSeverityBadgeVariant(complaint.severity)}>
                        {complaint.severity}
                      </Badge>
                      <Badge variant={complaint.isActive ? "default" : "secondary"}>
                        {complaint.isActive ? t("consultation.config.complaints.status.active") : t("consultation.config.complaints.status.inactive")}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{complaint.description}</p>
                    <div className="flex gap-4 text-xs text-muted-foreground mb-2">
                      <span>{t("consultation.config.complaints.details.icd10")}: {complaint.icd10Code}</span>
                      <span>{t("consultation.config.complaints.details.symptoms")}: {complaint.commonSymptoms.join(", ")}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditComplaint(complaint)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleComplaintStatus(complaint.id)}
                  >
                    {complaint.isActive ? t("consultation.config.complaints.actions.deactivate") : t("consultation.config.complaints.actions.activate")}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteComplaint(complaint.id)}
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Edit Complaint Dialog would go here - similar structure to add dialog */}
    </div>
  )
}
