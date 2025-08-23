'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

type Language = 'en' | 'es'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// Translation dictionary
const translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.doctors': 'Our Doctors',
    'nav.services': 'Services',
    'nav.appointments': 'Appointments',
    'nav.news': 'News & Updates',
    'nav.contact': 'Contact Us',
    "nav.messages": "Messages",
    "nav.inventory": "Inventory",
    "nav.patients": "Patients",
    "nav.billing": "Billing",
    "nav.activityLogs": "Activity Logs",

    // Header
    'header.title': 'Intergastro',
    'header.subtitle': 'Your Health Partner',
    'header.search.placeholder': 'Search doctors, services...',
    'header.language.en': 'Switch to Spanish',
    'header.language.es': 'Cambiar a Inglés',
    
    // Hero Section
    'hero.title': 'Your Health, Our Priority',
    'hero.subtitle': 'Providing exceptional medical care with compassion and expertise. Our team of experienced doctors is here to serve you and your family.',
    'hero.cta.primary': 'Schedule Appointment',
    'hero.cta.secondary': 'Learn More',
    
    // Doctors Section
    'doctors.title': 'Meet Our Expert Doctors',
    'doctors.subtitle': 'Our team of highly qualified medical professionals is dedicated to providing you with the best possible care.',
    'doctors.experience': 'experience',
    'doctors.book': 'Book Consultation',
    
    // Services Section
    'services.title': 'Our Medical Services',
    'services.subtitle': 'Comprehensive healthcare services tailored to meet your medical needs.',
    'services.general.title': 'General Consultation',
    'services.general.description': 'Comprehensive health checkups and routine medical care',
    'services.cardiology.title': 'Cardiology',
    'services.cardiology.description': 'Heart health assessments and cardiovascular treatments',
    'services.preventive.title': 'Preventive Care',
    'services.preventive.description': 'Vaccinations, screenings, and health maintenance',
    'services.emergency.title': 'Emergency Care',
    'services.emergency.description': '24/7 emergency medical services and urgent care',
    
    // News Section
    'news.title': 'Latest News & Updates',
    'news.subtitle': 'Stay informed with the latest medical insights and clinic updates from our doctors.',
    'news.readMore': 'Read More',
    
    // Contact Section
    'contact.title': 'Contact Us',
    'contact.subtitle': 'Get in touch with us for appointments, inquiries, or emergency care.',
    'contact.address.title': 'Address',
    'contact.address.value': 'Plaza Intermédica 3er Nivel,\n #309-C 3a Calle Poniente y 25 Avenida Norte,\n San Salvador',
    'contact.phone.title': 'Phone',
    'contact.phone.main': 'Main: (035) 7123-4567',
    'contact.phone.emergency': 'Emergency: 911',
    'contact.email.title': 'Email',
    'contact.email.general': 'General: info@intergastro.com',
    'contact.email.appointments': 'Appointments: appointments@intergastro.com',
    'contact.hours.title': 'Hours',
    'contact.hours.weekdays': 'Monday - Friday: 8:00 AM - 6:00 PM',
    'contact.hours.saturday': 'Saturday: 9:00 AM - 4:00 PM',
    'contact.hours.sunday': 'Sunday: Emergency Only',
    'contact.form.title': 'Send us a Message',
    'contact.form.firstName': 'First Name',
    'contact.form.lastName': 'Last Name',
    'contact.form.email': 'Email',
    'contact.form.phone': 'Phone',
    'contact.form.message': 'Your message...',
    'contact.form.send': 'Send Message',
    
    // Footer
    'footer.copyright': '© 2024 Intergastro. All rights reserved. | Licensed Healthcare Provider',
    
    // Quick Contact
    'quick.contact.phone': '(503) 7123-4567',
    'quick.contact.email': 'info@intergastro.com',
    'quick.contact.hours': 'Mon-Fri: 8AM-6PM',
  },
  es: {
    // Navigation
    'nav.home': 'Inicio',
    'nav.doctors': 'Nuestros Doctores',
    'nav.services': 'Servicios',
    'nav.appointments': 'Citas',
    'nav.news': 'Noticias y Actualizaciones',
    'nav.contact': 'Contáctanos',
    "nav.messages": "Mensajes",
    "nav.inventory": "Inventario",
    "nav.patients": "Pacientes",
    "nav.billing": "Facturación",
    "nav.activityLogs": "Registros de Actividad",


    // Header
    'header.title': 'Intergastro',
    'header.subtitle': 'Tu Socio de Salud',
    'header.search.placeholder': 'Buscar doctores, servicios...',
    'header.language.en': 'Switch to Spanish',
    'header.language.es': 'Cambiar a Inglés',
    
    // Hero Section
    'hero.title': 'Tu Salud, Nuestra Prioridad',
    'hero.subtitle': 'Proporcionando atención médica excepcional con compasión y experiencia. Nuestro equipo de doctores experimentados está aquí para servirte a ti y a tu familia.',
    'hero.cta.primary': 'Agendar Cita',
    'hero.cta.secondary': 'Saber Más',
    
    // Doctors Section
    'doctors.title': 'Conoce a Nuestros Doctores Expertos',
    'doctors.subtitle': 'Nuestro equipo de profesionales médicos altamente calificados está dedicado a proporcionarte la mejor atención posible.',
    'doctors.experience': 'años de experiencia',
    'doctors.book': 'Reservar Consulta',
    
    // Services Section
    'services.title': 'Nuestros Servicios Médicos',
    'services.subtitle': 'Servicios de atención médica integral adaptados para satisfacer tus necesidades médicas.',
    'services.general.title': 'Consulta General',
    'services.general.description': 'Chequeos de salud integrales y atención médica rutinaria',
    'services.cardiology.title': 'Cardiología',
    'services.cardiology.description': 'Evaluaciones de salud cardíaca y tratamientos cardiovasculares',
    'services.preventive.title': 'Cuidado Preventivo',
    'services.preventive.description': 'Vacunas, exámenes de detección y mantenimiento de la salud',
    'services.emergency.title': 'Atención de Emergencia',
    'services.emergency.description': 'Servicios médicos de emergencia y atención urgente 24/7',
    
    // News Section
    'news.title': 'Últimas Noticias y Actualizaciones',
    'news.subtitle': 'Mantente informado con las últimas perspectivas médicas y actualizaciones de la clínica de nuestros doctores.',
    'news.readMore': 'Leer Más',
    
    // Contact Section
    'contact.title': 'Contáctanos',
    'contact.subtitle': 'Ponte en contacto con nosotros para citas, consultas o atención de emergencia.',
    'contact.address.title': 'Dirección',
    'contact.address.value': 'Plaza Intermédica 3er Nivel,\n #309-C 3a Calle Poniente y 25 Avenida Norte, \n San Salvador',
    'contact.phone.title': 'Teléfono',
    'contact.phone.main': 'Principal: (503) 7123-4567',
    'contact.phone.emergency': 'Emergencia: 911',
    'contact.email.title': 'Correo Electrónico',
    'contact.email.general': 'General: info@intergastro.com',
    'contact.email.appointments': 'Citas: appointments@intergastro.com',
    'contact.hours.title': 'Horarios',
    'contact.hours.weekdays': 'Lunes - Viernes: 8:00 AM - 6:00 PM',
    'contact.hours.saturday': 'Sábado: 9:00 AM - 4:00 PM',
    'contact.hours.sunday': 'Domingo: Solo Emergencias',
    'contact.form.title': 'Envíanos un Mensaje',
    'contact.form.firstName': 'Nombre',
    'contact.form.lastName': 'Apellido',
    'contact.form.email': 'Correo Electrónico',
    'contact.form.phone': 'Teléfono',
    'contact.form.message': 'Tu mensaje...',
    'contact.form.send': 'Enviar Mensaje',
    
    // Footer
    'footer.copyright': '© 2024 Intergastro. Todos los derechos reservados. | Proveedor de Salud Licenciado',
    
    // Quick Contact
    'quick.contact.phone': '(555) 7123-4567',
    'quick.contact.email': 'info@intergastro.com',
    'quick.contact.hours': 'Lun-Vie: 8AM-6PM',
  }
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en')

  // Load language from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'es')) {
      setLanguage(savedLanguage)
    }
  }, [])

  // Save language to localStorage when it changes
  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem('language', lang)
  }

  // Translation function
  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key
  }

  return (
    <LanguageContext.Provider value={{ 
      language, 
      setLanguage: handleLanguageChange, 
      t 
    }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
