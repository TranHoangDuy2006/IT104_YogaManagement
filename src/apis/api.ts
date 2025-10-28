import axios from "axios";
import type { User } from "../types/User";
import type { Booking } from "../types/Booking";
import type { Service } from "../types/Service";
import type { Course } from "../types/Course";

const API_BASE = "http://localhost:1904";

// USERS
export const getUsers = () => axios.get<User[]>(`${API_BASE}/users`);
export const getUserByEmail = (email: string) => axios.get<User[]>(`${API_BASE}/users`, { params: { email } });
export const createUser = (user: User) => axios.post<User>(`${API_BASE}/users`, user);
export const updateUser = (id: string, user: Partial<User>) => axios.patch<User>(`${API_BASE}/users/${id}`, user);
export const deleteUser = (id: string) => axios.delete(`${API_BASE}/users/${id}`);

// BOOKINGS
export const getBookings = () => axios.get<Booking[]>(`${API_BASE}/bookings`);
export const getBookingsByUser = (userId: string) => axios.get<Booking[]>(`${API_BASE}/bookings`, { params: { userId } });
export const createBooking = (booking: Booking) => axios.post<Booking>(`${API_BASE}/bookings`, booking);
export const updateBooking = (id: number, booking: Partial<Booking>) => axios.patch<Booking>(`${API_BASE}/bookings/${id}`, booking);
export const deleteBooking = (id: number) => axios.delete(`${API_BASE}/bookings/${id}`);

// SERVICES
export const getServices = () => axios.get<Service[]>(`${API_BASE}/services`);
export const createService = (service: Omit<Service, "id">) => axios.post<Service>(`${API_BASE}/services`, service);
export const updateService = (id: string, service: Partial<Service>) => axios.patch<Service>(`${API_BASE}/services/${id}`, service);

// COURSES
export const getCourses = () => axios.get<Course[]>(`${API_BASE}/courses`);
