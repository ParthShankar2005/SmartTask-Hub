# Task Management Web Application - Project Report

## 1. Introduction

### Project Name
Task Management Web Application

### Objective
This project is a full-stack task management system built with the MERN ecosystem. Users can register, log in, and manage personal tasks with create, read, update, delete, filter, sort, and search capabilities. The system uses JWT-based authentication and secure backend APIs.

### Target Users
- Individuals tracking daily personal tasks.
- Small teams managing lightweight task workflows.
- Developers learning practical full-stack development and deployment.

## 2. Feature Summary

- User authentication (`register`, `login`, `logout`) using JWT.
- Protected task APIs for authenticated users only.
- Task CRUD operations.
- Task filtering by status (`pending`, `in-progress`, `completed`).
- Task sorting (`newest`, `oldest`, `due date`).
- Task search by title/description with highlighted matches.
- Mobile-responsive UI.
- Role-safe task access (users can manage only their own tasks).
- Deployment on Render (backend) and Vercel (frontend).

## 3. Technologies Used

### Frontend
- React.js
- React Router
- Axios
- Bootstrap 5
- React Icons

### Backend
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT (`jsonwebtoken`)
- `bcryptjs`
- `cors`
- `dotenv`

### Testing and Tooling
- Jest
- Supertest
- mongodb-memory-server

### Deployment and Version Control
- Render (backend hosting)
- Vercel (frontend hosting)
- GitHub (source control)

## 4. Architecture Overview

- `client/` contains React frontend.
- Root backend serves REST APIs under `/api/*`.
- Authentication is token-based using `Authorization: Bearer <token>`.
- Tasks are owner-scoped using `Task.user` reference to `User`.
- Health endpoint `/api/health` reports service and DB readiness.

## 5. Deployment Links

- Frontend (Vercel): `https://smart-taskhub.vercel.app`
- Backend API (Render): `https://smarttask-hub-sfx0.onrender.com`
- GitHub Repository: `https://github.com/ParthShankar2005/SmartTask-Hub`

## 6. Local Setup Instructions

### Prerequisites
- Node.js 18+ (Node 22 used in deployment)
- npm
- MongoDB Atlas URI (or local MongoDB)

### Clone Repository

```bash
git clone https://github.com/ParthShankar2005/SmartTask-Hub.git
cd SmartTask-Hub/task-management-app
```

### Backend Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env` in `task-management-app/`:

```env
MONGO_URI=<your_mongodb_connection_string>
JWT_SECRET=<your_strong_secret>
JWT_EXPIRES_IN=1d
PORT=5000
```

3. Run backend:

```bash
npm run dev
```

4. Verify backend:
- `http://localhost:5000/`
- `http://localhost:5000/api/health`

### Frontend Setup

1. Move to client:

```bash
cd client
```

2. Install dependencies:

```bash
npm install
```

3. Create `client/.env`:

```env
REACT_APP_API_URL=/api
```

For local-only direct backend calls, you can also use:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

4. Run frontend:

```bash
npm start
```

5. Open:
- `http://localhost:3000`

## 7. Testing and Bug Fixes Summary

### Functional Testing
- Authentication flow tested (register/login/logout, invalid login).
- Task CRUD tested.
- Filter/sort/search tested.
- Protected routes and token expiry behavior tested.
- Responsive layout tested with browser device emulation.

### Automated Testing
- Backend integration tests with Jest + Supertest.
- Current suite status: `8/8 tests passing`.

### Key Bug Fixes Implemented
- Enforced task ownership at API level.
- Protected `GET /api/tasks` with auth.
- Added DB-ready middleware to return clear `503` during DB outages.
- Improved frontend error messages for backend/network failures.
- Added task validation limits (title/description length).
- Improved modal usability and mobile layout behavior.

## 8. Performance and UX Notes

- Efficient task list updates using local state after create/update/delete.
- Loading spinner and success/error alerts for clear feedback.
- Responsive grid and toolbar behavior across mobile/tablet/desktop.

## 9. Future Improvements

- User roles and permissions (admin/user).
- Task reminders and notification system.
- Drag-and-drop task arrangement.
- Dark mode theme option.
- Task analytics dashboard (completion trends, weekly reports).
- CI pipeline for test/build checks on every pull request.

## 10. Conclusion

The Task Management Web Application is a complete, deployable full-stack system with secure authentication, protected APIs, and responsive UI workflows. The project demonstrates end-to-end development, testing, debugging, and cloud deployment practices suitable for real-world portfolio and learning use cases.
