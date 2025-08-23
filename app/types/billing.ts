// BACKEND: Database schema types for the billing system

export interface Order {
  id: string
  patientId: string
  patientName: string
  services: OrderService[]
  subtotal: number
  tax: number
  discount: number
  total: number
  patientAmount: number
  insuranceCoverage: number
  insuranceAmount: number
  documentType: "ticket" | "factura" | "creditoFiscal" | "dteFactura" | "dteComprobante"
  status: "pending_payment" | "paid" | "paid_pending_dte" | "paid_and_fiscalized" | "failed"
  notes?: string
  nit?: string
  rnc?: string
  createdAt: Date
  updatedAt: Date
}

export interface OrderService {
  description: string
  quantity: number
  unitPrice: number
  total: number
}

export interface Payment {
  id: string
  orderId: string
  stripePaymentId?: string
  stripeReceiptUrl?: string
  amount: number
  paymentMethod: string
  status: "pending" | "succeeded" | "failed"
  processedAt?: Date
  createdAt: Date
}

export interface DTE {
  id: string
  orderId: string
  dteUuid?: string
  controlNumber: string
  generationCode: string
  status: "pending" | "accepted" | "rejected" | "pending_retry"
  xmlContent?: string
  xmlUrl?: string
  pdfUrl?: string
  submittedAt?: Date
  acceptedAt?: Date
  createdAt: Date
  // BACKEND: DTE specific fields for El Salvador
  tipoDocumento: "01" | "03" // 01=Factura, 03=Comprobante
  receptor: {
    nit: string
    nombre: string
    telefono?: string
    correo?: string
  }
  resumen: {
    subTotal: number
    descuento: number
    ivaRetenido: number
    reteRenta: number
    montoTotalOperacion: number
    totalIva: number
    totalPagar: number
  }
}

// BACKEND: API request/response types
export interface CreateOrderRequest {
  patientId: string
  services: {
    serviceId: string
    quantity: number
    customPrice?: number
  }[]
  discount: number
  documentType: string
  notes?: string
}

export interface CreateStripePaymentIntentRequest {
  orderId: string
  amount: number // in cents
  currency: string
  metadata: {
    orderId: string
    patientId: string
    documentType: string
  }
}

export interface ConfirmStripePaymentRequest {
  orderId: string
  paymentIntentId: string
  status: "succeeded" | "failed"
}

export interface SubmitDTERequest {
  orderId: string
  dteData: {
    tipoDocumento: string
    numeroControl: string
    codigoGeneracion: string
    fechaEmision: string
    montoTotal: number
    receptor: {
      nit: string
      nombre: string
      telefono?: string
      correo?: string
    }
    cuerpoDocumento: {
      descripcion: string
      cantidad: number
      precioUnitario: number
      ventaTotal: number
    }[]
    medioPago: {
      codigo: string
      referencia?: string
    }
    resumen: {
      subTotal: number
      descuento: number
      ivaRetenido: number
      reteRenta: number
      montoTotalOperacion: number
      totalIva: number
      totalPagar: number
    }
  }
}
