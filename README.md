<div align="center">

![React](https://img.shields.io/badge/React-18.0.0-61DAFB?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=for-the-badge&logo=typescript)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-4169E1?style=for-the-badge&logo=postgresql)
![Vite](https://img.shields.io/badge/Vite-5.0+-646CFF?style=for-the-badge&logo=vite)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.0+-06B6D4?style=for-the-badge&logo=tailwindcss)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-11.0+-0055FF?style=for-the-badge&logo=framer)
![Express.js](https://img.shields.io/badge/Express.js-4.0+-000000?style=for-the-badge&logo=express)
![Drizzle ORM](https://img.shields.io/badge/Drizzle_ORM-Latest-C5F74F?style=for-the-badge)
![JWT](https://img.shields.io/badge/JWT-Auth-000000?style=for-the-badge&logo=jsonwebtokens)

# QuickCourt

### 🏆 Comprehensive Sports Court Booking Platform

*Find, book, and manage sports courts with real-time availability, smooth booking flows, and role-based dashboards.*

---

</div>

## 👥 Team Information

<div align="center">

| Field | Details |
|-------|---------|
| **Team Number** | 76 |
| **Team Name** | Code 01 |
| **Members** | Abhijat Sinha • Garv Khatri |

</div>

## ✨ Features

<div align="center">

### 🎯 Core Features

</div>

| Feature | Description |
|---------|-------------|
| **🔐 User Authentication** | OTP-enabled flows with JWT-based security |
| **🔍 Court Search** | Find courts by location, sport type, and availability |
| **⚡ Real-time Booking** | Instant availability checks and confirmations |
| **📊 User Dashboard** | Manage profile, bookings, and history |
| **🏢 Owner Dashboard** | Venue and courts management with analytics |
| **⚙️ Admin Panel** | User management, venue approvals, and comprehensive reports |

<div align="center">

### 🚀 Additional Features

</div>

| Feature | Description |
|---------|-------------|
| **⭐ Reviews & Ratings** | Comprehensive venue feedback system with star ratings |
| **📱 Responsive UI** | Optimized for both mobile and desktop experiences |
| **🎨 Theming** | Light/dark mode with smooth transitions |
| **📤 File Uploads** | Image upload support for venues |
| **🔄 Real-time Updates** | Live availability and booking status |

## 🛠️ Tech Stack

<div align="center">

### Frontend Technologies

</div>

| Technology | Purpose | Version |
|------------|---------|---------|
| **React** | UI Framework | 18.0+ |
| **TailwindCSS** | Styling & Design System | 3.0+ |
| **Framer Motion** | Animations & Transitions | 11.0+ |
| **Vite** | Build Tool & Dev Server | 5.0+ |
| **React Router** | Navigation & Routing | Latest |

<div align="center">

### Backend Technologies

</div>

| Technology | Purpose | Version |
|------------|---------|---------|
| **Node.js** | Runtime Environment | 18.0+ |
| **Express.js** | Web Framework | 4.0+ |
| **TypeScript** | Type Safety | 5.0+ |
| **PostgreSQL** | Database | 15+ |
| **Drizzle ORM** | Database ORM | Latest |
| **JWT** | Authentication | Latest |

## 📁 Project Architecture

<div align="center">

### 🎨 Frontend Structure

</div>

```
Frontend/
├── 📄 components.json          # Component configuration
├── ⚙️ eslint.config.js        # Linting rules
├── 🌐 index.html              # Entry HTML
├── 📦 package.json            # Dependencies and scripts
├── 🎨 tailwind.config.js      # Tailwind customization
├── ⚡ vite.config.js          # Vite build configuration
├── 📚 lib/
│   └── utils.js               # Utility functions (cn helper)
└── 📂 src/
    ├── 🚀 App.jsx             # Main app component
    ├── 🎨 index.css           # Global styles and CSS variables
    ├── 🎯 main.jsx            # App entry point
    ├── 🧩 components/
    │   ├── InputField.jsx     # Form input component
    │   ├── Navbar.jsx         # Navigation component
    │   ├── ReviewForm.jsx     # Review submission form
    │   ├── ReviewsList.jsx    # Reviews display component
    │   └── ui/                # Reusable UI components
    │       ├── Badge.jsx
    │       ├── Button.jsx
    │       ├── Card.jsx
    │       ├── Sheet.jsx
    │       └── text-scroll.jsx
    ├── 🌐 context/
    │   └── AuthContext.jsx    # Authentication context
    ├── 📄 pages/
    │   ├── Dashboard.jsx      # User dashboard
    │   ├── Home.jsx           # Landing page
    │   ├── Profile.jsx        # User profile management
    │   ├── VenueDetail.jsx    # Venue details with booking
    │   └── games/
    │       └── PublicGameDetail.jsx
    └── 🔌 services/
        └── api.js             # API service layer
```

<div align="center">

### ⚙️ Backend Structure

</div>

```
Backend/
├── 🔐 .env                    # Environment variables
├── 🐳 docker-compose.yml      # Docker configuration
├── 🗄️ drizzle.config.ts       # Database configuration
├── 📦 package.json            # Dependencies and scripts
├── 📝 tsconfig.json           # TypeScript configuration
├── 📁 uploads/                # File upload storage
└── 📂 src/
    ├── 🚀 app.ts              # Express app setup
    ├── 🌐 server.ts           # Server entry point
    ├── ⚙️ config/
    │   └── db.ts              # Database connection
    ├── 🎮 controllers/
    │   ├── auth.controller.ts      # Authentication logic
    │   ├── booking.controller.ts   # Booking management
    │   ├── review.controller.ts    # Review system
    │   ├── admin.controller.ts     # Admin operations
    │   └── owner.controller.ts     # Owner dashboard
    ├── 🗄️ db/
    │   ├── schema.ts          # Database schema definitions
    │   └── seed.ts            # Sample data seeding
    ├── 🛡️ middlewares/        # Express middlewares
    ├── 🛣️ routes/             # API route definitions
    ├── 💼 services/           # Business logic services
    ├── 🔧 utils/              # Utility functions
    └── ✅ validators/         # Input validation
```

## 🚀 Quick Start Guide

<div align="center">

### 📋 Prerequisites

</div>

| Requirement | Version | Purpose |
|-------------|---------|---------|
| **Node.js** | v18+ | Runtime environment |
| **PostgreSQL** | Latest | Database system |
| **npm/yarn** | Latest | Package manager |

<div align="center">

### 🔧 Backend Setup

</div>

| Step | Command | Description |
|------|---------|-------------|
| **1** | `cd Backend && npm install` | Install dependencies |
| **2** | Create `.env` file | Configure environment |
| **3** | `npm run db:migrate` | Setup database |
| **4** | `npm run db:seed` (optional) | Add sample data |
| **5** | `npm run dev` | Start development server |

<div align="center">

### ⚙️ Environment Configuration

</div>

```env
# 🔐 Required Variables
DATABASE_URL=postgres://USER:PASSWORD@localhost:5432/quickcourt
JWT_SECRET=your-super-secret-jwt-key-here
NODE_ENV=development

# 📧 Optional Variables
PORT=5000
SMTP_HOST=your-smtp-host
SMTP_PORT=587
SMTP_USER=your-email
SMTP_PASS=your-password
```

<div align="center">

### 🎨 Frontend Setup

</div>

| Step | Command | Description |
|------|---------|-------------|
| **1** | `cd Frontend && npm install` | Install dependencies |
| **2** | Create `.env` file | Configure environment |
| **3** | `npm run dev` | Start development server |

<div align="center">

### 🌐 Frontend Environment

</div>

```env
# 🔗 API Configuration
VITE_API_BASE_URL=http://localhost:5000
```

## 🎯 Key Features Implementation

<div align="center">

### 🔐 Authentication System

</div>

- ✅ JWT-based authentication with secure token storage
- ✅ OTP verification for enhanced security  
- ✅ Role-based access control (User, Owner, Admin)
- ✅ Protected routes with automatic redirects

<div align="center">

### ⭐ Reviews & Ratings System

</div>

| Component | File | Purpose |
|-----------|------|---------|
| **Frontend Form** | [`ReviewForm.jsx`](Frontend/src/components/ReviewForm.jsx) | Review submissions |
| **Frontend Display** | [`ReviewsList.jsx`](Frontend/src/components/ReviewsList.jsx) | Reviews display |
| **Backend Logic** | [`review.controller.ts`](Backend/src/controllers/review.controller.ts) | Review operations |

**Features:** Star ratings • Comment validation • Booking verification

<div align="center">

### 🏢 Venue Management

</div>

- 🖼️ Comprehensive venue details with image upload support
- ⚡ Real-time availability checking
- 🏗️ Court management for venue owners
- 🔍 Advanced search and filtering capabilities

## 🛠️ Development Commands

<div align="center">

### ⚙️ Backend Commands

</div>

| Command | Purpose |
|---------|---------|
| `npm run dev` | Development with hot reload |
| `npm run db:migrate` | Run database migrations |
| `npm run db:seed` | Seed sample data |
| `npm run db:reset` | Reset database |
| `npm start` | Start production server |
| `npm run build` | Build TypeScript |

<div align="center">

### 🎨 Frontend Commands

</div>

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start dev server with HMR |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix linting issues |

## 🌐 Environment Variables

<div align="center">

### ⚙️ Backend Environment

</div>

| Variable | Required | Description | Default |
|----------|:--------:|-------------|---------|
| `DATABASE_URL` | ✅ | PostgreSQL connection string | - |
| `JWT_SECRET` | ✅ | Secret key for JWT tokens | - |
| `NODE_ENV` | ✅ | Environment mode | development |
| `PORT` | ❌ | Server port | 5000 |
| `SMTP_HOST` | ❌ | Email server host | - |
| `SMTP_PORT` | ❌ | Email server port | 587 |
| `SMTP_USER` | ❌ | Email username | - |
| `SMTP_PASS` | ❌ | Email password | - |

<div align="center">

### 🎨 Frontend Environment

</div>

| Variable | Required | Description | Default |
|----------|:--------:|-------------|---------|
| `VITE_API_BASE_URL` | ✅ | Backend API URL | http://localhost:5000 |

## 🗄️ Database Schema

<div align="center">

**PostgreSQL with Drizzle ORM for type-safe database operations**

</div>

| Entity | Purpose |
|--------|---------|
| **👥 Users** | Authentication and profile data |
| **🏢 Venues** | Sports facility information |
| **🏟️ Courts** | Individual court details within venues |
| **📅 Bookings** | Reservation management |
| **⭐ Reviews** | User feedback and ratings |
| **🔔 Notifications** | System alerts and updates |

## 🎨 Design System

<div align="center">

### 🌈 Color Palette

*Sports-themed color system defined in [`Frontend/src/index.css`](Frontend/src/index.css)*

</div>

| Color | Value | Usage |
|-------|-------|-------|
| **🟢 Primary** | `--primary: 142 76% 36%` | Sports green theme |
| **⚪ Secondary** | `--secondary: 210 40% 98%` | Light gray backgrounds |
| **✅ Success** | Semantic green | Success states |
| **⚠️ Warning** | Semantic orange | Warning states |
| **❌ Error** | Semantic red | Error states |

<div align="center">

### 🧩 UI Components

*Reusable components in [`Frontend/src/components/ui`](Frontend/src/components/ui)*

</div>

| Component | Purpose |
|-----------|---------|
| **📦 Card** | Content containers with header/body/footer |
| **🔘 Button** | Various styles and sizes |
| **🏷️ Badge** | Status indicators |
| **📱 Sheet** | Slide-out panels |

## 🔒 Security Features

<div align="center">

### 🔐 Authentication

</div>

- 🔑 JWT tokens with secure HTTP-only storage
- 🔒 Password hashing with bcrypt
- 📱 OTP verification for sensitive operations
- ⏰ Session management and automatic logout

<div align="center">

### 🛡️ Data Protection

</div>

- ✅ Input validation on all endpoints
- 🛡️ SQL injection prevention with Drizzle ORM
- 🔒 XSS protection with proper sanitization
- 🔐 Environment variable protection

<div align="center">

### 👥 Access Control

</div>

- 🎭 Role-based permissions (User/Owner/Admin)
- 🛡️ Protected API routes with middleware
- 🚦 Frontend route guards

## 📡 API Documentation

<div align="center">

### 🔐 Authentication Endpoints

</div>

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | User registration |
| `POST` | `/api/auth/login` | User login |
| `POST` | `/api/auth/verify-otp` | OTP verification |
| `POST` | `/api/auth/reset-password` | Password reset |

<div align="center">

### 🏢 Venue Endpoints

</div>

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/venues` | List all venues |
| `GET` | `/api/venues/:id` | Get venue details |
| `POST` | `/api/venues` | Create venue (Owner only) |
| `PATCH` | `/api/venues/:id` | Update venue |

<div align="center">

### ⭐ Review Endpoints

</div>

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/reviews/venue/:id` | Get venue reviews |
| `POST` | `/api/reviews` | Submit review |
| `PATCH` | `/api/reviews/:id` | Update review |
| `DELETE` | `/api/reviews/:id` | Delete review |

## 🧪 Testing & Quality Assurance

<div align="center">

### 💎 Code Quality

</div>

- ✅ ESLint configuration for consistent code style
- 📝 TypeScript for type safety in backend
- 🔍 Proper error handling and logging

<div align="center">

### ⚡ Performance

</div>

- 🚀 Vite for fast development builds
- 📦 Code splitting and lazy loading
- 🗄️ Optimized database queries with Drizzle ORM

## 🚀 Deployment

<div align="center">

### 🌐 Production Setup

</div>

| Step | Action |
|------|--------|
| **1** | Set `NODE_ENV=production` in backend |
| **2** | Configure production database URL |
| **3** | Build frontend with `npm run build` |
| **4** | Serve static files from backend or CDN |
| **5** | Setup proper HTTPS and security headers |

<div align="center">

### 🐳 Docker Support

</div>

The project includes [`docker-compose.yml`](Backend/docker-compose.yml) for containerized deployment.

## 🤝 Contributing

<div align="center">

### 📝 Code Style Guidelines

</div>

- ✅ Use ESLint configuration provided
- ⚛️ Follow React hooks best practices
- 📝 Implement proper TypeScript types
- 💬 Write meaningful commit messages

<div align="center">

### 🔄 Pull Request Process

</div>

| Step | Action |
|------|--------|
| **1** | Fork the repository |
| **2** | Create feature branch |
| **3** | Add tests for new features |
| **4** | Ensure all tests pass |
| **5** | Submit pull request with description |

---
</div>