# HealthHuddle

Medical AI consultation platform with 4 debating agents.

## Prerequisites

- Node.js (v18+ recommended)
- npm (comes with Node.js)

## Installation

Install dependencies for both the backend (root) and frontend:

```bash
# Install root/backend dependencies and frontend dependencies in one go
npm run install:all
```

Or manually:

```bash
# Root/Backend
npm install

# Frontend
cd frontend
npm install
cd ..
```

## Running the Application

### Option 1: Run Both (Recommended)

Run both the backend server and frontend client with a single command:

```bash
npm run dev
```

This will run:
- Backend on: `http://localhost:5000` (or configured port)
- Frontend on: `http://localhost:5173` (Vite default)

### Option 2: Run Separately

**Terminal 1 (Backend):**
```bash
npm run server
```

**Terminal 2 (Frontend):**
```bash
npm run client
```

## Environment Variables

Make sure you have a `.env` file in the root directory with the necessary configurations (e.g., API keys, Port).
