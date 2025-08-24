// Mock billing data - Updated for El Salvador (IVA-inclusive pricing)
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
    tax: 265, // IVA extraído del precio total (2300 * 0.115044)
    discount: 0,
    total: 2300, // Precio final = precio mostrado (IVA incluido)
    status: "Pagada",
    paymentMethod: "Efectivo",
    paymentDate: "2024-11-15",
    insuranceCoverage: 70,
    insuranceAmount: 1610,
    patientAmount: 690,
    notes: "Pago completo recibido",
    documentType: "dteFactura",
    nit: "1234-567890-001-2",
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
    tax: 426, // IVA extraído del precio total (3700 * 0.115044)
    discount: 200,
    total: 3500, // Precio final después del descuento (IVA incluido)
    status: "Pendiente",
    paymentMethod: "",
    paymentDate: "",
    insuranceCoverage: 80,
    insuranceAmount: 2800,
    patientAmount: 700,
    notes: "Esperando aprobación del seguro",
    documentType: "dteFactura",
    nit: "2345-678901-002-3",
  },
  {
    id: "FAC-2024-003",
    patientId: "EXP-2024-001236",
    patientName: "Carmen Rosa Martínez",
    date: "2024-11-05",
    dueDate: "2024-12-05",
    services: [
      { description: "Consulta Médica General", quantity: 1, unitPrice: 1500, total: 1500 },
      { description: "Radiografía de Tórax", quantity: 1, unitPrice: 900, total: 900 },
    ],
    subtotal: 2400,
    tax: 276, // IVA extraído del precio total (2400 * 0.115044)
    discount: 0,
    total: 2400, // Precio final = precio mostrado (IVA incluido)
    status: "Pagada",
    paymentMethod: "Tarjeta",
    paymentDate: "2024-11-05",
    insuranceCoverage: 0,
    insuranceAmount: 0,
    patientAmount: 2400,
    notes: "Paciente sin seguro médico",
    documentType: "dteComprobante",
    nit: "",
  },
]

export const DOCUMENT_TYPES = {
  ticket: { name: "Ticket", requiresNIT: false, hasIVA: false },
  dteFactura: { name: "DTE Factura", requiresNIT: true, hasIVA: true },
  dteComprobante: { name: "DTE Comprobante", requiresNIT: false, hasIVA: true },
}

export const mockServices = [
  { id: "SRV-001", name: "Consulta Médica General en Gastroenterología", price: 1500, category: "Consultas" },
  { id: "SRV-002", name: "Consulta Especializada - Hepatología", price: 2500, category: "Consultas" },
  { id: "SRV-003", name: "Endoscopia Digestiva Alta", price: 4500, category: "Procedimientos" },
  { id: "SRV-004", name: "Colonoscopia", price: 5000, category: "Procedimientos" },
  { id: "SRV-005", name: "Pruebas de Función Hepática", price: 1200, category: "Laboratorio" },
  { id: "SRV-006", name: "Ecografía Abdominal - Hígado y Vías Biliares", price: 1800, category: "Diagnóstico" },
  { id: "SRV-007", name: "Test de Helicobacter Pylori (Aliento o Sangre)", price: 900, category: "Laboratorio" },
  { id: "SRV-008", name: "Polipectomía Endoscópica", price: 3500, category: "Procedimientos" },
]


export const mockPatients = [
  {
    id: "EXP-2024-001234",
    name: "María Elena González",
    insurance: "ISSS",
    coverage: 70,
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
    nit: "0614-567890-001-3",
    email: "juan.rodriguez@email.com",
    phone: "+503-7234-5678",
  },
  { 
    id: "EXP-2024-001236", 
    name: "Carmen Rosa Martínez", 
    insurance: "Sin Seguro", 
    coverage: 0, 
    nit: "", // No NIT - will trigger validation warning for DTE documents
    email: "carmen.martinez@email.com",
    phone: "+503-7345-6789",
  },
  { 
    id: "EXP-2024-001237", 
    name: "Roberto Fernández", 
    insurance: "ARS Universal", 
    coverage: 75, 
    nit: "",  // No NIT - will trigger validation warning for DTE documents
    email: "roberto.fernandez@email.com",
    phone: "+503-7456-7890",
  },
]

export type Invoice = (typeof mockInvoices)[0]
export type Service = (typeof mockServices)[0]
export type Patient = (typeof mockPatients)[0]
