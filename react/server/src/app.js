const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const feedbackRoutes = require("./routes/feedbackRoutes");
const { notFoundHandler, errorHandler } = require("./middleware/errorHandler");

function createApp(clientOrigin) {
  const app = express();

  app.use(
    cors({
      origin: clientOrigin,
      credentials: true
    })
  );
  app.use(helmet());
  app.use(morgan("dev"));
  app.use(express.json());

  app.get("/api/health", (req, res) => {
    res.json({ success: true, service: "summitize-server", timestamp: new Date().toISOString() });
  });

  app.use("/api/feedback", feedbackRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

module.exports = createApp;
