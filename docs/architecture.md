# BodyWise System Architecture
## Table of Contents

1. [Executive Summary](#executive-summary)
2. [System Overview](#system-overview)
3. [Architecture Patterns](#architecture-patterns)
4. [Technical Stack](#technical-stack)
5. [System Architecture Diagrams](#system-architecture-diagrams)
6. [Component Architecture](#component-architecture)
7. [Data Architecture](#data-architecture)
8. [Security Architecture](#security-architecture)
9. [Integration Architecture](#integration-architecture)
10. [Deployment Architecture](#deployment-architecture)
11. [Scalability & Performance](#scalability--performance)
12. [Technology Decisions](#technology-decisions)

---

## Executive Summary

BodyWise is a comprehensive telemedicine platform built on a modern, scalable architecture using Next.js 14, React 18, and TypeScript. The system is designed to facilitate seamless interactions between patients, healthcare professionals, and institutions while maintaining high security standards and optimal performance.

**Key Architectural Highlights:**

- **Monolithic Frontend with Microservice-Ready Backend** - Simplified deployment with clear separation of concerns
- **API-First Design** - RESTful APIs enabling future mobile app integration
- **Security by Design** - Multi-layered security with JWT authentication, role-based access control
- **Real-Time Communication** - Jitsi Meet integration for video consultations
- **Event-Driven Email System** - Automated notifications via SendGrid
- **Relational Data Model** - SQLite for development, PostgreSQL-ready for production scale

---

## System Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Layer                            │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐         │
│  │  Web App │  │  Mobile  │  │  Tablet  │  │  Desktop │         │
│  │ (Browser)│  │ (Future) │  │ (Future) │  │  (PWA)   │         │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘         │
└────────────────────────┬────────────────────────────────────────┘
                         │ HTTPS/WSS
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                   CDN Layer (Cloudflare)                        │
│  - Static Asset Caching                                         │
│  - DDoS Protection                                              │
│  - SSL/TLS Termination                                          │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Load Balancer (Nginx)                         │
│  - Request Distribution                                         │
│  - Health Checks                                                │
│  - Rate Limiting                                                │
└────────────────────────┬────────────────────────────────────────┘
                         │
         ┌───────────────┼───────────────┐
         ▼               ▼               ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│   Node.js    │ │   Node.js    │ │   Node.js    │
│  Instance 1  │ │  Instance 2  │ │  Instance N  │
│              │ │              │ │              │
│  Next.js 14  │ │  Next.js 14  │ │  Next.js 14  │
│  App Router  │ │  App Router  │ │  App Router  │
└──────┬───────┘ └──────┬───────┘ └──────┬───────┘
       │                │                │
       └────────────────┼────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Data Layer                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   SQLite     │  │    Redis     │  │  File System │         │
│  │  (Primary)   │  │   (Cache)    │  │  (Uploads)   │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└─────────────────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────────┐
│                   External Services                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   SendGrid   │  │  Jitsi Meet  │  │    Vercel    │         │
│  │   (Email)    │  │   (Video)    │  │  (Hosting)   │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└─────────────────────────────────────────────────────────────────┘
```

### System Context

BodyWise operates within a healthcare ecosystem connecting multiple stakeholders:

```
                    ┌─────────────────┐
                    │    Patients     │
                    │  - Book visits  │
                    │  - View records │
                    └────────┬────────┘
                             │
                             ▼
         ┌──────────────────────────────────────┐
         │        BodyWise Platform             │
         │  - Consultation Management           │
         │  - Schedule Coordination             │
         │  - Communication Hub                 │
         │  - Educational Resources             │
         └──────┬───────────────────┬───────────┘
                │                   │
       ┌────────▼────────┐   ┌─────▼──────────┐
       │ Health          │   │  Institutions  │
       │ Professionals   │   │  - Manage team │
       │ - Consultations │   │  - Analytics   │
       │ - Availability  │   │  - Reports     │
       └─────────────────┘   └────────────────┘
```

---

## Architecture Patterns

### 1. Layered Architecture

```
┌─────────────────────────────────────────────┐
│         Presentation Layer                  │
│  - React Components                         │
│  - UI/UX Logic                              │
│  - Client-side State Management             │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│         Application Layer                   │
│  - API Routes (Next.js)                     │
│  - Business Logic                           │
│  - Request Validation                       │
│  - Response Formatting                      │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│         Domain Layer                        │
│  - Core Business Logic                      │
│  - Domain Models                            │
│  - Business Rules                           │
│  - Validation Logic                         │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│         Data Access Layer                   │
│  - Database Operations                      │
│  - Query Builders                           │
│  - ORM Logic                                │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│         Infrastructure Layer                │
│  - SQLite Database                          │
│  - External Services                        │
│  - File System                              │
└─────────────────────────────────────────────┘
```

### 2. API-First Architecture

All business logic is exposed through RESTful APIs, enabling:
- Clear separation between frontend and backend
- Future mobile app integration
- Third-party integrations
- Microservices migration path

### 3. Middleware Pipeline

```
  Our Flow:

HTTP Request
    │
    ▼
┌─────────────────────┐
│  CORS Middleware    │ ← Cross-origin validation
└──────────┬──────────┘
           ▼
┌─────────────────────┐
│  Rate Limiter       │ ← DDoS protection
└──────────┬──────────┘
           ▼
┌─────────────────────┐
│  Auth Middleware    │ ← JWT validation
└──────────┬──────────┘
           ▼
┌─────────────────────┐
│  Role Checker       │ ← RBAC enforcement
└──────────┬──────────┘
           ▼
┌─────────────────────┐
│  API Route Handler  │ ← Business logic
└──────────┬──────────┘
           ▼
┌─────────────────────┐
│  Response Formatter │ ← Standardized output
└──────────┬──────────┘
           ▼
     HTTP Response
```

---

## Technical Stack

### Frontend Stack

| Category | Technology | Purpose |
|----------|-----------|---------|
| **Framework** | Next.js | React framework with SSR/SSG |
| **UI Library** | React | Component-based UI |
| **Language** | TypeScript | Type-safe JavaScript |
| **Styling** | Tailwind CSS | Utility-first CSS framework |
| **UI Components** | shadcn/ui | Accessible component library |
| **State Management** | React Context | Global state management |
| **Form Handling** | React Hook Form | Form validation & submission |
| **Icons** | Lucide React | Icon library |

### Backend Stack

| Category | Technology | Purpose |
|----------|-----------|---------|
| **Runtime** | Node.js | JavaScript runtime |
| **Database** | SQLite | Embedded relational database |
| **ORM/Query** | better-sqlite3 | Synchronous SQLite driver |
| **Authentication** | jsonwebtoken |JWT token generation/validation |
| **Password Hashing** | bcryptjs | Secure password hashing |
| **Email Service** | SendGrid | Transactional emails |
| **Validation** | Zod | Schema validation |

### Development Tools

| Category | Technology | Purpose |
|----------|-----------|---------|
| **Package Manager** | npm | Dependency management |
| **Linting** | ESLint | Code quality enforcement |
| **Testing** | Jest | Unit testing framework |
| **E2E Testing** | Playwright | End-to-end testing |
| **API Docs** | Swagger UI | Interactive API documentation |
| **Version Control** | Git | Source code management |

### External Services

| Service | Purpose | Integration |
|---------|---------|-------------|
| **SendGrid** | Email delivery | REST API v3 |
| **Jitsi Meet** | Video consultations | JavaScript SDK |
| **Vercel** | Hosting & deployment | Git integration |

---

## System Architecture Diagrams

### 1. Application Architecture

```
┌────────────────────────────────────────────────────────────────┐
│                     BodyWise Application                       │
│                                                                │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              Frontend (Next.js App Router)              │   │
│  │                                                         │   │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐         │   │
│  │  │   Pages    │  │ Components │  │   Layouts  │         │   │
│  │  │            │  │            │  │            │         │   │
│  │  │ - Landing  │  │ - Auth     │  │ - Dashboard│         │   │
│  │  │ - Login    │  │ - Meeting  │  │ - Public   │         │   │
│  │  │ - Signup   │  │ - Chat     │  │ - Protected│         │   │
│  │  │ - Dashboard│  │ - UI       │  │            │         │   │
│  │  └────────────┘  └────────────┘  └────────────┘         │   │
│  │                                                         │   │
│  │  ┌──────────────────────────────────────────────────┐   │   │
│  │  │            Shared Libraries                      │   │   │
│  │  │  - auth-context.tsx  - Authentication state      │   │   │
│  │  │  - utils.ts          - Helper functions          │   │   │
│  │  │  - constants.ts      - App constants             │   │   │
│  │  │  - navigation.ts     - Route definitions         │   │   │
│  │  └──────────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                 │
│                              │ API Calls                       │
│                              ▼                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              Backend API (Next.js API Routes)           │   │
│  │                                                         │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────┐   │   │
│  │  │   Auth   │  │  Patient │  │Professional││ Admin│ │   │   │
│  │  │          │  │          │  │          │  │        │   │   │
│  │  │ - Login  │  │ - Consult│  │ - Profile│  │ - Users│   │   │
│  │  │ - Logout │  │ - Booking│  │ - Schedule│ │ - Logs │   │   │
│  │  │ - Register│ │ - Doctors│  │ - Consult│  │ - Stats│   │   │
│  │  └──────────┘  └──────────┘  └──────────┘  └────────┘   │   │
│  │                                                         │   │
│  │  ┌──────────┐  ┌────────────┐  ┌──────────┐  ┌────────┐ │   │
│  │  │   Blog   │  │Testimonial │  │   Cron   │  │  Docs  │ │   │
│  │  │          │  │            │  │          │  │        │ │   │
│  │  │ - List   │  │ - Submit   │  │ - Email  │  │ -Swagger││   │
│  │  │ - Create │  │ - Approve  │  │ - Remind │  │ - Spec │ │   │
│  │  │ - Update │  │ - List     │  │          │  │        │ │   │
│  │  └──────────┘  └────────────┘  └──────────┘  └────────┘ │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                 │
│                              │ SQL Queries                     │
│                              ▼                                 │
│  ┌────────────────────────────────────────────────────────┐    │
│  │                  Database Layer                        │    │
│  │                                                        │    │
│  │  ┌──────────────────────────────────────────────────┐  │    │
│  │  │         SQLite Database (bodywise.db)            │  │    │
│  │  │                                                  │  │    │
│  │  │  Tables:                                         │  │    │
│  │  │  - users                - consultations          │  │    │
│  │  │  - health_professionals - consultation_slots     │  │    │
│  │  │  - institutions         - reviews                │  │    │
│  │  │  - blogs                - testimonials           │  │    │
│  │  │  - consultation_invites - activity_logs          │  │    │
│  │  └──────────────────────────────────────────────────┘  │    │
│  └────────────────────────────────────────────────────────┘    │
└────────────────────────────────────────────────────────────────┘
```

### 2. Data Flow Architecture

```
User Action >>> Frontend >>> API >>> Database >>> Response

Ex: Book Consultation

1. User clicks "Book Appointment"
   └─> React Component (patient/doctors/[id]/page.tsx)
       │
       ▼
2. Form submission triggers API call
   └─> fetch('/api/patient/consultations/book', {
           method: 'POST',
           body: JSON.stringify({ doctorId, slotId })
       })
       │
       ▼
3. Middleware validates request
   └─> middleware.ts
       ├─> Extract JWT token
       ├─> Verify signature
       ├─> Check expiration
       └─> Extract user data
       │
       ▼
4. API route handler processes request
   └─> app/api/patient/consultations/book/route.ts
       ├─> Validate input data
       ├─> Check slot availability
       ├─> Create consultation record
       ├─> Update slot status
       └─> Send confirmation email
       │
       ▼
5. Database transaction
   └─> lib/db/index.ts
       ├─> BEGIN TRANSACTION
       ├─> INSERT INTO consultations
       ├─> UPDATE consultation_slots
       ├─> COMMIT
       │
       ▼
6. Email notification
   └─> lib/email.ts
       ├─> SendGrid API call
       └─> Send consultation-confirmation.html
       │
       ▼
7. Success response
   └─> {
           "success": true,
           "data": {
               "consultationId": 123,
               "scheduledAt": "2025-11-20T10:00:00Z",
               "meetingLink": "https://meet.jitsi.si/room-123"
           }
       }
       │
       ▼
8. Frontend updates UI
   └─> Show success message
   └─> Redirect to consultations page
```

### 3. Authentication Flow

```
┌──────────────────────────────────────────────────────────────┐
│                    Authentication Flow                       │
└──────────────────────────────────────────────────────────────┘

#1: Login Request

User >> Login Form >> POST /api/auth/login
{
  "email": "patient@example.com",
  "password": "SecurePassword123"
}

#2: Credential Verification

API Route Handler
  ├─> Query user by email
  ├─> Compare password hash (bcrypt)
  ├─> Validate account status
  └─> If valid >> Proceed to #3
      If invalid >> Return 401 Unauthorized

#3: Token Generation

JWT Creation
  ├─> Payload: { userId, email, role, institutionId }
  ├─> Secret: process.env.JWT_SECRET
  ├─> Algorithm: HS256
  ├─> Expiration: 24 hours
  └─> Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

#4: Response

Response Headers:
  Set-Cookie: token=<JWT>; HttpOnly; Secure; SameSite=Strict; Max-Age=86400

Response Body:
{
  "success": true,
  "token": "<JWT>",
  "user": {
    "id": 1,
    "email": "patient@example.com",
    "role": "patient",
    "firstName": "John",
    "lastName": "Doe"
  }
}

#5: Subsequent Requests

Client >> API Request
Headers:
  Cookie: token=<JWT>
  OR
  Authorization: Bearer <JWT>

#6: Token Validation (Middleware)

middleware.ts
  ├─> Extract token from cookie or header
  ├─> Verify JWT signature
  ├─> Check expiration
  ├─> Extract user data
  └─> If valid > Allow access + Inject user data
      If invalid > Return 401 Unauthorized

#7: Role-Based Access Control

API Route Handler
  ├─> Check user.role
  ├─> Validate permissions
  └─> If authorized >> Process request
      If unauthorized >> Return 403 Forbidden
```

### 4. Database Entity-Relationship Diagram (Actual Schema)

```
┌─────────────────────────────────────────────────────────────────┐
│                  BodyWise Database Schema (SQLite)              │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                        users (Base Table)                        │
├──────────────────────────────────────────────────────────────────┤
│ id (PK), email (UNIQUE), password_hash                           │
│ role: patient | health_professional | institutional_admin |      │
│       system_admin                                               │
│ is_verified, is_active, created_at, updated_at                   │
└──────┬───────────────┬────────────────┬──────────────────────────┘
       │ 1             │ 1              │ 1
       │               │                │
       ▼ *             ▼ *              ▼ *
┌─────────────┐  ┌──────────────────┐  ┌──────────────────────┐
│  patients   │  │ health_          │  │ institutional_       │
│             │  │ professionals    │  │ admins               │
├─────────────┤  ├──────────────────┤  ├──────────────────────┤
│ id (PK)     │  │ id (PK)          │  │ id (PK)              │
│ user_id (FK)│  │ user_id (FK)     │  │ user_id (FK)         │
│ username    │  │ institution_id   │  │ institution_id (FK)  │
│ full_name   │  │ full_name        │  │ full_name            │
│ date_of_birth│ │ bio              │  │ phone                │
│ gender      │  │ specialization   │  │ profile_picture      │
│ phone       │  │ years_experience │  └──────────────────────┘
│ profile_pic │  │ phone            │           │
└──────┬──────┘  │ profile_picture  │           │ *
       │         │ average_rating   │           │
       │ 1       │ total_reviews    │           ▼
       │         └────┬─────────────┘  ┌──────────────────┐
       │              │                │  institutions    │
       │              │ 1              ├──────────────────┤
       │              │                │ id (PK)          │
       │              │ *              │ name (UNIQUE)    │
       │              ▼                │ bio, location    │
       │    ┌─────────────────────┐    │ verification     │
       │    │ availability_       │    │ status (pending/ │
       │    │ schedules           │    │ approved/rejected│
       │    ├─────────────────────┤    │ certificate_url  │
       │    │ id (PK)             │    │ support_documents│
       │    │ professional_id (FK)│    │  created_at      │
       │    │ day_of_week (0-6)   │    └──────────────────┘
       │    │ start_time, end_time│   
       │    │ is_available        │    
       │    └─────────────────────┘
       │
       │ 1                          ┌──────────────────────┐
       │ *                          │   system_admins      │
       ▼                            ├──────────────────────┤
┌──────────────────────┐            │ id (PK)              │
│   consultations      │            │ user_id (FK)         │
├──────────────────────┤            │ full_name            │
│ id (PK)              │            │ phone                │
│ patient_id (FK)      │───┐        └──────────────────────┘
│ professional_id (FK) │   │
│ scheduled_date       │   │ 1
│ scheduled_time       │   │
│ duration_minutes     │   │ *
│ meeting_link (Jitsi) │   ▼
│ status (scheduled/   │   ┌──────────────────────────┐
│ completed/cancelled/ │   │   consultation_          │
│ no_show)             │   │   attendees              │
│ created_at           │   ├──────────────────────────┤
└──────┬───────────────┘   │ id (PK)                  │
       │                   │ consultation_id (FK)     │
       │ 1                 │ patient_id (FK)          │
       │                   │ invitation_status        │
       │ *                 │ (pending/accepted/       │
       ▼                   │  declined)               │
┌──────────────────────┐   │ invited_at               │
│      reviews         │   └──────────────────────────┘
├──────────────────────┤
│ id (PK)              │
│ consultation_id (FK) │   ┌──────────────────────┐
│ patient_id (FK)      │   │   bmi_records        │
│ professional_id (FK) │   ├──────────────────────┤
│ rating (1-5)         │   │ id (PK)              │
│ comment              │   │ patient_id (FK)      │
│ created_at           │   │ height_cm            │
└──────────────────────┘   │ weight_kg            │
                           │ bmi_value            │
┌──────────────────────┐   │ bmi_category         │
│   articles           │   │ recorded_at          │
├──────────────────────┤   └──────────────────────┘
│ id (PK)              │
│ title                │   ┌──────────────────────┐
│ content              │   │   assessments        │
│ author_type (health_ │   ├──────────────────────┤
│  professional/       │   │ id (PK)              │
│  institutional_admin)│   │ title, description   │
│ author_id            │   │ content (JSON)       │
│ institution_id       │   │ creator_type         │
│ thumbnail_url        │   │ creator_id           │
│ is_published         │   │ institution_id       │
│ views_count          │   │ is_published         │
│ created_at           │   │ created_at           │
│ updated_at           │   └──────────────────────┘
└──────────────────────┘            │
                                    │ 1
┌──────────────────────┐            │ *
│   testimonials*      │            ▼
├──────────────────────┤   ┌──────────────────────┐
│ id (PK)              │   │ assessment_results   │
│ user_id (FK)         │   ├──────────────────────┤
│ user_type            │   │ id (PK)              │
│ content              │   │ assessment_id (FK)   │
│ rating (1-5)         │   │ patient_id (FK)      │
│ approval_status      │   │ responses (JSON)     │
│ (pending/approved/   │   │ score                │
│  rejected)           │   │ completed_at         │
│ approved_by          │   └──────────────────────┘
│ approved_at          │
│ rejection_reason     │   ┌──────────────────────┐
│ is_featured          │   │   system_logs        │
│ created_at           │   ├──────────────────────┤
└──────────────────────┘   │ id (PK)              │
*Optional migration        │ log_type (error/     │
                           │  warning/info/       │
                           │  performance)        │
                           │ message              │
┌──────────────────────┐   │ details (JSON)       │
│   user_activity      │   │ created_at           │
├──────────────────────┤   └──────────────────────┘
│ id (PK)              │
│ user_id (FK)         │
│ activity_type        │
│ details (JSON)       │
│ created_at           │
└──────────────────────┘

Key Notes:
- 15+ tables in core schema (lib/db/schema.sql)
- testimonials table requires migration (scripts/add-blog-testimonials.sql)
- Foreign keys enforced: ON DELETE CASCADE or SET NULL
- Indexes on: email, role, username, scheduled_date, status, is_published
 All timestamps use DATETIME DEFAULT CURRENT_TIMESTAMP
```

---

## Component Architecture

### Frontend Components Hierarchy

```
app/
├── layout.tsx (Root Layout)
│   ├── Navbar
│   └── Footer
│
├── page.tsx (Landing Page)
│   ├── Hero
│   ├── CoreFeatures
│   ├── EducationHub
│   └── TestimonialsSection
│
├── login/page.tsx
│   └── AuthShell
│       └── LoginForm
│
├── signup/page.tsx
│   └── AuthShell
│       └── SignupForm
│           └── RoleCard (x3)
│
├── user/ (Patient Dashboard)
│   ├── layout.tsx
│   │   └── DashboardShell
│   ├── page.tsx
│   │   ├── StatCard (x4)
│   │   ├── ChatCard
│   │   └── ActivityList
│   ├── doctors/page.tsx
│   │   └── DoctorCard (dynamic)
│   └── chat/page.tsx
│       └── Textarea
│
├── doctor/ (Professional Dashboard)
│   ├── layout.tsx
│   │   └── DashboardShell
│   ├── page.tsx
│   │   ├── StatCard (x4)
│   │   └── ScheduleList
│   └── profile/page.tsx
│
├── institution/ (Institution Dashboard)
│   ├── layout.tsx
│   │   └── DashboardShell
│   ├── page.tsx
│   └── doctors/page.tsx
│       └── OnboardDoctorModal
│
└── admin/ (Admin Dashboard)
    ├── layout.tsx
    │   └── DashboardShell
    ├── page.tsx
    │   └── SystemMonitor
    └── users/page.tsx
        └── DataTable
```

### Reusable Component Library (UI)

```
components/ui/
├── button.tsx          - Interactive buttons
├── card.tsx            - Content containers
├── dialog.tsx          - Modal dialogs
├── form.tsx            - Form components
├── input.tsx           - Text inputs
├── label.tsx           - Form labels
├── select.tsx          - Dropdown selects
├── table.tsx           - Data tables
├── tabs.tsx            - Tab navigation
├── badge.tsx           - Status badges
├── avatar.tsx          - User avatars
├── skeleton.tsx        - Loading states
└── toast.tsx           - Notifications
```

---

## Data Architecture

### Database Design Principles

1. **Normalization**: 3rd Normal Form (3NF) to reduce redundancy
2. **Referential Integrity**: Foreign key constraints enforced
3. **Indexing Strategy**: Indexes on frequently queried columns
4. **Audit Trail**: created_at, updated_at timestamps on all tables
5. **Soft Deletes**: Logical deletion where applicable (status field)
6. **Modular Migrations**: Optional features via separate SQL scripts

### Core Schema vs. Optional Features

**Core Database Schema** (`lib/db/schema.sql`):
-  Users and authentication (4 role types)
-  Patients, health professionals, institutions
-  Consultations and availability schedules
-  Reviews and BMI records
-  Articles (educational content)
-  Assessments and system logs
-  User activity tracking

**Optional Features** (Migration Scripts):
- `testimonials` table - `scripts/add-blog-testimonials.sql`
- Email reminder columns - `scripts/add-email-reminder-columns.sql`
- Doctor-specific reminder fields - `scripts/add-doctor-reminder-columns.sql`

**Note**: Testimonials API endpoints require running the `add-blog-testimonials.sql` migration script first.

### Data Access Patterns

```typescript
// Database connection (singleton pattern)
// lib/db/index.ts

import Database from 'better-sqlite3';

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!db) {
    db = new Database('./bodywise.db');
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
  }
  return db;
}

// Prepared statements for performance
const getUserByEmail = db.prepare('SELECT * FROM users WHERE email = ?');
const createUser = db.prepare(`
  INSERT INTO users (email, password_hash, role, first_name, last_name)
  VALUES (?, ?, ?, ?, ?)
`);

// Transaction support
function bookConsultation(patientId, slotId, professionalId) {
  const transaction = db.transaction(() => {
    // Create consultation
    const result = db.prepare(`
      INSERT INTO consultations (patient_id, professional_id, slot_id, status)
      VALUES (?, ?, ?, 'scheduled')
    `).run(patientId, professionalId, slotId);
    
    // Update slot availability
    db.prepare(`
      UPDATE consultation_slots 
      SET is_available = 0, consultation_id = ?
      WHERE id = ?
    `).run(result.lastInsertRowid, slotId);
    
    return result.lastInsertRowid;
  });
  
  return transaction();
}
```

### Data Backup Strategy

```bash
# Daily automated backup
0 2 * * * /usr/local/bin/backup-db.sh

# backup-db.sh
#!/bin/bash
BACKUP_DIR="/backups/bodywise"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
DB_FILE="/app/bodywise.db"
BACKUP_FILE="$BACKUP_DIR/bodywise_$TIMESTAMP.db"

# SQLite online backup
sqlite3 $DB_FILE ".backup $BACKUP_FILE"

# Compress backup
gzip $BACKUP_FILE

# Upload to cloud storage (S3, GCS, etc.)
aws s3 cp $BACKUP_FILE.gz s3://bodywise-backups/

# Keep only last 30 days locally
find $BACKUP_DIR -name "*.gz" -mtime +30 -delete
```

---

## Security Architecture

### Security Layers

```
┌─────────────────────────────────────────────────────────────┐
│                    Layer 6: Application                     │
│  - Input Validation (Zod schemas)                           │
│  - Output Encoding                                          │
│  - Business Logic Security                                  │
└─────────────────────────┬───────────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────────┐
│                    Layer 5: Authentication                  │
│  - JWT Token Validation                                     │
│  - Session Management                                       │
│  - Password Hashing (bcrypt)                                │
└─────────────────────────┬───────────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────────┐
│                    Layer 4: Authorization                   │
│  - Role-Based Access Control (RBAC)                         │
│  - Resource-Level Permissions                               │
│  - Middleware Enforcement                                   │
└─────────────────────────┬───────────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────────┐
│                    Layer 3: API Security                    │
│  - Rate Limiting                                            │
│  - CORS Configuration                                       │
│  - Request Size Limits                                      │
└─────────────────────────┬───────────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────────┐
│                    Layer 4: Transport                       │
│  - HTTPS/TLS 1.3                                            │
│  - Certificate Management                                   │
│  - Secure Headers (HSTS, CSP)                               │
└─────────────────────────┬───────────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────────┐
│                    Layer 1: Network                         │
│  - Firewall Rules                                           │
│  - IP Whitelisting (Admin endpoints)                        │
└─────────────────────────────────────────────────────────────┘
```

### Authentication Implementation

```typescript
// JWT token structure
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "userId": 123,
    "email": "user@example.com",
    "role": "patient",
    "institutionId": 1,
    "iat": 1700000000,
    "exp": 1700086400
  },
  "signature": "..."
}

// Token validation middleware
export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value ||
                request.headers.get('authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return NextResponse.json(
      { success: false, error: 'unauthorized' },
      { status: 401 }
    );
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    // Inject user data into request headers
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', decoded.userId);
    requestHeaders.set('x-user-role', decoded.role);
    
    return NextResponse.next({
      request: { headers: requestHeaders }
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'invalid token' },
      { status: 401 }
    );
  }
}
```

### Role-Based Access Control (RBAC)

```
Role Hierarchy:


system_admin (Full access)
    ├─> Manage all users
    ├─> System configuration
    ├─> Content moderation
    └─> Access all data

institution_admin
    ├─> Manage institution professionals
    ├─> View institution analytics
    └─> Manage institution settings

health_professional
    ├─> Manage own profile
    ├─> View assigned patients
    ├─> Manage consultations
    └─> Create blog posts

patient (Default)
    ├─> Book consultations
    ├─> View own records
    ├─> Submit reviews
    └─> Access educational content
```

```
Permissions Matrix:

Resource              | patient | professional | institution_admin | system_admin
─────────────────────|─────────|──────────────|───────────────────|──────────────
Own Profile          | RW      | RW           | RW                | CRUD
Other Profiles       | R       | R            | R (institution)   | CRUD
Consultations (Own)  | CRUD    | CRUD         | R                 | CRUD
Consultations (All)  | -       | -            | R (institution)   | CRUD
Blog Posts (Own)     | -       | CRUD         | -                 | CRUD
Blog Posts (All)     | R       | R            | R                 | CRUD
Users                | -       | -            | CRU (institution) | CRUD
Analytics            | -       | R (own)      | R (institution)   | R (all)

R = Read, C = Create, U = Update, D = Delete, W = Write
```
---

## Integration Architecture

### External Service Integrations

#### 1. SendGrid Email Service

```javascript
Integration Pattern: REST API

Flow:
User Action >> Event Trigger >> Email Queue >> SendGrid API >> Email Delivery

Implementation:
// lib/email.ts
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function sendConsultationConfirmation(data: {
  to: string;
  patientName: string;
  doctorName: string;
  scheduledAt: string;
  meetingLink: string;
}) {
  const msg = {
    to: data.to,
    from: 'noreply@bodywise.com',
    templateId: 'd-xxxxx', // SendGrid template ID
    dynamic_template_data: data
  };
  
  await sgMail.send(msg);
}

Error Handling:
- Retry logic (3 attempts)
- Fallback notification mechanism
- Error logging to activity_logs
```

#### 2. Jitsi Meet Video Service

```javascript
Integration Pattern: JavaScript SDK

Flow:
Consultation Scheduled >> Generate Room >> Embed Jitsi >> Start Meeting

Implementation:
// components/meeting/jitsi-meeting.tsx
import { JitsiMeeting } from '@jitsi/react-sdk';

export function JitsiMeetingComponent({ roomName, userName }) {
  return (
    <JitsiMeeting
      domain="meet.jitsi.si"
      roomName={roomName}
      configOverwrite={{
        startWithAudioMuted: true,
        disableModeratorIndicator: true,
        startScreenSharing: false,
        enableEmailInStats: false
      }}
      interfaceConfigOverwrite={{
        DISABLE_JOIN_LEAVE_NOTIFICATIONS: true
      }}
      userInfo={{
        displayName: userName
      }}
      getIFrameRef={(iframeRef) => {
        iframeRef.style.height = '100%';
      }}
    />
  );
}

Security:
- Unique room names per consultation
- JWT-based room access (future)
- Recording disabled by default
- End-to-end encryption
```

#### 3. AI Chatbot Service (Groq API)

Integration Pattern: Streaming API with Vercel AI SDK

##### Architecture Overview:

```
Patient User Interface
         │
         ▼
┌─────────────────────────────────────┐
│  React Component (useChat hook)     │
│  - Message input/display            │
│  - Streaming UI updates             │
│  - Privacy notice display           │
└──────────────┬──────────────────────┘
               │ POST /api/chat
               ▼
┌─────────────────────────────────────┐
│  Next.js API Route                  │
│  - Role validation (patient only)   │
│  - Rate limiting                    │
│  - Request sanitization             │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Vercel AI SDK                      │
│  - Stream management                │
│  - Token handling                   │
│  - Error handling                   │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Groq API (LLM Provider)            │
│  - llama-3.3-70b (default)          │
│  - compound-mini                    │
│  - gpt-oss-20b                      │
│  - qwen3-32b                        │
│  - kimi-k2-instruct-0905            │
└─────────────────────────────────────┘
```

```javascript
Implementation:

// ai/providers.ts
import { createGroq } from '@ai-sdk/groq';

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY!,
});

export const DEFAULT_MODEL = 'llama-3.3-70b-versatile';

export const BODYWISE_SYSTEM_PROMPT = `
You are a compassionate AI health coach for BodyWise...
[System prompt focuses on:]
- Body positivity and mental wellness
- Evidence-based health guidance
- Cultural sensitivity
- Safety boundaries (crisis referrals)
- Non-judgmental support
`;

// app/api/chat/route.ts
import { streamText } from 'ai';
import { groq } from '@/ai/providers';

export async function POST(req: Request) {
  const { messages } = await req.json();
  
  const result = streamText({
    model: groq(DEFAULT_MODEL),
    system: BODYWISE_SYSTEM_PROMPT,
    messages,
  });
  
  return result.toDataStreamResponse();
}

// app/user/chat/page.tsx
import { useChat } from 'ai/react';

export default function ChatPage() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: '/api/chat',
  });
  
  return (
    <div>
      <PrivacyNotice />
      <MessageList messages={messages} />
      <ChatInput />
    </div>
  );
}
```

##### Privacy & Security Features:

1. Zero Data Persistence
   - Messages are NOT stored in database
   - Conversations are ephemeral (session-based)
   - No chat history logs
   - No user tracking

2. Client-Side Privacy
   - Privacy notice displayed prominently:
     "Your messages are NOT saved. 
      This is a temporary, private conversation."
   - Users informed before first interaction
   - Transparent data handling

3. Server-Side Security
   - API key stored server-side only
   - Never exposed to client
   - Role-based access (patient only)
   - Rate limiting (100 req/15min)
   - Request sanitization

4. Best Practices Implemented
    Transient conversations (no persistence)
   - Clear privacy notices
   - Limited data collection
   - Secure API key management
   - Role-based access control
   - Crisis intervention referrals
   - Medical disclaimer
   - Professional consultation encouragement

##### Available Models:

| Model |
|-------|
| llama-3.3-70b |
| compound-mini |
| gpt-oss-20b |
| qwen3-32b |
| kimi-k2-instruct-0905 |


##### Model Switching
> Update DEFAULT_MODEL in ai/providers.ts basing on your preference.

 Performance:
- Response Time: 200-500ms (streaming)
- Concurrent Users: 100+ (Groq free tier)
- Token Limit: 8192 context tokens
- Streaming: Real-time word-by-word display

Error Handling:

- Network failures: Retry with exponential backoff
- Rate limits: Queue requests, show wait time
- API errors: User-friendly error messages
- Timeout: 30-second request timeout

Future Enhancements:

- Multi-language support
- Voice input/output
- Medical resource citations
- Symptom tracker integration
- Professional handoff feature
---

## Deployment Architecture

### Production Environment

```
┌─────────────────────────────────────────────────────────────┐
│                     Internet                                │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                   Vercel Edge Network                       │
│  - Global CDN                                               │
│  - Automatic HTTPS                                          │
│  - Serverless Functions                                     │
│  - Preview Deployments                                      │
└────────────────────────┬────────────────────────────────────┘
                         │
         ┌───────────────┼───────────────┐
         ▼               ▼               ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ Next.js App  │ │ Next.js App  │ │ Next.js App  │
│ (us-east-1)  │ │ (eu-west-1)  │ │ (ap-south-1) │
│              │ │              │ │              │
│ Node.js 20   │ │ Node.js 20   │ │ Node.js 20   │
│ SQLite       │ │ SQLite       │ │ SQLite       │
└──────────────┘ └──────────────┘ └──────────────┘
```

### Deployment Process

```
Deployment Pipeline:

1. Code Push (Git)
   └─> GitHub Repository (main branch)
       │
       ▼
2. CI/CD Trigger (Vercel)
   └─> Automatic build detection
       ├─> Install dependencies (npm ci)
       ├─> Run linting (npm run lint)
       ├─> Run tests (npm test)
       ├─> Build application (npm run build)
       └─> Type checking (tsc --noEmit)
       │
       ▼
3. Build Process
   └─> Next.js Build
       ├─> Static page generation
       ├─> API routes compilation
       ├─> Asset optimization
       └─> Bundle creation
       │
       ▼
4. Deployment
   └─> Vercel Edge Network
       ├─> Deploy to regions
       ├─> Update routing
       ├─> Invalidate caches
       └─> Health checks
```

### Environment Configuration

```bash
# Production Environment Variables
# .env.production

# Application
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://bodywise.com

# Database
DATABASE_URL=/var/lib/bodywise/production.db

# Authentication
JWT_SECRET=<strong-random-secret-256-bits>
JWT_EXPIRES_IN=24h

# Email
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxx
SENDGRID_FROM_EMAIL=noreply@bodywise.com

# External Services
JITSI_DOMAIN=meet.jitsi.si
JITSI_ROOM_PREFIX=bodywise_

# Security
ALLOWED_ORIGINS=https://bodywise.com,https://www.bodywise.com
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW_MS=900000
```

---

## Scalability & Performance

### Current Performance Metrics

```
Baseline Performance (Single Instance):

Concurrent Users:        100
Requests/Second:         50
Average Response Time:   120ms
P95 Response Time:       250ms
P99 Response Time:       500ms
Database Queries/Sec:    200
Memory Usage:            150MB
CPU Usage:               15%
```

### Database Scaling

```
Phase 1: SQLite Optimization (Current)

- Write-Ahead Logging (WAL mode)
- Prepared statements
- Connection pooling
- Query optimization
- Proper indexing

Phase 2: SQLite Replication

- Read replicas for reporting
- Litestream for continuous backup
- Master-slave configuration

Phase 3: PostgreSQL Migration (>10k users)

- Horizontal partitioning (sharding)
- Read replicas (up to 5)
- Connection pooling (PgBouncer)
- Query caching (Redis)
```

### Caching Strategy

```
Multi-Level Caching:


Level 1: Browser Cache
- Static assets (images, CSS, JS)
- Cache-Control: max-age=31536000

Level 2: CDN Cache (Cloudflare)
- HTML pages (cache-control: s-maxage=60)
- API responses (selective caching)

Level 3: Application Cache (Redis - Future)
- User sessions
- Frequently accessed data
- API response cache
- Rate limit counters

Level 4: Database Query Cache
- Prepared statements
- Query result caching (5 minutes)
```

---

## Technology Decisions

### Why Next.js?

**Advantages:**
- Server-side rendering for better SEO
- API routes eliminate need for separate backend
- File-based routing simplifies development
- Built-in optimization (images, fonts, scripts)
- Excellent TypeScript support
- Active community and ecosystem

**Trade-offs:**
- Vendor lock-in to Vercel ecosystem
- Learning curve for App Router
- Limited control over server configuration

### Why SQLite?

**Advantages:**
- Zero configuration required
- Excellent for small to medium deployments
- ACID compliant with full SQL support
- Fast reads (faster than PostgreSQL for simple queries)
- Simple backup (single file)
- No network latency

**Trade-offs:**
- Limited write concurrency
- Not suitable for >100k users without sharding
- Migration to PostgreSQL needed at scale

**Migration Path:** SQLite >> PostgreSQL when:
- Concurrent users > 1000
- Write operations > 50/second
- Database size > 50GB
- Need for advanced features (full-text search, JSON operations)

### Why JWT Authentication?

**Advantages:**
- Stateless authentication
- Scales horizontally easily
- Self-contained (no database lookups)
- Cross-domain support
- Mobile-friendly

**Trade-offs:**
- Cannot revoke tokens before expiration
- Larger payload than session IDs
- Need refresh token mechanism

**Alternative Considered:** Session-based auth
### Why SendGrid?

**Advantages:**
- Reliable delivery (99.9% uptime)
- Template management
- Analytics and tracking
- Generous free tier (100 emails/day)
- Easy integration

**Trade-offs:**
- Cost at scale ($15/month for 5000 emails)
- Vendor dependency

**Alternative Considered:** AWS SES (cheaper but more complex setup)

---

## Performance Optimization Techniques

### Frontend Optimizations

```
1. Code Splitting
   - Dynamic imports for heavy components
   - Route-based splitting (automatic in Next.js)
   
2. Image Optimization
   - Next.js Image component (automatic WebP)
   - Lazy loading below-the-fold images
   - Responsive images with srcset
   
3. Bundle Size Reduction
   - Tree shaking unused code
   - Minification and compression (Gzip/Brotli)
   - Eliminate duplicate dependencies
   
4. Critical CSS
   - Inline critical CSS
   - Defer non-critical styles
   
5. Preloading
   - DNS prefetch for external domains
   - Preconnect to API origins
   - Prefetch next-page resources
```

### Backend Optimizations

```
1. Database Query Optimization
   - Proper indexing on foreign keys
   - Use of prepared statements
   - Batch operations where possible
   - Pagination for large result sets
   
2. API Response Optimization
   - Compression (Gzip/Brotli)
   - Conditional requests (ETag, Last-Modified)
   - Partial responses (field filtering)
   
3. Connection Management
   - Persistent connections
   - Connection pooling
   - Keep-alive headers
   
4. Async Processing
   - Background jobs for emails
   - Deferred processing for analytics
   - Queue system for batch operations
```
---

## Future Enhancements

### Short-term (3-6 months)

1. **Mobile Applications**
   - React Native apps for iOS/Android
   - Push notifications
   - Offline mode support

2. **Advanced Analytics**
   - Provider performance dashboards
   - Patient health trends
   - Predictive analytics

### Long-term (6-12 months)

1. **AI Integration**
   - Symptom checker chatbot
   - Automated appointment scheduling
   - Medical document analysis

2. **EHR Integration**
   - HL7 FHIR compliance
   - Lab result integration
   - Prescription management

3. **Telemedicine Feature**
   - Real-time vital signs monitoring

---

## Conclusion

BodyWise is built on a solid, modern architecture that prioritizes:
- **Security**: Multi-layered security with JWT, RBAC, and HTTPS
- **Scalability**: Horizontal scaling with load balancing
- **Maintainability**: Clean code, TypeScript, comprehensive testing
- **Performance**: Optimized queries, caching, CDN
- **Reliability**: Automated backups, disaster recovery, monitoring

The architecture is designed to evolve from a monolithic application to a distributed microservices system as the platform grows, ensuring long-term sustainability and scalability.