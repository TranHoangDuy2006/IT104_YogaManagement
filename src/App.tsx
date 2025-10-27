import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import LoadingSpinner from "./components/commons/LoadingSpinner";
import RegisterForm from "./components/forms/RegisterForm";
import LoginForm from "./components/forms/LoginForm";
import ProtectedRoute from "./ProtectedRoute";

const HomePage = lazy(() => import("./pages/HomePage"));
const AdminPage = lazy(() => import("./pages/AdminPage"));
const BookingPage = lazy(() => import("./pages/BookingPage"));
const ServicesManagementPage = lazy(() => import("./pages/ServicesManagementPage"));
const SchedulesManagementPage = lazy(() => import("./pages/SchedulesManagementPage"));
const UsersManagementPage = lazy(() => import("./pages/UsersManagementPage"));
const NotFound = lazy(() => import("./pages/NotFoundPage"));

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/admin" element={<ProtectedRoute><AdminPage /></ProtectedRoute>}>
          <Route path="schedules-management" element={<SchedulesManagementPage />} />
          <Route path="services-management" element={<ServicesManagementPage />} />
          <Route path="users-management" element={<UsersManagementPage />} />
        </Route>
        <Route path="*" element={<NotFound />} />
        <Route path="/bookings" element={<ProtectedRoute><BookingPage /></ProtectedRoute>} />
      </Routes>
    </Suspense>
  );
}

export default App;