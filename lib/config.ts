// Environment Configuration
export const config = {
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
    timeout: 10000, // 10 seconds
  },
  app: {
    name: 'EasyClinic',
    version: '1.0.0',
  },
  auth: {
    tokenKey: 'easyclinic_token',
    refreshTokenKey: 'easyclinic_refresh_token',
  },
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    me: '/auth/me',
  },
  users: {
    list: '/users',
    create: '/users',
    update: (id: string) => `/users/${id}`,
    delete: (id: string) => `/users/${id}`,
  },
  patients: {
    list: '/patients',
    create: '/patients',
    update: (id: string) => `/patients/${id}`,
    delete: (id: string) => `/patients/${id}`,
  },
  appointments: {
    list: '/appointments',
    create: '/appointments',
    update: (id: string) => `/appointments/${id}`,
    delete: (id: string) => `/appointments/${id}`,
  },
  billing: {
    invoices: '/billing/invoices',
    createInvoice: '/billing/invoices',
    updateInvoice: (id: string) => `/billing/invoices/${id}`,
    deleteInvoice: (id: string) => `/billing/invoices/${id}`,
  },
  inventory: {
    items: '/inventory/items',
    createItem: '/inventory/items',
    updateItem: (id: string) => `/inventory/items/${id}`,
    deleteItem: (id: string) => `/inventory/items/${id}`,
  },
} as const;
