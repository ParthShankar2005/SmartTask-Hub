# Task Management App

## Folder Structure

```
task-management-app/
|-- client/
|   |-- public/
|   |   `-- index.html
|   `-- src/
|       |-- assets/
|       |   `-- .gitkeep
|       |-- components/
|       |   |-- Button.js
|       |   |-- Navbar.js
|       |   `-- TaskItem.js
|       |-- pages/
|       |   |-- HomePage.js
|       |   |-- LoginPage.js
|       |   `-- TaskPage.js
|       |-- services/
|       |   `-- taskService.js
|       |-- styles/
|       |   `-- main.css
|       |-- App.js
|       `-- index.js
|-- config/
|   `-- db.js
|-- controllers/
|   |-- taskController.js
|   `-- userController.js
|-- middleware/
|   `-- authMiddleware.js
|-- models/
|   |-- Task.js
|   `-- User.js
|-- routes/
|   |-- taskRoutes.js
|   `-- userRoutes.js
|-- utils/
|   `-- logger.js
|-- .env
|-- .env.example
|-- .gitignore
|-- package.json
|-- server.js
`-- README.md
```

## Naming Conventions

1. Use `PascalCase` for model and component files (example: `User.js`, `TaskItem.js`).
2. Use `camelCase` for route, controller, middleware, and service files (example: `taskRoutes.js`, `authMiddleware.js`).
3. Keep related backend files grouped by concern: `models`, `controllers`, `routes`, `middleware`, `utils`, `config`.
4. Keep frontend files grouped by concern inside `client/src`: `components`, `pages`, `services`, `styles`, `assets`.

## MongoDB Atlas Connection Checklist

Use this list to connect this backend to MongoDB Atlas.

1. Create a MongoDB Atlas account.
2. Create a cluster (Free Tier `M0` is fine for development).
3. Create a database user with `Read and write to any database` role.
4. Add network access:
   - Your current IP (recommended), or
   - `0.0.0.0/0` for development/testing.
5. Copy the Atlas connection string from `Connect` -> `Connect your application`.
6. Update local environment variables in `.env`:
   - `MONGO_URI=<your-atlas-uri>`
   - `PORT=5000`
7. Ensure dependencies are installed:
   - `mongoose`
   - `dotenv`
8. Ensure database connection code exists in `config/db.js` and calls:
   - `mongoose.connect(process.env.MONGO_URI)`
9. Ensure server startup calls DB connection before listening in `server.js`.
10. Run the backend:
    - `npm run dev`
11. Verify successful connection logs:
    - `MongoDB Connected: <host>`
    - `Server listening on port 5000`

## Common Issues

1. `ENOTFOUND` often means cluster URL is wrong in `MONGO_URI`.
2. `Authentication failed` means username/password is incorrect.
3. `IP not whitelisted` means your network access rules are missing your IP.

## Deploy Backend to Render

Use these settings when creating a Render Web Service from this repository.

1. Connect Render to this GitHub repository.
2. Select the service root directory as `task-management-app`.
3. Use:
   - Build Command: `npm install`
   - Start Command: `node server.js`
4. Add environment variables in Render:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `JWT_EXPIRES_IN` (example: `1d`)
5. Deploy and verify:
   - `GET /` should return the API running message
   - `GET /api/health` should return `{ "status": "ok" }`
6. Enable auto deploy so new GitHub pushes redeploy automatically.

## Deploy Frontend to Vercel

Use these settings when creating a Vercel project from this repository.

1. Import GitHub repo: `ParthShankar2005/SmartTask-Hub`.
2. Set Root Directory to `task-management-app/client`.
3. Use:
   - Build Command: `npm run build`
   - Output Directory: `build`
4. Add environment variable in Vercel:
   - `REACT_APP_API_URL=https://<your-render-service>.onrender.com/api`
5. Deploy and verify:
   - App loads at `https://<your-project>.vercel.app`
   - Login/Register works
   - Task fetch/create/update/delete works

### Frontend Routing on Vercel

For React Router routes (for example `/tasks`), this project includes:

- `client/vercel.json` rewrite to `index.html` for SPA routing.
- `client/vercel.json` also proxies `/api/*` to Render backend.

If `REACT_APP_API_URL` is not set, frontend requests still work through the `/api/*` Vercel proxy.

### Local Frontend

If running frontend locally, keep using the local proxy in `client/package.json` (`http://localhost:5000`).
