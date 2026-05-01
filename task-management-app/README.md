# Task Management Web Application

Full-stack task manager with JWT authentication, protected task APIs, and responsive React UI.

## Live Links

- Frontend (Vercel): `https://smart-taskhub.vercel.app`
- Backend (Render): `https://smarttask-hub-sfx0.onrender.com`
- Health Check: `https://smarttask-hub-sfx0.onrender.com/api/health`
- Repository: `https://github.com/ParthShankar2005/SmartTask-Hub`

## Project Report

- Detailed report: `PROJECT_REPORT.md`
- Final submission template: `FINAL_SUBMISSION.md`

## Features

- User registration and login with JWT
- Logout and session-aware protected routes
- Task create, read, update, delete
- Task filtering by status
- Task sorting by newest, oldest, and due date
- Search with text highlighting
- Mobile responsive UI
- User-owned task security (users manage only their own tasks)
- DB-ready middleware for graceful `503` during outages

## Tech Stack

- Frontend: React, React Router, Axios, Bootstrap, React Icons
- Backend: Node.js, Express, MongoDB Atlas, Mongoose
- Auth/Security: `jsonwebtoken`, `bcryptjs`, `cors`, `dotenv`
- Testing: Jest, Supertest, mongodb-memory-server
- Deployment: Render (backend), Vercel (frontend), GitHub (source control)

## Project Structure

```text
task-management-app/
|-- client/
|   |-- public/
|   |-- src/
|   |   |-- components/
|   |   |-- pages/
|   |   |-- services/
|   |   `-- styles/
|   |-- .env.example
|   |-- package.json
|   `-- vercel.json
|-- config/
|-- controllers/
|-- middleware/
|-- models/
|-- routes/
|-- tests/
|-- .env.example
|-- package.json
|-- app.js
|-- server.js
|-- PROJECT_REPORT.md
`-- README.md
```

## API Endpoints

- `POST /api/auth/register` - register new user
- `POST /api/auth/login` - login user
- `GET /api/tasks` - get authenticated user's tasks
- `POST /api/tasks` - create task
- `PUT /api/tasks/:id` - update own task
- `DELETE /api/tasks/:id` - delete own task
- `GET /api/health` - service and database health

## Local Setup

### Prerequisites

- Node.js 18+ (Node 22 recommended)
- npm
- MongoDB Atlas URI

### 1) Clone

```bash
git clone https://github.com/ParthShankar2005/SmartTask-Hub.git
cd SmartTask-Hub/task-management-app
```

### 2) Backend Setup

```bash
npm install
```

Create `.env` in `task-management-app/`:

```env
MONGO_URI=<your_mongodb_connection_string>
JWT_SECRET=<your_strong_secret>
JWT_EXPIRES_IN=1d
PORT=5000
```

Run backend:

```bash
npm run dev
```

### 3) Frontend Setup

```bash
cd client
npm install
```

Create `client/.env`:

```env
REACT_APP_API_URL=/api
```

Run frontend:

```bash
npm start
```

Open `http://localhost:3000`.

## Deployment Notes

### Render (Backend)

- Root Directory: `task-management-app`
- Build Command: `npm install`
- Start Command: `node server.js`
- Required env vars: `MONGO_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`

### Vercel (Frontend)

- Root Directory: `task-management-app/client`
- Build Command: `npm run build`
- Output Directory: `build`
- `client/vercel.json` handles SPA rewrite to `index.html`
- `client/vercel.json` handles `/api/*` proxy to Render backend

## Testing

- Backend tests:

```bash
npm test
```

- Frontend build check:

```bash
cd client
npm run build
```

Current backend suite status: `8/8` passing.

## Demo Video

Add your video link in `FINAL_SUBMISSION.md` before final internship submission.
