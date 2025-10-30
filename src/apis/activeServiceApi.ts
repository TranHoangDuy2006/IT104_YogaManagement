import axios from "axios";
import type { Service } from "../types/Service";

const API_BASE = "http://localhost:1904";

export const getActiveServicesWithCourses = async () => {
  const res = await axios.get<Service[]>(`${API_BASE}/services`);
  // Only services that are active and have courses
  return res.data.filter(s => s.isActive && Array.isArray(s.courses) && s.courses.length > 0);
};
