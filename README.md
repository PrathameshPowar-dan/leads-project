# Leads CRM Project

A modern lead management dashboard built with a Next.js frontend and an Express + MongoDB backend.

## Live Demos

- **Frontend Demo:** https://leads-project-red.vercel.app/
- **Backend API:** https://leads-project-phhg.onrender.com/
- **GitHub Repository:** https://github.com/PrathameshPowar-dan/leads-project

## Overview

This project is a CRM-style lead tracker that allows users to:

- Add new sales leads with contact details and company information
- Search leads by name, email, or company
- Filter leads by status
- Sort and paginate lead results
- Edit and delete leads
- View a lightweight analytics summary of leads in view and converted leads

## Tech Stack

- Frontend: `Next.js`, `React`, `Tailwind CSS`, `axios`, `lucide-react`
- Backend: `Express`, `Mongoose`, `MongoDB`, `cors`, `dotenv`
- Runtime: `Node.js`

## What makes this project strong

- **RESTful API design** with clean routes and controllers
- **Search + filter + pagination** support in the backend
- **Lead status workflow** using a schema enum: `New`, `Contacted`, `Qualified`, `Converted`, `Lost`
- **Reusable frontend API service** for create, update, delete, search, and list operations
- **Client-side UI experience** with a modal form, table layout, and responsive controls
- **Custom response wrapper** on backend for consistent API payload structure

## Architecture

### Backend

The backend lives inside `backend/src/`.

- `src/index.js` — entrypoint that connects to MongoDB and starts the Express server
- `src/app.js` — Express app setup with CORS and JSON parsing
- `src/routes/lead.routes.js` — CRUD routes for leads
- `src/controllers/lead.controller.js` — business logic and query handling
- `src/models/leads.models.js` — Mongoose lead schema with timestamps and status enum
- `src/utils/ApiError.js` — error wrapper class
- `src/utils/ApiResponse.js` — consistent API response class
- `src/utils/asyncHandler.js` — async wrapper for Express route handlers

### Frontend

The frontend lives inside `frontend/src/`.

- `src/app/page.js` — dashboard page with data fetching, search, filter, sort, pagination, and modal control
- `src/components/LeadModal.js` — reusable modal form for creating and editing leads
- `src/services/api.js` — centralized API client for backend communication

## Backend API Endpoints

- `POST /api/leads` — create a new lead
- `GET /api/leads` — list leads with query params:
  - `page`, `limit`, `sortBy`, `order`, `status`, `search`
- `GET /api/leads/search?query=...` — search leads by name, email, or company
- `PUT /api/leads/:id` — update a lead
- `DELETE /api/leads/:id` — remove a lead

## Local Setup

### Backend

```bash
cd backend
npm install
```

Create a `.env` file in `backend/` with:

```env
MONGODB_URL=<your-mongodb-connection-string>
CORS_ORIGIN=http://localhost:3000
```

Run the backend:

```bash
npm run dev
```

### Frontend

```bash
cd frontend
npm install
```

Create a `.env.local` file in `frontend/` with:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/leads
```

Run the frontend:

```bash
npm run dev
```

Then open `http://localhost:3000`.

## Notes and Opportunities

- The backend currently has no dedicated error middleware; adding a centralized error handler would improve stability.
- Validation can be enhanced using a schema library like `Joi` or `zod`.
- Tests are not included yet; adding API and UI tests would strengthen reliability.
- The frontend could benefit from toast notifications for create/update/delete feedback.

## Recommended next improvements

- Add registration/login if user authentication is needed
- Add export/import of lead data
- Add data visualizations for lead conversion trends
- Add server-side validation and stricter request handling

---

Built to provide a clean lead management experience with an easy-to-use dashboard and a simple, robust API.