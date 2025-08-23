# Backend Processes for Clinic Billing System

## 1. Order Management (BACKEND REQUIRED)

### API Endpoints:
- `POST /api/orders` - Create new order
- `GET /api/orders` - List orders with filters
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id` - Update order
- `DELETE /api/orders/:id` - Cancel order

### Database Operations:
- Create order with status="pending_payment"
- Store patient info, services, totals
- Generate unique order number
- Validate patient NIT/RNC for tax documents

## 2. Stripe Payment Integration (BACKEND REQUIRED)

### API Endpoints:
- `POST /api/payments/stripe/create-intent` - Create payment intent
- `POST /api/payments/stripe/confirm` - Confirm payment
- `POST /api/stripe/connection-token` - Get terminal connection token
- `POST /api/stripe/webhook` - Handle Stripe webhooks

### Process Flow:
1. Create Stripe Payment Intent with order amount
2. Initialize Stripe Terminal for NFC payment
3. Process payment through terminal
4. Handle payment confirmation/failure
5. Update order status based on payment result
6. Store Stripe payment ID and receipt URL

### Required Environment Variables:
- `STRIPE_SECRET_KEY`
- `STRIPE_PUBLISHABLE_KEY`
- `STRIPE_WEBHOOK_SECRET`

## 3. DTE Generation and Submission (BACKEND REQUIRED)

### API Endpoints:
- `POST /api/dte/submit` - Submit DTE to Ministerio de Hacienda
- `GET /api/dte/:orderId` - Get DTE status
- `POST /api/dte/retry` - Retry failed DTE submission
- `GET /api/dte/xml/:uuid` - Download DTE XML
- `GET /api/dte/pdf/:uuid` - Download DTE PDF

### Process Flow:
1. Generate DTE document after successful payment
2. Build DTE JSON/XML according to MH specifications
3. Submit to Ministerio de Hacienda Web Service
4. Handle acceptance/rejection responses
5. Store DTE UUID and status
6. Generate PDF/XML files for download
7. Implement retry mechanism for failed submissions

### Required Environment Variables:
- `DTE_MH_ENDPOINT` - Ministerio de Hacienda API endpoint
- `DTE_NIT_EMISOR` - Clinic's NIT
- `DTE_CERTIFICATE` - Digital certificate for DTE signing
- `DTE_PRIVATE_KEY` - Private key for DTE signing

## 4. Patient Management (BACKEND REQUIRED)

### API Endpoints:
- `GET /api/patients` - List patients with search
- `GET /api/patients/:id` - Get patient details
- `POST /api/patients` - Create new patient
- `PUT /api/patients/:id` - Update patient
- `DELETE /api/patients/:id` - Delete patient

### Database Operations:
- Store patient demographics
- Manage NIT/RNC for tax documents
- Handle insurance information
- Track patient billing history

## 5. Service Catalog Management (BACKEND REQUIRED)

### API Endpoints:
- `GET /api/services` - List available services
- `POST /api/services` - Create new service
- `PUT /api/services/:id` - Update service
- `DELETE /api/services/:id` - Delete service

### Database Operations:
- Manage service pricing
- Category organization
- Tax applicability per service

## 6. Notification System (BACKEND REQUIRED)

### API Endpoints:
- `POST /api/notifications/send-dte` - Send DTE to patient
- `POST /api/notifications/send-receipt` - Send payment receipt
- `POST /api/notifications/send-reminder` - Send payment reminder

### Integration Points:
- Email service (SendGrid, AWS SES, etc.)
- WhatsApp Business API
- SMS service

## 7. Reporting and Analytics (BACKEND REQUIRED)

### API Endpoints:
- `GET /api/reports/revenue` - Revenue reports
- `GET /api/reports/taxes` - Tax reports for compliance
- `GET /api/reports/dte-status` - DTE submission status
- `GET /api/reports/payments` - Payment method analysis

### Database Operations:
- Aggregate sales data
- Tax calculation summaries
- DTE compliance tracking
- Payment method statistics

## 8. Retry and Error Handling (BACKEND REQUIRED)

### Background Jobs:
- DTE retry queue for failed submissions
- Payment confirmation retries
- Notification delivery retries
- Data synchronization jobs

### Error Handling:
- Stripe payment failures
- DTE submission errors
- Network connectivity issues
- Database transaction rollbacks

## 9. Security and Compliance (BACKEND REQUIRED)

### Security Measures:
- API authentication and authorization
- Data encryption at rest and in transit
- Audit logging for all transactions
- PCI DSS compliance for payment data
- GDPR/data privacy compliance

### Compliance Requirements:
- El Salvador DTE regulations
- Dominican Republic DGII requirements
- Medical data privacy (HIPAA equivalent)
- Financial transaction logging

## 10. Database Schema (BACKEND REQUIRED)

### Core Tables:
- `orders` - Order/invoice information
- `payments` - Payment transactions
- `dtes` - DTE documents and status
- `patients` - Patient information
- `services` - Service catalog
- `audit_logs` - Transaction audit trail

### Relationships:
- Order → Patient (many-to-one)
- Order → Payment (one-to-one)
- Order → DTE (one-to-one)
- Order → OrderServices (one-to-many)

## Implementation Priority:

1. **Phase 1**: Order management and basic payment processing
2. **Phase 2**: Stripe Terminal integration and NFC payments
3. **Phase 3**: DTE generation and submission to Ministerio de Hacienda
4. **Phase 4**: Notification system and receipt delivery
5. **Phase 5**: Reporting, analytics, and compliance features

Each phase requires full backend implementation with proper error handling, logging, and monitoring.
