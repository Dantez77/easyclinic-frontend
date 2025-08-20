"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  User,
  Calendar,
  Phone,
  FileText,
  Stethoscope,
  Thermometer,
  Pill,
  TestTube,
  FileDown,
  Save,
  Send,
  Plus,
  X,
  Upload,
  Eye,
  ArrowLeft,
  Heart,
  Users,
  Award,
  Clock,
  Mail,
  Moon,
  Sun,
  Activity,
} from "lucide-react"
import { useTheme } from "next-themes"
import { useLanguage } from "@/lib/language-context"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { AppHeader } from "@/components/app-header"



function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="border-primary text-primary hover:bg-main-50 dark:border-main-400 dark:text-main-400 dark:hover:bg-main-950"
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}

// Mock patient data
const patientData = {
  fullName: "John Smith",
  dateOfBirth: "03/15/1985",
  age: "38 years",
  gender: "Male",
  patientId: "EXP-2024-001234",
  bloodType: "O+",
  allergies: ["Penicillin", "Shellfish"],
  insurance: "Health Insurance - Basic Plan",
  emergencyContact: "Jane Smith (Wife) - (555) 123-4567",
}

const commonComplaints = [
  "Headache",
  "Fever",
  "Abdominal pain",
  "Cough",
  "Sore throat",
  "Nausea",
  "Dizziness",
  "Fatigue",
  "Muscle pain",
  "Shortness of breath",
]

const commonSymptoms = [
  "Fever",
  "Pain",
  "Nausea",
  "Vomiting",
  "Diarrhea",
  "Constipation",
  "Cough",
  "Shortness of breath",
  "Palpitations",
  "Dizziness",
  "Headache",
  "Fatigue",
]

const medications = [
  "Acetaminophen 500mg",
  "Ibuprofen 400mg",
  "Amoxicillin 500mg",
  "Omeprazole 20mg",
  "Losartan 50mg",
  "Metformin 850mg",
]

const labTests = [
  "Complete Blood Count",
  "Blood Chemistry",
  "Lipid Profile",
  "Urinalysis",
  "TSH",
  "Fasting Glucose",
  "Chest X-ray",
]

export default function PatientConsultationPage() {
  const searchParams = useSearchParams()
  const patientName = searchParams.get("patient") || "Unknown Patient"
  const appointmentId = searchParams.get("appointmentId")

  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([])
  const [prescriptions, setPrescriptions] = useState([
    { medication: "", dosage: "", frequency: "", duration: "", instructions: "" },
  ])
  const [selectedTests, setSelectedTests] = useState<string[]>([])
  const [vitalSigns, setVitalSigns] = useState({
    temperature: "",
    bloodPressure: "",
    heartRate: "",
    respiratoryRate: "",
    oxygenSaturation: "",
    weight: "",
    height: "",
    bmi: "",
  })

  // Update patient data based on the patient name from URL
  useEffect(() => {
    if (patientName && patientName !== "Unknown Patient") {
      patientData.fullName = patientName
    }
  }, [patientName])

  const addPrescription = () => {
    setPrescriptions([...prescriptions, { medication: "", dosage: "", frequency: "", duration: "", instructions: "" }])
  }

  const removePrescription = (index: number) => {
    setPrescriptions(prescriptions.filter((_, i) => i !== index))
  }

  const calculateBMI = () => {
    const weight = Number.parseFloat(vitalSigns.weight)
    const height = Number.parseFloat(vitalSigns.height) / 100 // Convert cm to m
    if (weight && height) {
      const bmi = (weight / (height * height)).toFixed(1)
      setVitalSigns((prev) => ({ ...prev, bmi }))
    }
  }

  const handleSaveConsultation = () => {
    // Here you would typically save the consultation data to your backend
    alert("Consultation saved successfully!")
    window.close()
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {/* Header */}
        <header className="sticky top-0 z-50 w-full border-b border-main-200 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:border-main-800">
          <div className="container flex h-16 items-center justify-between px-4">
            <div className="flex items-center gap-2 lg:gap-4">
              <SidebarTrigger className="text-primary dark:text-main-400" />
              <Separator orientation="vertical" className="h-6" />
              <Button
                variant="ghost"
                onClick={() => window.history.back()}
                className="text-primary dark:text-main-400 text-sm lg:text-base"
              >
                <ArrowLeft className="h-4 w-4 mr-1 lg:mr-2" />
                <span className="hidden sm:inline">Back to Appointments</span>
                <span className="sm:hidden">Back</span>
              </Button>
              <h1 className="text-lg lg:text-xl font-semibold text-primary dark:text-main-400 hidden md:block">
                Patient Consultation
              </h1>
            </div>

            <div className="flex items-center gap-2 lg:gap-4">
              <div className="flex items-center gap-2 text-xs lg:text-sm text-muted-foreground">
                <Calendar className="w-3 h-3 lg:w-4 lg:h-4" />
                <span className="hidden sm:inline">{new Date().toLocaleDateString()}</span>
              </div>
              <ThemeToggle />
            </div>
          </div>
        </header>

        <div className="flex flex-col lg:flex-row h-[calc(100vh-4rem)] bg-background">
          {/* Patient Summary Sidebar */}
          <div className="w-full lg:w-80 bg-card border-b lg:border-b-0 lg:border-r border-main-200 dark:border-main-800 flex flex-col max-h-64 lg:max-h-none">
            <div className="p-4 lg:p-6 border-b border-main-200 dark:border-main-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-main-100 dark:bg-main-900 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 lg:w-6 lg:h-6 text-primary dark:text-main-400" />
                </div>
                <div>
                  <h2 className="text-base lg:text-lg font-semibold text-foreground">{patientData.fullName}</h2>
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
                        {allergy}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="hidden lg:block">
                  <Separator />
                  <div>
                    <h3 className="text-sm font-medium text-primary dark:text-main-400 mb-3">Insurance</h3>
                    <p className="text-sm text-muted-foreground">{patientData.insurance}</p>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-sm font-medium text-primary dark:text-main-400 mb-3">Emergency Contact</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="w-4 h-4" />
                      <span className="text-xs">{patientData.emergencyContact}</span>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col min-h-0">
            {/* Content Tabs */}
            <div className="flex-1 p-6">
              <Tabs defaultValue="consultation" className="h-full">
                <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
                  <TabsTrigger value="consultation" className="text-xs lg:text-sm">
                    Consultation
                  </TabsTrigger>
                  <TabsTrigger value="history" className="text-xs lg:text-sm">
                    History
                  </TabsTrigger>
                  <TabsTrigger value="documents" className="text-xs lg:text-sm">
                    Documents
                  </TabsTrigger>
                  <TabsTrigger value="notes" className="text-xs lg:text-sm">
                    Notes
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="consultation" className="mt-6 h-full">
                  <ScrollArea className="h-full">
                    <div className="space-y-8 pb-8">
                      {/* Reason for Visit */}
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
                          />
                          <div>
                            <Label className="text-sm font-medium">Common Complaints</Label>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {commonComplaints.map((complaint, index) => (
                                <Badge
                                  key={index}
                                  variant="outline"
                                  className="cursor-pointer hover:bg-main-50 dark:hover:bg-main-950"
                                >
                                  {complaint}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Symptoms */}
                      <Card className="border-main-200 dark:border-main-800">
                        <CardHeader>
                          <CardTitle className="text-primary dark:text-main-400">Symptoms</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                            {commonSymptoms.map((symptom, index) => (
                              <div key={index} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`symptom-${index}`}
                                  checked={selectedSymptoms.includes(symptom)}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      setSelectedSymptoms([...selectedSymptoms, symptom])
                                    } else {
                                      setSelectedSymptoms(selectedSymptoms.filter((s) => s !== symptom))
                                    }
                                  }}
                                />
                                <Label htmlFor={`symptom-${index}`} className="text-sm">
                                  {symptom}
                                </Label>
                              </div>
                            ))}
                          </div>
                          <Textarea
                            placeholder="Additional notes about symptoms, duration, description..."
                            className="min-h-[80px] border-main-200 dark:border-main-800"
                          />
                        </CardContent>
                      </Card>

                      {/* Vital Signs */}
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
                                onChange={(e) => setVitalSigns((prev) => ({ ...prev, temperature: e.target.value }))}
                                className="border-main-200 dark:border-main-800"
                              />
                            </div>
                            <div>
                              <Label htmlFor="bloodPressure">Blood Pressure</Label>
                              <Input
                                id="bloodPressure"
                                placeholder="120/80"
                                value={vitalSigns.bloodPressure}
                                onChange={(e) => setVitalSigns((prev) => ({ ...prev, bloodPressure: e.target.value }))}
                                className="border-main-200 dark:border-main-800"
                              />
                            </div>
                            <div>
                              <Label htmlFor="heartRate">Heart Rate</Label>
                              <Input
                                id="heartRate"
                                type="number"
                                value={vitalSigns.heartRate}
                                onChange={(e) => setVitalSigns((prev) => ({ ...prev, heartRate: e.target.value }))}
                                className="border-main-200 dark:border-main-800"
                              />
                            </div>
                            <div>
                              <Label htmlFor="respiratoryRate">Respiratory Rate</Label>
                              <Input
                                id="respiratoryRate"
                                type="number"
                                value={vitalSigns.respiratoryRate}
                                onChange={(e) =>
                                  setVitalSigns((prev) => ({ ...prev, respiratoryRate: e.target.value }))
                                }
                                className="border-main-200 dark:border-main-800"
                              />
                            </div>
                            <div>
                              <Label htmlFor="oxygenSaturation">Oxygen Saturation (%)</Label>
                              <Input
                                id="oxygenSaturation"
                                type="number"
                                value={vitalSigns.oxygenSaturation}
                                onChange={(e) =>
                                  setVitalSigns((prev) => ({ ...prev, oxygenSaturation: e.target.value }))
                                }
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
                                onChange={(e) => setVitalSigns((prev) => ({ ...prev, weight: e.target.value }))}
                                onBlur={calculateBMI}
                                className="border-main-200 dark:border-main-800"
                              />
                            </div>
                            <div>
                              <Label htmlFor="height">Height (in)</Label>
                              <Input
                                id="height"
                                type="number"
                                value={vitalSigns.height}
                                onChange={(e) => setVitalSigns((prev) => ({ ...prev, height: e.target.value }))}
                                onBlur={calculateBMI}
                                className="border-main-200 dark:border-main-800"
                              />
                            </div>
                            <div>
                              <Label htmlFor="bmi">BMI</Label>
                              <Input id="bmi" value={vitalSigns.bmi} readOnly className="bg-muted" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Clinical Diagnosis */}
                      <Card className="border-main-200 dark:border-main-800">
                        <CardHeader>
                          <CardTitle className="text-primary dark:text-main-400">Clinical Diagnosis</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <Label htmlFor="diagnosis">Search Diagnosis (ICD-10)</Label>
                            <Input
                              id="diagnosis"
                              placeholder="Type to search diagnoses..."
                              className="border-main-200 dark:border-main-800"
                            />
                          </div>
                          <div className="flex gap-2">
                            <Badge variant="default">Confirmed</Badge>
                            <Badge variant="secondary">Suspected</Badge>
                            <Badge variant="outline">Ruled Out</Badge>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Prescription */}
                      <Card className="border-main-200 dark:border-main-800">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-primary dark:text-main-400">
                            <Pill className="w-5 h-5" />
                            Prescription
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {prescriptions.map((prescription, index) => (
                            <div
                              key={index}
                              className="border rounded-lg p-4 space-y-4 border-main-200 dark:border-main-800"
                            >
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium">Medication {index + 1}</h4>
                                {prescriptions.length > 1 && (
                                  <Button variant="ghost" size="sm" onClick={() => removePrescription(index)}>
                                    <X className="w-4 h-4" />
                                  </Button>
                                )}
                              </div>
                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                <div>
                                  <Label>Medication</Label>
                                  <Select>
                                    <SelectTrigger className="border-main-200 dark:border-main-800">
                                      <SelectValue placeholder="Select medication" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {medications.map((med, i) => (
                                        <SelectItem key={i} value={med}>
                                          {med}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <Label>Dosage</Label>
                                  <Input placeholder="e.g. 1 tablet" className="border-main-200 dark:border-main-800" />
                                </div>
                                <div>
                                  <Label>Frequency</Label>
                                  <Select>
                                    <SelectTrigger className="border-main-200 dark:border-main-800">
                                      <SelectValue placeholder="Select frequency" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="every-8h">Every 8 hours</SelectItem>
                                      <SelectItem value="every-12h">Every 12 hours</SelectItem>
                                      <SelectItem value="every-24h">Every 24 hours</SelectItem>
                                      <SelectItem value="prn">As needed</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <Label>Duration</Label>
                                  <Input placeholder="e.g. 7 days" className="border-main-200 dark:border-main-800" />
                                </div>
                              </div>
                              <div>
                                <Label>Additional Instructions</Label>
                                <Textarea
                                  placeholder="Special instructions..."
                                  className="border-main-200 dark:border-main-800"
                                />
                              </div>
                            </div>
                          ))}
                          <Button
                            onClick={addPrescription}
                            variant="outline"
                            className="w-full border-primary text-primary hover:bg-main-50 dark:border-main-400 dark:text-main-400 bg-transparent"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Medication
                          </Button>
                        </CardContent>
                      </Card>

                      {/* Medical Orders */}
                      <Card className="border-main-200 dark:border-main-800">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-primary dark:text-main-400">
                            <TestTube className="w-5 h-5" />
                            Medical Orders / Tests
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                            {labTests.map((test, index) => (
                              <div key={index} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`test-${index}`}
                                  checked={selectedTests.includes(test)}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      setSelectedTests([...selectedTests, test])
                                    } else {
                                      setSelectedTests(selectedTests.filter((t) => t !== test))
                                    }
                                  }}
                                />
                                <Label htmlFor={`test-${index}`} className="text-sm">
                                  {test}
                                </Label>
                              </div>
                            ))}
                          </div>
                          <div>
                            <Label>Lab Notes</Label>
                            <Textarea
                              placeholder="Special instructions for lab personnel..."
                              className="border-main-200 dark:border-main-800"
                            />
                          </div>
                          <div>
                            <Label>Priority</Label>
                            <Select>
                              <SelectTrigger className="w-48 border-main-200 dark:border-main-800">
                                <SelectValue placeholder="Select priority" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="normal">Normal</SelectItem>
                                <SelectItem value="urgent">Urgent</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </CardContent>
                      </Card>

                      {/* General Medical Instructions */}
                      <Card className="border-main-200 dark:border-main-800">
                        <CardHeader>
                          <CardTitle className="text-primary dark:text-main-400">
                            General Medical Instructions
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <Label>Lifestyle Recommendations</Label>
                            <Textarea
                              placeholder="Diet, physical activity, general recommendations..."
                              className="border-main-200 dark:border-main-800"
                            />
                          </div>
                          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                            <div>
                              <Label>Return to Work/School Note</Label>
                              <Select>
                                <SelectTrigger className="border-main-200 dark:border-main-800">
                                  <SelectValue placeholder="Select option" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="immediate">Immediate</SelectItem>
                                  <SelectItem value="3-days">3 days</SelectItem>
                                  <SelectItem value="1-week">1 week</SelectItem>
                                  <SelectItem value="2-weeks">2 weeks</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label>Next Follow-up Appointment</Label>
                              <Input type="date" className="border-main-200 dark:border-main-800" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="history" className="mt-6">
                  <Card className="border-main-200 dark:border-main-800">
                    <CardHeader>
                      <CardTitle className="text-primary dark:text-main-400">Medical History</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="border-l-4 border-main-500 pl-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">Consultation - Headache</h4>
                              <p className="text-sm text-muted-foreground">Dr. Sarah Johnson • 11/15/2024</p>
                            </div>
                            <Badge variant="outline">Completed</Badge>
                          </div>
                          <p className="text-sm mt-2">Diagnosis: Tension headache. Treatment with analgesics.</p>
                        </div>
                        <div className="border-l-4 border-green-500 pl-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">Routine Examination</h4>
                              <p className="text-sm text-muted-foreground">Dr. Michael Chen • 10/02/2024</p>
                            </div>
                            <Badge variant="outline">Completed</Badge>
                          </div>
                          <p className="text-sm mt-2">General checkup. All parameters normal.</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="documents" className="mt-6">
                  <Card className="border-main-200 dark:border-main-800">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-primary dark:text-main-400">
                        <FileText className="w-5 h-5" />
                        Attached Documents
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="border-2 border-dashed border-main-300 dark:border-main-700 rounded-lg p-8 text-center">
                        <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                        <p className="text-muted-foreground">Drag files here or click to upload</p>
                        <Button
                          variant="outline"
                          className="mt-2 border-primary text-primary hover:bg-main-50 dark:border-main-400 dark:text-main-400 bg-transparent"
                        >
                          Select Files
                        </Button>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-3 border rounded-lg border-main-200 dark:border-main-800">
                          <div className="flex items-center gap-3">
                            <FileText className="w-5 h-5 text-primary dark:text-main-400" />
                            <div>
                              <p className="font-medium">Lab_Results_Nov15_2024.pdf</p>
                              <p className="text-sm text-muted-foreground">2.3 MB • Uploaded 2 days ago</p>
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
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="notes" className="mt-6">
                  <Card className="border-main-200 dark:border-main-800">
                    <CardHeader>
                      <CardTitle className="text-primary dark:text-main-400">Doctor's Notes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <Textarea
                          placeholder="Write your private notes about the patient and consultation..."
                          className="min-h-[200px] border-main-200 dark:border-main-800"
                        />
                        <div className="flex items-center space-x-2">
                          <Checkbox id="internal-only" />
                          <Label htmlFor="internal-only" className="text-sm">
                            Mark as internal note (not visible to patient)
                          </Label>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Action Buttons */}
            <div className="bg-card border-t border-main-200 dark:border-main-800 p-4 lg:p-6">
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div className="flex flex-col sm:flex-row gap-2 lg:gap-3">
                  <Button
                    variant="outline"
                    className="border-primary text-primary hover:bg-main-50 dark:border-main-400 dark:text-main-400 bg-transparent text-sm lg:text-base"
                  >
                    <FileDown className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Generate PDF Report</span>
                    <span className="sm:hidden">PDF Report</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="border-primary text-primary hover:bg-main-50 dark:border-main-400 dark:text-main-400 bg-transparent text-sm lg:text-base"
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
                    onClick={handleSaveConsultation}
                    className="bg-primary hover:bg-main-800 text-white text-sm lg:text-base"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Save & Close</span>
                    <span className="sm:hidden">Save</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
