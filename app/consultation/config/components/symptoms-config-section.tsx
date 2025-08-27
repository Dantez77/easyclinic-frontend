"use client"

import { useState } from "react"
import { Plus, Trash2, Edit, Activity } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useLanguage } from "@/lib/language-context"

interface Symptom {
  id: string
  name: string
  category: string
  description: string
  bodySystem: string
  severity: "leve" | "moderado" | "grave"
  duration: string
  associatedConditions: string[]
  isActive: boolean
}

// Mock data for symptoms
const mockSymptoms: Symptom[] = [
  {
    id: "1",
    name: "Dolor",
    category: "Sensorial",
    description: "Sensación desagradable que puede variar en intensidad y localización",
    bodySystem: "Sistema Nervioso",
    severity: "moderado",
    duration: "Variable",
    associatedConditions: ["Trauma", "Inflamación", "Infección"],
    isActive: true,
  },
  {
    id: "2",
    name: "Fiebre",
    category: "Sistémico",
    description: "Elevación de la temperatura corporal por encima de lo normal",
    bodySystem: "Sistema Inmune",
    severity: "moderado",
    duration: "Variable",
    associatedConditions: ["Infección", "Inflamación", "Reacción alérgica"],
    isActive: true,
  },
  {
    id: "3",
    name: "Fatiga",
    category: "Sistémico",
    description: "Sensación de cansancio o agotamiento extremo",
    bodySystem: "Sistema Muscular",
    severity: "leve",
    duration: "Crónica",
    associatedConditions: ["Anemia", "Depresión", "Enfermedad crónica"],
    isActive: true,
  },
  {
    id: "4",
    name: "Náuseas",
    category: "Gastrointestinal",
    description: "Sensación de malestar en el estómago con ganas de vomitar",
    bodySystem: "Sistema Digestivo",
    severity: "moderado",
    duration: "Aguda",
    associatedConditions: ["Gastritis", "Migraña", "Embarazo"],
    isActive: true,
  },
  {
    id: "5",
    name: "Dificultad para respirar",
    category: "Respiratorio",
    description: "Sensación de falta de aire o respiración trabajosa",
    bodySystem: "Sistema Respiratorio",
    severity: "grave",
    duration: "Aguda",
    associatedConditions: ["Asma", "Neumonía", "Insuficiencia cardíaca"],
    isActive: true,
  },
]

const symptomCategories = [
  "Sensorial",
  "Sistémico",
  "Gastrointestinal",
  "Respiratorio",
  "Cardiovascular",
  "Neurológico",
  "Musculoesquelético",
  "Dermatológico",
  "Genitourinario",
  "Otros",
]

const bodySystems = [
  "Sistema Nervioso",
  "Sistema Cardiovascular",
  "Sistema Respiratorio",
  "Sistema Digestivo",
  "Sistema Muscular",
  "Sistema Esquelético",
  "Sistema Inmune",
  "Sistema Endocrino",
  "Sistema Genitourinario",
  "Sistema Tegumentario",
]

const severityLevels = [
  { value: "leve", label: "Leve" },
  { value: "moderado", label: "Moderado" },
  { value: "grave", label: "Grave" },
]

const durationOptions = [
  "Aguda",
  "Subaguda",
  "Crónica",
  "Variable",
  "Intermittente",
]

const associatedConditionOptions = [
  "Trauma",
  "Inflamación",
  "Infección",
  "Anemia",
  "Depresión",
  "Enfermedad crónica",
  "Gastritis",
  "Migraña",
  "Embarazo",
  "Asma",
  "Neumonía",
  "Insuficiencia cardíaca",
  "Diabetes",
  "Hipertensión",
  "Artritis",
  "Cáncer",
  "Alergia",
  "Estrés",
  "Ansiedad",
  "Trastorno del sueño",
]

export function SymptomsConfigSection() {
  const { t } = useLanguage()
  const [symptoms, setSymptoms] = useState<Symptom[]>(mockSymptoms)
  const [isAddSymptomOpen, setIsAddSymptomOpen] = useState(false)
  const [isEditSymptomOpen, setIsEditSymptomOpen] = useState(false)
  const [selectedSymptom, setSelectedSymptom] = useState<Symptom | null>(null)
  const [newSymptom, setNewSymptom] = useState({
    name: '',
    category: '',
    description: '',
    bodySystem: '',
    severity: 'leve' as 'leve' | 'moderado' | 'grave',
    duration: '',
    associatedConditions: [] as string[],
  })

  const handleAddSymptom = () => {
    if (newSymptom.name && newSymptom.category) {
      const symptom: Symptom = {
        id: Date.now().toString(),
        ...newSymptom,
        isActive: true,
      }
      setSymptoms([...symptoms, symptom])
      setNewSymptom({
        name: '', category: '', description: '', bodySystem: '', severity: 'leve', duration: '', associatedConditions: []
      })
      setIsAddSymptomOpen(false)
    }
  }

  const handleEditSymptom = (symptom: Symptom) => {
    setSelectedSymptom(symptom)
    setIsEditSymptomOpen(true)
  }

  const handleUpdateSymptom = () => {
    if (selectedSymptom) {
      setSymptoms(symptoms.map(s => s.id === selectedSymptom.id ? selectedSymptom : s))
      setIsEditSymptomOpen(false)
      setSelectedSymptom(null)
    }
  }

  const handleDeleteSymptom = (symptomId: string) => {
    setSymptoms(symptoms.filter(s => s.id !== symptomId))
  }

  const toggleSymptomStatus = (symptomId: string) => {
    setSymptoms(symptoms.map(s => 
      s.id === symptomId ? { ...s, isActive: !s.isActive } : s
    ))
  }

  const handleConditionToggle = (condition: string) => {
    setNewSymptom(prev => ({
      ...prev,
      associatedConditions: prev.associatedConditions.includes(condition)
        ? prev.associatedConditions.filter(c => c !== condition)
        : [...prev.associatedConditions, condition]
    }))
  }

  const getCategoryBadgeVariant = (category: string) => {
    const variants: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
      "Sensorial": "default",
      "Sistémico": "secondary",
      "Gastrointestinal": "outline",
      "Respiratorio": "destructive",
      "Cardiovascular": "destructive",
      "Neurológico": "default",
      "Musculoesquelético": "secondary",
      "Dermatológico": "outline",
      "Genitourinario": "default",
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
          <h2 className="text-2xl font-semibold text-foreground">{t("consultation.config.symptoms.title")}</h2>
          <p className="text-muted-foreground">{t("consultation.config.symptoms.subtitle")}</p>
        </div>
        <Dialog open={isAddSymptomOpen} onOpenChange={setIsAddSymptomOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              {t("consultation.config.symptoms.addSymptom")}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{t("consultation.config.symptoms.addSymptom")}</DialogTitle>
              <DialogDescription>
                {t("consultation.config.symptoms.addSymptomDescription")}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="symptom-name">{t("consultation.config.symptoms.form.name")}</Label>
                  <Input
                    id="symptom-name"
                    value={newSymptom.name}
                    onChange={(e) => setNewSymptom({...newSymptom, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="symptom-category">{t("consultation.config.symptoms.form.category")}</Label>
                  <Select value={newSymptom.category} onValueChange={(value) => setNewSymptom({...newSymptom, category: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder={t("consultation.config.symptoms.form.selectCategory")} />
                    </SelectTrigger>
                    <SelectContent>
                      {symptomCategories.map((category) => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="symptom-bodySystem">{t("consultation.config.symptoms.form.bodySystem")}</Label>
                  <Select value={newSymptom.bodySystem} onValueChange={(value) => setNewSymptom({...newSymptom, bodySystem: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder={t("consultation.config.symptoms.form.selectBodySystem")} />
                    </SelectTrigger>
                    <SelectContent>
                      {bodySystems.map((system) => (
                        <SelectItem key={system} value={system}>{system}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="symptom-severity">{t("consultation.config.symptoms.form.severity")}</Label>
                  <Select value={newSymptom.severity} onValueChange={(value: 'leve' | 'moderado' | 'grave') => setNewSymptom({...newSymptom, severity: value})}>
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
                <Label htmlFor="symptom-duration">{t("consultation.config.symptoms.form.duration")}</Label>
                <Select value={newSymptom.duration} onValueChange={(value) => setNewSymptom({...newSymptom, duration: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("consultation.config.symptoms.form.selectDuration")} />
                  </SelectTrigger>
                  <SelectContent>
                    {durationOptions.map((duration) => (
                      <SelectItem key={duration} value={duration}>{duration}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="symptom-description">{t("consultation.config.symptoms.form.description")}</Label>
                <Textarea
                  id="symptom-description"
                  value={newSymptom.description}
                  onChange={(e) => setNewSymptom({...newSymptom, description: e.target.value})}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>{t("consultation.config.symptoms.form.associatedConditions")}</Label>
                <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto border rounded-md p-3">
                  {associatedConditionOptions.map((condition) => (
                    <div key={condition} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`condition-${condition}`}
                        checked={newSymptom.associatedConditions.includes(condition)}
                        onChange={() => handleConditionToggle(condition)}
                        className="rounded border-gray-300"
                      />
                      <Label htmlFor={`condition-${condition}`} className="text-sm">{condition}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleAddSymptom}>
                {t("consultation.config.symptoms.addSymptom")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-main-200 dark:border-main-800">
        <CardHeader>
          <CardTitle>{t("consultation.config.symptoms.symptomList.title")}</CardTitle>
          <CardDescription>{t("consultation.config.symptoms.symptomList.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {symptoms.map((symptom) => (
              <div key={symptom.id} className="flex items-start justify-between p-4 border rounded-lg border-main-200 dark:border-main-800">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Activity className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{symptom.name}</h4>
                      <Badge variant={getCategoryBadgeVariant(symptom.category)}>
                        {symptom.category}
                      </Badge>
                      <Badge variant={getSeverityBadgeVariant(symptom.severity)}>
                        {symptom.severity}
                      </Badge>
                      <Badge variant={symptom.isActive ? "default" : "secondary"}>
                        {symptom.isActive ? t("consultation.config.symptoms.status.active") : t("consultation.config.symptoms.status.inactive")}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{symptom.description}</p>
                    <div className="flex gap-4 text-xs text-muted-foreground mb-2">
                      <span>{t("consultation.config.symptoms.details.bodySystem")}: {symptom.bodySystem}</span>
                      <span>{t("consultation.config.symptoms.details.duration")}: {symptom.duration}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      <p><strong>{t("consultation.config.symptoms.details.associatedConditions")}:</strong> {symptom.associatedConditions.join(", ")}</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditSymptom(symptom)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleSymptomStatus(symptom.id)}
                  >
                    {symptom.isActive ? t("consultation.config.symptoms.actions.deactivate") : t("consultation.config.symptoms.actions.activate")}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteSymptom(symptom.id)}
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

      {/* Edit Symptom Dialog would go here - similar structure to add dialog */}
    </div>
  )
}
