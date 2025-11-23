<p align="center">
  <h1 align="center">BodyWise</h1>
  <p align="center">
    The open-source mental health platform connecting students with professional support
    <br />
    <a href="#features"><strong>Features</strong></a> .  
    <a href="#getting-started"><strong>Getting Started</strong></a> .  
    <a href="#documentation"><strong>Documentation</strong></a> .  
    <a href="#contributing"><strong>Contributing</strong></a>
  </p>
</p>

<p align="center">
  <a href="https://github.com/Divine-kuzo/BodyWise/blob/main/LICENSE">
    <img src="https://img.shields.io/badge/license-MIT-blue" alt="License">
  </a>
  <a href="https://github.com/Divine-kuzo/BodyWise/stargazers">
    <img src="https://img.shields.io/github/stars/Divine-kuzo/BodyWise" alt="Github Stars">
  </a>
</p>

<br/>

BodyWise is a comprehensive mental health platform designed specifically for educational institutions. We connect students with qualified mental health professionals, providing easy access to consultations, educational resources, and community support.

**[Demo Video](https://www.tella.tv/video/body-wise-africa-ai-health-wellness-platform-55rm)**

#### Built With

- **[Next.js](https://nextjs.org/)** - React framework for production
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[SQLite](https://www.sqlite.org/)** - Lightweight database with better-sqlite3
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[SendGrid](https://sendgrid.com/)** - Email delivery service
- **[Jitsi Meet](https://jitsi.org/)** - Secure video conferencing
- **[Swagger](https://swagger.io/)** - API documentation

## Technical Specifications

### System Requirements
- Node.js 18.x or higher
- npm 9.x or any other package manager
- Your lovely IDE(We recommend famous one - VSCode)

### Technology Stack

<details>
  <summary><b>Frontend</b></summary>
  
  - Next.js 14.0.1 (App Router)
  - React 18
  - TypeScript 5.x
  - Tailwind CSS 3.x
  - Radix UI components
</details>

<details>
  <summary><b>Backend</b></summary>

  - Next.js API Routes (serverless)
  - JWT authentication
  - Better-sqlite3 (database driver)
</details>

<details>
  <summary><b>Database</b></summary>

  - SQLite 3.x
  - Foreign key constraints enabled
  - Trigger-based analytics
</details>

<details>
  <summary><b>External services</b></summary>

  - SendGrid Web API v3 (email)
  - Jitsi Meet (video conferencing)
  - Groq API (AI chatbot - 5 LLM models)
</details>
<details>
  <summary><b>AI</b></summary>

  - Vercel AI SDK (streaming responses)
  - Llama 3.3 70B (default model)
  - Zero-persistence architecture (privacy-first)
</details>
<details>
  <summary><b>Development Tools</b></summary>
  
  - ESLint (code linting)
  - TypeScript (type checking)
  - Swagger UI (API documentation)
</details>

<br>

**Performance Metrics**

- *Page Load Time*: < 2s (first contentful paint)
- *API Response Time*: < 200ms (average)
- *Database Query Time*: < 50ms (average)
- *Concurrent Users*: 1000+ supported
- *Uptime Target*: 99.9%

## Project Structure

```
bodywise-frontend/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── admin/             # Admin dashboard
│   ├── doctor/            # Health professional portal
│   ├── user/              # Patient portal
│   └── ...
├── components/            # React components
│   ├── auth/             # Authentication components
│   ├── dashboard/        # Dashboard components
│   └── ui/               # UI components
├── lib/                   # Utility functions and configs
│   ├── db/               # Database utilities
│   ├── auth.ts           # Authentication logic
│   └── email.ts          # Email utilities
├── scripts/              # Database and setup scripts
└── public/               # Static assets
```

## System Architecture

BodyWise is built on a modern, scalable architecture using **Next.js 14**, **React 18**, and **TypeScript**. The system follows a layered architecture pattern with a clear separation of concerns, designed to evolve from a monolithic application to a distributed microservices platform as the platform scales.

```
┌──────────────────────────────────────────┐
│         Client Layer                     │
│  Web Browsers | Mobile (Future)          │
└──────────────┬───────────────────────────┘
               │ HTTPS
               ▼
┌──────────────────────────────────────────┐
│      CDN Layer (Cloudflare)              │
│  Static Assets | DDoS Protection         │
└──────────────┬───────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────┐
│   Next.js Application (Node.js 20)       │
│  ┌─────────────┐  ┌─────────────┐       │
│  │  Frontend   │  │  API Routes │       │
│  │  React 18   │  │  REST APIs  │       │
│  └─────────────┘  └─────────────┘       │
│  ┌─────────────────────────────────┐    │
│  │  Middleware (Auth & RBAC)       │    │
│  └─────────────────────────────────┘    │
└──────────────┬───────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────┐
│      Data & Services Layer               │
│  ┌──────────┐  ┌────────────────────┐   │
│  │ SQLite   │  │ External Services  │   │
│  │ Database │  │ - SendGrid (Email) │   │
│  │          │  │ - Jitsi (Video)    │   │
│  │          │  │ - Groq AI (Chat)   │   │
│  └──────────┘  └────────────────────┘   │
└──────────────────────────────────────────┘
```
<p align="center">
  Quick Architecture Overview
</p>

### Key Architectural Features

- **Layered Architecture**: Presentation → Application → Domain → Data Access → Infrastructure
- **Security by Design**: JWT authentication, RBAC, multi-layered security
- **API-First Design**: RESTful APIs enabling mobile app and third-party integrations
- **Real-Time Communication**: Jitsi Meet for video consultations
- **Privacy-First AI**: Ephemeral AI conversations with zero data persistence
- **Event-Driven Email**: Automated notifications via SendGrid
- **Relational Data Model**: SQLite (development) → PostgreSQL-ready for scale
- **Serverless Deployment**: Vercel Edge Network with global CDN

### Technology Stack Summary

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 18 + Next.js 14 | Server-side rendering, App Router |
| **Styling** | Tailwind CSS + shadcn/ui | Responsive design, accessible components |
| **Backend** | Next.js API Routes | RESTful API endpoints |
| **Database** | SQLite 3 (better-sqlite3) | Embedded relational database |
| **Auth** | JWT + bcrypt | Token-based authentication, password hashing |
| **AI Chatbot** | Groq API + Vercel AI SDK | Privacy-first AI health coach (5 LLM models) |
| **Email** | SendGrid | Transactional emails, templates |
| **Video** | Jitsi Meet | Secure video consultations |
| **Deployment** | Vercel + Cloudflare | Hosting, CDN, DDoS protection |

Complete technical specifications, including:
- Detailed architecture diagrams (application, data flow, database ERD, security layers)
- Component architecture and design patterns
- Integration architecture for external services
- Deployment architecture and CI/CD pipeline
- Scalability strategies and performance optimization
- Security architecture and disaster recovery
- Technology decisions and trade-offs

<details>
  <summary> Data Flow and Database Summary</summary>

  ### Data Flow Summary

  **Request Processing Pipeline:**

   ```
    User -> Middleware (Auth) -> API Route -> Database -> Response -> UI Update
   ```

  1. **Client Request** - User action triggers API call
  2. **Middleware Layer** - JWT validation, role checking, request logging
  3. **API Handler** - Input validation, business logic execution
  4. **Database Layer** - Query execution with prepared statements
  5. **Response** - JSON formatting, headers, status codes
  6. **Client Update** - React state update, UI re-render

  **Example Flow (Book Consultation):**
  ```
    Patient clicks "Book" 
      - Middleware validates the JWT token
      - API checks slot availability
      - Database transaction (create consultation + update slot)
      - SendGrid sends a confirmation email
      - Returns meeting link
      - UI shows a success message
  ```

  ### Database Design Summary

  **Core Entities:** 15+ tables with referential integrity

  ```
  Users (4 roles) ─┬─ health_professionals (specialization, ratings)
                   │   ├─ availability_schedules (weekly schedules)
                   │   └─ reviews (ratings, feedback)
                   │
                   ├─ patients (profiles, usernames)
                   │   └─ bmi_records (health tracking)
                   │
                   ├─ consultations (appointments, status, meeting links)
                   │   └─ consultation_attendees (multi-party sessions)
                   │
                   ├─ institutions (organization management)
                   │   └─ institutional_admins
                   │
                   ├─ articles (educational content)
                   ├─ assessments (wellness questionnaires)
                   ├─ testimonials (user feedback)
                   └─ system_admins
  ```
  
  **Key Features:**
  >- **ACID Compliance** - Full transaction support with SQLite
  >- **Foreign Keys** - Referential integrity enforced
  >- **Triggers** - Automatic rating calculations (planned)
  >- **Indexes** - Optimized queries on email, dates, status, usernames
  >- **Transaction Support** - Atomic operations for bookings

</details>
<details>
  <summary>Security</summary>

  ### Security Overview

  **Multi-Layered Security Architecture:**

  ```
  Transport (HTTPS/TLS 1.3)
            ↓
  Authentication (JWT + bcrypt)
            ↓
  Authorization (RBAC)
            ↓
  API Security (Rate limiting, validation)
            ↓
  Data Protection (Prepared statements, XSS/CSRF prevention)
  ```

  **Key Security Measures:**
  >- JWT tokens (HS256, 24h expiration, httpOnly cookies)
  >- Role-based access control (4 roles: patient, professional, institution_admin, system_admin)
  >- Password hashing (bcrypt, 10 rounds)
  >- SQL injection prevention (prepared statements)
  >- Rate limiting (100 req/15min per IP)
  >- Secure headers (HSTS, CSP, X-Frame-Options)

</details>

**[View Comprehensive Architecture Documentation >>>](./docs/ARCHITECTURE.md)**


## Features

### For Students
- `Find Health Professionals` - Browse and search qualified mental health professionals
- `Easy Booking` - Schedule consultations with real-time availability
- `Secure Video Calls` - HIPAA-compliant video consultations via Jitsi
- `AI Health Coach` - Private, ephemeral conversations with AI chatbot (messages NOT saved)
- `Educational Resources` - Access mental health articles and guides
- `Reviews & Ratings` - Make informed decisions with peer reviews
- `Smart Reminders` - Automated email notifications for appointments

### For Health Professionals
- `Dashboard`- Manage consultations and view analytics
- `Availability Management` - Set your schedule and working hours
- `Patient Management` - Track and manage patient consultations
- `Profile Customization` - Showcase your expertise and qualifications
- `Performance Metrics` - Monitor ratings and consultation statistics

### For Institutions
- `Multi-institution Support` - Manage multiple campuses or facilities
- `Staff Onboarding` - Easy onboarding for health professionals
- `Analytics Dashboard` - Track usage and engagement metrics
- `Role-based Access` - Secure access control for different user types

### For Admins
- `System Monitoring` - Real-time performance and health metrics
- `User Management` - Manage users, roles, and permissions
- `Content Moderation` - Approve blogs and testimonials
- `Analytics` - Comprehensive system-wide analytics

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/Divine-kuzo/BodyWise.git
   cd BodyWise/bodywise-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Configure the following in `.env.local`:
   ```env
   # Database
   DATABASE_URL=./bodywise.db
   
   # Authentication
   JWT_SECRET=your-secret-key-here
   
   # Email (SendGrid)
   SENDGRID_API_KEY=your-sendgrid-api-key
   SENDGRID_FROM_EMAIL=noreply@bodywise.com
   
   # AI Chatbot (Groq)
   GROQ_API_KEY=your-groq-api-key
   # Get your free API key from: https://console.groq.com/keys
   
   # Application
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Initialize the database**
   ```bash
   npm run db:init
   ```
   
   This creates the core database schema with 15+ tables, including:
   - `users`, `patients`, `health_professionals`
   - `consultations`, `availability_schedules`
   - `institutions`, `institutional_admins`, `system_admins`
   - `reviews`, `bmi_records`, `articles`
   - `assessments`, `user_activity`, and more

5. **(Optional) Run migration scripts**
   ```bash
   # Add testimonials system (optional feature)
   sqlite3 bodywise.db < scripts/add-blog-testimonials.sql
   
   # Add email reminder tracking columns
   sqlite3 bodywise.db < scripts/add-email-reminder-columns.sql
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)
   
   **Default admin credentials:**
   - Email: `a.niyonseng@alustudent.com`
   - Password: `admin123`

For detailed setup instructions, see our [Quick Start Guide](./docs/quick-start.md).

## API Architecture

### API Overview

**Base URL**: `http://localhost:3000/api`  
**Format**: JSON  
**Authentication**: JWT (Cookie or Bearer token)  
**Rate Limits**: 1000 requests/15min (authenticated)

### Core Endpoints

| Endpoint | Description | Auth Required |
|----------|-------------|---------------|
| `POST /api/auth/login` | Authenticate and get JWT token | No |
| `POST /api/auth/register` | Create new user account | No |
| `GET /api/users/me` | Get current user profile | Yes |
| `GET /api/patient/doctors` | List available health professionals | Yes (Patient) |
| `GET /api/patient/available-slots` | Get available consultation slots | Yes (Patient) |
| `POST /api/patient/consultations/book` | Book a consultation | Yes (Patient) |
| `GET /api/patient/consultations` | List patient's consultations | Yes (Patient) |
| `POST /api/patient/reviews` | Submit consultation review | Yes (Patient) |
| `GET /api/professional/profile` | Get professional profile | Yes (Professional) |
| `PUT /api/professional/availability` | Set availability schedule | Yes (Professional) |
| `GET /api/professional/consultations` | List professional's sessions | Yes (Professional) |
| `GET /api/admin/analytics` | System analytics | Yes (Admin) |
| `GET /api/admin/performance` | Performance metrics | Yes (Admin) |
| `GET /api/blog` | List published articles | No |
| `POST /api/blog` | Create article | Yes (Professional) |
| `POST /api/blog/approve` | Approve/reject article | Yes (Admin) |
| `GET /api/testimonials` | List testimonials | No |
| `POST /api/testimonials` | Submit testimonial | Yes |


**Check [Complete API Documentation](./docs/api-documentation.md)**


## Documentation

- [User Manual](./docs/user-manual.md) - Complete guide for all users
- [API Documentation](./docs/api-documentation.md) - REST API reference
- [Architecture](./docs/architecture.md) - System Architecture with technical specifications and diagrams

## Contributing

We welcome contributions! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature`)
3. Commit your changes (`git commit -m 'add feature'`)
4. Push to the branch (`git push origin feature`)
5. Open a Pull Request

## Our Contributors 

<br>

![Contributors](https://contrib.rocks/image?repo=Divine-kuzo/BodyWise)

## License

BodyWise is open-source software licensed under the [MIT License](LICENSE).

## Support
- GitHub Issues: [Create an issue](https://github.com/Divine-kuzo/BodyWise/issues)
- Documentation: [docs](./docs/)

<br>

<p align="center">
  Made with ❤️ and care for a better future.
</p>
