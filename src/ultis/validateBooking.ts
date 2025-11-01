export interface BookingInput {
  class: string;
  date: string;
  time: string;
}

export function validateBookingInput(booking: BookingInput): string | null {
  if (!booking.class.trim() || !booking.date.trim() || !booking.time.trim()) {
    return "Vui lòng nhập đầy đủ thông tin!";
  }
  return null;
}
