import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
  timeout: 8000
});

export async function submitFeedback(payload) {
  const response = await api.post("/feedback", payload);
  return response.data;
}
