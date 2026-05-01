const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const taskRoutes = require("./routes/taskRoutes");
const authRoutes = require("./routes/authRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

dotenv.config({ quiet: true });

const startServer = async () => {
  await connectDB();

  const app = express();
  const PORT = process.env.PORT || 5000;

  app.use(cors());
  app.use(express.json());
  app.use("/api/tasks", taskRoutes);
  app.use("/api/auth", authRoutes);

  app.get("/", (_req, res) => {
    res.status(200).json({ message: "Task Management API is running." });
  });

  app.use(notFound);
  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
};

startServer();
