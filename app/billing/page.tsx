"use client"

import * as React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Import mock data
import { 
  mockInvoices, 
  mockServices, 
  mockPatients,
  DOCUMENT_TYPES,
  type Invoice 
} from "./mocks/billing-data"

// Import custom hook
import { useBilling } from "./hooks/use-billing"

// Import printer utilities
import { printReceipt } from "./utils/printer-utils"

// Import components
import { BillingHeader } from "./components/billing-header"
import { DashboardMetrics } from "./components/dashboard-metrics"
import { RecentInvoices } from "./components/recent-invoices"
import { InvoiceFilters } from "./components/invoice-filters"
import { InvoicesTable } from "./components/invoices-table"
import { Pagination } from "./components/pagination"
import { ServicesCatalog } from "./components/services-catalog"
import { StripeTerminalConfig } from "./components/stripe-terminal-config"
import { DteConfig } from "./components/dte-config"
import { PrinterConfig } from "./components/printer-config"
import { CreateInvoiceDialog } from "./components/create-invoice-dialog"
import { ViewInvoiceSheet } from "./components/view-invoice-sheet"
import { PaymentDialog } from "./components/payment-dialog"

export default function BillingPage() {
  // Use custom hook for billing management
  const {
    invoices,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    dateFilter,
    setDateFilter,
    documentTypeFilter,
    setDocumentTypeFilter,
    currentPage,
    setCurrentPage,
    paginatedInvoices,
    totalPages,
    itemsPerPage,
    totalRevenue,
    pendingAmount,
    overdueAmount,
    addInvoice,
    updateInvoice,
  } = useBilling(mockInvoices)

  // Stripe Terminal state
  const [stripeTerminalConnected, setStripeTerminalConnected] = React.useState(false)
  const [isProcessingStripePayment, setIsProcessingStripePayment] = React.useState(false)
  const [isDteProcessing, setIsDteProcessing] = React.useState(false)

  // Dialog states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false)
  const [isViewSheetOpen, setIsViewSheetOpen] = React.useState(false)
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = React.useState(false)
  const [viewingInvoice, setViewingInvoice] = React.useState<Invoice | null>(null)
  const [processingPayment, setProcessingPayment] = React.useState<Invoice | null>(null)
  const [activeTab, setActiveTab] = React.useState("invoices")

  // New invoice form state
  const [newInvoice, setNewInvoice] = React.useState({
    patientId: "",
    services: [{ serviceId: "", quantity: 1, customPrice: 0 }],
    discount: 0,
    notes: "",
    documentType: "ticket",
  })

  const [searchPatientTerm, setSearchPatientTerm] = React.useState("")
  const [showPatientSuggestions, setShowPatientSuggestions] = React.useState(false)

  // Filter patients based on search term
  const filteredPatientSuggestions = React.useMemo(() => {
    if (!searchPatientTerm) return []
    return mockPatients
      .filter(
        (patient) =>
          patient.name.toLowerCase().includes(searchPatientTerm.toLowerCase()) ||
          patient.id.toLowerCase().includes(searchPatientTerm.toLowerCase()),
      )
      .slice(0, 5)
  }, [searchPatientTerm])

  // BACKEND PROCESS: Create Invoice/Order
  const handleCreateInvoice = async () => {
    const selectedPatient = mockPatients.find((p) => p.id === newInvoice.patientId)
    const docType = DOCUMENT_TYPES[newInvoice.documentType]

    // Validate patient selection
    if (!selectedPatient) {
      alert("Por favor seleccione un paciente.")
      return
    }

    // Check NIT/RNC requirement
    if (docType.requiresNIT && !selectedPatient?.nit) {
      alert(`Este tipo de documento (${docType.name}) requiere que el paciente tenga NIT registrado.\n\nPaciente: ${selectedPatient.name}\nNIT actual: ${selectedPatient.nit || 'No registrado'}`)
      return
    }

    if (docType.requiresRNC && !selectedPatient?.rnc) {
      alert(`Este tipo de documento (${docType.name}) requiere que el paciente tenga RNC registrado.\n\nPaciente: ${selectedPatient.name}\nRNC actual: ${selectedPatient.rnc || 'No registrado'}`)
      return
    }

    // Validate services
    if (newInvoice.services.some((s) => !s.serviceId)) {
      alert("Por favor seleccione todos los servicios antes de crear la factura.")
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
      // Mock response for demo
      const invoice: Invoice = {
        id: `FAC-2024-${String(invoices.length + 1).padStart(3, "0")}`,
        ...orderData,
        date: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: "Pendiente",
        paymentMethod: "",
        paymentDate: "",
        insuranceCoverage,
        insuranceAmount,
      }

      addInvoice(invoice)
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
      // Mock successful payment for demo
      await new Promise((resolve) => setTimeout(resolve, 3000)) // Simulate payment processing

      // Update invoice status to paid
      updateInvoice(invoice.id, {
        status: "Pagada",
        paymentMethod: "Tarjeta NFC",
        paymentDate: new Date().toISOString().split('T')[0],
        stripePaymentId: "pi_mock_123456",
        stripeReceiptUrl: "https://stripe.com/receipt/mock_123456",
      })

      // Print receipt for Stripe payments
      const updatedInvoice = invoices.find((inv) => inv.id === invoice.id)
      if (updatedInvoice) {
        try {
          await printReceipt(updatedInvoice, "Tarjeta NFC")
        } catch (error) {
          console.error("Error printing receipt:", error)
        }
      }

      // BACKEND PROCESS: Generate DTE after successful payment
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
      // Mock DTE processing for demo
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // BACKEND: Update order with DTE information
      updateInvoice(invoice.id, {
        dteUuid: "DTE-UUID-" + Date.now(),
        dteStatus: "accepted",
        dteXmlUrl: `/dte/xml/${invoice.id}.xml`,
        dtePdfUrl: `/dte/pdf/${invoice.id}.pdf`,
      })

      alert("DTE generado y enviado exitosamente")
    } catch (error) {
      console.error("Error generating DTE:", error)

      // BACKEND: Mark order as paid_pending_dte for retry
      updateInvoice(invoice.id, {
        dteStatus: "pending_retry",
      })

      alert("Pago exitoso, pero error al generar DTE. Se reintentará automáticamente.")
    } finally {
      setIsDteProcessing(false)
    }
  }

  // BACKEND PROCESS: Legacy payment processing (cash, check, etc.)
  const handleProcessPayment = async (paymentMethod: string) => {
    if (processingPayment) {
      updateInvoice(processingPayment.id, {
        status: "Pagada",
        paymentMethod,
        paymentDate: new Date().toISOString().split('T')[0],
      })

      // Print receipt for non-card payments
      const updatedInvoice = invoices.find((inv) => inv.id === processingPayment.id)
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

  const handleTestPrinter = async () => {
    // Test printer connection
    const testInvoice = mockInvoices[0]
    try {
      await printReceipt(testInvoice, "Efectivo")
      alert("Prueba de impresora exitosa")
    } catch (error) {
      alert("Error al probar la impresora. Verifique la conexión.")
    }
  }

  const handlePatientSelect = (patient: any) => {
    setNewInvoice({ ...newInvoice, patientId: patient.id })
    setSearchPatientTerm("")
    setShowPatientSuggestions(false)
  }

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

  // Close suggestions when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (!target.closest(".relative")) {
        setShowPatientSuggestions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <BillingHeader
        stripeTerminalConnected={stripeTerminalConnected}
        onConnectTerminal={initializeStripeTerminal}
        onCreateInvoice={() => setIsCreateDialogOpen(true)}
      />

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
            <DashboardMetrics
              totalRevenue={totalRevenue}
              pendingAmount={pendingAmount}
              overdueAmount={overdueAmount}
              totalInvoices={invoices.length}
            />
            <RecentInvoices
              invoices={invoices}
              onViewInvoice={(invoice) => {
                setViewingInvoice(invoice)
                setIsViewSheetOpen(true)
              }}
            />
          </TabsContent>

          {/* Invoices Tab */}
          <TabsContent value="invoices" className="space-y-6">
            <InvoiceFilters
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              statusFilter={statusFilter}
              onStatusChange={setStatusFilter}
              dateFilter={dateFilter}
              onDateChange={setDateFilter}
              documentTypeFilter={documentTypeFilter}
              onDocumentTypeChange={setDocumentTypeFilter}
            />

            <InvoicesTable
              invoices={paginatedInvoices}
              stripeTerminalConnected={stripeTerminalConnected}
              isProcessingStripePayment={isProcessingStripePayment}
              onViewInvoice={(invoice) => {
                setViewingInvoice(invoice)
                setIsViewSheetOpen(true)
              }}
              onProcessStripePayment={handleProcessStripePayment}
              onProcessPayment={(invoice) => {
                setProcessingPayment(invoice)
                setIsPaymentDialogOpen(true)
              }}
              onReprintReceipt={handleReprintReceipt}
            />

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={invoices.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
            />
          </TabsContent>

          {/* Services Tab */}
          <TabsContent value="services" className="space-y-6">
            <StripeTerminalConfig
              stripeTerminalConnected={stripeTerminalConnected}
              onConnectTerminal={initializeStripeTerminal}
            />
            <DteConfig />
            <PrinterConfig onTestPrinter={handleTestPrinter} />
            <ServicesCatalog services={mockServices} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Dialogs and Sheets */}
      <CreateInvoiceDialog
        isOpen={isCreateDialogOpen}
        onOpenChange={(open) => {
          if (!open) handleCloseCreateDialog()
          else setIsCreateDialogOpen(true)
        }}
        newInvoice={newInvoice}
        onNewInvoiceChange={setNewInvoice}
        searchPatientTerm={searchPatientTerm}
        onSearchPatientTermChange={setSearchPatientTerm}
        showPatientSuggestions={showPatientSuggestions}
        onShowPatientSuggestionsChange={setShowPatientSuggestions}
        filteredPatientSuggestions={filteredPatientSuggestions}
        allPatients={mockPatients}
        onPatientSelect={handlePatientSelect}
        onAddService={addService}
        onRemoveService={removeService}
        onUpdateService={updateService}
        onCreateInvoice={handleCreateInvoice}
        services={mockServices}
      />

      <ViewInvoiceSheet
        isOpen={isViewSheetOpen}
        onOpenChange={setIsViewSheetOpen}
        invoice={viewingInvoice}
        onReprintReceipt={handleReprintReceipt}
      />

      <PaymentDialog
        isOpen={isPaymentDialogOpen}
        onOpenChange={setIsPaymentDialogOpen}
        invoice={processingPayment}
        stripeTerminalConnected={stripeTerminalConnected}
        isProcessingStripePayment={isProcessingStripePayment}
        onProcessStripePayment={handleProcessStripePayment}
        onProcessPayment={handleProcessPayment}
      />

      {/* Processing Overlays */}
      {isProcessingStripePayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-card p-6 rounded-lg shadow-lg max-w-sm w-full mx-4">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 text-primary animate-pulse">💳</div>
              <h3 className="text-lg font-semibold mb-2">Procesando Pago</h3>
              <p className="text-muted-foreground mb-4">Presente la tarjeta o dispositivo móvil al lector NFC</p>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: "60%" }}></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {isDteProcessing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-card p-6 rounded-lg shadow-lg max-w-sm w-full mx-4">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 text-green-600 animate-pulse">🛡️</div>
              <h3 className="text-lg font-semibold mb-2">Generando DTE</h3>
              <p className="text-muted-foreground mb-4">Enviando documento al Ministerio de Hacienda...</p>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full animate-pulse" style={{ width: "80%" }}></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
