import { Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import HomePage from "./pages/HomePage";
import Blog1Page from "./pages/Blog1Page";
import Blog2Page from "./pages/Blog2Page";
import Blog3Page from "./pages/Blog3Page";
import NotFoundPage from "./pages/NotFoundPage";

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/blog1" element={<Blog1Page />} />
        <Route path="/blog2" element={<Blog2Page />} />
        <Route path="/blog3" element={<Blog3Page />} />
        <Route path="/index.html" element={<Navigate to="/" replace />} />
        <Route path="/blog1.html" element={<Navigate to="/blog1" replace />} />
        <Route path="/blog2.html" element={<Navigate to="/blog2" replace />} />
        <Route path="/blog3.html" element={<Navigate to="/blog3" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
