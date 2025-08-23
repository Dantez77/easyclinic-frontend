"use client"

import { useState, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import {
  DollarSign,
  Search,
  Plus,
  Eye,
  Download,
  Send,
  FileText,
  CreditCard,
  User,
  Receipt,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  Save,
  X,
  Wifi,
  Shield,
} from "lucide-react"

// Mock billing data
const mockInvoices = [
  {
    id: "FAC-2024-001",
    patientId: "EXP-2024-001234",
    patientName: "María Elena González",
    date: "2024-11-15",
    dueDate: "2024-12-15",
    services: [
      { description: "Consulta Médica General", quantity: 1, unitPrice: 1500, total: 1500 },
      { description: "Electrocardiograma", quantity: 1, unitPrice: 800, total: 800 },
    ],
    subtotal: 2300,
    tax: 414, // 18% ITBIS
    discount: 0,
    total: 2714,
    status: "Pagada",
    paymentMethod: "Efectivo",
    paymentDate: "2024-11-15",
    insuranceCoverage: 70,
    insuranceAmount: 1899.8,
    patientAmount: 814.2,
    notes: "Pago completo recibido",
    documentType: "factura",
    // BACKEND: Add these fields for Stripe + DTE integration
    stripePaymentId: "pi_1234567890",
    stripeReceiptUrl: "https://stripe.com/receipt/123",
    dteUuid: "DTE-UUID-123456789",
    dteStatus: "accepted", // accepted, rejected, pending_retry
    dteXmlUrl: "/dte/xml/DTE-UUID-123456789.xml",
    dtePdfUrl: "/dte/pdf/DTE-UUID-123456789.pdf",
  },
  {
    id: "FAC-2024-002",
    patientId: "EXP-2024-001235",
    patientName: "Juan Carlos Rodríguez",
    date: "2024-11-10",
    dueDate: "2024-12-10",
    services: [
      { description: "Consulta Especializada - Cardiología", quantity: 1, unitPrice: 2500, total: 2500 },
      { description: "Exámenes de Laboratorio", quantity: 1, unitPrice: 1200, total: 1200 },
    ],
    subtotal: 3700,
    tax: 666,
    discount: 200,
    total: 4166,
    status: "Pendiente",
    paymentMethod: "",
    paymentDate: "",
    insuranceCoverage: 80,
    insuranceAmount: 3332.8,
    patientAmount: 833.2,
    notes: "Esperando aprobación del seguro",
    documentType: "factura",
  },
  {
    id: "FAC-2024-003",
    patientId: "EXP-2024-001236",
    patientName: "Carmen Rosa Martínez",
    date: "2024-10-28",
    dueDate: "2024-11-28",
    services: [{ description: "Consulta Médica General", quantity: 1, unitPrice: 1500, total: 1500 }],
    subtotal: 1500,
    tax: 270,
    discount: 0,
    total: 1770,
    status: "Vencida",
    paymentMethod: "",
    paymentDate: "",
    insuranceCoverage: 0,
    insuranceAmount: 0,
    patientAmount: 1770,
    notes: "Paciente sin seguro médico",
    documentType: "factura",
  },
]

const DOCUMENT_TYPES = {
  ticket: { name: "Ticket", requiresRNC: false, hasITBIS: false },
  factura: { name: "Factura", requiresRNC: true, hasITBIS: true },
  creditoFiscal: { name: "Crédito Fiscal", requiresRNC: true, hasITBIS: true },
  // BACKEND: Add DTE types for El Salvador
  dteFactura: { name: "DTE Factura", requiresNIT: true, hasIVA: true },
  dteComprobante: { name: "DTE Comprobante", requiresNIT: false, hasIVA: true },
}

const mockServices = [
  { id: "SRV-001", name: "Consulta Médica General", price: 1500, category: "Consultas" },
  { id: "SRV-002", name: "Consulta Especializada - Cardiología", price: 2500, category: "Consultas" },
  { id: "SRV-003", name: "Consulta Especializada - Neurología", price: 2500, category: "Consultas" },
  { id: "SRV-004", name: "Electrocardiograma", price: 800, category: "Procedimientos" },
  { id: "SRV-005", name: "Radiografía de Tórax", price: 1200, category: "Imagenología" },
  { id: "SRV-006", name: "Hemograma Completo", price: 600, category: "Laboratorio" },
  { id: "SRV-007", name: "Química Sanguínea", price: 800, category: "Laboratorio" },
  { id: "SRV-008", name: "Ultrasonido Abdominal", price: 1800, category: "Imagenología" },
]

const mockPatients = [
  {
    id: "EXP-2024-001234",
    name: "María Elena González",
    insurance: "ARS Humano",
    coverage: 70,
    rnc: "101234567",
    // BACKEND: Add NIT for El Salvador DTE
    nit: "0614-123456-001-2",
    email: "maria.gonzalez@email.com",
    phone: "+503-7123-4567",
  },
  { id: "EXP-2024-001235", name: "Juan Carlos Rodríguez", insurance: "SeNaSa", coverage: 80, rnc: "101234568" },
  { id: "EXP-2024-001236", name: "Carmen Rosa Martínez", insurance: "Sin Seguro", coverage: 0, rnc: "" },
  { id: "EXP-2024-001237", name: "Roberto Fernández", insurance: "ARS Universal", coverage: 75, rnc: "101234569" },
]

type Invoice = (typeof mockInvoices)[0]
type Service = (typeof mockServices)[0]

export default function BillingPage() {
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isViewSheetOpen, setIsViewSheetOpen] = useState(false)
  const [viewingInvoice, setViewingInvoice] = useState<Invoice | null>(null)
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false)
  const [processingPayment, setProcessingPayment] = useState<Invoice | null>(null)
  const [activeTab, setActiveTab] = useState("invoices")
  const [documentTypeFilter, setDocumentTypeFilter] = useState("all")

  // BACKEND: Add state for Stripe Terminal integration
  const [stripeTerminalConnected, setStripeTerminalConnected] = useState(false)
  const [isProcessingStripePayment, setIsProcessingStripePayment] = useState(false)
  const [isDteProcessing, setIsDteProcessing] = useState(false)

  // New invoice form state
  const [newInvoice, setNewInvoice] = useState({
    patientId: "",
    services: [{ serviceId: "", quantity: 1, customPrice: 0 }],
    discount: 0,
    notes: "",
    documentType: "ticket",
  })

  const [searchPatientTerm, setSearchPatientTerm] = useState("")
  const [showPatientSuggestions, setShowPatientSuggestions] = useState(false)

  // Filter patients based on search term
  const filteredPatientSuggestions = useMemo(() => {
    if (!searchPatientTerm) return []
    return mockPatients
      .filter(
        (patient) =>
          patient.name.toLowerCase().includes(searchPatientTerm.toLowerCase()) ||
          patient.id.toLowerCase().includes(searchPatientTerm.toLowerCase()),
      )
      .slice(0, 5)
  }, [searchPatientTerm])

  const itemsPerPage = 10

  // Filter invoices
  const filteredInvoices = useMemo(() => {
    return invoices.filter((invoice) => {
      const matchesSearch =
        invoice.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.id.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === "all" || invoice.status.toLowerCase() === statusFilter.toLowerCase()

      const matchesDate = (() => {
        if (dateFilter === "all") return true
        const invoiceDate = new Date(invoice.date)
        const today = new Date()
        const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
        const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)

        switch (dateFilter) {
          case "today":
            return invoiceDate.toDateString() === today.toDateString()
          case "week":
            return invoiceDate >= sevenDaysAgo
          case "month":
            return invoiceDate >= thirtyDaysAgo
          default:
            return true
        }
      })()

      const matchesDocumentType =
        documentTypeFilter === "all" || invoice.documentType.toLowerCase() === documentTypeFilter.toLowerCase()

      return matchesSearch && matchesStatus && matchesDate && matchesDocumentType
    })
  }, [invoices, searchTerm, statusFilter, dateFilter, documentTypeFilter])

  // Pagination
  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage)
  const paginatedInvoices = filteredInvoices.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  // Calculate totals
  const totalRevenue = invoices.reduce((sum, invoice) => sum + (invoice.status === "Pagada" ? invoice.total : 0), 0)
  const pendingAmount = invoices.reduce((sum, invoice) => sum + (invoice.status === "Pendiente" ? invoice.total : 0), 0)
  const overdueAmount = invoices.reduce((sum, invoice) => sum + (invoice.status === "Vencida" ? invoice.total : 0), 0)

  // BACKEND PROCESS: Create Invoice/Order
  const handleCreateInvoice = async () => {
    const selectedPatient = mockPatients.find((p) => p.id === newInvoice.patientId)
    const docType = DOCUMENT_TYPES[newInvoice.documentType]

    // Check NIT/RNC requirement
    if (docType.requiresNIT && !selectedPatient?.nit) {
      alert("Este tipo de documento requiere que el paciente tenga NIT registrado.")
      return
    }

    const services = newInvoice.services.map((service) => {
      const serviceData = mockServices.find((s) => s.id === service.serviceId)
      const unitPrice = service.customPrice || serviceData?.price || 0
      return {
        description: serviceData?.name || "",
        quantity: service.quantity,
        unitPrice,
        total: unitPrice * service.quantity,
      }
    })

    const subtotal = services.reduce((sum, service) => sum + service.total, 0)
    const discountAmount = (subtotal * newInvoice.discount) / 100
    const taxableAmount = subtotal - discountAmount

    // Apply IVA only for DTE documents
    const tax = docType.hasIVA ? taxableAmount * 0.13 : 0 // 13% IVA in El Salvador
    const total = taxableAmount + tax

    const insuranceCoverage = selectedPatient?.coverage || 0
    const insuranceAmount = (total * insuranceCoverage) / 100
    const patientAmount = total - insuranceAmount

    // BACKEND: Create order in database with status="pending_payment"
    const orderData = {
      patientId: newInvoice.patientId,
      patientName: selectedPatient?.name || "",
      services,
      subtotal,
      tax,
      discount: discountAmount,
      total,
      patientAmount,
      documentType: newInvoice.documentType,
      status: "pending_payment", // Initial status
      nit: selectedPatient?.nit || "",
      notes: newInvoice.notes,
    }

    try {
      // BACKEND API CALL: POST /api/orders
      // const response = await fetch('/api/orders', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(orderData)
      // })
      // const order = await response.json()

      // Mock response for demo
      const invoice: Invoice = {
        id: generateDocumentNumber(newInvoice.documentType),
        ...orderData,
        date: format(new Date(), "yyyy-MM-dd"),
        dueDate: format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), "yyyy-MM-dd"),
        status: "Pendiente",
        paymentMethod: "",
        paymentDate: "",
        insuranceCoverage,
        insuranceAmount,
      }

      setInvoices([invoice, ...invoices])
      setIsCreateDialogOpen(false)
      setNewInvoice({
        patientId: "",
        services: [{ serviceId: "", quantity: 1, customPrice: 0 }],
        discount: 0,
        notes: "",
        documentType: "ticket",
      })
    } catch (error) {
      console.error("Error creating order:", error)
      alert("Error al crear la orden")
    }
  }

  // BACKEND PROCESS: Stripe Payment Integration
  const handleProcessStripePayment = async (invoice: Invoice) => {
    setIsProcessingStripePayment(true)

    try {
      // BACKEND API CALL: Create Stripe Payment Intent
      // const response = await fetch('/api/payments/stripe/create-intent', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     orderId: invoice.id,
      //     amount: Math.round(invoice.patientAmount * 100), // Convert to cents
      //     currency: 'usd', // or local currency
      //     metadata: {
      //       orderId: invoice.id,
      //       patientId: invoice.patientId,
      //       documentType: invoice.documentType
      //     }
      //   })
      // })
      // const { clientSecret, paymentIntentId } = await response.json()

      // BACKEND: Initialize Stripe Terminal for NFC payment
      // const terminal = StripeTerminal.create({
      //   onFetchConnectionToken: async () => {
      //     const response = await fetch('/api/stripe/connection-token', { method: 'POST' })
      //     const { secret } = await response.json()
      //     return secret
      //   }
      // })

      // BACKEND: Process payment through Stripe Terminal
      // const result = await terminal.collectPaymentMethod({
      //   payment_intent: {
      //     id: paymentIntentId,
      //     client_secret: clientSecret
      //   }
      // })

      // Mock successful payment for demo
      await new Promise((resolve) => setTimeout(resolve, 3000)) // Simulate payment processing

      // BACKEND API CALL: Confirm payment and update order
      // const confirmResponse = await fetch('/api/payments/stripe/confirm', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     orderId: invoice.id,
      //     paymentIntentId: 'pi_mock_123456',
      //     status: 'succeeded'
      //   })
      // })

      // Update invoice status to paid
      const updatedInvoices = invoices.map((inv) =>
        inv.id === invoice.id
          ? {
            ...inv,
            status: "Pagada" as const,
            paymentMethod: "Tarjeta NFC",
            paymentDate: format(new Date(), "yyyy-MM-dd"),
            stripePaymentId: "pi_mock_123456",
            stripeReceiptUrl: "https://stripe.com/receipt/mock_123456",
          }
          : inv,
      )
      setInvoices(updatedInvoices)

      // BACKEND PROCESS: Generate DTE after successful payment
      const updatedInvoice = updatedInvoices.find((inv) => inv.id === invoice.id)
      if (updatedInvoice && (invoice.documentType === "dteFactura" || invoice.documentType === "dteComprobante")) {
        await handleGenerateDTE(updatedInvoice)
      }

      alert("Pago procesado exitosamente con Stripe NFC")
    } catch (error) {
      console.error("Error processing Stripe payment:", error)
      alert("Error al procesar el pago")
    } finally {
      setIsProcessingStripePayment(false)
      setIsPaymentDialogOpen(false)
      setProcessingPayment(null)
    }
  }

  // BACKEND PROCESS: DTE Generation and Submission to Ministerio de Hacienda
  const handleGenerateDTE = async (invoice: Invoice) => {
    setIsDteProcessing(true)

    try {
      // BACKEND API CALL: Generate DTE document
      // const dteData = {
      //   // Datos Generales
      //   tipoDocumento: invoice.documentType === 'dteFactura' ? '01' : '03',
      //   numeroControl: generateDTEControlNumber(),
      //   codigoGeneracion: generateDTECode(),
      //   fechaEmision: new Date().toISOString(),
      //   montoTotal: invoice.total,
      //
      //   // Receptor (Patient)
      //   receptor: {
      //     nit: invoice.nit,
      //     nombre: invoice.patientName,
      //     telefono: selectedPatient?.phone,
      //     correo: selectedPatient?.email
      //   },
      //
      //   // Detalle de servicios
      //   cuerpoDocumento: invoice.services.map(service => ({
      //     descripcion: service.description,
      //     cantidad: service.quantity,
      //     precioUnitario: service.unitPrice,
      //     ventaTotal: service.total
      //   })),
      //
      //   // Medio de pago
      //   medioPago: {
      //     codigo: '02', // Tarjeta
      //     referencia: invoice.stripePaymentId
      //   },
      //
      //   // Resumen
      //   resumen: {
      //     subTotal: invoice.subtotal,
      //     descuento: invoice.discount,
      //     ivaRetenido: 0,
      //     reteRenta: 0,
      //     montoTotalOperacion: invoice.total,
      //     totalIva: invoice.tax,
      //     totalPagar: invoice.total
      //   }
      // }

      // BACKEND API CALL: Submit DTE to Ministerio de Hacienda
      // const dteResponse = await fetch('/api/dte/submit', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     orderId: invoice.id,
      //     dteData: dteData
      //   })
      // })
      // const dteResult = await dteResponse.json()

      // Mock DTE processing for demo
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // BACKEND: Update order with DTE information
      const updatedInvoices = invoices.map((inv) =>
        inv.id === invoice.id
          ? {
            ...inv,
            dteUuid: "DTE-UUID-" + Date.now(),
            dteStatus: "accepted",
            dteXmlUrl: `/dte/xml/${invoice.id}.xml`,
            dtePdfUrl: `/dte/pdf/${invoice.id}.pdf`,
          }
          : inv,
      )
      setInvoices(updatedInvoices)

      // BACKEND API CALL: Send DTE to patient via email/WhatsApp
      // await fetch('/api/notifications/send-dte', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     orderId: invoice.id,
      //     patientEmail: selectedPatient?.email,
      //     patientPhone: selectedPatient?.phone,
      //     dteXmlUrl: `/dte/xml/${invoice.id}.xml`,
      //     dtePdfUrl: `/dte/pdf/${invoice.id}.pdf`
      //   })
      // })

      alert("DTE generado y enviado exitosamente")
    } catch (error) {
      console.error("Error generating DTE:", error)

      // BACKEND: Mark order as paid_pending_dte for retry
      const updatedInvoices = invoices.map((inv) =>
        inv.id === invoice.id
          ? {
            ...inv,
            dteStatus: "pending_retry",
          }
          : inv,
      )
      setInvoices(updatedInvoices)

      alert("Pago exitoso, pero error al generar DTE. Se reintentará automáticamente.")
    } finally {
      setIsDteProcessing(false)
    }
  }

  // BACKEND PROCESS: Legacy payment processing (cash, check, etc.)
  const handleProcessPayment = async (paymentMethod: string) => {
    if (processingPayment) {
      // BACKEND API CALL: Process non-Stripe payment
      // const response = await fetch('/api/payments/process', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     orderId: processingPayment.id,
      //     paymentMethod: paymentMethod,
      //     amount: processingPayment.patientAmount
      //   })
      // })

      const updatedInvoices = invoices.map((invoice) =>
        invoice.id === processingPayment.id
          ? {
            ...invoice,
            status: "Pagada" as const,
            paymentMethod,
            paymentDate: format(new Date(), "yyyy-MM-dd"),
          }
          : invoice,
      )
      setInvoices(updatedInvoices)

      // Print receipt for non-card payments
      const updatedInvoice = updatedInvoices.find((inv) => inv.id === processingPayment.id)
      if (updatedInvoice) {
        try {
          await printReceipt(updatedInvoice, paymentMethod)
          alert("Pago procesado y recibo impreso exitosamente")
        } catch (error) {
          alert("Pago procesado. Error al imprimir recibo, pero se puede reimprimir desde la factura.")
        }
      }

      setIsPaymentDialogOpen(false)
      setProcessingPayment(null)
    }
  }

  // BACKEND PROCESS: Initialize Stripe Terminal connection
  const initializeStripeTerminal = async () => {
    try {
      // BACKEND API CALL: Get connection token
      // const response = await fetch('/api/stripe/connection-token', { method: 'POST' })
      // const { secret } = await response.json()

      // Initialize Stripe Terminal SDK
      // const terminal = StripeTerminal.create({
      //   onFetchConnectionToken: () => Promise.resolve(secret)
      // })

      // Discover and connect to reader
      // const { discoveredReaders } = await terminal.discoverReaders({
      //   simulated: false,
      //   location: 'your_location_id'
      // })

      // if (discoveredReaders.length > 0) {
      //   await terminal.connectReader(discoveredReaders[0])
      //   setStripeTerminalConnected(true)
      // }

      // Mock connection for demo
      setStripeTerminalConnected(true)
      alert("Stripe Terminal conectado exitosamente")
    } catch (error) {
      console.error("Error connecting to Stripe Terminal:", error)
      alert("Error al conectar con Stripe Terminal")
    }
  }

  const addService = () => {
    setNewInvoice({
      ...newInvoice,
      services: [...newInvoice.services, { serviceId: "", quantity: 1, customPrice: 0 }],
    })
  }

  const removeService = (index: number) => {
    setNewInvoice({
      ...newInvoice,
      services: newInvoice.services.filter((_, i) => i !== index),
    })
  }

  const updateService = (index: number, field: string, value: any) => {
    const updatedServices = newInvoice.services.map((service, i) =>
      i === index ? { ...service, [field]: value } : service,
    )
    setNewInvoice({ ...newInvoice, services: updatedServices })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pagada":
        return "default"
      case "Pendiente":
        return "secondary"
      case "Vencida":
        return "destructive"
      default:
        return "outline"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Pagada":
        return <CheckCircle className="w-4 h-4" />
      case "Pendiente":
        return <Clock className="w-4 h-4" />
      case "Vencida":
        return <AlertCircle className="w-4 h-4" />
      default:
        return <FileText className="w-4 h-4" />
    }
  }

  // BACKEND PROCESS: Thermal printer integration (existing code)
  const printReceipt = async (invoice: Invoice, paymentMethod: string) => {
    try {
      if ("serial" in navigator) {
        const port = await (navigator as any).serial.requestPort()
        await port.open({ baudRate: 9600 })

        const writer = port.writable.getWriter()
        const encoder = new TextEncoder()

        const ESC = "\x1B"
        const GS = "\x1D"

        const receiptContent = generateReceiptContent(invoice, paymentMethod)

        await writer.write(encoder.encode(ESC + "@"))
        await writer.write(encoder.encode(receiptContent))
        await writer.write(encoder.encode("\n\n\n"))
        await writer.write(encoder.encode(GS + "V" + String.fromCharCode(66, 0)))

        writer.releaseLock()
        await port.close()

        return true
      } else {
        printReceiptFallback(invoice, paymentMethod)
        return true
      }
    } catch (error) {
      console.error("Printer error:", error)
      printReceiptFallback(invoice, paymentMethod)
      return false
    }
  }

  const generateDocumentNumber = (documentType: string) => {
    const prefix =
      {
        ticket: "TKT",
        factura: "FAC",
        creditoFiscal: "CF",
        dteFactura: "DTE-FAC",
        dteComprobante: "DTE-CCF",
      }[documentType] || "DOC"

    return `${prefix}-2024-${String(invoices.length + 1).padStart(3, "0")}`
  }

  const generateReceiptContent = (invoice: Invoice, paymentMethod: string) => {
    const now = new Date()
    const ESC = "\x1B"
    const GS = "\x1D"
    const docType = DOCUMENT_TYPES[invoice.documentType]

    let header = ""
    if (invoice.documentType === "ticket") {
      header = "TICKET DE VENTA"
    } else if (invoice.documentType === "factura") {
      header = "FACTURA"
    } else if (invoice.documentType === "creditoFiscal") {
      header = "CREDITO FISCAL"
    } else if (invoice.documentType === "dteFactura") {
      header = "DTE FACTURA"
    } else if (invoice.documentType === "dteComprobante") {
      header = "DTE COMPROBANTE"
    }

    return (
      `${ESC}a1` +
      `CLINICA MEDICA\n` +
      `NIT: 0614-123456-001-2\n` +
      `${header}\n` +
      `${ESC}a0` +
      `--------------------------------\n` +
      `Fecha: ${format(now, "dd/MM/yyyy HH:mm", { locale: es })}\n` +
      `Documento: ${invoice.id}\n` +
      `Paciente: ${invoice.patientName}\n` +
      `ID: ${invoice.patientId}\n` +
      (invoice.nit ? `NIT Cliente: ${invoice.nit}\n` : "") +
      (invoice.dteUuid ? `DTE UUID: ${invoice.dteUuid}\n` : "") +
      `--------------------------------\n` +
      `SERVICIOS:\n` +
      invoice.services
        .map(
          (service) =>
            `${service.description}\n` +
            `${service.quantity} x $${service.unitPrice.toLocaleString()}\n` +
            `  Total: $${service.total.toLocaleString()}\n`,
        )
        .join("") +
      `--------------------------------\n` +
      `Subtotal: $${invoice.subtotal.toLocaleString()}\n` +
      (invoice.discount > 0 ? `Descuento: -$${invoice.discount.toLocaleString()}\n` : "") +
      (docType.hasIVA ? `IVA (13%): $${invoice.tax.toLocaleString()}\n` : `Sin IVA\n`) +
      `${ESC}E1` +
      `TOTAL: $${invoice.total.toLocaleString()}\n` +
      `${ESC}E0` +
      `--------------------------------\n` +
      (invoice.insuranceCoverage > 0
        ? `Seguro (${invoice.insuranceCoverage}%): $${invoice.insuranceAmount.toLocaleString()}\n` +
        `Paciente paga: $${invoice.patientAmount.toLocaleString()}\n` +
        `--------------------------------\n`
        : "") +
      `Metodo de pago: ${paymentMethod}\n` +
      (invoice.stripePaymentId ? `Stripe ID: ${invoice.stripePaymentId}\n` : "") +
      `Estado: PAGADO\n` +
      `--------------------------------\n` +
      `${ESC}a1` +
      `Gracias por su visita\n` +
      (docType.hasIVA ? `Documento valido para credito fiscal\n` : "") +
      (invoice.dteUuid ? `DTE enviado por email\n` : "") +
      `${ESC}a0`
    )
  }

  const printReceiptFallback = (invoice: Invoice, paymentMethod: string) => {
    const printWindow = window.open("", "_blank")
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Recibo de Pago - ${invoice.id}</title>
          <style>
            body { 
              font-family: 'Courier New', monospace; 
              font-size: 12px; 
              width: 300px; 
              margin: 0 auto; 
              padding: 10px;
            }
            .center { text-align: center; }
            .bold { font-weight: bold; }
            .line { border-bottom: 1px dashed #000; margin: 5px 0; }
            @media print {
              body { width: auto; }
            }
          </style>
        </head>
        <body>
          <div class="center bold">
            <h2>CLINICA MEDICA</h2>
            <h3>RECIBO DE PAGO</h3>
          </div>
          <div class="line"></div>
          <p><strong>Fecha:</strong> ${format(new Date(), "dd/MM/yyyy HH:mm", { locale: es })}</p>
          <p><strong>Documento:</strong> ${invoice.id}</p>
          <p><strong>Paciente:</strong> ${invoice.patientName}</p>
          <p><strong>ID:</strong> ${invoice.patientId}</p>
          ${invoice.dteUuid ? `<p><strong>DTE UUID:</strong> ${invoice.dteUuid}</p>` : ""}
          <div class="line"></div>
          <p><strong>SERVICIOS:</strong></p>
          ${invoice.services
        .map(
          (service) => `
            <p>${service.description}<br>
            ${service.quantity} x $${service.unitPrice.toLocaleString()}<br>
            <strong>Total: $${service.total.toLocaleString()}</strong></p>
          `,
        )
        .join("")}
          <div class="line"></div>
          <p>Subtotal: $${invoice.subtotal.toLocaleString()}</p>
          ${invoice.discount > 0 ? `<p>Descuento: -$${invoice.discount.toLocaleString()}</p>` : ""}
          <p>IVA (13%): $${invoice.tax.toLocaleString()}</p>
          <p class="bold">TOTAL: $${invoice.total.toLocaleString()}</p>
          <div class="line"></div>
          ${
        invoice.insuranceCoverage > 0
          ? `
            <p>Seguro (${invoice.insuranceCoverage}%): $${invoice.insuranceAmount.toLocaleString()}</p>
            <p><strong>Paciente paga: $${invoice.patientAmount.toLocaleString()}</strong></p>
            <div class="line"></div>
          `
          : ""
      }
          <p><strong>Método de pago:</strong> ${paymentMethod}</p>
          ${invoice.stripePaymentId ? `<p><strong>Stripe ID:</strong> ${invoice.stripePaymentId}</p>` : ""}
          <p><strong>Estado:</strong> PAGADO</p>
          <div class="line"></div>
          <div class="center">
            <p><strong>Gracias por su visita</strong></p>
            ${invoice.dteUuid ? `<p><strong>DTE enviado por email</strong></p>` : ""}
          </div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 1000);
            }
          </script>
        </body>
        </html>
      `)
      printWindow.document.close()
    }
  }

  const handleReprintReceipt = async (invoice: Invoice) => {
    if (invoice.status === "Pagada") {
      try {
        await printReceipt(invoice, invoice.paymentMethod)
        alert("Recibo reimpreso exitosamente")
      } catch (error) {
        alert("Error al reimprimir recibo")
      }
    }
  }

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (!target.closest(".relative")) {
        setShowPatientSuggestions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleCloseCreateDialog = () => {
    setIsCreateDialogOpen(false)
    setSearchPatientTerm("")
    setShowPatientSuggestions(false)
    setNewInvoice({
      patientId: "",
      services: [{ serviceId: "", quantity: 1, customPrice: 0 }],
      discount: 0,
      notes: "",
      documentType: "ticket",
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 lg:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Facturación</h1>
                <p className="text-sm lg:text-base text-gray-500">Gestión de facturas y pagos</p>
              </div>
            </div>
            <div className="flex gap-2">
              {/* Stripe Terminal Connection Status */}
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100">
                <div className={`w-2 h-2 rounded-full ${stripeTerminalConnected ? "bg-green-500" : "bg-red-500"}`} />
                <span className="text-xs text-gray-600">
                  {stripeTerminalConnected ? "Terminal Conectado" : "Terminal Desconectado"}
                </span>
              </div>
              {!stripeTerminalConnected && (
                <Button onClick={initializeStripeTerminal} variant="outline" size="sm" className="bg-transparent">
                  <Wifi className="w-4 h-4 mr-2" />
                  Conectar Terminal
                </Button>
              )}
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Nueva </span>Factura
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-4 lg:p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-3">
            <TabsTrigger value="invoices">Facturas</TabsTrigger>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="services">Servicios</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Ingresos Totales</p>
                      <p className="text-2xl font-bold text-green-600">${totalRevenue.toLocaleString()}</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Facturas Pendientes</p>
                      <p className="text-2xl font-bold text-yellow-600">${pendingAmount.toLocaleString()}</p>
                    </div>
                    <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                      <Clock className="w-6 h-6 text-yellow-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Facturas Vencidas</p>
                      <p className="text-2xl font-bold text-red-600">${overdueAmount.toLocaleString()}</p>
                    </div>
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                      <AlertCircle className="w-6 h-6 text-red-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Facturas</p>
                      <p className="text-2xl font-bold text-blue-600">{invoices.length}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Receipt className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Invoices */}
            <Card>
              <CardHeader>
                <CardTitle>Facturas Recientes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {invoices.slice(0, 5).map((invoice) => (
                    <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(invoice.status)}
                          <div>
                            <p className="font-medium">{invoice.id}</p>
                            <p className="text-sm text-gray-500">{invoice.patientName}</p>
                            {invoice.dteUuid && (
                              <div className="flex items-center gap-1 text-xs text-green-600">
                                <Shield className="w-3 h-3" />
                                DTE Generado
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${invoice.total.toLocaleString()}</p>
                        <Badge variant={getStatusColor(invoice.status)} className="text-xs">
                          {invoice.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Invoices Tab */}
          <TabsContent value="invoices" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        placeholder="Buscar por paciente o número de factura..."
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
                        <SelectItem value="pagada">Pagada</SelectItem>
                        <SelectItem value="pendiente">Pendiente</SelectItem>
                        <SelectItem value="vencida">Vencida</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={dateFilter} onValueChange={setDateFilter}>
                      <SelectTrigger className="w-full sm:w-40">
                        <SelectValue placeholder="Fecha" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas las fechas</SelectItem>
                        <SelectItem value="today">Hoy</SelectItem>
                        <SelectItem value="week">Esta semana</SelectItem>
                        <SelectItem value="month">Este mes</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={documentTypeFilter} onValueChange={setDocumentTypeFilter}>
                      <SelectTrigger className="w-full sm:w-40">
                        <SelectValue placeholder="Tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos los tipos</SelectItem>
                        <SelectItem value="ticket">Tickets</SelectItem>
                        <SelectItem value="factura">Facturas</SelectItem>
                        <SelectItem value="creditoFiscal">Crédito Fiscal</SelectItem>
                        <SelectItem value="dteFactura">DTE Factura</SelectItem>
                        <SelectItem value="dteComprobante">DTE Comprobante</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Invoices Table */}
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="p-4 text-left text-sm font-medium text-gray-900">Documento</th>
                      <th className="p-4 text-left text-sm font-medium text-gray-900">Paciente</th>
                      <th className="p-4 text-left text-sm font-medium text-gray-900 hidden md:table-cell">Fecha</th>
                      <th className="p-4 text-left text-sm font-medium text-gray-900 hidden lg:table-cell">
                        Vencimiento
                      </th>
                      <th className="p-4 text-left text-sm font-medium text-gray-900">Total</th>
                      <th className="p-4 text-left text-sm font-medium text-gray-900">Estado</th>
                      <th className="p-4 text-left text-sm font-medium text-gray-900">Acciones</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                    {paginatedInvoices.map((invoice) => (
                      <tr key={invoice.id} className="hover:bg-gray-50">
                        <td className="p-4">
                          <div className="font-medium text-gray-900">{invoice.id}</div>
                          <div className="text-xs text-gray-500">{DOCUMENT_TYPES[invoice.documentType]?.name}</div>
                          {invoice.dteUuid && (
                            <div className="flex items-center gap-1 text-xs text-green-600 mt-1">
                              <Shield className="w-3 h-3" />
                              DTE: {invoice.dteStatus}
                            </div>
                          )}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <User className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{invoice.patientName}</div>
                              <div className="text-sm text-gray-500">{invoice.patientId}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 hidden md:table-cell">
                          <div className="text-sm text-gray-900">
                            {format(new Date(invoice.date), "dd/MM/yyyy", { locale: es })}
                          </div>
                        </td>
                        <td className="p-4 hidden lg:table-cell">
                          <div className="text-sm text-gray-900">
                            {format(new Date(invoice.dueDate), "dd/MM/yyyy", { locale: es })}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="font-medium text-gray-900">${invoice.total.toLocaleString()}</div>
                          {invoice.insuranceCoverage > 0 && (
                            <div className="text-xs text-gray-500">Seguro: {invoice.insuranceCoverage}%</div>
                          )}
                        </td>
                        <td className="p-4">
                          <Badge variant={getStatusColor(invoice.status)}>{invoice.status}</Badge>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setViewingInvoice(invoice)
                                setIsViewSheetOpen(true)
                              }}
                              className="h-8 w-8 p-0"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            {invoice.status === "Pendiente" && (
                              <>
                                {stripeTerminalConnected && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleProcessStripePayment(invoice)}
                                    disabled={isProcessingStripePayment}
                                    className="h-8 w-8 p-0"
                                    title="Pago con Tarjeta NFC"
                                  >
                                    <CreditCard className="w-4 h-4" />
                                  </Button>
                                )}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setProcessingPayment(invoice)
                                    setIsPaymentDialogOpen(true)
                                  }}
                                  className="h-8 w-8 p-0"
                                  title="Otros métodos de pago"
                                >
                                  <DollarSign className="w-4 h-4" />
                                </Button>
                              </>
                            )}
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Download className="w-4 h-4" />
                            </Button>
                            {invoice.status === "Pagada" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleReprintReceipt(invoice)}
                                className="h-8 w-8 p-0"
                                title="Reimprimir Recibo"
                              >
                                <Receipt className="w-4 h-4" />
                              </Button>
                            )}
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
                      {Math.min(currentPage * itemsPerPage, filteredInvoices.length)} de {filteredInvoices.length}{" "}
                      facturas
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
          </TabsContent>

          {/* Services Tab */}
          <TabsContent value="services" className="space-y-6">
            {/* Stripe Terminal Setup */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Configuración Stripe Terminal NFC
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Estado de Conexión:</h4>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-3 h-3 rounded-full ${stripeTerminalConnected ? "bg-green-500" : "bg-red-500"}`}
                      />
                      <span className="text-sm text-blue-800">
                        {stripeTerminalConnected ? "Terminal NFC Conectado" : "Terminal NFC Desconectado"}
                      </span>
                    </div>
                  </div>
                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <h4 className="font-medium text-yellow-900 mb-2">Dispositivos Compatibles:</h4>
                    <ul className="text-sm text-yellow-800 space-y-1">
                      <li>• Stripe Terminal BBPOS WisePOS E</li>
                      <li>• Stripe Terminal Verifone P400</li>
                      <li>• Tap to Pay en iPhone/Android</li>
                      <li>• Cualquier lector NFC compatible con Stripe</li>
                    </ul>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={initializeStripeTerminal}
                      disabled={stripeTerminalConnected}
                      className={stripeTerminalConnected ? "bg-green-600" : ""}
                    >
                      <Wifi className="w-4 h-4 mr-2" />
                      {stripeTerminalConnected ? "Conectado" : "Conectar Terminal"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        // BACKEND: Test Stripe Terminal connection
                        alert("Probando conexión con Stripe Terminal...")
                      }}
                      className="bg-transparent"
                    >
                      <Receipt className="w-4 h-4 mr-2" />
                      Probar Conexión
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* DTE Configuration */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Configuración DTE El Salvador
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-900 mb-2">Estado DTE:</h4>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                      <span className="text-sm text-green-800">Conectado al Ministerio de Hacienda</span>
                    </div>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Información de la Clínica:</h4>
                    <div className="text-sm text-blue-800 space-y-1">
                      <p>
                        <strong>NIT:</strong> 0614-123456-001-2
                      </p>
                      <p>
                        <strong>Nombre:</strong> Clínica Médica El Salvador
                      </p>
                      <p>
                        <strong>Actividad Económica:</strong> Servicios de Salud
                      </p>
                      <p>
                        <strong>Ambiente:</strong> Producción
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => {
                      // BACKEND: Test DTE connection
                      alert("Probando conexión con Ministerio de Hacienda...")
                    }}
                    className="bg-transparent"
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Probar Conexión DTE
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Printer Setup Instructions */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Receipt className="w-5 h-5" />
                  Configuración de Impresora Térmica
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Instrucciones de Configuración:</h4>
                    <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                      <li>Conecte la impresora térmica via USB o Serial</li>
                      <li>Instale los drivers necesarios para su impresora</li>
                      <li>Configure la velocidad de baudios a 9600</li>
                      <li>Al procesar un pago, el sistema solicitará acceso al puerto serial</li>
                      <li>Seleccione su impresora térmica de la lista</li>
                    </ol>
                  </div>
                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <h4 className="font-medium text-yellow-900 mb-2">Impresoras Compatibles:</h4>
                    <ul className="text-sm text-yellow-800 space-y-1">
                      <li>• Epson TM-T20, TM-T82, TM-T88</li>
                      <li>• Star TSP100, TSP650, TSP700</li>
                      <li>• Citizen CT-S310, CT-S4000</li>
                      <li>• Cualquier impresora compatible con ESC/POS</li>
                    </ul>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => {
                      // Test printer connection
                      const testInvoice = mockInvoices[0]
                      printReceipt(testInvoice, "Efectivo")
                    }}
                    className="bg-transparent"
                  >
                    <Receipt className="w-4 h-4 mr-2" />
                    Probar Impresora
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Catálogo de Servicios</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mockServices.map((service) => (
                    <div key={service.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-medium">{service.name}</h4>
                          <Badge variant="outline" className="text-xs mt-1">
                            {service.category}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-600">${service.price.toLocaleString()}</p>
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

      {/* Create Invoice Dialog */}
      <Dialog
        open={isCreateDialogOpen}
        onOpenChange={(open) => {
          if (!open) handleCloseCreateDialog()
          else setIsCreateDialogOpen(true)
        }}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nueva Factura</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            {/* Patient Selection */}
            <div>
              <Label>Paciente</Label>
              <div className="relative mt-1">
                <Input
                  placeholder="Buscar paciente por nombre..."
                  value={
                    newInvoice.patientId
                      ? mockPatients.find((p) => p.id === newInvoice.patientId)?.name || ""
                      : searchPatientTerm
                  }
                  onChange={(e) => {
                    const value = e.target.value
                    setSearchPatientTerm(value)
                    setNewInvoice({ ...newInvoice, patientId: "" })
                    setShowPatientSuggestions(value.length > 0)
                  }}
                  onFocus={() => setShowPatientSuggestions(searchPatientTerm.length > 0)}
                />
                {showPatientSuggestions && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                    {filteredPatientSuggestions.length > 0 ? (
                      filteredPatientSuggestions.map((patient) => (
                        <div
                          key={patient.id}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                          onClick={() => {
                            setNewInvoice({ ...newInvoice, patientId: patient.id })
                            setSearchPatientTerm("")
                            setShowPatientSuggestions(false)
                          }}
                        >
                          <div className="font-medium text-gray-900">{patient.name}</div>
                          <div className="text-sm text-gray-500">
                            {patient.id} - {patient.insurance}
                          </div>
                          <div className="text-xs text-gray-400">
                            Cobertura: {patient.coverage}% | NIT: {patient.nit || "No registrado"}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-gray-500 text-sm">No se encontraron pacientes</div>
                    )}
                  </div>
                )}
              </div>
              {newInvoice.patientId && (
                <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-blue-900">
                        {mockPatients.find((p) => p.id === newInvoice.patientId)?.name}
                      </p>
                      <p className="text-sm text-blue-700">
                        {mockPatients.find((p) => p.id === newInvoice.patientId)?.insurance} - Cobertura:{" "}
                        {mockPatients.find((p) => p.id === newInvoice.patientId)?.coverage}%
                      </p>
                      <p className="text-xs text-blue-600">
                        NIT: {mockPatients.find((p) => p.id === newInvoice.patientId)?.nit || "No registrado"}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setNewInvoice({ ...newInvoice, patientId: "" })
                        setSearchPatientTerm("")
                      }}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Document Type Selection */}
            <div>
              <Label>Tipo de Documento</Label>
              <Select
                value={newInvoice.documentType}
                onValueChange={(value) => setNewInvoice({ ...newInvoice, documentType: value })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Seleccionar tipo de documento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ticket">Ticket</SelectItem>
                  <SelectItem value="dteFactura">Factura </SelectItem>
                  <SelectItem value="dteComprobante">Credito Fiscal </SelectItem>
                </SelectContent>
              </Select>
              {(newInvoice.documentType === "dteFactura" || newInvoice.documentType === "dteComprobante") && (
                <div className="mt-2 p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-800">
                    <strong>DTE El Salvador:</strong> Este documento incluye IVA (13%) y requiere NIT del paciente. Se
                    enviará automáticamente al Ministerio de Hacienda después del pago.
                  </p>
                </div>
              )}
              {(newInvoice.documentType === "factura" || newInvoice.documentType === "creditoFiscal") && (
                <div className="mt-2 p-3 bg-yellow-50 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <strong>Nota:</strong> Este documento incluye ITBIS (18%) y requiere RNC del paciente.
                  </p>
                </div>
              )}
            </div>

            {/* Services */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <Label>Servicios</Label>
                <Button onClick={addService} variant="outline" size="sm" className="bg-transparent">
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar Servicio
                </Button>
              </div>
              <div className="space-y-4">
                {newInvoice.services.map((service, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium">Servicio {index + 1}</h4>
                      {newInvoice.services.length > 1 && (
                        <Button variant="ghost" size="sm" onClick={() => removeService(index)}>
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label className="text-sm">Servicio</Label>
                        <Select
                          value={service.serviceId}
                          onValueChange={(value) => updateService(index, "serviceId", value)}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Seleccionar servicio" />
                          </SelectTrigger>
                          <SelectContent>
                            {mockServices.map((s) => (
                              <SelectItem key={s.id} value={s.id}>
                                {s.name} - ${s.price}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-sm">Cantidad</Label>
                        <Input
                          type="number"
                          min="1"
                          value={service.quantity}
                          onChange={(e) => updateService(index, "quantity", Number.parseInt(e.target.value))}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-sm">Precio Personalizado (opcional)</Label>
                        <Input
                          type="number"
                          min="0"
                          value={service.customPrice}
                          onChange={(e) => updateService(index, "customPrice", Number.parseFloat(e.target.value) || 0)}
                          className="mt-1"
                          placeholder="Dejar vacío para precio estándar"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Discount */}
            <div>
              <Label htmlFor="discount">Descuento (%)</Label>
              <Input
                id="discount"
                type="number"
                min="0"
                max="100"
                value={newInvoice.discount}
                onChange={(e) => setNewInvoice({ ...newInvoice, discount: Number.parseFloat(e.target.value) || 0 })}
                className="mt-1"
              />
            </div>

            {/* Notes */}
            <div>
              <Label htmlFor="notes">Notas</Label>
              <Textarea
                id="notes"
                value={newInvoice.notes}
                onChange={(e) => setNewInvoice({ ...newInvoice, notes: e.target.value })}
                placeholder="Notas adicionales..."
                className="mt-1"
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)} className="bg-transparent">
                Cancelar
              </Button>
              <Button
                onClick={handleCreateInvoice}
                disabled={!newInvoice.patientId || newInvoice.services.some((s) => !s.serviceId)}
              >
                <Save className="w-4 h-4 mr-2" />
                Crear Factura
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Invoice Sheet */}
      <Sheet open={isViewSheetOpen} onOpenChange={setIsViewSheetOpen}>
        <SheetContent className="w-full sm:max-w-2xl">
          <SheetHeader>
            <SheetTitle>Detalle de Factura</SheetTitle>
          </SheetHeader>
          {viewingInvoice && (
            <ScrollArea className="h-[calc(100vh-120px)] pr-4">
              <div className="space-y-6 pb-8 pr-2">
                {/* Invoice Header */}
                <div className="border-b pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">{viewingInvoice.id}</h3>
                      <p className="text-sm text-gray-500">
                        Fecha: {format(new Date(viewingInvoice.date), "dd/MM/yyyy", { locale: es })}
                      </p>
                      {viewingInvoice.dteUuid && (
                        <div className="flex items-center gap-2 mt-2">
                          <Shield className="w-4 h-4 text-green-600" />
                          <span className="text-sm text-green-600">DTE: {viewingInvoice.dteUuid}</span>
                        </div>
                      )}
                    </div>
                    <Badge variant={getStatusColor(viewingInvoice.status)} className="text-sm">
                      {viewingInvoice.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="font-medium">{viewingInvoice.patientName}</p>
                    <p className="text-sm text-gray-500">{viewingInvoice.patientId}</p>
                    {viewingInvoice.nit && <p className="text-sm text-gray-500">NIT: {viewingInvoice.nit}</p>}
                  </div>
                </div>

                {/* Services */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Servicios</h4>
                  <div className="space-y-2">
                    {viewingInvoice.services.map((service, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-sm">{service.description}</p>
                          <p className="text-xs text-gray-500">
                            {service.quantity} x ${service.unitPrice.toLocaleString()}
                          </p>
                        </div>
                        <p className="font-medium">${service.total.toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Totals */}
                <div className="border-t pt-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal:</span>
                      <span>${viewingInvoice.subtotal.toLocaleString()}</span>
                    </div>
                    {viewingInvoice.discount > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Descuento:</span>
                        <span className="text-red-600">-${viewingInvoice.discount.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        {viewingInvoice.documentType.includes("dte") ? "IVA (13%)" : "ITBIS (18%)"}:
                      </span>
                      <span>${viewingInvoice.tax.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg border-t pt-2">
                      <span>Total:</span>
                      <span>${viewingInvoice.total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Insurance Coverage */}
                {viewingInvoice.insuranceCoverage > 0 && (
                  <div className="border-t pt-4">
                    <h4 className="font-medium text-gray-900 mb-3">Cobertura del Seguro</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Cobertura ({viewingInvoice.insuranceCoverage}%):</span>
                        <span className="text-green-600">${viewingInvoice.insuranceAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between font-medium">
                        <span>Monto del Paciente:</span>
                        <span>${viewingInvoice.patientAmount.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Payment Info */}
                {viewingInvoice.status === "Pagada" && (
                  <div className="border-t pt-4">
                    <h4 className="font-medium text-gray-900 mb-3">Información de Pago</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Método de Pago:</span>
                        <span>{viewingInvoice.paymentMethod}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Fecha de Pago:</span>
                        <span>{format(new Date(viewingInvoice.paymentDate), "dd/MM/yyyy", { locale: es })}</span>
                      </div>
                      {viewingInvoice.stripePaymentId && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Stripe ID:</span>
                          <span className="text-xs font-mono">{viewingInvoice.stripePaymentId}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* DTE Information */}
                {viewingInvoice.dteUuid && (
                  <div className="border-t pt-4">
                    <h4 className="font-medium text-gray-900 mb-3">Información DTE</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">UUID DTE:</span>
                        <span className="text-xs font-mono">{viewingInvoice.dteUuid}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Estado DTE:</span>
                        <Badge variant={viewingInvoice.dteStatus === "accepted" ? "default" : "secondary"}>
                          {viewingInvoice.dteStatus}
                        </Badge>
                      </div>
                    </div>
                  </div>
                )}

                {/* Notes */}
                {viewingInvoice.notes && (
                  <div className="border-t pt-4">
                    <h4 className="font-medium text-gray-900 mb-2">Notas</h4>
                    <p className="text-sm text-gray-600">{viewingInvoice.notes}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-2 pt-4 sticky bottom-0 bg-white pb-4">
                  {/*<Button variant="outline" className="flex-1 bg-transparent">
                    <Download className="w-4 h-4 mr-2" />
                    Descargar PDF
                  </Button>*/}
                  <Button variant="outline" className="flex-1 bg-transparent">
                    <Send className="w-4 h-4 mr-2" />
                    Enviar por Email
                  </Button>
                  {viewingInvoice.dteXmlUrl && (
                    <Button variant="outline" className="flex-1 bg-transparent">
                      <Shield className="w-4 h-4 mr-2" />
                      Descargar DTE
                    </Button>
                  )}
                  {viewingInvoice.status === "Pagada" && (
                    <Button
                      variant="outline"
                      className="flex-1 bg-transparent"
                      onClick={() => handleReprintReceipt(viewingInvoice)}
                    >
                      <Receipt className="w-4 h-4 mr-2" />
                      Reimprimir Recibo
                    </Button>
                  )}
                </div>
              </div>
            </ScrollArea>
          )}
        </SheetContent>
      </Sheet>

      {/* Payment Dialog */}
      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Procesar Pago</DialogTitle>
          </DialogHeader>
          {processingPayment && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="font-medium">{processingPayment.patientName}</p>
                <p className="text-sm text-gray-500">Factura: {processingPayment.id}</p>
                <p className="text-lg font-bold text-green-600 mt-2">
                  Total: ${processingPayment.patientAmount.toLocaleString()}
                </p>
                {processingPayment.insuranceCoverage > 0 && (
                  <p className="text-sm text-gray-500">
                    (Seguro cubre: ${processingPayment.insuranceAmount.toLocaleString()})
                  </p>
                )}
              </div>

              {/* Stripe NFC Payment Option */}
              {stripeTerminalConnected && (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Pago con Tarjeta NFC</h4>
                  <Button
                    onClick={() => handleProcessStripePayment(processingPayment)}
                    disabled={isProcessingStripePayment}
                    className="w-full"
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    {isProcessingStripePayment ? "Procesando..." : "Pagar con Tarjeta NFC"}
                  </Button>
                  {isProcessingStripePayment && (
                    <p className="text-sm text-blue-700 mt-2">
                      Presente la tarjeta o dispositivo móvil al lector NFC...
                    </p>
                  )}
                </div>
              )}

              {/* Traditional Payment Methods */}
              <div>
                <Label>Otros Métodos de Pago</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <Button variant="outline" onClick={() => handleProcessPayment("Efectivo")} className="bg-transparent">
                    Efectivo
                  </Button>
                  <Button variant="outline" onClick={() => handleProcessPayment("Cheque")} className="bg-transparent">
                    Cheque
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleProcessPayment("Transferencia")}
                    className="bg-transparent"
                  >
                    Transferencia
                  </Button>
                  <Button variant="outline" onClick={() => handleProcessPayment("Otro")} className="bg-transparent">
                    Otro
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Processing Overlays */}
      {isProcessingStripePayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full mx-4">
            <div className="text-center">
              <CreditCard className="w-12 h-12 mx-auto mb-4 text-blue-600 animate-pulse" />
              <h3 className="text-lg font-semibold mb-2">Procesando Pago</h3>
              <p className="text-gray-600 mb-4">Presente la tarjeta o dispositivo móvil al lector NFC</p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: "60%" }}></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {isDteProcessing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full mx-4">
            <div className="text-center">
              <Shield className="w-12 h-12 mx-auto mb-4 text-green-600 animate-pulse" />
              <h3 className="text-lg font-semibold mb-2">Generando DTE</h3>
              <p className="text-gray-600 mb-4">Enviando documento al Ministerio de Hacienda...</p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full animate-pulse" style={{ width: "80%" }}></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
