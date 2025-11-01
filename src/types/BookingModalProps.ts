import type { Booking } from "../slices/bookingSlice";

export interface BookingModalProps {
  booking?: Booking;
  bookings: Booking[];
  onSave: (data: Booking) => void;
  onClose: () => void;
  currentUserId: string;
  defaultClassName?: string;
}
