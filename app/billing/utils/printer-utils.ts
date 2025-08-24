import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Invoice, DOCUMENT_TYPES } from "../mocks/billing-data"

// BACKEND PROCESS: Thermal printer integration
export const printReceipt = async (invoice: Invoice, paymentMethod: string) => {
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

export const generateReceiptContent = (invoice: Invoice, paymentMethod: string) => {
  const now = new Date()
  const ESC = "\x1B"
  const GS = "\x1D"
  const docType = DOCUMENT_TYPES[invoice.documentType as keyof typeof DOCUMENT_TYPES]

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
    (docType.hasIVA ? `IVA (13% incluido): $${invoice.tax.toLocaleString()}\n` : `Sin IVA\n`) +
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

export const printReceiptFallback = (invoice: Invoice, paymentMethod: string) => {
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
        <p>IVA (13% incluido): $${invoice.tax.toLocaleString()}</p>
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
