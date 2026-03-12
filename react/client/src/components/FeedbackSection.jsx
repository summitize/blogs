import { useState } from "react";
import { submitFeedback } from "../services/feedbackApi";

const initialState = {
  name: "",
  email: "",
  topic: "",
  rating: "",
  message: "",
  company: ""
};

export default function FeedbackSection({
  page,
  title,
  description,
  points,
  topics,
  sectionId = "feedback"
}) {
  const [formData, setFormData] = useState(initialState);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const onChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    if (formData.company.trim()) {
      return;
    }

    const payload = {
      page,
      name: formData.name.trim(),
      email: formData.email.trim(),
      topic: formData.topic,
      rating: formData.rating,
      message: formData.message.trim()
    };

    if (!payload.name || !payload.email || !payload.topic || !payload.rating || !payload.message) {
      setStatus({ type: "error", message: "Please complete all required fields before submitting." });
      return;
    }

    setSubmitting(true);
    setStatus({ type: "", message: "" });

    try {
      await submitFeedback(payload);
      setStatus({ type: "success", message: "Thank you. Your feedback has been recorded successfully." });
      setFormData(initialState);
    } catch (error) {
      const storageKey = "summitize_feedback_entries";
      const stored = JSON.parse(localStorage.getItem(storageKey) || "[]");
      stored.unshift({ ...payload, submittedAt: new Date().toISOString(), fallback: true });
      localStorage.setItem(storageKey, JSON.stringify(stored.slice(0, 100)));
      setStatus({
        type: "success",
        message: "Saved locally. Connect backend to persist feedback centrally."
      });
      setFormData(initialState);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="container feedback-wrap fade-in delay-2" id={sectionId} aria-labelledby={`${page}-feedback-title`}>
      <div className="feedback-shell">
        <div className="feedback-grid">
          <div className="feedback-copy">
            <span className="eyebrow">Feedback</span>
            <h2 id={`${page}-feedback-title`}>{title}</h2>
            <p>{description}</p>
            <ul className="feedback-points">
              {points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </div>

          <form className="feedback-form" onSubmit={onSubmit}>
            <input className="visually-hidden" type="text" name="company" tabIndex="-1" autoComplete="off" value={formData.company} onChange={onChange} />
            <div className="form-grid">
              <div className="form-field">
                <label htmlFor={`${page}-name`}>Name</label>
                <input id={`${page}-name`} name="name" type="text" required value={formData.name} onChange={onChange} />
              </div>

              <div className="form-field">
                <label htmlFor={`${page}-email`}>Email</label>
                <input id={`${page}-email`} name="email" type="email" required value={formData.email} onChange={onChange} />
              </div>

              <div className="form-field">
                <label htmlFor={`${page}-topic`}>Topic</label>
                <select id={`${page}-topic`} name="topic" required value={formData.topic} onChange={onChange}>
                  <option value="">Select one</option>
                  {topics.map((topic) => (
                    <option key={topic} value={topic}>
                      {topic}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-field">
                <label htmlFor={`${page}-rating`}>Rating</label>
                <select id={`${page}-rating`} name="rating" required value={formData.rating} onChange={onChange}>
                  <option value="">Select one</option>
                  <option value="Excellent">Excellent</option>
                  <option value="Good">Good</option>
                  <option value="Average">Average</option>
                  <option value="Needs Work">Needs Work</option>
                </select>
              </div>

              <div className="form-field full">
                <label htmlFor={`${page}-message`}>Feedback</label>
                <textarea
                  id={`${page}-message`}
                  name="message"
                  required
                  placeholder="What should we improve?"
                  value={formData.message}
                  onChange={onChange}
                />
              </div>
            </div>

            <button className="btn btn-primary" type="submit" disabled={submitting}>
              {submitting ? "Submitting..." : "Submit Feedback"}
            </button>
            <p className="feedback-note">
              Responses are sent to the MERN API and fallback to local storage if the API is unavailable.
            </p>
            <p className={`feedback-status ${status.type}`.trim()} aria-live="polite">
              {status.message}
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
