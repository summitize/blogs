const mongoose = require("mongoose");
const Feedback = require("../models/Feedback");
const { addFeedback, listFeedback } = require("../store/feedbackStore");

function normalizeBody(body) {
  return {
    page: String(body.page || "").trim(),
    name: String(body.name || "").trim(),
    email: String(body.email || "").trim(),
    topic: String(body.topic || "").trim(),
    rating: String(body.rating || "").trim(),
    message: String(body.message || "").trim()
  };
}

function validatePayload(payload) {
  const required = ["page", "name", "email", "topic", "rating", "message"];
  return required.every((key) => payload[key]);
}

async function submitFeedback(req, res, next) {
  try {
    const payload = normalizeBody(req.body || {});

    if (!validatePayload(payload)) {
      return res.status(400).json({
        success: false,
        message: "All feedback fields are required."
      });
    }

    const entry = {
      ...payload,
      ipAddress: req.ip || "",
      userAgent: req.headers["user-agent"] || ""
    };

    if (mongoose.connection.readyState === 1) {
      const saved = await Feedback.create(entry);
      return res.status(201).json({ success: true, data: saved, storage: "mongo" });
    }

    const saved = addFeedback(entry);
    return res.status(201).json({ success: true, data: saved, storage: "memory" });
  } catch (error) {
    return next(error);
  }
}

async function getFeedback(req, res, next) {
  try {
    if (mongoose.connection.readyState === 1) {
      const entries = await Feedback.find().sort({ createdAt: -1 }).limit(200).lean();
      return res.json({ success: true, count: entries.length, data: entries, storage: "mongo" });
    }

    const entries = listFeedback();
    return res.json({ success: true, count: entries.length, data: entries, storage: "memory" });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  submitFeedback,
  getFeedback
};
