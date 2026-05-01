# Final Project Submission

## Candidate Details

- Name: `Parth Shankar`
- Project: `Task Management Web Application`
- Stack: `MERN (MongoDB, Express, React, Node.js)`

## Submission Links

- GitHub Repository: `https://github.com/ParthShankar2005/SmartTask-Hub`
- Live Frontend (Vercel): `https://smart-taskhub.vercel.app`
- Live Backend (Render): `https://smarttask-hub-sfx0.onrender.com`
- Health Endpoint: `https://smarttask-hub-sfx0.onrender.com/api/health`
- Demo Video: `<add_google_drive_or_youtube_link>`
- Project Report: `PROJECT_REPORT.md`

## Implemented Features

- JWT authentication (register/login/logout)
- Protected routes and API access control
- Task CRUD operations
- Filter, sort, and search
- Responsive UI for desktop/mobile
- User-scoped task ownership (multi-user security)
- Graceful outage handling when DB is unavailable

## Local Run Commands

Backend:

```bash
cd task-management-app
npm install
npm run dev
```

Frontend:

```bash
cd task-management-app/client
npm install
npm start
```

## Environment Files

- Backend sample: `.env.example`
- Frontend sample: `client/.env.example`
- Sensitive credentials are excluded from Git using `.gitignore`.

## API Quick Reference

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/tasks`
- `POST /api/tasks`
- `PUT /api/tasks/:id`
- `DELETE /api/tasks/:id`
- `GET /api/health`

## Testing Summary

- Manual feature testing completed on live UI and API.
- Backend integration tests: `8/8` passing.
- Frontend production build verification completed.

## Submission Checklist

- [ ] GitHub repository is public and accessible
- [ ] Frontend live link opens and works
- [ ] Backend live link and `/api/health` work
- [ ] Demo video link is added
- [ ] Project report is attached/shared
- [ ] All required links are submitted on LMS/portal

## Short Project Summary

This project delivers a secure and responsive full-stack task manager with complete authentication flow, task lifecycle operations, and production deployment. It demonstrates backend API design, frontend state handling, live debugging, cloud deployment, and structured documentation for reviewer evaluation.
