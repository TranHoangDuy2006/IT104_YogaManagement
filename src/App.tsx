import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import RegisterForm from "./components/forms/RegisterForm";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/register" element={<RegisterForm />} />
    </Routes>
  );
}