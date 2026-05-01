const express = require("express");
const cors = require("cors");
const { getDbReadyState, getDbStatus } = require("./config/db");
const taskRoutes = require("./routes/taskRoutes");
const authRoutes = require("./routes/authRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/tasks", taskRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (_req, res) => {
  res.status(200).json({ message: "Task Management API is running." });
});

app.get("/api/health", (_req, res) => {
  const database = getDbStatus();
  const isHealthy = getDbReadyState() === 1;

  res.status(isHealthy ? 200 : 503).json({
    status: isHealthy ? "ok" : "degraded",
    database,
  });
});

app.use(notFound);
app.use(errorHandler);

module.exports = app;
