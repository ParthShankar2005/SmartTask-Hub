const dotenv = require("dotenv");
const { connectDB } = require("./config/db");
const app = require("./app");

dotenv.config({ quiet: true });

const PORT = Number(process.env.PORT) || 5000;
const HOST = process.env.HOST || "0.0.0.0";
const DB_RETRY_DELAY_MS = 10000;

const connectWithRetry = async () => {
  try {
    await connectDB();
  } catch (error) {
    console.error(`MongoDB connection failed: ${error.message}`);
    console.log(`Retrying MongoDB connection in ${DB_RETRY_DELAY_MS / 1000}s...`);
    setTimeout(connectWithRetry, DB_RETRY_DELAY_MS);
  }
};

app.listen(PORT, HOST, () => {
  console.log(`Server listening on ${HOST}:${PORT}`);
});

connectWithRetry();
