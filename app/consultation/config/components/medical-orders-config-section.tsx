"use client"

import { useState } from "react"
import { Plus, Trash2, Edit, TestTube } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useLanguage } from "@/lib/language-context"

interface LabTest {
  id: string
  name: string
  category: string
  description: string
  preparation: string
  turnaroundTime: string
  cost: string
  isActive: boolean
}

// Mock data for medical orders
const mockLabTests: LabTest[] = [
  {
    id: "1",
    name: "Hemograma completo",
    category: "Hematología",
    description: "Análisis completo de células sanguíneas",
    preparation: "Ayuno de 8-12 horas",
    turnaroundTime: "24-48 horas",
    cost: "$25.00",
    isActive: true,
  },
  {
    id: "2",
    name: "Química sanguínea",
    category: "Bioquímica",
    description: "Perfil metabólico completo",
    preparation: "Ayuno de 8-12 horas",
    turnaroundTime: "24-48 horas",
    cost: "$35.00",
    isActive: true,
  },
  {
    id: "3",
    name: "Glucosa en ayunas",
    category: "Bioquímica",
    description: "Nivel de glucosa en sangre",
    preparation: "Ayuno de 8-12 horas",
    turnaroundTime: "2-4 horas",
    cost: "$15.00",
    isActive: true,
  },
  {
    id: "4",
    name: "Radiografía de tórax",
    category: "Imagenología",
    description: "Imagen del tórax en dos proyecciones",
    preparation: "Sin preparación especial",
    turnaroundTime: "1-2 horas",
    cost: "$45.00",
    isActive: true,
  },
]

const testCategories = [
  "Hematología",
  "Bioquímica",
  "Inmunología",
  "Microbiología",
  "Imagenología",
  "Cardiología",
  "Neurología",
  "Otros",
]

export function MedicalOrdersConfigSection() {
  const { t } = useLanguage()
  const [labTests, setLabTests] = useState<LabTest[]>(mockLabTests)
  const [isAddTestOpen, setIsAddTestOpen] = useState(false)
  const [isEditTestOpen, setIsEditTestOpen] = useState(false)
  const [selectedTest, setSelectedTest] = useState<LabTest | null>(null)
  const [newTest, setNewTest] = useState({
    name: '',
    category: '',
    description: '',
    preparation: '',
    turnaroundTime: '',
    cost: '',
  })

  const handleAddTest = () => {
    if (newTest.name && newTest.category) {
      const test: LabTest = {
        id: Date.now().toString(),
        ...newTest,
        isActive: true,
      }
      setLabTests([...labTests, test])
      setNewTest({ name: '', category: '', description: '', preparation: '', turnaroundTime: '', cost: '' })
      setIsAddTestOpen(false)
    }
  }

  const handleEditTest = (test: LabTest) => {
    setSelectedTest(test)
    setIsEditTestOpen(true)
  }

  const handleUpdateTest = () => {
    if (selectedTest) {
      setLabTests(labTests.map(t => t.id === selectedTest.id ? selectedTest : t))
      setIsEditTestOpen(false)
      setSelectedTest(null)
    }
  }

  const handleDeleteTest = (testId: string) => {
    setLabTests(labTests.filter(t => t.id !== testId))
  }

  const toggleTestStatus = (testId: string) => {
    setLabTests(labTests.map(t => 
      t.id === testId ? { ...t, isActive: !t.isActive } : t
    ))
  }

  const getCategoryBadgeVariant = (category: string) => {
    const variants: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
      "Hematología": "default",
      "Bioquímica": "secondary",
      "Inmunología": "outline",
      "Microbiología": "destructive",
      "Imagenología": "default",
      "Cardiología": "secondary",
      "Neurología": "outline",
      "Otros": "outline",
    }
    return variants[category] || "outline"
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">{t("consultation.config.medicalOrders.title")}</h2>
          <p className="text-muted-foreground">{t("consultation.config.medicalOrders.subtitle")}</p>
        </div>
        <Dialog open={isAddTestOpen} onOpenChange={setIsAddTestOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              {t("consultation.config.medicalOrders.addTest")}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{t("consultation.config.medicalOrders.addTest")}</DialogTitle>
              <DialogDescription>
                {t("consultation.config.medicalOrders.addTestDescription")}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="test-name">{t("consultation.config.medicalOrders.form.name")}</Label>
                  <Input
                    id="test-name"
                    value={newTest.name}
                    onChange={(e) => setNewTest({...newTest, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="test-category">{t("consultation.config.medicalOrders.form.category")}</Label>
                  <Select value={newTest.category} onValueChange={(value) => setNewTest({...newTest, category: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder={t("consultation.config.medicalOrders.form.selectCategory")} />
                    </SelectTrigger>
                    <SelectContent>
                      {testCategories.map((category) => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="test-description">{t("consultation.config.medicalOrders.form.description")}</Label>
                <Textarea
                  id="test-description"
                  value={newTest.description}
                  onChange={(e) => setNewTest({...newTest, description: e.target.value})}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="test-preparation">{t("consultation.config.medicalOrders.form.preparation")}</Label>
                  <Input
                    id="test-preparation"
                    value={newTest.preparation}
                    onChange={(e) => setNewTest({...newTest, preparation: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="test-turnaround">{t("consultation.config.medicalOrders.form.turnaroundTime")}</Label>
                  <Input
                    id="test-turnaround"
                    value={newTest.turnaroundTime}
                    onChange={(e) => setNewTest({...newTest, turnaroundTime: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="test-cost">{t("consultation.config.medicalOrders.form.cost")}</Label>
                  <Input
                    id="test-cost"
                    value={newTest.cost}
                    onChange={(e) => setNewTest({...newTest, cost: e.target.value})}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleAddTest}>
                {t("consultation.config.medicalOrders.addTest")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-main-200 dark:border-main-800">
        <CardHeader>
          <CardTitle>{t("consultation.config.medicalOrders.testList.title")}</CardTitle>
          <CardDescription>{t("consultation.config.medicalOrders.testList.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {labTests.map((test) => (
              <div key={test.id} className="flex items-center justify-between p-4 border rounded-lg border-main-200 dark:border-main-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <TestTube className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{test.name}</h4>
                      <Badge variant={getCategoryBadgeVariant(test.category)}>
                        {test.category}
                      </Badge>
                      <Badge variant={test.isActive ? "default" : "secondary"}>
                        {test.isActive ? t("consultation.config.medicalOrders.status.active") : t("consultation.config.medicalOrders.status.inactive")}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{test.description}</p>
                    <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                      <span>{t("consultation.config.medicalOrders.details.preparation")}: {test.preparation}</span>
                      <span>{t("consultation.config.medicalOrders.details.turnaround")}: {test.turnaroundTime}</span>
                      <span>{t("consultation.config.medicalOrders.details.cost")}: {test.cost}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditTest(test)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleTestStatus(test.id)}
                  >
                    {test.isActive ? t("consultation.config.medicalOrders.actions.deactivate") : t("consultation.config.medicalOrders.actions.activate")}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteTest(test.id)}
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

      {/* Edit Test Dialog */}
      <Dialog open={isEditTestOpen} onOpenChange={setIsEditTestOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{t("consultation.config.medicalOrders.editTest.title")}</DialogTitle>
            <DialogDescription>
              {t("consultation.config.medicalOrders.editTest.description")}
            </DialogDescription>
          </DialogHeader>
          {selectedTest && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-test-name">{t("consultation.config.medicalOrders.form.name")}</Label>
                  <Input
                    id="edit-test-name"
                    value={selectedTest.name}
                    onChange={(e) => setSelectedTest({...selectedTest, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-test-category">{t("consultation.config.medicalOrders.form.category")}</Label>
                  <Select value={selectedTest.category} onValueChange={(value) => setSelectedTest({...selectedTest, category: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {testCategories.map((category) => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-test-description">{t("consultation.config.medicalOrders.form.description")}</Label>
                <Textarea
                  id="edit-test-description"
                  value={selectedTest.description}
                  onChange={(e) => setSelectedTest({...selectedTest, description: e.target.value})}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-test-preparation">{t("consultation.config.medicalOrders.form.preparation")}</Label>
                  <Input
                    id="edit-test-preparation"
                    value={selectedTest.preparation}
                    onChange={(e) => setSelectedTest({...selectedTest, preparation: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-test-turnaround">{t("consultation.config.medicalOrders.form.turnaroundTime")}</Label>
                  <Input
                    id="edit-test-turnaround"
                    value={selectedTest.turnaroundTime}
                    onChange={(e) => setSelectedTest({...selectedTest, turnaroundTime: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-test-cost">{t("consultation.config.medicalOrders.form.cost")}</Label>
                  <Input
                    id="edit-test-cost"
                    value={selectedTest.cost}
                    onChange={(e) => setSelectedTest({...selectedTest, cost: e.target.value})}
                  />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button type="submit" onClick={handleUpdateTest}>
              {t("consultation.config.medicalOrders.editTest.save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
