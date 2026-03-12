const mongoose = require("mongoose");

async function connectDB(uri) {
  if (!uri) {
    console.warn("[db] MONGO_URI not set. Running in fallback mode without MongoDB.");
    return false;
  }

  try {
    await mongoose.connect(uri);
    console.log("[db] MongoDB connected");
    return true;
  } catch (error) {
    console.error("[db] MongoDB connection failed:", error.message);
    return false;
  }
}

module.exports = connectDB;
