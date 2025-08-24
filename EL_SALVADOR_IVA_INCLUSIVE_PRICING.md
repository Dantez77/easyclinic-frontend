# El Salvador IVA-Inclusive Pricing Implementation

## Overview

In El Salvador, IVA (Impuesto al Valor Agregado) is **included** in the displayed price, not added on top. This is fundamentally different from countries like the United States where taxes are added to the displayed price.

## Key Changes Made

### 1. **Billing Logic Update** (`app/billing/page.tsx`)

**Before (IVA Added on Top):**
```typescript
// Apply IVA only for DTE documents
const tax = docType.hasIVA ? taxableAmount * 0.13 : 0 // 13% IVA in El Salvador
const total = taxableAmount + tax
```

**After (IVA Included in Price):**
```typescript
// In El Salvador, IVA is included in the displayed price
// We need to extract the IVA amount from the total price
let tax = 0
let total = taxableAmount

if (docType.hasIVA) {
  // Calculate IVA from the total price (IVA is 13% of the final price)
  // Formula: IVA = Total * (13/113) = Total * 0.115044
  tax = Math.round(taxableAmount * 0.115044) // 13% IVA included in price
  // Note: 0.115044 = 13/113, which extracts IVA from IVA-inclusive price
}
```

### 2. **Mock Data Updates** (`app/billing/mocks/billing-data.ts`)

**Before (IVA Added on Top):**
```typescript
{
  subtotal: 2300,
  tax: 299, // 13% IVA (El Salvador)
  total: 2599, // 2300 + 299
}
```

**After (IVA Included in Price):**
```typescript
{
  subtotal: 2300,
  tax: 265, // IVA extraído del precio total (2300 * 0.115044)
  total: 2300, // Precio final = precio mostrado (IVA incluido)
}
```

### 3. **Printer Utilities Update** (`app/billing/utils/printer-utils.ts`)

**Before:**
```
IVA (13%): $299
```

**After:**
```
IVA (13% incluido): $265
```

## Mathematical Formula

### **IVA Extraction from Inclusive Price**
- **Formula**: `IVA = Precio Total × (13/113) = Precio Total × 0.115044`
- **Example**: 
  - Service Price: $1500 (IVA included)
  - IVA Amount: $1500 × 0.115044 = $172.57
  - Net Price: $1500 - $172.57 = $1327.43

### **Why 0.115044?**
- In El Salvador, IVA is 13% of the final price
- If the final price is 100%, then the base price is 87% and IVA is 13%
- To extract IVA: `13/87 = 0.149425` (this would be wrong)
- **Correct formula**: `13/113 = 0.115044` (because IVA is 13% of the total, not the base)

## Real-World Example

### **Service: Consulta Médica General**
- **Displayed Price**: $1500 (IVA included)
- **IVA Amount**: $1500 × 0.115044 = $172.57
- **Net Price**: $1327.43
- **Total to Customer**: $1500 (no additional tax)

### **Invoice Breakdown**
```
Subtotal: $1500
IVA (13% incluido): $172.57
TOTAL: $1500
```

## Benefits of IVA-Inclusive Pricing

1. **Transparency**: Customers see the exact amount they will pay
2. **No Surprises**: No additional taxes added at checkout
3. **Compliance**: Follows El Salvador's tax regulations
4. **Customer Experience**: Simpler pricing for end consumers

## Technical Implementation Notes

1. **Tax Calculation**: Always use `0.115044` multiplier for IVA extraction
2. **Display**: Show "IVA (13% incluido)" to clarify pricing structure
3. **Totals**: Final total equals the displayed service prices
4. **DTE Documents**: All DTE documents include IVA in pricing
5. **Tickets**: Regular tickets may not include IVA (depending on business type)

## Compliance Requirements

- **DTE Factura**: Must include IVA and show NIT
- **DTE Comprobante**: Must include IVA (NIT optional)
- **Regular Ticket**: May exclude IVA for certain transactions
- **Tax Reporting**: IVA amounts must be reported separately for fiscal purposes

## Testing Scenarios

1. **Service Price $1000**: IVA should be $115.04, Total $1000
2. **Service Price $2500**: IVA should be $287.61, Total $2500
3. **Multiple Services**: IVA calculated on total amount
4. **Discounts**: IVA calculated after discount application
5. **Insurance**: Insurance coverage calculated on IVA-inclusive total

## Future Considerations

1. **Multi-Country Support**: Consider country-specific tax handling
2. **Tax Rate Changes**: Make tax rate configurable
3. **Audit Trail**: Maintain clear records of IVA calculations
4. **Reporting**: Generate tax reports for fiscal authorities
