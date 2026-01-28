# Clinic Booking System - Backend

A microservices-based backend for managing clinic appointments built with NestJS.

## Features

- **Authentication**: JWT-based auth for clinics, Google OAuth for patients
- **Clinic Management**: CRUD operations for clinic profiles, working hours, images
- **Appointment Booking**: Time slot validation, availability checking, prescription management
- **Patient Profiles**: Profile management with completion tracking

## Tech Stack

- NestJS 10
- TypeORM with PostgreSQL
- Passport (JWT + Google OAuth)
- Swagger/OpenAPI documentation

## Project Structure

```
backend/
├── apps/
│   └── api-gateway/          # Main application with all modules
├── libs/
│   ├── common/               # Shared utilities
│   └── database/             # Database entities and config
```

## Setup

### Prerequisites

- Node.js 18+
- PostgreSQL 14+

### Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your configuration
```

### Environment Variables

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=clinic_booking

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRATION=24h

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### Database Setup

```bash
# Create database
createdb clinic_booking

# Run migrations (auto-sync enabled in development)
npm run start:dev
```

### Running the Application

```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

The API will be available at `http://localhost:3000`

Swagger documentation: `http://localhost:3000/api`

## API Endpoints

### Authentication
- `POST /auth/clinic/login` - Clinic login
- `GET /auth/google` - Google OAuth login
- `GET /auth/google/callback` - OAuth callback
- `GET /auth/profile` - Get current user

### Clinics
- `GET /clinics` - List all clinics (with filters)
- `GET /clinics/:id` - Get clinic details
- `PUT /clinics/:id` - Update clinic info
- `PUT /clinics/:id/working-hours` - Update working hours
- `POST /clinics/:id/images` - Upload image
- `DELETE /clinics/:id/images` - Delete image

### Appointments
- `POST /appointments` - Create appointment
- `GET /appointments` - List appointments (with filters)
- `GET /appointments/:id` - Get appointment details
- `PUT /appointments/:id` - Update appointment
- `PUT /appointments/:id/prescription` - Add prescription
- `DELETE /appointments/:id` - Cancel appointment
- `GET /appointments/clinic/:clinicId/available-slots` - Get available slots

### Patients
- `GET /patients/profile` - Get patient profile
- `PUT /patients/profile` - Update patient profile

## Database Schema

- **users** - Authentication (email, password, role, google_id)
- **clinics** - Clinic information and settings
- **patients** - Patient profiles
- **appointments** - Appointment records with prescriptions

## Development

```bash
# Run tests
npm run test

# Run e2e tests
npm run test:e2e

# Lint
npm run lint

# Format
npm run format
```

## License

MIT
# clinic-fullstack
