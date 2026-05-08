# Real-Time Expert Session Booking System

Tech stack used:
- Frontend: React (Vite)
- Backend: Node.js + Express + MongoDB
- Realtime: Socket.io

## Features Implemented

### 1) Expert Listing Screen
- Experts list with name, category, experience, rating
- Search by name
- Filter by category
- Pagination
- Loading and error states

### 2) Expert Detail Screen
- Expert details with available slots grouped by date
- Realtime slot updates when another booking happens (Socket.io)

### 3) Booking Screen
- Form with Name, Email, Phone, Date, Time Slot, Notes
- Client + server validation
- Success and error messages
- Booked slots removed from available list

### 4) My Bookings Screen
- Lookup bookings by email
- Shows status: Pending / Confirmed / Completed

## Backend APIs

- `GET /experts?page=&limit=&search=&category=`
- `GET /experts/:id`
- `POST /bookings`
- `PATCH /bookings/:id/status`
- `GET /bookings?email=`

## Critical Requirements Covered

- **Double booking prevention**
  - Unique compound index on `{ expertId, date, timeSlot }` in `Booking` model
  - Transaction-based booking flow to handle race conditions safely
- **Realtime updates**
  - Socket room per expert (`watch-expert`)
  - `slot-booked` event emitted on successful booking
- **Proper error handling**
  - Centralized error middleware
  - Express-validator based request validation
  - Meaningful status codes and messages
  - Environment variables for configuration

## Folder Structure

```
backend/
  src/
    config/
    controllers/
    middleware/
    models/
    routes/
    seeders/
    validations/
frontend/
  src/
    pages/
    api.js
    utils.js
```

## Setup Instructions

### Prerequisites
- Node.js 18+
- MongoDB local or cloud instance

### Backend
```bash
cd backend
cp .env.example .env
npm install
npm run seed
npm run dev
```

### Frontend
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Open frontend at `http://localhost:5173`.

## Demo Video Checklist

- Show expert list: search, filter, pagination
- Open expert detail and keep it open in two tabs
- Book from one tab and show realtime slot update in other tab
- Open My Bookings screen and query by email
- Update one booking status with `PATCH /bookings/:id/status` (Postman/curl) and show status change
