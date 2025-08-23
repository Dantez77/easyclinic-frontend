"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import {
  FileText,
  Download,
  Printer,
  User,
  Heart,
  Activity,
  TestTube,
  Stethoscope,
  Pill,
  Phone,
  Mail,
  MapPin,
  Shield,
  AlertTriangle,
  TrendingUp,
  FileDown,
  Eye,
} from "lucide-react"

// Mock comprehensive patient data
const mockPatientEHR = {
  // Basic Information
  id: "EXP-2024-001234",
  firstName: "María Elena",
  lastName: "González",
  cedula: "001-1234567-8",
  dateOfBirth: "1985-03-15",
  age: 38,
  gender: "Femenino",
  bloodType: "O+",
  maritalStatus: "Casada",
  occupation: "Contadora",

  // Contact Information
  phone: "809-555-0123",
  email: "maria.gonzalez@email.com",
  address: "Calle Principal #123, Los Alcarrizos",
  city: "Santo Domingo",
  province: "Distrito Nacional",
  postalCode: "10101",

  // Emergency Contact
  emergencyContact: {
    name: "Carlos González",
    relationship: "Esposo",
    phone: "809-555-0124",
    email: "carlos.gonzalez@email.com",
  },

  // Insurance Information
  insurance: {
    provider: "ARS Humano",
    policyNumber: "AH-123456789",
    groupNumber: "GRP-001",
    effectiveDate: "2020-01-01",
    expirationDate: "2024-12-31",
  },

  // Medical Information
  allergies: [
    { substance: "Penicilina", severity: "Severa", reaction: "Erupción cutánea", dateIdentified: "2010-05-15" },
    { substance: "Mariscos", severity: "Moderada", reaction: "Hinchazón", dateIdentified: "2015-08-20" },
  ],

  chronicConditions: [
    { condition: "Hipertensión", diagnosisDate: "2020-03-10", status: "Controlada", notes: "Medicación diaria" },
    { condition: "Migraña", diagnosisDate: "2018-07-22", status: "Activa", notes: "Episodios ocasionales" },
  ],

  currentMedications: [
    {
      medication: "Losartán 50mg",
      dosage: "1 tableta",
      frequency: "Cada 24 horas",
      startDate: "2020-03-10",
      prescribedBy: "Dr. Juan Pérez",
      indication: "Hipertensión",
    },
    {
      medication: "Sumatriptán 50mg",
      dosage: "1 tableta",
      frequency: "Según necesidad",
      startDate: "2018-07-22",
      prescribedBy: "Dr. Ana López",
      indication: "Migraña",
    },
  ],

  // Vital Signs History
  vitalSigns: [
    {
      date: "2024-11-15",
      temperature: "36.5°C",
      bloodPressure: "125/80",
      heartRate: "72 bpm",
      respiratoryRate: "16 rpm",
      oxygenSaturation: "98%",
      weight: "65 kg",
      height: "165 cm",
      bmi: "23.9",
    },
    {
      date: "2024-10-20",
      temperature: "36.8°C",
      bloodPressure: "120/78",
      heartRate: "68 bpm",
      respiratoryRate: "15 rpm",
      oxygenSaturation: "99%",
      weight: "64.5 kg",
      height: "165 cm",
      bmi: "23.7",
    },
    {
      date: "2024-09-15",
      temperature: "36.6°C",
      bloodPressure: "128/82",
      heartRate: "75 bpm",
      respiratoryRate: "16 rpm",
      oxygenSaturation: "98%",
      weight: "65.2 kg",
      height: "165 cm",
      bmi: "24.0",
    },
  ],

  // Medical History
  consultations: [
    {
      id: "CONS-001",
      date: "2024-11-15",
      doctor: "Dr. Juan Pérez",
      specialty: "Medicina General",
      reason: "Dolor de cabeza persistente",
      symptoms: ["Cefalea", "Fotofobia", "Náuseas"],
      diagnosis: "Cefalea tensional",
      treatment: "Acetaminofén 500mg c/8h x 5 días",
      notes: "Paciente refiere mejoría con analgésicos. Recomendar descanso y manejo del estrés.",
      followUp: "2024-12-15",
      status: "Completada",
    },
    {
      id: "CONS-002",
      date: "2024-10-20",
      doctor: "Dr. Ana López",
      specialty: "Medicina Interna",
      reason: "Chequeo de rutina",
      symptoms: [],
      diagnosis: "Paciente sana",
      treatment: "Continuar con estilo de vida saludable",
      notes: "Todos los parámetros dentro de rangos normales. Continuar medicación para hipertensión.",
      followUp: "2025-04-20",
      status: "Completada",
    },
  ],

  // Procedures
  procedures: [
    {
      id: "PROC-001",
      date: "2024-10-25",
      procedure: "Electrocardiograma",
      doctor: "Dr. Carlos Martínez",
      specialty: "Cardiología",
      indication: "Evaluación cardiovascular rutinaria",
      results: "Ritmo sinusal normal, sin alteraciones significativas",
      notes: "ECG dentro de parámetros normales para la edad",
      status: "Completado",
    },
  ],

  // Laboratory Tests
  labTests: [
    {
      id: "LAB-001",
      date: "2024-11-10",
      test: "Hemograma completo",
      orderedBy: "Dr. Ana López",
      results: "Valores normales",
      status: "Completado",
      values: {
        Hemoglobina: { value: "13.5", unit: "g/dL", reference: "12.0-15.5", status: "Normal" },
        Hematocrito: { value: "40.2", unit: "%", reference: "36-46", status: "Normal" },
        Leucocitos: { value: "7200", unit: "/μL", reference: "4500-11000", status: "Normal" },
        Plaquetas: { value: "280000", unit: "/μL", reference: "150000-450000", status: "Normal" },
      },
    },
    {
      id: "LAB-002",
      date: "2024-09-20",
      test: "Química sanguínea",
      orderedBy: "Dr. Juan Pérez",
      results: "Glucosa ligeramente elevada",
      status: "Completado",
      values: {
        Glucosa: { value: "110", unit: "mg/dL", reference: "70-100", status: "Elevado" },
        Creatinina: { value: "0.9", unit: "mg/dL", reference: "0.6-1.2", status: "Normal" },
        "Colesterol Total": { value: "180", unit: "mg/dL", reference: "<200", status: "Normal" },
        Triglicéridos: { value: "150", unit: "mg/dL", reference: "<150", status: "Límite" },
      },
    },
  ],

  // Imaging Studies
  imagingStudies: [
    {
      id: "IMG-001",
      date: "2024-08-15",
      study: "Radiografía de Tórax",
      indication: "Evaluación pulmonar rutinaria",
      radiologist: "Dr. Patricia Ruiz",
      findings: "Campos pulmonares libres, silueta cardíaca normal",
      impression: "Estudio normal",
      status: "Completado",
    },
  ],

  // Immunizations
  immunizations: [
    {
      vaccine: "COVID-19 (Pfizer)",
      date: "2024-01-15",
      dose: "Refuerzo",
      administeredBy: "Enfermera Carmen Díaz",
      lotNumber: "PF123456",
      site: "Brazo izquierdo",
    },
    {
      vaccine: "Influenza",
      date: "2023-10-20",
      dose: "Anual",
      administeredBy: "Enfermera María Santos",
      lotNumber: "FLU789012",
      site: "Brazo derecho",
    },
  ],

  // Documents
  documents: [
    {
      id: "DOC-001",
      date: "2024-11-15",
      name: "Receta_Cefalea_15Nov2024.pdf",
      type: "Receta",
      size: "245 KB",
      uploadedBy: "Dr. Juan Pérez",
    },
    {
      id: "DOC-002",
      date: "2024-10-25",
      name: "ECG_25Oct2024.pdf",
      type: "Estudio",
      size: "1.2 MB",
      uploadedBy: "Dr. Carlos Martínez",
    },
  ],

  // Social History
  socialHistory: {
    smoking: { status: "Nunca fumó", quitDate: null, packsPerDay: 0 },
    alcohol: { status: "Ocasional", frequency: "1-2 copas por semana" },
    drugs: { status: "Nunca", substances: [] },
    exercise: { frequency: "3 veces por semana", type: "Caminata y yoga" },
    diet: { type: "Balanceada", restrictions: "Ninguna" },
  },

  // Family History
  familyHistory: [
    { relation: "Madre", condition: "Diabetes Tipo 2", ageOfOnset: 55, status: "Viva" },
    { relation: "Padre", condition: "Hipertensión", ageOfOnset: 48, status: "Vivo" },
    { relation: "Abuela materna", condition: "Enfermedad cardíaca", ageOfOnset: 70, status: "Fallecida" },
  ],
}

export default function PatientEHRPage({ params }: { params: { patientId: string } }) {
  const [activeTab, setActiveTab] = useState("overview")
  const printRef = useRef<HTMLDivElement>(null)

  const handlePrint = () => {
    window.print()
  }

  const handleExportPDF = () => {
    // In a real application, you would use a library like jsPDF or Puppeteer
    // For this demo, we'll simulate the PDF export
    alert("Exportando EHR a PDF... (Funcionalidad simulada)")
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "normal":
        return "default"
      case "elevado":
      case "alto":
        return "destructive"
      case "bajo":
        return "secondary"
      case "límite":
        return "outline"
      default:
        return "outline"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-main-200 dark:border-main-800 p-4 lg:p-6 print:hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-xl lg:text-2xl font-bold text-foreground">Expediente Médico Electrónico</h1>
                <p className="text-sm lg:text-base text-muted-foreground">
                  {mockPatientEHR.firstName} {mockPatientEHR.lastName} - {mockPatientEHR.id}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handlePrint} variant="outline" className="bg-transparent">
                <Printer className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Imprimir</span>
              </Button>
              <Button onClick={handleExportPDF} variant="outline" className="bg-transparent">
                <Download className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Exportar </span>PDF
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Print Header - Only visible when printing */}
      <div className="hidden print:block p-6 border-b">
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold">EXPEDIENTE MÉDICO ELECTRÓNICO</h1>
          <p className="text-muted-foreground">Centro Médico - Sistema de Salud</p>
        </div>
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold">
              {mockPatientEHR.firstName} {mockPatientEHR.lastName}
            </h2>
            <p>ID: {mockPatientEHR.id}</p>
          </div>
          <div className="text-right">
            <p>Fecha de impresión: {format(new Date(), "dd/MM/yyyy HH:mm", { locale: es })}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-4 lg:p-6" ref={printRef}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6 print:hidden">
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="medical">Médico</TabsTrigger>
            <TabsTrigger value="tests">Exámenes</TabsTrigger>
            <TabsTrigger value="medications">Medicamentos</TabsTrigger>
            <TabsTrigger value="history">Historial</TabsTrigger>
            <TabsTrigger value="documents">Documentos</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Patient Demographics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Información del Paciente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">Datos Personales</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Nombre Completo:</span>
                        <span className="font-medium">
                          {mockPatientEHR.firstName} {mockPatientEHR.lastName}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Cédula:</span>
                        <span>{mockPatientEHR.cedula}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Fecha de Nacimiento:</span>
                        <span>{format(new Date(mockPatientEHR.dateOfBirth), "dd/MM/yyyy", { locale: es })}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Edad:</span>
                        <span>{mockPatientEHR.age} años</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Género:</span>
                        <span>{mockPatientEHR.gender}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Estado Civil:</span>
                        <span>{mockPatientEHR.maritalStatus}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Ocupación:</span>
                        <span>{mockPatientEHR.occupation}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tipo de Sangre:</span>
                        <Badge variant="outline">{mockPatientEHR.bloodType}</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">Información de Contacto</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span>{mockPatientEHR.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span>{mockPatientEHR.email}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                        <div>
                          <div>{mockPatientEHR.address}</div>
                          <div className="text-muted-foreground">
                            {mockPatientEHR.city}, {mockPatientEHR.province}
                          </div>
                          <div className="text-muted-foreground">{mockPatientEHR.postalCode}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">Contacto de Emergencia</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Nombre:</span>
                        <span className="font-medium">{mockPatientEHR.emergencyContact.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Parentesco:</span>
                        <span>{mockPatientEHR.emergencyContact.relationship}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span>{mockPatientEHR.emergencyContact.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span>{mockPatientEHR.emergencyContact.email}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Insurance Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Información del Seguro
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Proveedor:</span>
                      <span className="font-medium">{mockPatientEHR.insurance.provider}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Número de Póliza:</span>
                      <span>{mockPatientEHR.insurance.policyNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Número de Grupo:</span>
                      <span>{mockPatientEHR.insurance.groupNumber}</span>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Fecha de Vigencia:</span>
                      <span>
                        {format(new Date(mockPatientEHR.insurance.effectiveDate), "dd/MM/yyyy", { locale: es })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Fecha de Vencimiento:</span>
                      <span>
                        {format(new Date(mockPatientEHR.insurance.expirationDate), "dd/MM/yyyy", { locale: es })}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Current Vital Signs */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Signos Vitales Actuales
                </CardTitle>
              </CardHeader>
              <CardContent>
                {mockPatientEHR.vitalSigns.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                    {Object.entries(mockPatientEHR.vitalSigns[0])
                      .filter(([key]) => key !== "date")
                      .map(([key, value]) => (
                        <div key={key} className="text-center p-3 bg-muted rounded-lg">
                          <div className="text-xs text-muted-foreground mb-1 capitalize">
                            {key.replace(/([A-Z])/g, " $1").trim()}
                          </div>
                          <div className="font-semibold text-foreground">{value}</div>
                        </div>
                      ))}
                  </div>
                )}
                <div className="mt-4 text-xs text-muted-foreground">
                  Última actualización:{" "}
                  {format(new Date(mockPatientEHR.vitalSigns[0].date), "dd/MM/yyyy", { locale: es })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Medical Tab */}
          <TabsContent value="medical" className="space-y-6">
            {/* Allergies */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Alergias
                </CardTitle>
              </CardHeader>
              <CardContent>
                {mockPatientEHR.allergies.length > 0 ? (
                  <div className="space-y-4">
                    {mockPatientEHR.allergies.map((allergy, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium text-foreground">{allergy.substance}</h4>
                            <p className="text-sm text-muted-foreground">Reacción: {allergy.reaction}</p>
                            <p className="text-xs text-muted-foreground">
                              Identificada: {format(new Date(allergy.dateIdentified), "dd/MM/yyyy", { locale: es })}
                            </p>
                          </div>
                          <Badge variant={allergy.severity === "Severa" ? "destructive" : "secondary"}>
                            {allergy.severity}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">Sin alergias conocidas</p>
                )}
              </CardContent>
            </Card>

            {/* Chronic Conditions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  Condiciones Crónicas
                </CardTitle>
              </CardHeader>
              <CardContent>
                {mockPatientEHR.chronicConditions.length > 0 ? (
                  <div className="space-y-4">
                    {mockPatientEHR.chronicConditions.map((condition, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium text-foreground">{condition.condition}</h4>
                            <p className="text-sm text-muted-foreground">{condition.notes}</p>
                            <p className="text-xs text-muted-foreground">
                              Diagnosticada: {format(new Date(condition.diagnosisDate), "dd/MM/yyyy", { locale: es })}
                            </p>
                          </div>
                          <Badge variant={condition.status === "Controlada" ? "default" : "secondary"}>
                            {condition.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">Sin condiciones crónicas registradas</p>
                )}
              </CardContent>
            </Card>

            {/* Social History */}
            <Card>
              <CardHeader>
                <CardTitle>Historia Social</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-foreground mb-2">Hábitos</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Tabaquismo:</span>
                          <span>{mockPatientEHR.socialHistory.smoking.status}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Alcohol:</span>
                          <span>{mockPatientEHR.socialHistory.alcohol.status}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Drogas:</span>
                          <span>{mockPatientEHR.socialHistory.drugs.status}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-foreground mb-2">Estilo de Vida</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Ejercicio:</span>
                          <span>{mockPatientEHR.socialHistory.exercise.frequency}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Tipo:</span>
                          <span>{mockPatientEHR.socialHistory.exercise.type}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Dieta:</span>
                          <span>{mockPatientEHR.socialHistory.diet.type}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Family History */}
            <Card>
              <CardHeader>
                <CardTitle>Historia Familiar</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockPatientEHR.familyHistory.map((family, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div>
                        <span className="font-medium">{family.relation}</span>
                        <span className="text-muted-foreground ml-2">- {family.condition}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Edad de inicio: {family.ageOfOnset} años ({family.status})
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tests Tab */}
          <TabsContent value="tests" className="space-y-6">
            {/* Laboratory Tests */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TestTube className="w-5 h-5" />
                  Exámenes de Laboratorio
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {mockPatientEHR.labTests.map((lab) => (
                    <div key={lab.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="font-medium text-foreground">{lab.test}</h4>
                          <p className="text-sm text-muted-foreground">Ordenado por: Dr. {lab.orderedBy}</p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(lab.date), "dd/MM/yyyy", { locale: es })}
                          </p>
                        </div>
                        <Badge variant="outline">{lab.status}</Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Object.entries(lab.values).map(([test, data]) => (
                          <div key={test} className="p-3 bg-muted rounded-lg">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium">{test}</span>
                              <Badge variant={getStatusColor(data.status)} className="text-xs">
                                {data.status}
                              </Badge>
                            </div>
                            <div className="text-lg font-semibold">
                              {data.value} {data.unit}
                            </div>
                            <div className="text-xs text-muted-foreground">Ref: {data.reference}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Vital Signs Trends */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Tendencias de Signos Vitales
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Fecha</th>
                        <th className="text-left p-2">Temperatura</th>
                        <th className="text-left p-2">Presión Arterial</th>
                        <th className="text-left p-2">Frecuencia Cardíaca</th>
                        <th className="text-left p-2">Peso</th>
                        <th className="text-left p-2">IMC</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockPatientEHR.vitalSigns.map((vital, index) => (
                        <tr key={index} className="border-b">
                          <td className="p-2">{format(new Date(vital.date), "dd/MM/yyyy", { locale: es })}</td>
                          <td className="p-2">{vital.temperature}</td>
                          <td className="p-2">{vital.bloodPressure}</td>
                          <td className="p-2">{vital.heartRate}</td>
                          <td className="p-2">{vital.weight}</td>
                          <td className="p-2">{vital.bmi}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Medications Tab */}
          <TabsContent value="medications" className="space-y-6">
            {/* Current Medications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Pill className="w-5 h-5" />
                  Medicamentos Actuales
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockPatientEHR.currentMedications.map((medication, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-medium text-foreground">{medication.medication}</h4>
                          <p className="text-sm text-muted-foreground">
                            {medication.dosage} - {medication.frequency}
                          </p>
                        </div>
                        <Badge variant="default">Activo</Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Indicación:</span>
                          <p className="font-medium">{medication.indication}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Prescrito por:</span>
                          <p className="font-medium">{medication.prescribedBy}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Fecha de inicio:</span>
                          <p className="font-medium">
                            {format(new Date(medication.startDate), "dd/MM/yyyy", { locale: es })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-6">
            {/* Consultations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Stethoscope className="w-5 h-5" />
                  Historial de Consultas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {mockPatientEHR.consultations.map((consultation) => (
                    <div key={consultation.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="font-medium text-foreground">{consultation.reason}</h4>
                          <p className="text-sm text-muted-foreground">
                            Dr. {consultation.doctor} - {consultation.specialty}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(consultation.date), "dd/MM/yyyy", { locale: es })}
                          </p>
                        </div>
                        <Badge variant="outline">{consultation.status}</Badge>
                      </div>

                      <div className="space-y-3">
                        {consultation.symptoms.length > 0 && (
                          <div>
                            <span className="text-sm font-medium text-foreground">Síntomas:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {consultation.symptoms.map((symptom, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {symptom}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        <div>
                          <span className="text-sm font-medium text-foreground">Diagnóstico:</span>
                          <p className="text-sm text-muted-foreground">{consultation.diagnosis}</p>
                        </div>

                        <div>
                          <span className="text-sm font-medium text-foreground">Tratamiento:</span>
                          <p className="text-sm text-muted-foreground">{consultation.treatment}</p>
                        </div>

                        <div>
                          <span className="text-sm font-medium text-foreground">Notas:</span>
                          <p className="text-sm text-muted-foreground">{consultation.notes}</p>
                        </div>

                        {consultation.followUp && (
                          <div>
                            <span className="text-sm font-medium text-foreground">Próximo seguimiento:</span>
                            <p className="text-sm text-muted-foreground">
                              {format(new Date(consultation.followUp), "dd/MM/yyyy", { locale: es })}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Documentos Adjuntos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockPatientEHR.documents.map((document) => (
                    <div key={document.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                            <FileText className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-medium text-foreground">{document.name}</h4>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Badge variant="secondary" className="text-xs">
                                {document.type}
                              </Badge>
                              <span>{document.size}</span>
                              <span>•</span>
                              <span>{format(new Date(document.date), "dd/MM/yyyy", { locale: es })}</span>
                            </div>
                            <p className="text-sm text-muted-foreground">Subido por: {document.uploadedBy}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <FileDown className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
