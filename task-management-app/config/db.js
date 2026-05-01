const mongoose = require("mongoose");

const MONGO_CONNECTION_OPTIONS = {
  serverSelectionTimeoutMS: 10000,
};

const DB_READY_STATES = {
  0: "disconnected",
  1: "connected",
  2: "connecting",
  3: "disconnecting",
};

const getDbReadyState = () => mongoose.connection.readyState;
const getDbStatus = () => DB_READY_STATES[getDbReadyState()] || "unknown";

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not set in environment variables.");
  }

  const conn = await mongoose.connect(process.env.MONGO_URI, MONGO_CONNECTION_OPTIONS);
  console.log(`MongoDB connected: ${conn.connection.host}`);
  return conn;
};

module.exports = { connectDB, getDbReadyState, getDbStatus };
