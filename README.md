# Express Backend Boilerplate

## Overview

This is a reusable backend setup built using **Express** and **TypeScript**. It includes authentication, authorization, validation, logging, security enhancements, and API documentation. Designed to be modular and scalable for any backend application.

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env` file in the root directory with the following:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/backend-setup
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=36000
```

### 3. Start Development Server

```bash
npm run dev
```

## Project Structure

```
src/
├── controllers/         # Handles business logic
├── middlewares/         # Request processing logic
├── models/              # Mongoose schemas
├── routes/              # API route definitions
├── services/            # Reusable logic (e.g., token generation)
├── utils/               # Utility functions (e.g., logger)
├── validators/          # Request validation schemas
├── config/              # Configuration files
├── __tests__/           # Unit and integration tests
├── app.ts               # Express app setup
└── server.ts            # Server entry point
```

## Key Features

- **Authentication**: JWT-based authentication system
- **Authorization**: Role-based access control (User, Admin, Superadmin)
- **Validation**: Request validation using Zod schemas
- **Error Handling**: Centralized error response management
- **Logging**: Detailed logging with Winston
- **Security**: Enhanced security with Helmet and rate limiting
- **API Documentation**: Integrated Swagger documentation
- **Database**: MongoDB with Mongoose ODM
- **Versioning**: URL-based API versioning (`/v1`)

## Additional Information

### API Documentation

Swagger documentation is available at: `http://localhost:5000/api-docs`

### Logging

Logs are automatically stored in:
- `logs/combined.log` - All application logs
- `logs/error.log` - Error-specific logs

### Future Improvements

- Add Redis for caching functionality
- Implement pagination for database queries
- Integrate monitoring tools like Sentry
- Add automated testing pipeline
- Implement database migrations
