# Task Management App

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
