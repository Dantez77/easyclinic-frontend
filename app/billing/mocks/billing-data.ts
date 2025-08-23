// Mock billing data
export const mockInvoices = [
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

export const DOCUMENT_TYPES = {
  ticket: { name: "Ticket", requiresRNC: false, hasITBIS: false },
  factura: { name: "Factura", requiresRNC: true, hasITBIS: true },
  creditoFiscal: { name: "Crédito Fiscal", requiresRNC: true, hasITBIS: true },
  // BACKEND: Add DTE types for El Salvador
  dteFactura: { name: "DTE Factura", requiresNIT: true, hasIVA: true },
  dteComprobante: { name: "DTE Comprobante", requiresNIT: false, hasIVA: true },
}

export const mockServices = [
  { id: "SRV-001", name: "Consulta Médica General", price: 1500, category: "Consultas" },
  { id: "SRV-002", name: "Consulta Especializada - Cardiología", price: 2500, category: "Consultas" },
  { id: "SRV-003", name: "Consulta Especializada - Neurología", price: 2500, category: "Consultas" },
  { id: "SRV-004", name: "Electrocardiograma", price: 800, category: "Procedimientos" },
  { id: "SRV-005", name: "Radiografía de Tórax", price: 1200, category: "Imagenología" },
  { id: "SRV-006", name: "Hemograma Completo", price: 600, category: "Laboratorio" },
  { id: "SRV-007", name: "Química Sanguínea", price: 800, category: "Laboratorio" },
  { id: "SRV-008", name: "Ultrasonido Abdominal", price: 1800, category: "Imagenología" },
]

export const mockPatients = [
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
  { 
    id: "EXP-2024-001235", 
    name: "Juan Carlos Rodríguez", 
    insurance: "SeNaSa", 
    coverage: 80, 
    rnc: "101234568",
    nit: "0614-567890-001-3",
    email: "juan.rodriguez@email.com",
    phone: "+503-7234-5678",
  },
  { 
    id: "EXP-2024-001236", 
    name: "Carmen Rosa Martínez", 
    insurance: "Sin Seguro", 
    coverage: 0, 
    rnc: "",
    nit: "", // No NIT - will trigger validation warning for DTE documents
    email: "carmen.martinez@email.com",
    phone: "+503-7345-6789",
  },
  { 
    id: "EXP-2024-001237", 
    name: "Roberto Fernández", 
    insurance: "ARS Universal", 
    coverage: 75, 
    rnc: "101234569",
    nit: "",  // No NIT - will trigger validation warning for DTE documents
    email: "roberto.fernandez@email.com",
    phone: "+503-7456-7890",
  },
]

export type Invoice = (typeof mockInvoices)[0]
export type Service = (typeof mockServices)[0]
export type Patient = (typeof mockPatients)[0]
