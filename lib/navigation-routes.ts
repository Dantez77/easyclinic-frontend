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
  preload?: boolean // Whether to preload this route
}

export const navigationRoutes: NavigationRoute[] = [
  {
    path: "/billing",
    labels: { en: "Billing", es: "Facturación" },
    aliases: { en: ["Invoices", "Payments"], es: ["Facturas", "Pagos", "Credito"] },
    preload: true, // Preload billing as it's commonly accessed
  },
  {
    path: "/activity-logs",
    labels: { en: "Activity Logs", es: "Auditorías" },
    aliases: { en: ["Audits", "Logs"], es: ["Registros", "Historial"] },
    preload: false, // Less commonly accessed
  },
  {
    path: "/inventory",
    labels: { en: "Inventory", es: "Inventario" },
    aliases: { en: ["Stock", "Warehouse"], es: ["Existencias", "Almacén", "Productos"] },
    preload: true, // Preload inventory as it's commonly accessed
  },
  {
    path: "/consultation",
    labels: { en: "Consultation", es: "Consulta" },
    aliases: { en: ["Appointments", "Visits"], es: ["Citas", "Atención"] },
    preload: true, // Preload consultation as it's commonly accessed
  },
  {
    path: "/patients",
    labels: { en: "Patients", es: "Pacientes" },
    aliases: { en: ["Patients", "Profiles", "Records", "Medical History"], es: ["Pacientes", "Gestión", "Perfiles", "Expediente", "Historial Médico"] },
    preload: true, // Preload patients as it's commonly accessed
  },
]

// Route preloading utility
export const preloadRoute = (path: string) => {
  if (typeof window !== 'undefined') {
    // Preload the route by creating a link element
    const link = document.createElement('link')
    link.rel = 'prefetch'
    link.href = path
    document.head.appendChild(link)
  }
}

// Preload commonly accessed routes
export const preloadCommonRoutes = () => {
  if (typeof window !== 'undefined') {
    navigationRoutes
      .filter(route => route.preload)
      .forEach(route => preloadRoute(route.path))
  }
}
