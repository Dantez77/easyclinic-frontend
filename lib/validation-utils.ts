// Validation utilities for El Salvador formats
import { EL_SALVADOR_CONFIG } from './localization'

// DUI (Documento Único de Identidad) validation
export const validateDUI = (dui: string): { isValid: boolean; error?: string } => {
  if (!dui) {
    return { isValid: false, error: EL_SALVADOR_CONFIG.validation.required }
  }

  // Remove any non-digit characters
  const cleanDUI = dui.replace(/\D/g, '')
  
  // DUI format: 8 digits + 1 check digit
  if (cleanDUI.length !== 9) {
    return { 
      isValid: false, 
      error: EL_SALVADOR_CONFIG.validation.invalidDUI 
    }
  }

  // Validate check digit using El Salvador DUI algorithm
  const digits = cleanDUI.split('').map(Number)
  const checkDigit = digits[8]
  const mainDigits = digits.slice(0, 8)
  
  // Calculate check digit
  let sum = 0
  for (let i = 0; i < 8; i++) {
    sum += mainDigits[i] * (9 - i)
  }
  
  const calculatedCheckDigit = sum % 10
  
  if (calculatedCheckDigit !== checkDigit) {
    return { 
      isValid: false, 
      error: EL_SALVADOR_CONFIG.validation.invalidDUI 
    }
  }

  return { isValid: true }
}

// Format DUI for display
export const formatDUI = (dui: string): string => {
  const cleanDUI = dui.replace(/\D/g, '')
  if (cleanDUI.length === 9) {
    return `${cleanDUI.slice(0, 8)}-${cleanDUI.slice(8)}`
  }
  return dui
}

// NIT (Número de Identificación Tributaria) validation
export const validateNIT = (nit: string): { isValid: boolean; error?: string } => {
  if (!nit) {
    return { isValid: false, error: EL_SALVADOR_CONFIG.validation.required }
  }

  // Remove any non-digit characters
  const cleanNIT = nit.replace(/\D/g, '')
  
  // NIT format: 4 digits + 6 digits + 3 digits
  if (cleanNIT.length !== 13) {
    return { 
      isValid: false, 
      error: EL_SALVADOR_CONFIG.validation.invalidNIT 
    }
  }

  // Basic format validation (can be enhanced with actual NIT algorithm)
  const pattern = /^\d{4}\d{6}\d{3}$/
  if (!pattern.test(cleanNIT)) {
    return { 
      isValid: false, 
      error: EL_SALVADOR_CONFIG.validation.invalidNIT 
    }
  }

  return { isValid: true }
}

// Format NIT for display
export const formatNIT = (nit: string): string => {
  const cleanNIT = nit.replace(/\D/g, '')
  if (cleanNIT.length === 13) {
    return `${cleanNIT.slice(0, 4)}-${cleanNIT.slice(4, 10)}-${cleanNIT.slice(10)}`
  }
  return nit
}

// Phone number validation for El Salvador
export const validatePhone = (phone: string): { isValid: boolean; error?: string } => {
  if (!phone) {
    return { isValid: false, error: EL_SALVADOR_CONFIG.validation.required }
  }

  // Check if it matches the expected format (0000-0000)
  if (!EL_SALVADOR_CONFIG.phone.validation.pattern.test(phone)) {
    return { 
      isValid: false, 
      error: EL_SALVADOR_CONFIG.validation.invalidPhone 
    }
  }

  // Check length
  const cleanPhone = phone.replace(/\D/g, '')
  if (cleanPhone.length < EL_SALVADOR_CONFIG.phone.validation.minLength || 
      cleanPhone.length > EL_SALVADOR_CONFIG.phone.validation.maxLength) {
    return { 
      isValid: false, 
      error: EL_SALVADOR_CONFIG.validation.invalidPhone 
    }
  }

  return { isValid: true }
}

// Format phone number for display
export const formatPhone = (phone: string): string => {
  const cleanPhone = phone.replace(/\D/g, '')
  if (cleanPhone.length === 8) {
    return `${cleanPhone.slice(0, 4)}-${cleanPhone.slice(4)}`
  }
  return phone
}

// Email validation
export const validateEmail = (email: string): { isValid: boolean; error?: string } => {
  if (!email) {
    return { isValid: true } // Email is optional
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailPattern.test(email)) {
    return { 
      isValid: false, 
      error: EL_SALVADOR_CONFIG.validation.invalidEmail 
    }
  }

  return { isValid: true }
}

// Required field validation
export const validateRequired = (value: string): { isValid: boolean; error?: string } => {
  if (!value || value.trim().length === 0) {
    return { isValid: false, error: EL_SALVADOR_CONFIG.validation.required }
  }
  return { isValid: true }
}

// Length validation
export const validateLength = (
  value: string, 
  min?: number, 
  max?: number
): { isValid: boolean; error?: string } => {
  if (min && value.length < min) {
    return { 
      isValid: false, 
      error: EL_SALVADOR_CONFIG.validation.minLength(min) 
    }
  }
  
  if (max && value.length > max) {
    return { 
      isValid: false, 
      error: EL_SALVADOR_CONFIG.validation.maxLength(max) 
    }
  }
  
  return { isValid: true }
}

// Date validation (must be in the past)
export const validateDateOfBirth = (date: string): { isValid: boolean; error?: string } => {
  if (!date) {
    return { isValid: false, error: EL_SALVADOR_CONFIG.validation.required }
  }

  const birthDate = new Date(date)
  const today = new Date()
  
  if (birthDate > today) {
    return { isValid: false, error: "La fecha de nacimiento no puede ser en el futuro" }
  }
  
  if (birthDate < new Date('1900-01-01')) {
    return { isValid: false, error: "La fecha de nacimiento no puede ser anterior a 1900" }
  }
  
  return { isValid: true }
}

// Age calculation from date of birth
export const calculateAge = (dateOfBirth: string): number => {
  const birthDate = new Date(dateOfBirth)
  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  
  return age
}

// Comprehensive patient validation
export const validatePatientData = (data: any): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {}
  
  // Required fields
  const requiredFields = ['firstName', 'lastName', 'dui', 'dateOfBirth', 'gender', 'phone', 'address', 'city', 'province']
  requiredFields.forEach(field => {
    const validation = validateRequired(data[field])
    if (!validation.isValid) {
      errors[field] = validation.error!
    }
  })
  
  // DUI validation
  if (data.dui) {
    const duiValidation = validateDUI(data.dui)
    if (!duiValidation.isValid) {
      errors.dui = duiValidation.error!
    }
  }
  
  // NIT validation (if provided)
  if (data.nit) {
    const nitValidation = validateNIT(data.nit)
    if (!nitValidation.isValid) {
      errors.nit = nitValidation.error!
    }
  }
  
  // Phone validation
  if (data.phone) {
    const phoneValidation = validatePhone(data.phone)
    if (!phoneValidation.isValid) {
      errors.phone = phoneValidation.error!
    }
  }
  
  // Email validation
  if (data.email) {
    const emailValidation = validateEmail(data.email)
    if (!emailValidation.isValid) {
      errors.email = emailValidation.error!
    }
  }
  
  // Date of birth validation
  if (data.dateOfBirth) {
    const dateValidation = validateDateOfBirth(data.dateOfBirth)
    if (!dateValidation.isValid) {
      errors.dateOfBirth = dateValidation.error!
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

// Format utilities
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: EL_SALVADOR_CONFIG.currency,
  }).format(amount)
}

export const formatDate = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat(EL_SALVADOR_CONFIG.dateTime.locale, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(dateObj)
}

export const formatDateTime = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat(EL_SALVADOR_CONFIG.dateTime.locale, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(dateObj)
}
