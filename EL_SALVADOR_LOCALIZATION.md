# El Salvador Localization Guide

This document outlines all the changes made to localize the EasyClinic web application for El Salvador.

## Overview

The web application has been updated to work specifically in El Salvador, replacing Dominican Republic-specific content with Salvadoran equivalents. This includes document formats, phone numbers, addresses, tax systems, and other country-specific requirements.

## Key Changes Made

### 1. Document Identification

#### Before (Dominican Republic)
- **Cédula**: National ID with format `000-0000000-0`
- **RNC**: Registro Nacional del Contribuyente

#### After (El Salvador)
- **DUI**: Documento Único de Identidad with format `00000000-0`
- **NIT**: Número de Identificación Tributaria with format `0000-000000-000-0`

### 2. Phone Number Format

#### Before
- Format: `809-0000-0000` (Dominican Republic)
- Country code: `+1-809`

#### After
- Format: `0000-0000` (El Salvador)
- Country code: `+503`

### 3. Address System

#### Provinces (Updated from Dominican Republic to El Salvador)
- **Before**: 32 provinces including "Distrito Nacional", "Santo Domingo", "Santiago"
- **After**: 14 departments including "San Salvador", "La Libertad", "Santa Ana", "San Miguel"

#### Cities
- Added major Salvadoran cities like "Santa Tecla", "Mejicanos", "Soyapango"
- Postal codes are now optional (not commonly used in El Salvador)

### 4. Tax System

#### Before
- **ITBIS**: 18% tax (Dominican Republic)
- **RNC**: Required for tax documents

#### After
- **IVA**: 13% tax (El Salvador)
- **NIT**: Required for DTE (Documento Tributario Electrónico) documents

### 5. Insurance Providers

#### Updated to include Salvadoran providers:
- **ISSS**: Instituto Salvadoreño del Seguro Social
- **FOSALUD**: Fondo Solidario para la Salud
- **SeNaSa**: Seguro Nacional de Salud
- Plus existing ARS providers

### 6. Medical Information

#### Added Salvadoran-specific conditions:
- **Gastritis**: Common in El Salvador
- **Úlcera Péptica**: Common digestive condition
- **Sulfas**: Common allergy
- **Ibuprofeno**: Common medication allergy

## Files Modified

### 1. New Files Created
- `lib/localization.ts` - Centralized El Salvador configuration
- `lib/validation-utils.ts` - Salvadoran format validation utilities
- `EL_SALVADOR_LOCALIZATION.md` - This documentation file

### 2. Files Updated
- `app/types/patient.ts` - Updated patient interface for Salvadoran fields
- `app/patients/types.ts` - Local patient types with Salvadoran constants
- `app/patients/registration/page.tsx` - Updated registration form

## Validation Features

### DUI Validation
- Format: `00000000-0` (8 digits + 1 check digit)
- Includes check digit algorithm validation
- Auto-formatting as user types

### NIT Validation
- Format: `0000-000000-000-0` (13 digits total)
- Optional field for fiscal documents
- Format validation

### Phone Validation
- Format: `0000-0000` (8 digits)
- Salvadoran country code (+503)
- Emergency number: 911

### Email Validation
- Standard email format validation
- Optional field

## Usage Examples

### DUI Input
```typescript
// User types: 12345678
// Auto-formats to: 12345678-0
// Validation ensures proper check digit
```

### NIT Input
```typescript
// User types: 0614123456001
// Auto-formats to: 0614-123456-001-0
```

### Phone Input
```typescript
// User types: 71234567
// Auto-formats to: 7123-4567
```

## Configuration

All Salvadoran-specific settings are centralized in `lib/localization.ts`:

```typescript
export const EL_SALVADOR_CONFIG = {
  country: "El Salvador",
  countryCode: "SV",
  currency: "USD",
  timezone: "America/El_Salvador",
  locale: "es-SV",
  // ... more configuration
}
```

## Benefits of Localization

1. **Legal Compliance**: Meets Salvadoran tax and identification requirements
2. **User Experience**: Familiar formats for Salvadoran users
3. **Business Operations**: Proper DTE integration for fiscal compliance
4. **Data Accuracy**: Validates Salvadoran document formats
5. **Local Standards**: Follows Salvadoran healthcare and business practices

## Future Enhancements

1. **DTE Integration**: Full Ministerio de Hacienda integration
2. **Local Payment Methods**: Salvadoran banking integration
3. **Regional Healthcare**: Salvadoran healthcare provider networks
4. **Language Variants**: Salvadoran Spanish dialect support
5. **Local Regulations**: Salvadoran healthcare compliance features

## Testing

To test the localization:

1. **DUI Validation**: Try invalid DUI numbers to see validation errors
2. **Phone Format**: Enter phone numbers to test auto-formatting
3. **NIT Validation**: Test NIT format validation
4. **Address Selection**: Verify Salvadoran provinces and cities
5. **Tax Calculations**: Ensure 13% IVA is applied correctly

## Support

For questions about the El Salvador localization:

1. Check this documentation
2. Review the validation utilities in `lib/validation-utils.ts`
3. Consult the localization configuration in `lib/localization.ts`
4. Test with Salvadoran document formats

## Compliance Notes

- **DUI**: Must follow Salvadoran government format
- **NIT**: Required for business transactions and DTE documents
- **IVA**: 13% tax rate as mandated by Salvadoran law
- **Phone Numbers**: Must follow Salvadoran telecommunications format
- **Addresses**: Must use official Salvadoran administrative divisions
