require("dotenv").config();
const createApp = require("./app");
const connectDB = require("./config/db");

const PORT = Number(process.env.PORT || 5000);
const MONGO_URI = process.env.MONGO_URI;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";

async function bootstrap() {
  await connectDB(MONGO_URI);

  const app = createApp(CLIENT_ORIGIN);
  app.listen(PORT, () => {
    console.log(`[server] listening on http://localhost:${PORT}`);
  });
}

bootstrap();
