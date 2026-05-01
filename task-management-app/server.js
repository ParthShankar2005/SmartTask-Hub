const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config({ quiet: true });

const startServer = async () => {
  await connectDB();

  const app = express();
  const PORT = process.env.PORT || 5000;

  app.use(cors());
  app.use(express.json());

  app.get("/", (_req, res) => {
    res.status(200).json({ message: "Task Management API is running." });
  });

  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
};

startServer();
