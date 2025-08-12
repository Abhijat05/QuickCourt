# QuickCourt

QuickCourt is a comprehensive sports court booking platform that allows users to find, book, and manage sports courts (tennis, basketball, badminton, etc.) with real-time availability, smooth booking flows, and role-based dashboards.

## Team

- **Team Number:** 76
- **Team Name:** Code 01
- **Members:** Abhijat Sinha, Garv Khatri

## Features

### Core Features
- **User Authentication** - OTP-enabled flows with JWT-based security
- **Court Search** - Find courts by location, sport type, and availability
- **Real-time Booking** - Instant availability checks and confirmations
- **User Dashboard** - Manage profile, bookings, and history
- **Owner Dashboard** - Venue and courts management with analytics
- **Admin Panel** - User management, venue approvals, and comprehensive reports

### Additional Features
- **Reviews & Ratings** - Comprehensive venue feedback system with star ratings
- **Responsive UI** - Optimized for both mobile and desktop experiences
- **Theming** - Light/dark mode with smooth transitions
- **File Uploads** - Image upload support for venues
- **Real-time Updates** - Live availability and booking status

## Tech Stack

### Frontend
- **Framework:** React 18 with JSX
- **Styling:** TailwindCSS with custom design system
- **Animations:** Framer Motion for smooth transitions
- **Build Tool:** Vite for fast development and builds
- **Routing:** React Router for navigation
- **State Management:** Context API for auth and global state

### Backend
- **Runtime:** Node.js 18+
- **Framework:** Express.js with TypeScript
- **Database:** PostgreSQL with Drizzle ORM
- **Authentication:** JWT tokens with bcrypt password hashing
- **File Storage:** Local file system for image uploads

### Development Tools
- **Linting:** ESLint for code quality
- **Package Manager:** npm
- **Version Control:** Git with proper .gitignore setup
- **UI Components:** Custom shadcn/ui-inspired component library

## Project Structure

### Frontend Architecture
```
Frontend/
├── components.json          # Component configuration
├── eslint.config.js        # Linting rules
├── index.html              # Entry HTML
├── package.json            # Dependencies and scripts
├── tailwind.config.js      # Tailwind customization
├── vite.config.js          # Vite build configuration
├── lib/
│   └── utils.js            # Utility functions (cn helper)
└── src/
    ├── App.jsx             # Main app component
    ├── index.css           # Global styles and CSS variables
    ├── main.jsx            # App entry point
    ├── components/
    │   ├── InputField.jsx  # Form input component
    │   ├── Navbar.jsx      # Navigation component
    │   ├── ReviewForm.jsx  # Review submission form
    │   ├── ReviewsList.jsx # Reviews display component
    │   └── ui/             # Reusable UI components
    │       ├── Badge.jsx
    │       ├── Button.jsx
    │       ├── Card.jsx
    │       ├── Sheet.jsx
    │       └── text-scroll.jsx
    ├── context/
    │   └── AuthContext.jsx # Authentication context
    ├── pages/
    │   ├── Dashboard.jsx   # User dashboard
    │   ├── Home.jsx        # Landing page
    │   ├── Profile.jsx     # User profile management
    │   ├── VenueDetail.jsx # Venue details with booking
    │   └── games/
    │       └── PublicGameDetail.jsx
    └── services/
        └── api.js          # API service layer
```

### Backend Architecture
```
Backend/
├── .env                    # Environment variables
├── docker-compose.yml      # Docker configuration
├── drizzle.config.ts       # Database configuration
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
├── uploads/                # File upload storage
└── src/
    ├── app.ts              # Express app setup
    ├── server.ts           # Server entry point
    ├── config/
    │   └── db.ts           # Database connection
    ├── controllers/
    │   ├── auth.controller.ts      # Authentication logic
    │   ├── booking.controller.ts   # Booking management
    │   ├── review.controller.ts    # Review system
    │   ├── admin.controller.ts     # Admin operations
    │   └── owner.controller.ts     # Owner dashboard
    ├── db/
    │   ├── schema.ts       # Database schema definitions
    │   └── seed.ts         # Sample data seeding
    ├── middlewares/        # Express middlewares
    ├── routes/             # API route definitions
    ├── services/           # Business logic services
    ├── utils/              # Utility functions
    └── validators/         # Input validation
```

## Quick Start Guide

### Prerequisites
- **Node.js** v18 or higher
- **PostgreSQL** database
- **npm** or **yarn** package manager

### Backend Setup

1. **Install dependencies:**
   ```bash
   cd Backend
   npm install
   ```

2. **Configure environment variables:**
   Create a `.env` file in the Backend directory:
   ```env
   # Required
   DATABASE_URL=postgres://USER:PASSWORD@localhost:5432/quickcourt
   JWT_SECRET=your-super-secret-jwt-key-here
   NODE_ENV=development
   
   # Optional
   PORT=5000
   SMTP_HOST=your-smtp-host
   SMTP_PORT=587
   SMTP_USER=your-email
   SMTP_PASS=your-password
   ```

3. **Setup database:**
   ```bash
   # Run database migrations
   npm run db:migrate
   
   # Seed with sample data (optional)
   npm run db:seed
   ```

4. **Start the API server:**
   ```bash
   npm run dev
   ```
   API will be available at http://localhost:5000

### Frontend Setup

1. **Install dependencies:**
   ```bash
   cd Frontend
   npm install
   ```

2. **Configure environment:**
   Create a `.env` file in the Frontend directory:
   ```env
   VITE_API_BASE_URL=http://localhost:5000
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```
   App will be available at http://localhost:5173

## Key Features Implementation

### Authentication System
- JWT-based authentication with secure token storage
- OTP verification for enhanced security
- Role-based access control (User, Owner, Admin)
- Protected routes with automatic redirects

### Reviews & Ratings System
The review system is implemented across multiple components:
- **Frontend:** [`ReviewForm`](Frontend/src/components/ReviewForm.jsx) for submissions and [`ReviewsList`](Frontend/src/components/ReviewsList.jsx) for display
- **Backend:** [`review.controller.ts`](Backend/src/controllers/review.controller.ts) handles all review operations
- **Features:** Star ratings, comment validation, booking verification

### Venue Management
- Comprehensive venue details with image upload support
- Real-time availability checking
- Court management for venue owners
- Advanced search and filtering capabilities

## Development Scripts

### Backend Commands
```bash
# Development with hot reload
npm run dev

# Database operations
npm run db:migrate    # Run migrations
npm run db:seed      # Seed sample data
npm run db:reset     # Reset database

# Production
npm start           # Start production server
npm run build       # Build TypeScript
```

### Frontend Commands
```bash
# Development
npm run dev         # Start dev server with HMR

# Production
npm run build       # Build for production
npm run preview     # Preview production build

# Code quality
npm run lint        # Run ESLint
npm run lint:fix    # Fix linting issues
```

## Environment Configuration

### Backend Environment Variables
| Variable | Required | Description | Default |
|----------|----------|-------------|---------|
| `DATABASE_URL` | ✅ | PostgreSQL connection string | - |
| `JWT_SECRET` | ✅ | Secret key for JWT tokens | - |
| `NODE_ENV` | ✅ | Environment mode | development |
| `PORT` | ❌ | Server port | 5000 |
| `SMTP_HOST` | ❌ | Email server host | - |
| `SMTP_PORT` | ❌ | Email server port | 587 |
| `SMTP_USER` | ❌ | Email username | - |
| `SMTP_PASS` | ❌ | Email password | - |

### Frontend Environment Variables
| Variable | Required | Description | Default |
|----------|----------|-------------|---------|
| `VITE_API_BASE_URL` | ✅ | Backend API URL | http://localhost:5000 |

## Database Schema

The application uses PostgreSQL with Drizzle ORM for type-safe database operations:

- **Users** - Authentication and profile data
- **Venues** - Sports facility information
- **Courts** - Individual court details within venues
- **Bookings** - Reservation management
- **Reviews** - User feedback and ratings
- **Notifications** - System alerts and updates

## Design System

### Color Palette
The app uses a sports-themed color system defined in [`Frontend/src/index.css`](Frontend/src/index.css):
- **Primary:** Sports green (`--primary: 142 76% 36%`)
- **Secondary:** Light gray (`--secondary: 210 40% 98%`)
- **Success, Warning, Error:** Semantic colors for feedback

### UI Components
Reusable components are located in [`Frontend/src/components/ui`](Frontend/src/components/ui):
- **Card** - Content containers with header/body/footer
- **Button** - Various styles and sizes
- **Badge** - Status indicators
- **Sheet** - Slide-out panels

## Security Features

### Authentication
- JWT tokens with secure HTTP-only storage
- Password hashing with bcrypt
- OTP verification for sensitive operations
- Session management and automatic logout

### Data Protection
- Input validation on all endpoints
- SQL injection prevention with Drizzle ORM
- XSS protection with proper sanitization
- Environment variable protection

### Access Control
- Role-based permissions (User/Owner/Admin)
- Protected API routes with middleware
- Frontend route guards

## API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/verify-otp` - OTP verification
- `POST /api/auth/reset-password` - Password reset

### Venue Endpoints
- `GET /api/venues` - List all venues
- `GET /api/venues/:id` - Get venue details
- `POST /api/venues` - Create venue (Owner only)
- `PATCH /api/venues/:id` - Update venue

### Review Endpoints
- `GET /api/reviews/venue/:id` - Get venue reviews
- `POST /api/reviews` - Submit review
- `PATCH /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review

## Testing & Quality Assurance

### Code Quality
- ESLint configuration for consistent code style
- TypeScript for type safety in backend
- Proper error handling and logging

### Performance
- Vite for fast development builds
- Code splitting and lazy loading
- Optimized database queries with Drizzle ORM

## Deployment

### Production Setup
1. Set `NODE_ENV=production` in backend
2. Configure production database URL
3. Build frontend with `npm run build`
4. Serve static files from backend or CDN
5. Setup proper HTTPS and security headers

### Docker Support
The project includes [`docker-compose.yml`](Backend/docker-compose.yml) for containerized deployment.

## Contributing

### Code Style
- Use ESLint configuration provided
- Follow React hooks best practices
- Implement proper TypeScript types
- Write meaningful commit messages

### Pull Request Process
1. Fork the repository
2. Create feature branch
3. Add tests for new features
4. Ensure all tests pass
5. Submit pull request with description

## Support & Contact

For questions or support:
- **Team:** Code 01 (Team #76)
- **Members:** Abhijat Sinha, Garv Khatri
- **Project:** QuickCourt Sports Booking Platform
---