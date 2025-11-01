import type { User } from "./User";
import type { Booking } from "../slices/bookingSlice";

export interface AddScheduleForUserModalProps {
  users: User[];
  bookings: Booking[];
  onSave: (data: Booking) => void;
  onClose: () => void;
}
