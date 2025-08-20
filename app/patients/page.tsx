"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import {
  Users,
  Search,
  Edit,
  Trash2,
  Eye,
  Download,
  Phone,
  Mail,
  MapPin,
  User,
  Save,
  ChevronLeft,
  ChevronRight,
  UserPlus,
  Calendar,
  FileText,
  TestTube,
  Stethoscope,
  Activity,
  Clock,
  ChevronDown,
} from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

// Mock patient data
const mockPatients = [
  {
    id: "EXP-2024-001234",
    firstName: "María Elena",
    lastName: "González",
    cedula: "001-1234567-8",
    dateOfBirth: "1985-03-15",
    age: 38,
    gender: "Femenino",
    phone: "809-555-0123",
    email: "maria.gonzalez@email.com",
    address: "Calle Principal #123, Los Alcarrizos",
    city: "Santo Domingo",
    province: "Distrito Nacional",
    bloodType: "O+",
    allergies: ["Penicilina", "Mariscos"],
    insuranceProvider: "ARS Humano",
    emergencyContact: "Carlos González - 809-555-0124",
    lastVisit: "2024-11-15",
    status: "Activo",
  },
  {
    id: "EXP-2024-001235",
    firstName: "Juan Carlos",
    lastName: "Rodríguez",
    cedula: "001-2345678-9",
    dateOfBirth: "1978-07-22",
    age: 45,
    gender: "Masculino",
    phone: "809-555-0125",
    email: "juan.rodriguez@email.com",
    address: "Av. 27 de Febrero #456, Gazcue",
    city: "Santo Domingo",
    province: "Distrito Nacional",
    bloodType: "A+",
    allergies: ["Aspirina"],
    insuranceProvider: "SeNaSa",
    emergencyContact: "Ana Rodríguez - 809-555-0126",
    lastVisit: "2024-11-10",
    status: "Activo",
  },
  {
    id: "EXP-2024-001236",
    firstName: "Carmen Rosa",
    lastName: "Martínez",
    cedula: "001-3456789-0",
    dateOfBirth: "1992-12-08",
    age: 31,
    gender: "Femenino",
    phone: "809-555-0127",
    email: "carmen.martinez@email.com",
    address: "Calle Duarte #789, Santiago",
    city: "Santiago",
    province: "Santiago",
    bloodType: "B+",
    allergies: [],
    insuranceProvider: "ARS Palic",
    emergencyContact: "Pedro Martínez - 809-555-0128",
    lastVisit: "2024-10-28",
    status: "Inactivo",
  },
  {
    id: "EXP-2024-001237",
    firstName: "Roberto",
    lastName: "Fernández",
    cedula: "001-4567890-1",
    dateOfBirth: "1965-05-14",
    age: 58,
    gender: "Masculino",
    phone: "809-555-0129",
    email: "roberto.fernandez@email.com",
    address: "Calle Mella #321, La Vega",
    city: "La Vega",
    province: "La Vega",
    bloodType: "AB+",
    allergies: ["Penicilina", "Látex"],
    insuranceProvider: "ARS Universal",
    emergencyContact: "María Fernández - 809-555-0130",
    lastVisit: "2024-11-12",
    status: "Activo",
  },
]

// Mock medical history data
const mockMedicalHistory = {
  "EXP-2024-001234": {
    consultations: [
      {
        id: "CONS-001",
        date: "2024-11-15",
        doctor: "Dr. Juan Pérez",
        reason: "Dolor de cabeza persistente",
        diagnosis: "Cefalea tensional",
        treatment: "Acetaminofén 500mg c/8h x 5 días",
        notes: "Paciente refiere mejoría con analgésicos. Recomendar descanso.",
        status: "Completada",
      },
      {
        id: "CONS-002",
        date: "2024-10-20",
        doctor: "Dr. Ana López",
        reason: "Chequeo de rutina",
        diagnosis: "Paciente sana",
        treatment: "Continuar con estilo de vida saludable",
        notes: "Todos los parámetros dentro de rangos normales.",
        status: "Completada",
      },
      {
        id: "CONS-003",
        date: "2024-09-15",
        doctor: "Dr. Juan Pérez",
        reason: "Seguimiento hipertensión",
        diagnosis: "Hipertensión controlada",
        treatment: "Losartán 50mg continuar",
        notes: "Presión arterial estable. Continuar medicación actual.",
        status: "Completada",
      },
    ],
    procedures: [
      {
        id: "PROC-001",
        date: "2024-10-25",
        procedure: "Electrocardiograma",
        doctor: "Dr. Carlos Martínez",
        results: "Ritmo sinusal normal",
        notes: "ECG sin alteraciones significativas",
        status: "Completado",
      },
    ],
    labTests: [
      {
        id: "LAB-001",
        date: "2024-11-10",
        test: "Hemograma completo",
        results: "Valores normales",
        doctor: "Dr. Ana López",
        status: "Completado",
        values: {
          Hemoglobina: "13.5 g/dL",
          Hematocrito: "40.2%",
          Leucocitos: "7,200/μL",
          Plaquetas: "280,000/μL",
        },
      },
      {
        id: "LAB-002",
        date: "2024-09-20",
        test: "Química sanguínea",
        results: "Glucosa ligeramente elevada",
        doctor: "Dr. Juan Pérez",
        status: "Completado",
        values: {
          Glucosa: "110 mg/dL",
          Creatinina: "0.9 mg/dL",
          Colesterol: "180 mg/dL",
          Triglicéridos: "150 mg/dL",
        },
      },
    ],
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
      {
        id: "DOC-003",
        date: "2024-09-20",
        name: "Resultados_Lab_20Sep2024.pdf",
        type: "Laboratorio",
        size: "890 KB",
        uploadedBy: "Dr. Ana López",
      },
    ],
    appointments: [
      {
        id: "APT-001",
        date: "2024-12-15",
        time: "10:00 AM",
        doctor: "Dr. Juan Pérez",
        reason: "Seguimiento cefalea",
        status: "Programada",
      },
      {
        id: "APT-002",
        date: "2024-11-15",
        time: "2:30 PM",
        doctor: "Dr. Juan Pérez",
        reason: "Dolor de cabeza",
        status: "Completada",
      },
    ],
  },
}

type Patient = (typeof mockPatients)[0]

export default function PatientManagementPage() {
  const [patients, setPatients] = useState<Patient[]>(mockPatients)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [provinceFilter, setProvinceFilter] = useState("all")
  const [selectedPatients, setSelectedPatients] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null)
  const [viewingPatient, setViewingPatient] = useState<Patient | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewSheetOpen, setIsViewSheetOpen] = useState(false)
  const [viewingHistory, setViewingHistory] = useState<string | null>(null)
  const [isHistorySheetOpen, setIsHistorySheetOpen] = useState(false)
  const [historyActiveTab, setHistoryActiveTab] = useState("consultations")
  const itemsPerPage = 10

  // Filter and search patients
  const filteredPatients = useMemo(() => {
    return patients.filter((patient) => {
      const matchesSearch =
        patient.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.cedula.includes(searchTerm) ||
        patient.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.phone.includes(searchTerm)

      const matchesStatus = statusFilter === "all" || patient.status.toLowerCase() === statusFilter.toLowerCase()
      const matchesProvince = provinceFilter === "all" || patient.province === provinceFilter

      return matchesSearch && matchesStatus && matchesProvince
    })
  }, [patients, searchTerm, statusFilter, provinceFilter])

  // Pagination
  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage)
  const paginatedPatients = filteredPatients.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  // Get unique provinces for filter
  const provinces = [...new Set(patients.map((p) => p.province))]

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedPatients(paginatedPatients.map((p) => p.id))
    } else {
      setSelectedPatients([])
    }
  }

  const handleSelectPatient = (patientId: string, checked: boolean) => {
    if (checked) {
      setSelectedPatients([...selectedPatients, patientId])
    } else {
      setSelectedPatients(selectedPatients.filter((id) => id !== patientId))
    }
  }

  const handleDeletePatient = (patientId: string) => {
    setPatients(patients.filter((p) => p.id !== patientId))
    setSelectedPatients(selectedPatients.filter((id) => id !== patientId))
  }

  const handleBulkDelete = () => {
    setPatients(patients.filter((p) => !selectedPatients.includes(p.id)))
    setSelectedPatients([])
  }

  const handleEditPatient = (patient: Patient) => {
    setEditingPatient({ ...patient })
    setIsEditDialogOpen(true)
  }

  const handleViewPatient = (patient: Patient) => {
    setViewingPatient(patient)
    setIsViewSheetOpen(true)
  }

  const handleViewHistory = (patientId: string) => {
    setViewingHistory(patientId)
    setIsHistorySheetOpen(true)
  }

  const handleSaveEdit = () => {
    if (editingPatient) {
      setPatients(patients.map((p) => (p.id === editingPatient.id ? editingPatient : p)))
      setIsEditDialogOpen(false)
      setEditingPatient(null)
    }
  }

  const handleExport = () => {
    // Mock export functionality
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "ID,Nombre,Apellido,Cédula,Teléfono,Email,Estado\n" +
      filteredPatients
        .map((p) => `${p.id},${p.firstName},${p.lastName},${p.cedula},${p.phone},${p.email},${p.status}`)
        .join("\n")

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "pacientes.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200 p-4 lg:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Gestión de Pacientes</h1>
                <p className="text-sm lg:text-base text-gray-500">
                  {filteredPatients.length} paciente{filteredPatients.length !== 1 ? "s" : ""} encontrado
                  {filteredPatients.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleExport} variant="outline" className="bg-transparent">
                <Download className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Exportar</span>
              </Button>
              <Button onClick={() => (window.location.href = "/patient-management")}>
                <UserPlus className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Nuevo </span>Paciente
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="max-w-7xl mx-auto p-4 lg:p-6">
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Buscar por nombre, cédula, ID o teléfono..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los estados</SelectItem>
                    <SelectItem value="activo">Activo</SelectItem>
                    <SelectItem value="inactivo">Inactivo</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={provinceFilter} onValueChange={setProvinceFilter}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Provincia" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las provincias</SelectItem>
                    {provinces.map((province) => (
                      <SelectItem key={province} value={province}>
                        {province}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bulk Actions */}
        {selectedPatients.length > 0 && (
          <Card className="mb-4">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  {selectedPatients.length} paciente{selectedPatients.length !== 1 ? "s" : ""} seleccionado
                  {selectedPatients.length !== 1 ? "s" : ""}
                </span>
                <div className="flex gap-2">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Eliminar Seleccionados
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar pacientes seleccionados?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta acción eliminará permanentemente {selectedPatients.length} paciente
                          {selectedPatients.length !== 1 ? "s" : ""} y todos sus datos asociados. Esta acción no se
                          puede deshacer.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleBulkDelete} className="bg-red-600 hover:bg-red-700">
                          Eliminar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Patients Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="p-4 text-left">
                      <Checkbox
                        checked={selectedPatients.length === paginatedPatients.length && paginatedPatients.length > 0}
                        onCheckedChange={handleSelectAll}
                      />
                    </th>
                    <th className="p-4 text-left text-sm font-medium text-gray-900">Paciente</th>
                    <th className="p-4 text-left text-sm font-medium text-gray-900 hidden md:table-cell">Contacto</th>
                    <th className="p-4 text-left text-sm font-medium text-gray-900 hidden lg:table-cell">Ubicación</th>
                    <th className="p-4 text-left text-sm font-medium text-gray-900 hidden sm:table-cell">Estado</th>
                    <th className="p-4 text-left text-sm font-medium text-gray-900 hidden lg:table-cell">
                      Última Visita
                    </th>
                    <th className="p-4 text-left text-sm font-medium text-gray-900 w-32">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paginatedPatients.map((patient) => (
                    <tr key={patient.id} className="hover:bg-gray-50">
                      <td className="p-4">
                        <Checkbox
                          checked={selectedPatients.includes(patient.id)}
                          onCheckedChange={(checked) => handleSelectPatient(patient.id, checked as boolean)}
                        />
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {patient.firstName} {patient.lastName}
                            </div>
                            <div className="text-sm text-gray-500">{patient.id}</div>
                            <div className="text-sm text-gray-500 md:hidden">{patient.phone}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 hidden md:table-cell">
                        <div className="text-sm">
                          <div className="flex items-center gap-1 text-gray-900">
                            <Phone className="w-3 h-3" />
                            {patient.phone}
                          </div>
                          <div className="flex items-center gap-1 text-gray-500 mt-1">
                            <Mail className="w-3 h-3" />
                            {patient.email}
                          </div>
                        </div>
                      </td>
                      <td className="p-4 hidden lg:table-cell">
                        <div className="text-sm">
                          <div className="text-gray-900">{patient.city}</div>
                          <div className="text-gray-500">{patient.province}</div>
                        </div>
                      </td>
                      <td className="p-4 hidden sm:table-cell">
                        <Badge variant={patient.status === "Activo" ? "default" : "secondary"}>{patient.status}</Badge>
                      </td>
                      <td className="p-4 hidden lg:table-cell">
                        <div className="text-sm text-gray-900">
                          {format(new Date(patient.lastVisit), "dd/MM/yyyy", { locale: es })}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewPatient(patient)}
                            className="h-8 w-8 p-0"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditPatient(patient)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewHistory(patient.id)}
                            className="h-8 w-8 p-0"
                          >
                            <Activity className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => (window.location.href = `/patient-ehr/${patient.id}`)}
                            className="h-8 w-8 p-0"
                            title="Ver EHR Completo"
                          >
                            <FileText className="w-4 h-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-600 hover:text-red-700">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>¿Eliminar paciente?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Esta acción eliminará permanentemente a {patient.firstName} {patient.lastName} y todos
                                  sus datos asociados. Esta acción no se puede deshacer.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeletePatient(patient.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Eliminar
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between p-4 border-t">
                <div className="text-sm text-gray-500">
                  Mostrando {(currentPage - 1) * itemsPerPage + 1} a{" "}
                  {Math.min(currentPage * itemsPerPage, filteredPatients.length)} de {filteredPatients.length} pacientes
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="bg-transparent"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <span className="text-sm">
                    Página {currentPage} de {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="bg-transparent"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* View Patient Sheet */}
      <Sheet open={isViewSheetOpen} onOpenChange={setIsViewSheetOpen}>
        <SheetContent className="w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>Información del Paciente</SheetTitle>
          </SheetHeader>
          {viewingPatient && (
            <ScrollArea className="h-full mt-6">
              <div className="space-y-6 pb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">
                      {viewingPatient.firstName} {viewingPatient.lastName}
                    </h3>
                    <p className="text-sm text-gray-500">{viewingPatient.id}</p>
                    <Badge variant={viewingPatient.status === "Activo" ? "default" : "secondary"} className="mt-1">
                      {viewingPatient.status}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Información Personal</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Cédula:</span>
                        <span>{viewingPatient.cedula}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Fecha de Nacimiento:</span>
                        <span>{format(new Date(viewingPatient.dateOfBirth), "dd/MM/yyyy", { locale: es })}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Edad:</span>
                        <span>{viewingPatient.age} años</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Género:</span>
                        <span>{viewingPatient.gender}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Tipo de Sangre:</span>
                        <Badge variant="outline">{viewingPatient.bloodType}</Badge>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Contacto</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span>{viewingPatient.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span>{viewingPatient.email}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                        <div>
                          <div>{viewingPatient.address}</div>
                          <div className="text-gray-500">
                            {viewingPatient.city}, {viewingPatient.province}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Información Médica</h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-500">Alergias:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {viewingPatient.allergies.length > 0 ? (
                            viewingPatient.allergies.map((allergy, index) => (
                              <Badge key={index} variant="destructive" className="text-xs">
                                {allergy}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-gray-400">Sin alergias conocidas</span>
                          )}
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Seguro:</span>
                        <span>{viewingPatient.insuranceProvider}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Contacto de Emergencia:</span>
                        <span className="text-right">{viewingPatient.emergencyContact}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Última Visita:</span>
                        <span>{format(new Date(viewingPatient.lastVisit), "dd/MM/yyyy", { locale: es })}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={() => (window.location.href = `/patient-ehr/${viewingPatient?.id}`)}
                  className="w-full"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  <span>Ver EHR Completo</span>
                </Button>
              </div>
            </ScrollArea>
          )}
        </SheetContent>
      </Sheet>

      {/* Medical History Sheet */}
      <Sheet open={isHistorySheetOpen} onOpenChange={setIsHistorySheetOpen}>
        <SheetContent className="w-full sm:max-w-4xl">
          <SheetHeader>
            <SheetTitle>Historial Médico</SheetTitle>
            {viewingHistory && (
              <p className="text-sm text-gray-500">
                {patients.find((p) => p.id === viewingHistory)?.firstName}{" "}
                {patients.find((p) => p.id === viewingHistory)?.lastName}
              </p>
            )}
          </SheetHeader>
          {viewingHistory && mockMedicalHistory[viewingHistory] && (
            <div className="mt-6 h-full">
              <div className="flex flex-wrap gap-2 mb-6 border-b">
                <Button
                  variant={historyActiveTab === "consultations" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setHistoryActiveTab("consultations")}
                  className="rounded-b-none"
                >
                  <Stethoscope className="w-4 h-4 mr-2" />
                  Consultas ({mockMedicalHistory[viewingHistory].consultations.length})
                </Button>
                <Button
                  variant={historyActiveTab === "procedures" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setHistoryActiveTab("procedures")}
                  className="rounded-b-none"
                >
                  <Activity className="w-4 h-4 mr-2" />
                  Procedimientos ({mockMedicalHistory[viewingHistory].procedures.length})
                </Button>
                <Button
                  variant={historyActiveTab === "labs" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setHistoryActiveTab("labs")}
                  className="rounded-b-none"
                >
                  <TestTube className="w-4 h-4 mr-2" />
                  Laboratorios ({mockMedicalHistory[viewingHistory].labTests.length})
                </Button>
                <Button
                  variant={historyActiveTab === "documents" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setHistoryActiveTab("documents")}
                  className="rounded-b-none"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Documentos ({mockMedicalHistory[viewingHistory].documents.length})
                </Button>
                <Button
                  variant={historyActiveTab === "appointments" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setHistoryActiveTab("appointments")}
                  className="rounded-b-none"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Citas ({mockMedicalHistory[viewingHistory].appointments.length})
                </Button>
              </div>

              <ScrollArea className="h-[calc(100vh-200px)]">
                {/* Consultations Tab */}
                {historyActiveTab === "consultations" && (
                  <div className="space-y-4">
                    {mockMedicalHistory[viewingHistory].consultations.map((consultation) => (
                      <Card key={consultation.id}>
                        <CardContent className="p-4">
                          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant="outline">{consultation.status}</Badge>
                                <span className="text-sm text-gray-500">
                                  {format(new Date(consultation.date), "dd/MM/yyyy", { locale: es })}
                                </span>
                              </div>
                              <h4 className="font-medium text-gray-900 mb-1">{consultation.reason}</h4>
                              <p className="text-sm text-gray-600 mb-2">Dr. {consultation.doctor}</p>

                              <Collapsible>
                                <CollapsibleTrigger className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700">
                                  Ver detalles <ChevronDown className="w-4 h-4" />
                                </CollapsibleTrigger>
                                <CollapsibleContent className="mt-3 space-y-2">
                                  <div>
                                    <span className="text-sm font-medium text-gray-700">Diagnóstico:</span>
                                    <p className="text-sm text-gray-600">{consultation.diagnosis}</p>
                                  </div>
                                  <div>
                                    <span className="text-sm font-medium text-gray-700">Tratamiento:</span>
                                    <p className="text-sm text-gray-600">{consultation.treatment}</p>
                                  </div>
                                  <div>
                                    <span className="text-sm font-medium text-gray-700">Notas:</span>
                                    <p className="text-sm text-gray-600">{consultation.notes}</p>
                                  </div>
                                </CollapsibleContent>
                              </Collapsible>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {/* Procedures Tab */}
                {historyActiveTab === "procedures" && (
                  <div className="space-y-4">
                    {mockMedicalHistory[viewingHistory].procedures.map((procedure) => (
                      <Card key={procedure.id}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="font-medium text-gray-900">{procedure.procedure}</h4>
                              <p className="text-sm text-gray-600">Dr. {procedure.doctor}</p>
                            </div>
                            <div className="text-right">
                              <Badge variant="outline">{procedure.status}</Badge>
                              <p className="text-sm text-gray-500 mt-1">
                                {format(new Date(procedure.date), "dd/MM/yyyy", { locale: es })}
                              </p>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div>
                              <span className="text-sm font-medium text-gray-700">Resultados:</span>
                              <p className="text-sm text-gray-600">{procedure.results}</p>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-gray-700">Notas:</span>
                              <p className="text-sm text-gray-600">{procedure.notes}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {/* Lab Tests Tab */}
                {historyActiveTab === "labs" && (
                  <div className="space-y-4">
                    {mockMedicalHistory[viewingHistory].labTests.map((lab) => (
                      <Card key={lab.id}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="font-medium text-gray-900">{lab.test}</h4>
                              <p className="text-sm text-gray-600">Solicitado por: Dr. {lab.doctor}</p>
                            </div>
                            <div className="text-right">
                              <Badge variant="outline">{lab.status}</Badge>
                              <p className="text-sm text-gray-500 mt-1">
                                {format(new Date(lab.date), "dd/MM/yyyy", { locale: es })}
                              </p>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div>
                              <span className="text-sm font-medium text-gray-700">Resultado General:</span>
                              <p className="text-sm text-gray-600">{lab.results}</p>
                            </div>
                            <Collapsible>
                              <CollapsibleTrigger className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700">
                                Ver valores detallados <ChevronDown className="w-4 h-4" />
                              </CollapsibleTrigger>
                              <CollapsibleContent className="mt-3">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-3 bg-gray-50 rounded-lg">
                                  {Object.entries(lab.values).map(([key, value]) => (
                                    <div key={key} className="flex justify-between text-sm">
                                      <span className="text-gray-700">{key}:</span>
                                      <span className="font-medium">{value}</span>
                                    </div>
                                  ))}
                                </div>
                              </CollapsibleContent>
                            </Collapsible>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {/* Documents Tab */}
                {historyActiveTab === "documents" && (
                  <div className="space-y-4">
                    {mockMedicalHistory[viewingHistory].documents.map((document) => (
                      <Card key={document.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <FileText className="w-5 h-5 text-blue-600" />
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900">{document.name}</h4>
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                  <Badge variant="secondary" className="text-xs">
                                    {document.type}
                                  </Badge>
                                  <span>{document.size}</span>
                                  <span>•</span>
                                  <span>{format(new Date(document.date), "dd/MM/yyyy", { locale: es })}</span>
                                </div>
                                <p className="text-sm text-gray-600">Subido por: {document.uploadedBy}</p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="ghost" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Download className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {/* Appointments Tab */}
                {historyActiveTab === "appointments" && (
                  <div className="space-y-4">
                    {mockMedicalHistory[viewingHistory].appointments.map((appointment) => (
                      <Card key={appointment.id}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-medium text-gray-900">{appointment.reason}</h4>
                              <p className="text-sm text-gray-600">Dr. {appointment.doctor}</p>
                              <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                                <Calendar className="w-4 h-4" />
                                <span>{format(new Date(appointment.date), "dd/MM/yyyy", { locale: es })}</span>
                                <Clock className="w-4 h-4 ml-2" />
                                <span>{appointment.time}</span>
                              </div>
                            </div>
                            <Badge
                              variant={
                                appointment.status === "Completada"
                                  ? "default"
                                  : appointment.status === "Programada"
                                    ? "secondary"
                                    : "outline"
                              }
                            >
                              {appointment.status}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Edit Patient Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Paciente</DialogTitle>
          </DialogHeader>
          {editingPatient && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-firstName">Nombres</Label>
                  <Input
                    id="edit-firstName"
                    value={editingPatient.firstName}
                    onChange={(e) => setEditingPatient({ ...editingPatient, firstName: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-lastName">Apellidos</Label>
                  <Input
                    id="edit-lastName"
                    value={editingPatient.lastName}
                    onChange={(e) => setEditingPatient({ ...editingPatient, lastName: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-phone">Teléfono</Label>
                  <Input
                    id="edit-phone"
                    value={editingPatient.phone}
                    onChange={(e) => setEditingPatient({ ...editingPatient, phone: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-email">Email</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={editingPatient.email}
                    onChange={(e) => setEditingPatient({ ...editingPatient, email: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="edit-address">Dirección</Label>
                <Textarea
                  id="edit-address"
                  value={editingPatient.address}
                  onChange={(e) => setEditingPatient({ ...editingPatient, address: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Estado</Label>
                  <Select
                    value={editingPatient.status}
                    onValueChange={(value) => setEditingPatient({ ...editingPatient, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Activo">Activo</SelectItem>
                      <SelectItem value="Inactivo">Inactivo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Seguro</Label>
                  <Select
                    value={editingPatient.insuranceProvider}
                    onValueChange={(value) => setEditingPatient({ ...editingPatient, insuranceProvider: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ARS Humano">ARS Humano</SelectItem>
                      <SelectItem value="ARS Palic">ARS Palic</SelectItem>
                      <SelectItem value="ARS Universal">ARS Universal</SelectItem>
                      <SelectItem value="SeNaSa">SeNaSa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="bg-transparent">
                  Cancelar
                </Button>
                <Button onClick={handleSaveEdit}>
                  <Save className="w-4 h-4 mr-2" />
                  Guardar Cambios
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
