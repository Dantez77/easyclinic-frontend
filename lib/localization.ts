// El Salvador Localization Configuration
// This file contains all country-specific settings, formats, and constants for El Salvador

export const EL_SALVADOR_CONFIG = {
  // Country Information
  country: "El Salvador",
  countryCode: "SV",
  currency: "USD",
  timezone: "America/El_Salvador",
  locale: "es-SV",
  
  // Tax Configuration
  tax: {
    iva: 0.13, // 13% IVA (Impuesto al Valor Agregado)
    ivaLabel: "IVA",
    taxLabel: "Impuesto",
  },
  
  // Document Types
  documents: {
    identification: {
      primary: "DUI", // Documento Único de Identidad
      secondary: "Pasaporte",
      tertiary: "Carnet de Menor",
      foreign: "Documento Extranjero",
    },
    fiscal: {
      nit: "NIT", // Número de Identificación Tributaria
      nitFormat: "0000-000000-000-0",
      nitExample: "0614-123456-001-2",
    },
    billing: {
      dteFactura: "DTE Factura",
      dteComprobante: "DTE Comprobante",
      ticket: "Ticket",
    },
  },
  
  // Phone Number Format
  phone: {
    countryCode: "+503",
    format: "0000-0000",
    example: "7123-4567",
    emergency: "911",
    validation: {
      minLength: 8,
      maxLength: 8,
      pattern: /^\d{4}-\d{4}$/,
    },
  },
  
  // Address Configuration
  address: {
    provinces: [
      "Ahuachapán",
      "Cabañas", 
      "Chalatenango",
      "Cuscatlán",
      "La Libertad",
      "La Paz",
      "La Unión",
      "Morazán",
      "San Miguel",
      "San Salvador",
      "San Vicente",
      "Santa Ana",
      "Sonsonate",
      "Usulután",
    ],
    cities: {
      "San Salvador": ["San Salvador", "Mejicanos", "Soyapango", "San Marcos", "Cuscatancingo"],
      "La Libertad": ["Santa Tecla", "Antiguo Cuscatlán", "Nuevo Cuscatlán", "Zaragoza"],
      "Santa Ana": ["Santa Ana", "Chalchuapa", "Metapán", "Coatepeque"],
      "San Miguel": ["San Miguel", "Usulután", "Santiago de María"],
    },
    postalCode: {
      required: false,
      format: "0000",
      example: "1101",
    },
  },
  
  // Insurance Providers (El Salvador)
  insurance: {
    providers: [
      "ISSS", // Instituto Salvadoreño del Seguro Social
      "FOSALUD", // Fondo Solidario para la Salud
      "SeNaSa", // Seguro Nacional de Salud
      "ARS Humano",
      "ARS Palic", 
      "ARS Universal",
      "ARS Futuro",
      "ARS Monumental",
      "ARS CMD",
      "ARS Renacer",
      "ARS Simag",
      "ARS Yuna",
      "Sin seguro",
    ],
    coverage: {
      min: 0,
      max: 100,
      default: 0,
    },
  },
  
  // Medical Information
  medical: {
    bloodTypes: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    genders: ["Masculino", "Femenino", "Otro"],
    maritalStatus: [
      "Soltero/a",
      "Casado/a", 
      "Divorciado/a",
      "Viudo/a",
      "Unión Libre",
    ],
    commonAllergies: [
      "Penicilina",
      "Aspirina",
      "Mariscos",
      "Nueces",
      "Látex",
      "Polen",
      "Polvo",
      "Huevos",
      "Leche",
      "Soja",
      "Sulfas",
      "Ibuprofeno",
    ],
    commonConditions: [
      "Hipertensión",
      "Diabetes",
      "Asma",
      "Artritis",
      "Migraña",
      "Depresión",
      "Ansiedad",
      "Colesterol Alto",
      "Enfermedad Cardíaca",
      "Osteoporosis",
      "Gastritis",
      "Úlcera Péptica",
    ],
  },
  
  // Date and Time
  dateTime: {
    locale: "es-SV",
    format: "dd/MM/yyyy",
    timeFormat: "HH:mm",
    workingHours: {
      weekdays: "08:00 - 18:00",
      saturday: "09:00 - 16:00", 
      sunday: "Solo Emergencias",
    },
  },
  
  // Validation Messages
  validation: {
    required: "Este campo es requerido",
    invalidFormat: "Formato inválido",
    invalidDUI: "DUI inválido. Formato: 00000000-0",
    invalidNIT: "NIT inválido. Formato: 0000-000000-000-0",
    invalidPhone: "Teléfono inválido. Formato: 0000-0000",
    invalidEmail: "Correo electrónico inválido",
    minLength: (min: number) => `Mínimo ${min} caracteres`,
    maxLength: (max: number) => `Máximo ${max} caracteres`,
  },
}

// Export individual sections for easier imports
export const {
  tax,
  documents,
  phone,
  address,
  insurance,
  medical,
  dateTime,
  validation,
} = EL_SALVADOR_CONFIG

export default EL_SALVADOR_CONFIG
