# Resume Analyzer

Resume Analyzer is a full-stack application that helps users upload resumes, authenticate with a secure account, and generate interview reports using AI-powered analysis.

## Project Overview

This repository contains two main parts:

- `Backend/` - Express + MongoDB API server with auth, file upload, resume parsing, AI integration, and interview report generation.
- `Frontend/` - React + Vite single-page application with registration/login flows and interview report UI.

## Key Features

- User registration and login with email/password
- JWT-based authentication middleware for protected routes
- Resume upload support via PDF file upload
- Interview report generation using AI services
- MongoDB persistence for users and report data

## Tech Stack

### Backend
- Node.js
- Express
- MongoDB + Mongoose
- JSON Web Tokens (JWT)
- Multer file uploads
- dotenv for environment variables
- express-validator for request validation
- Google GenAI

### Frontend
- React
- Vite
- React Router
- Axios
- SCSS styling

## Prerequisites

- Node.js 18+ recommended
- npm
- MongoDB connection string
- Google GenAI API key
- GROQ API key

## Setup Instructions

### 1. Clone the repository

```bash
cd "c:\Users\USERE\Resume Analyzer"
```

### 2. Install backend dependencies

```bash
cd Backend
npm install
```

### 3. Install frontend dependencies

```bash
cd ../Frontend
npm install
```

## Environment Configuration

Create a `.env` file in the `Backend/` folder with these values:

```env
PORT=3000
MONGO_URI=<your-mongodb-connection-string>
JWT_SECRET=<your-jwt-secret>
GOOGLE_GENAI_APIKEY=<your-google-genai-api-key>
GROQ_API_KEY=<your-groq-api-key>
```

### Important
- Do not commit `.env` to source control
- Use secure values for `JWT_SECRET`
- Ensure `MONGO_URI` points to a running MongoDB instance

## Running the App

### Start the backend server

```bash
cd Backend
npm start
```

The backend will listen on `http://localhost:3000` by default.

### Start the frontend app

```bash
cd Frontend
npm run dev
```

The frontend runs at `http://localhost:5173` by default.

## API Reference

### Authentication

- `POST /api/auth/register`
  - Registers a new user
  - Required fields: `username`, `email`, `password`

- `POST /api/auth/login`
  - Authenticates a user and issues auth cookies
  - Required fields: `email`, `password`

- `GET /api/auth/logout`
  - Clears authentication cookies

- `GET /api/auth/get-user`
  - Returns the current authenticated user
  - Protected route

### Interview Report

- `POST /api/interview`
  - Generates an interview report from a resume upload
  - Protected route
  - Accepts form data with field `resume`

## Project Structure

### Backend

- `server.js` - Server entry point
- `src/app.js` - Express app configuration
- `src/models/database.js` - MongoDB connection
- `src/routes/auth.routes.js` - Auth routes
- `src/routes/interview.routes.js` - Interview report route
- `src/controllers/` - Route handlers
- `src/middleware/` - Auth and upload middleware
- `src/services/` - AI and auth service helpers
- `src/models/` - Mongoose schemas

### Frontend

- `src/main.jsx` - React app bootstrap
- `src/App.jsx` - Route layout and navigation
- `src/pages/` - Page components
- `src/components/` - Shared UI components
- `src/services/api.js` - Axios API helper
- `src/styles/` - Global styling

## Notes and Tips

- The frontend communicates with the backend via `/api/*` endpoints.
- Ensure CORS is configured correctly if you change frontend or backend ports.
- Replace placeholder API keys before running AI-related features.
- If you add new environment variables, restart the backend server.

## Troubleshooting

- Backend fails to start: verify `.env` values and MongoDB connectivity.
- Login/register errors: check request validation messages and ensure the backend is running.
- Resume upload issues: confirm the frontend sends `resume` as the form field name.


