// src/lib/navigation-routes.ts

export interface NavigationRoute {
  path: string
  labels: {
    en: string
    es: string
  }
  aliases?: {
    en?: string[]
    es?: string[]
  }
}

export const navigationRoutes: NavigationRoute[] = [
  {
    path: "/billing",
    labels: { en: "Billing", es: "Facturación" },
    aliases: { en: ["Invoices", "Payments"], es: ["Facturas", "Pagos", "Credito"] },
  },
  {
    path: "/activity-logs",
    labels: { en: "Activity Logs", es: "Auditorías" },
    aliases: { en: ["Audits", "Logs"], es: ["Registros", "Historial"] },
  },
  {
    path: "/inventory",
    labels: { en: "Inventory", es: "Inventario" },
    aliases: { en: ["Stock", "Warehouse"], es: ["Existencias", "Almacén", "Productos"] },
  },
  {
    path: "/consultation",
    labels: { en: "Consultation", es: "Consulta" },
    aliases: { en: ["Appointments", "Visits"], es: ["Citas", "Atención"] },
  },
  {
    path: "/patients",
    labels: { en: "Patients", es: "Pacientes" },
    aliases: { en: ["Patients", "Profiles", "Records", "Medical History"], es: ["Pacientes", "Gestión", "Perfiles", "Expediente", "Historial Médico"] },
  },
]
