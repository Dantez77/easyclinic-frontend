# Unified Data Structure for EasyClinic Frontend

## Overview

This document describes the unified data structure implemented across all modules of the EasyClinic frontend application. The goal is to ensure consistency and seamless data flow between patient registration, appointments, consultations, and EHR management.

## Data Flow Architecture

```
Patient Registration → Patients Management → Appointments → Consultation → EHR
       ↓                      ↓              ↓            ↓         ↓
   Creates Patient      Manages Patient   Books Appt   Records    Stores All
   Record              Information       for Patient   Visit      Medical Data
```

## Core Data Models

### 1. Patient (`/types/patient.ts`)

The central data model that all modules reference:

```typescript
interface Patient {
  // Core identification
  id: string                    // Internal database ID
  patientId: string            // External patient ID (e.g., EXP-2024-001234)
  cedula: string               // National ID
  
  // Personal information
  firstName: string
  lastName: string
  dateOfBirth: string
  age: number
  gender: "Masculino" | "Femenino" | "Otro"
  bloodType: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-"
  maritalStatus: string
  occupation: string
  
  // Contact information
  phone: string
  email: string
  address: string
  city: string
  province: string
  postalCode: string
  
  // Emergency contact
  emergencyContact: {
    name: string
    relationship: string
    phone: string
    email: string
  }
  
  // Insurance information
  insurance: {
    provider: string
    policyNumber: string
    groupNumber: string
    effectiveDate: string
    expirationDate: string
  }
  
  // Medical information
  allergies: Allergy[]
  chronicConditions: ChronicCondition[]
  currentMedications: Medication[]
  
  // Status and tracking
  status: "Activo" | "Inactivo" | "Suspendido"
  lastVisit: string
  createdAt: string
  updatedAt: string
}
```

### 2. Appointment

```typescript
interface Appointment {
  id: string
  patientId: string           // Links to Patient.id
  patientName: string
  patientPhone: string
  patientEmail: string
  doctor: string
  date: string
  time: string
  duration: number
  type: string
  status: "pending" | "confirmed" | "cancelled" | "completed"
  notes: string
  patientHistory: string[]
  createdAt: string
  updatedAt: string
}
```

### 3. Consultation

```typescript
interface Consultation {
  id: string
  date: string
  doctor: string
  specialty: string
  reason: string
  symptoms: string[]
  diagnosis: string
  treatment: string
  notes: string
  followUp?: string
  status: "Programada" | "En Proceso" | "Completada" | "Cancelada"
  prescriptions: Prescription[]
  labTests: LabTest[]
  vitalSigns: VitalSigns
}
```

## Module Integration

### 1. Patient Registration (`/patients/registration/`)

**Purpose**: Create new patient records
**Data Created**: Patient object with all required fields
**Next Step**: Patient appears in patients management system

**Key Features**:
- Comprehensive patient information collection
- Validation of required fields
- Integration with insurance providers
- Allergy and medical condition tracking

### 2. Patients Management (`/patients/`)

**Purpose**: Manage existing patient records
**Data Accessed**: Patient records from registration
**Next Step**: Patients can be selected for appointments

**Key Features**:
- Patient search and filtering
- Medical history viewing
- Patient information editing
- EHR access

### 3. Appointments (`/appointments/`)

**Purpose**: Schedule and manage patient appointments
**Data Accessed**: Patient records from patients management
**Data Created**: Appointment records
**Next Step**: Appointments can be converted to consultations

**Key Features**:
- Patient search and selection
- Doctor and time slot scheduling
- Appointment status management
- Integration with patient data

### 4. Consultation (`/consultation/`)

**Purpose**: Record patient visit details
**Data Accessed**: Patient data + appointment data
**Data Created**: Consultation records with medical details
**Next Step**: Data flows to EHR

**Key Features**:
- Patient information display
- Symptom and diagnosis recording
- Prescription management
- Lab test ordering
- Vital signs tracking

### 5. EHR (`/patients/ehr/`)

**Purpose**: Comprehensive patient medical record
**Data Accessed**: All patient data from all modules
**Data Displayed**: Complete medical history

**Key Features**:
- Patient demographics
- Medical history
- Lab results
- Prescriptions
- Vital signs trends
- Document management

## Data Constants

All modules use shared constants for consistency:

```typescript
export const PROVINCES = ["Distrito Nacional", "Santo Domingo", ...]
export const BLOOD_TYPES = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
export const INSURANCE_PROVIDERS = ["ARS Humano", "ARS Palic", ...]
export const COMMON_ALLERGIES = ["Penicilina", "Aspirina", ...]
export const COMMON_CONDITIONS = ["Hipertensión", "Diabetes", ...]
export const APPOINTMENT_TYPES = ["Consultation", "Follow-up", ...]
export const TIME_SLOTS = ["08:00", "08:30", "09:00", ...]
```

## API Integration Points

When the backend is implemented, these are the key integration points:

### Patient Management
- `POST /api/patients` - Create new patient
- `GET /api/patients` - List patients with search/filter
- `GET /api/patients/:id` - Get patient details
- `PUT /api/patients/:id` - Update patient
- `DELETE /api/patients/:id` - Delete patient

### Appointments
- `POST /api/appointments` - Create appointment
- `GET /api/appointments` - List appointments
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Delete appointment

### Consultations
- `POST /api/consultations` - Create consultation
- `GET /api/consultations/:patientId` - Get patient consultations
- `PUT /api/consultations/:id` - Update consultation

### EHR
- `GET /api/patients/:id/ehr` - Get complete EHR data
- `POST /api/patients/:id/ehr/vital-signs` - Add vital signs
- `POST /api/patients/:id/ehr/prescriptions` - Add prescriptions

## Data Validation

### Required Fields
- Patient: firstName, lastName, cedula, dateOfBirth, gender, phone
- Appointment: patientId, doctor, date, time, type
- Consultation: patientId, doctor, date, reason, diagnosis

### Data Types
- Dates: ISO 8601 format (YYYY-MM-DD)
- Phone numbers: Dominican Republic format (809-XXX-XXXX)
- Cédula: Dominican Republic format (000-0000000-0)
- IDs: UUID or incremental integers

## Future Enhancements

### 1. Real-time Updates
- WebSocket integration for live appointment updates
- Real-time patient status changes

### 2. Advanced Search
- Full-text search across all patient data
- Fuzzy matching for patient names
- Search by symptoms or diagnoses

### 3. Data Export
- PDF generation for patient records
- CSV export for data analysis
- Integration with external systems

### 4. Audit Trail
- Track all data changes
- User activity logging
- Compliance reporting


### Missing 
- 🔄 Fix import path issues (temporary workaround in place)
- 🔄 Implement real API integration
- 🔄 Add data validation and error handling
- 🔄 Implement real-time updates
- 🔄 Add comprehensive testing

### File Structure
```
app/
├── types/
│   └── patient.ts              # Unified data types
├── patients/
│   ├── registration/           # Patient registration
│   ├── mocks/                  # Patient mock data
│   └── ehr/                    # Electronic Health Records
├── appointments/
│   ├── mocks/                  # Appointment mock data
│   └── components/             # Appointment components
└── consultation/
    ├── mocks/                  # Consultation mock data
    └── components/             # Consultation components
```

