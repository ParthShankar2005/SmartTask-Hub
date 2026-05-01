const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const taskRoutes = require("./routes/taskRoutes");
const userRoutes = require("./routes/userRoutes");

dotenv.config({ quiet: true });

const startServer = async () => {
  await connectDB();

  const app = express();
  const PORT = process.env.PORT || 5000;

  app.use(cors());
  app.use(express.json());
  app.use("/api/tasks", taskRoutes);
  app.use("/api/users", userRoutes);

  app.get("/", (_req, res) => {
    res.status(200).json({ message: "Task Management API is running." });
  });

  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
};

startServer();
