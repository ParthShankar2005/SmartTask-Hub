const dotenv = require("dotenv");
const connectDB = require("./config/db");
const app = require("./app");

dotenv.config({ quiet: true });

const startServer = async () => {
  await connectDB();
  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
};

startServer();
