"use client"

import { useState } from "react"
import { Plus, Trash2, Edit, Pill } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useLanguage } from "@/lib/language-context"

interface Medication {
  id: string
  name: string
  genericName: string
  category: string
  dosageForms: string[]
  strengths: string[]
  description: string
  indications: string
  contraindications: string
  sideEffects: string
  isActive: boolean
}

// Mock data for medications
const mockMedications: Medication[] = [
  {
    id: "1",
    name: "Acetaminofén",
    genericName: "Paracetamol",
    category: "Analgésico",
    dosageForms: ["Tableta", "Jarabe", "Supositorio"],
    strengths: ["500mg", "1000mg"],
    description: "Analgésico y antipirético para el alivio del dolor y la fiebre",
    indications: "Dolor leve a moderado, fiebre",
    contraindications: "Hipersensibilidad al medicamento, enfermedad hepática grave",
    sideEffects: "Raros en dosis terapéuticas, puede causar reacciones alérgicas",
    isActive: true,
  },
  {
    id: "2",
    name: "Ibuprofeno",
    genericName: "Ibuprofeno",
    category: "Antiinflamatorio",
    dosageForms: ["Tableta", "Jarabe", "Cápsula"],
    strengths: ["200mg", "400mg", "600mg", "800mg"],
    description: "Antiinflamatorio no esteroideo para el alivio del dolor e inflamación",
    indications: "Dolor, inflamación, fiebre",
    contraindications: "Úlcera péptica activa, insuficiencia renal grave",
    sideEffects: "Puede causar irritación gástrica, aumento de presión arterial",
    isActive: true,
  },
  {
    id: "3",
    name: "Losartán",
    genericName: "Losartán",
    category: "Antihipertensivo",
    dosageForms: ["Tableta"],
    strengths: ["25mg", "50mg", "100mg"],
    description: "Bloqueador del receptor de angiotensina II para el tratamiento de la hipertensión",
    indications: "Hipertensión arterial, protección renal en diabetes",
    contraindications: "Embarazo, hipersensibilidad al medicamento",
    sideEffects: "Mareos, fatiga, tos seca, hiperpotasemia",
    isActive: true,
  },
  {
    id: "4",
    name: "Metformina",
    genericName: "Metformina",
    category: "Antidiabético",
    dosageForms: ["Tableta", "Tableta de liberación prolongada"],
    strengths: ["500mg", "850mg", "1000mg"],
    description: "Medicamento oral para el tratamiento de la diabetes tipo 2",
    indications: "Diabetes mellitus tipo 2, síndrome de ovario poliquístico",
    contraindications: "Insuficiencia renal grave, acidosis metabólica",
    sideEffects: "Náuseas, diarrea, malestar abdominal, sabor metálico",
    isActive: true,
  },
]

const medicationCategories = [
  "Analgésico",
  "Antiinflamatorio",
  "Antibiótico",
  "Antihipertensivo",
  "Antidiabético",
  "Antidepresivo",
  "Ansiolítico",
  "Antiemético",
  "Antihistamínico",
  "Broncodilatador",
  "Diurético",
  "Otros",
]

const dosageForms = [
  "Tableta",
  "Cápsula",
  "Jarabe",
  "Suspensión",
  "Inyección",
  "Supositorio",
  "Crema",
  "Ungüento",
  "Parche",
  "Inhalador",
]

export function MedicationsConfigSection() {
  const { t } = useLanguage()
  const [medications, setMedications] = useState<Medication[]>(mockMedications)
  const [isAddMedicationOpen, setIsAddMedicationOpen] = useState(false)
  const [isEditMedicationOpen, setIsEditMedicationOpen] = useState(false)
  const [selectedMedication, setSelectedMedication] = useState<Medication | null>(null)
  const [newMedication, setNewMedication] = useState({
    name: '',
    genericName: '',
    category: '',
    dosageForms: [] as string[],
    strengths: [] as string[],
    description: '',
    indications: '',
    contraindications: '',
    sideEffects: '',
  })

  const handleAddMedication = () => {
    if (newMedication.name && newMedication.category) {
      const medication: Medication = {
        id: Date.now().toString(),
        ...newMedication,
        isActive: true,
      }
      setMedications([...medications, medication])
      setNewMedication({
        name: '', genericName: '', category: '', dosageForms: [], strengths: [],
        description: '', indications: '', contraindications: '', sideEffects: ''
      })
      setIsAddMedicationOpen(false)
    }
  }

  const handleEditMedication = (medication: Medication) => {
    setSelectedMedication(medication)
    setIsEditMedicationOpen(true)
  }

  const handleUpdateMedication = () => {
    if (selectedMedication) {
      setMedications(medications.map(m => m.id === selectedMedication.id ? selectedMedication : m))
      setIsEditMedicationOpen(false)
      setSelectedMedication(null)
    }
  }

  const handleDeleteMedication = (medicationId: string) => {
    setMedications(medications.filter(m => m.id !== medicationId))
  }

  const toggleMedicationStatus = (medicationId: string) => {
    setMedications(medications.map(m => 
      m.id === medicationId ? { ...m, isActive: !m.isActive } : m
    ))
  }

  const handleDosageFormToggle = (form: string) => {
    setNewMedication(prev => ({
      ...prev,
      dosageForms: prev.dosageForms.includes(form)
        ? prev.dosageForms.filter(f => f !== form)
        : [...prev.dosageForms, form]
    }))
  }

  const handleStrengthToggle = (strength: string) => {
    setNewMedication(prev => ({
      ...prev,
      strengths: prev.strengths.includes(strength)
        ? prev.strengths.filter(s => s !== strength)
        : [...prev.strengths, strength]
    }))
  }

  const getCategoryBadgeVariant = (category: string) => {
    const variants: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
      "Analgésico": "default",
      "Antiinflamatorio": "secondary",
      "Antibiótico": "destructive",
      "Antihipertensivo": "outline",
      "Antidiabético": "default",
      "Antidepresivo": "secondary",
      "Ansiolítico": "outline",
      "Antiemético": "default",
      "Antihistamínico": "secondary",
      "Broncodilatador": "outline",
      "Diurético": "default",
      "Otros": "outline",
    }
    return variants[category] || "outline"
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">{t("consultation.config.medications.title")}</h2>
          <p className="text-muted-foreground">{t("consultation.config.medications.subtitle")}</p>
        </div>
        <Dialog open={isAddMedicationOpen} onOpenChange={setIsAddMedicationOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              {t("consultation.config.medications.addMedication")}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{t("consultation.config.medications.addMedication")}</DialogTitle>
              <DialogDescription>
                {t("consultation.config.medications.addMedicationDescription")}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="med-name">{t("consultation.config.medications.form.name")}</Label>
                  <Input
                    id="med-name"
                    value={newMedication.name}
                    onChange={(e) => setNewMedication({...newMedication, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="med-generic">{t("consultation.config.medications.form.genericName")}</Label>
                  <Input
                    id="med-generic"
                    value={newMedication.genericName}
                    onChange={(e) => setNewMedication({...newMedication, genericName: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="med-category">{t("consultation.config.medications.form.category")}</Label>
                <Select value={newMedication.category} onValueChange={(value) => setNewMedication({...newMedication, category: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("consultation.config.medications.form.selectCategory")} />
                  </SelectTrigger>
                  <SelectContent>
                    {medicationCategories.map((category) => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>{t("consultation.config.medications.form.dosageForms")}</Label>
                <div className="grid grid-cols-3 gap-2">
                  {dosageForms.map((form) => (
                    <div key={form} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`form-${form}`}
                        checked={newMedication.dosageForms.includes(form)}
                        onChange={() => handleDosageFormToggle(form)}
                        className="rounded border-gray-300"
                      />
                      <Label htmlFor={`form-${form}`} className="text-sm">{form}</Label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label>{t("consultation.config.medications.form.strengths")}</Label>
                <div className="flex flex-wrap gap-2">
                  {["100mg", "200mg", "250mg", "500mg", "750mg", "1000mg"].map((strength) => (
                    <Button
                      key={strength}
                      type="button"
                      variant={newMedication.strengths.includes(strength) ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleStrengthToggle(strength)}
                    >
                      {strength}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="med-description">{t("consultation.config.medications.form.description")}</Label>
                <Textarea
                  id="med-description"
                  value={newMedication.description}
                  onChange={(e) => setNewMedication({...newMedication, description: e.target.value})}
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="med-indications">{t("consultation.config.medications.form.indications")}</Label>
                <Textarea
                  id="med-indications"
                  value={newMedication.indications}
                  onChange={(e) => setNewMedication({...newMedication, indications: e.target.value})}
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="med-contraindications">{t("consultation.config.medications.form.contraindications")}</Label>
                <Textarea
                  id="med-contraindications"
                  value={newMedication.contraindications}
                  onChange={(e) => setNewMedication({...newMedication, contraindications: e.target.value})}
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="med-sideEffects">{t("consultation.config.medications.form.sideEffects")}</Label>
                <Textarea
                  id="med-sideEffects"
                  value={newMedication.sideEffects}
                  onChange={(e) => setNewMedication({...newMedication, sideEffects: e.target.value})}
                  rows={2}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleAddMedication}>
                {t("consultation.config.medications.addMedication")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-main-200 dark:border-main-800">
        <CardHeader>
          <CardTitle>{t("consultation.config.medications.medicationList.title")}</CardTitle>
          <CardDescription>{t("consultation.config.medications.medicationList.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {medications.map((medication) => (
              <div key={medication.id} className="flex items-start justify-between p-4 border rounded-lg border-main-200 dark:border-main-800">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Pill className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{medication.name}</h4>
                      <Badge variant="outline" className="text-xs">
                        {medication.genericName}
                      </Badge>
                      <Badge variant={getCategoryBadgeVariant(medication.category)}>
                        {medication.category}
                      </Badge>
                      <Badge variant={medication.isActive ? "default" : "secondary"}>
                        {medication.isActive ? t("consultation.config.medications.status.active") : t("consultation.config.medications.status.inactive")}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{medication.description}</p>
                    <div className="flex gap-4 text-xs text-muted-foreground mb-2">
                      <span>{t("consultation.config.medications.details.forms")}: {medication.dosageForms.join(", ")}</span>
                      <span>{t("consultation.config.medications.details.strengths")}: {medication.strengths.join(", ")}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      <p><strong>{t("consultation.config.medications.details.indications")}:</strong> {medication.indications}</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditMedication(medication)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleMedicationStatus(medication.id)}
                  >
                    {medication.isActive ? t("consultation.config.medications.actions.deactivate") : t("consultation.config.medications.actions.activate")}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteMedication(medication.id)}
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

      {/* Edit Medication Dialog would go here - similar structure to add dialog */}
    </div>
  )
}
