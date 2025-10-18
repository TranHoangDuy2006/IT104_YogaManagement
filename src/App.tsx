import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import RegisterForm from "./components/forms/RegisterForm";
import LoginForm from "./components/forms/LoginForm";
import NotFound from "./pages/NotFoundPage";
import AdminPage from "./pages/AdminPage";
import BookingPage from "./pages/BookingPage";
import ServicesManagementPage from "./pages/ServicesManagementPage";
import ProtectedRoute from "./ProtectedRoute";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/register" element={<RegisterForm />} />
      <Route path="/login/" element={<LoginForm />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFound />} />
      <Route path="/booking" element={<BookingPage />} />
      <Route path="/services-management" element={<ServicesManagementPage />} />
    </Routes>
  );
}