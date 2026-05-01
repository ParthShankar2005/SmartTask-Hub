MongoDB credentials must never be stored in source control.

Use environment variables instead:
- MONGO_URI
- JWT_SECRET

If credentials were committed previously, rotate them in MongoDB Atlas immediately.
