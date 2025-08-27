"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Wrench, Plus, Edit2, Trash2, Check, X } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Simple data structure matching consultation-data.ts
type SimpleList = {
  id: string
  name: string
  isActive: boolean
}

export default function ToolsPage() {
  const { t } = useLanguage()

  // Simple state for each list
  const [complaints, setComplaints] = useState<SimpleList[]>([
    { id: "1", name: "Dolor de cabeza", isActive: true },
    { id: "2", name: "Fiebre", isActive: true },
    { id: "3", name: "Dolor abdominal", isActive: true },
    { id: "4", name: "Fatiga", isActive: true },
    { id: "5", name: "Tos", isActive: true },
  ])

  const [symptoms, setSymptoms] = useState<SimpleList[]>([
    { id: "1", name: "Dolor", isActive: true },
    { id: "2", name: "Fiebre", isActive: true },
    { id: "3", name: "Fatiga", isActive: true },
    { id: "4", name: "Náuseas", isActive: true },
    { id: "5", name: "Vómitos", isActive: true },
  ])

  const [medications, setMedications] = useState<SimpleList[]>([
    { id: "1", name: "Acetaminofén", isActive: true },
    { id: "2", name: "Ibuprofeno", isActive: true },
    { id: "3", name: "Aspirina", isActive: true },
    { id: "4", name: "Losartán", isActive: true },
    { id: "5", name: "Metformina", isActive: true },
  ])

  const [labTests, setLabTests] = useState<SimpleList[]>([
    { id: "1", name: "Hemograma completo", isActive: true },
    { id: "2", name: "Química sanguínea", isActive: true },
    { id: "3", name: "Glucosa en ayunas", isActive: true },
    { id: "4", name: "Hemoglobina A1c", isActive: true },
    { id: "5", name: "Perfil lipídico", isActive: true },
  ])

  // Simple functions to manage lists
  const addItem = (list: SimpleList[], setList: (list: SimpleList[]) => void, name: string) => {
    if (name.trim()) {
      const newItem: SimpleList = {
        id: Date.now().toString(),
        name: name.trim(),
        isActive: true
      }
      setList([...list, newItem])
    }
  }

  const toggleItem = (list: SimpleList[], setList: (list: SimpleList[]) => void, id: string) => {
    setList(list.map(item => 
      item.id === id ? { ...item, isActive: !item.isActive } : item
    ))
  }

  const deleteItem = (list: SimpleList[], setList: (list: SimpleList[]) => void, id: string) => {
    setList(list.filter(item => item.id !== id))
  }

  const SimpleListSection = ({ 
    title, 
    items, 
    setItems, 
    placeholder 
  }: { 
    title: string
    items: SimpleList[]
    setItems: (items: SimpleList[]) => void
    placeholder: string
  }) => {
    const [newItem, setNewItem] = useState("")

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            {title}
            <div className="flex gap-2">
              <Input
                placeholder={placeholder}
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                className="w-48"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    addItem(items, setItems, newItem)
                    setNewItem("")
                  }
                }}
              />
              <Button 
                size="sm" 
                onClick={() => {
                  addItem(items, setItems, newItem)
                  setNewItem("")
                }}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {items.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-2 border rounded-lg">
                <span className={item.isActive ? "" : "line-through text-muted-foreground"}>
                  {item.name}
                </span>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant={item.isActive ? "outline" : "default"}
                    onClick={() => toggleItem(items, setItems, item.id)}
                  >
                    {item.isActive ? <X className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteItem(items, setItems, item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            {items.length === 0 && (
              <p className="text-center text-muted-foreground py-4">
                No items yet. Add some using the input above.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-main-200 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:border-main-800">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Wrench className="h-6 w-6 text-primary dark:text-main-400" />
            <div>
              <h1 className="text-xl font-semibold text-foreground">{t("tools.title")}</h1>
              <p className="text-sm text-muted-foreground">{t("tools.subtitle")}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <Tabs defaultValue="complaints" className="h-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
            <TabsTrigger value="complaints">Quejas Comunes</TabsTrigger>
            <TabsTrigger value="symptoms">Síntomas</TabsTrigger>
            <TabsTrigger value="medications">Medicamentos</TabsTrigger>
            <TabsTrigger value="labTests">Pruebas de Laboratorio</TabsTrigger>
          </TabsList>

          <TabsContent value="complaints" className="mt-6">
            <SimpleListSection
              title="Quejas Comunes"
              items={complaints}
              setItems={setComplaints}
              placeholder="Agregar queja común..."
            />
          </TabsContent>

          <TabsContent value="symptoms" className="mt-6">
            <SimpleListSection
              title="Síntomas"
              items={symptoms}
              setItems={setSymptoms}
              placeholder="Agregar síntoma..."
            />
          </TabsContent>

          <TabsContent value="medications" className="mt-6">
            <SimpleListSection
              title="Medicamentos"
              items={medications}
              setItems={setMedications}
              placeholder="Agregar medicamento..."
            />
          </TabsContent>

          <TabsContent value="labTests" className="mt-6">
            <SimpleListSection
              title="Pruebas de Laboratorio"
              items={labTests}
              setItems={setLabTests}
              placeholder="Agregar prueba..."
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
