import axios from "axios";
import type { Service } from "../types/Service";

const API_BASE = import.meta.env.VITE_API_BASE;

export const getActiveServicesWithCourses = async () => {
  const res = await axios.get<Service[]>(`${API_BASE}/services`);
  return res.data.filter(s => s.isActive && Array.isArray(s.courses) && s.courses.length > 0);
};
