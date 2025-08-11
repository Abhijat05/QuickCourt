# QuickCourt

QuickCourt is a comprehensive sports court booking platform that allows users to find, book, and manage sports courts for various activities including tennis, basketball, and badminton.

## Team Details

### Team Number
76

### Team Name
Code 01

### Team Members
1. Abhijat Sinha
2. Garv Khatri

## Project Overview

QuickCourt simplifies the process of finding and booking sports venues. With an intuitive user interface, real-time availability, and seamless booking experience, users can quickly reserve courts for their favorite sports activities.

## Tech Stack

- **Frontend**: React, TailwindCSS, Framer Motion, Vite
- **Backend**: Node.js, Express.js, TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: JWT, bcrypt
- **Build Tools**: Vite
- **Linting**: ESLint
- **UI Components**: Custom components with shadcn/ui inspiration
- **AI**: GPT-5

## Project Structure

### Frontend
```
Frontend/
├── components.json
├── eslint.config.js
├── index.html
├── jsconfig.json
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
├── lib/
│   └── utils.js
└── src/
    ├── App.jsx
    ├── index.css
    ├── main.jsx
    ├── components/
    │   ├── InputField.jsx
    │   ├── Navbar.jsx
    │   └── ui/
    │       ├── Badge.jsx
    │       ├── Breadcrumb.jsx
    │       ├── Button.jsx
    │       ├── Card.jsx
    │       ├── Sheet.jsx
    │       ├── expanded-tabs.jsx
    │       ├── text-scroll.jsx
    │       ├── theme-animations.js
    │       └── wrap-button.jsx
    ├── context/
    │   └── AuthContext.jsx
    ├── pages/
    │   ├── Dashboard.jsx
    │   ├── Home.jsx
    │   ├── ResetPassword.jsx
    │   ├── Signup.jsx
    │   └── VerifyOtp.jsx
    └── services/
        └── api.js
```

### Backend
```
Backend/
├── .env
├── docker-compose.yml
├── drizzle.config.ts
├── package.json
├── tsconfig.json
└── src/
    ├── app.ts
    ├── server.ts
    ├── config/
    │   └── db.ts
    ├── controllers/
    │   ├── admin.controller.ts
    │   ├── analytics.controller.ts
    │   ├── auth.controller.ts
    │   ├── booking.controller.ts
    │   ├── maintenance.controller.ts
    │   ├── notification.controller.ts
    │   ├── owner.controller.ts
    │   └── review.controller.ts
    ├── db/
    │   ├── schema.ts
    │   └── seed.ts
    ├── middlewares/
    ├── routes/
    ├── services/
    └── utils/
```

## Features

- **User Authentication**: Secure signup, login, and password reset flows with OTP verification
- **Court Search**: Find courts by location, sport type, and availability
- **Real-time Booking**: Instantly book courts with real-time availability updates
- **User Dashboard**: Manage bookings, view history, and user profile
- **Owner Dashboard**: For venue owners to manage courts and view analytics
- **Admin Panel**: System administration and venue approval
- **Reviews & Ratings**: Community feedback on venues and courts
- **Responsive Design**: Works seamlessly on mobile and desktop

## Key UI Components

- **Home Page**: Engaging landing page with animated sections and call-to-actions
- **Dashboard**: User and owner dashboards with booking management
- **Interactive Elements**: Motion animations and interactive components
- **Theme Support**: Light and dark mode with smooth transitions

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- PostgreSQL
- npm or yarn

### Backend Setup
1. Navigate to the Backend directory:
   ```bash
   cd Backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env` (if available)
   - Configure database connection and JWT secrets

4. Run database migrations:
   ```bash
   npm run db:migrate
   ```

5. Seed the database (optional):
   ```bash
   npm run db:seed
   ```

6. Start the development server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the Frontend directory:
   ```bash
   cd Frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Access the application at `http://localhost:5173`

## Screenshots

[Add screenshots of key application screens here]
